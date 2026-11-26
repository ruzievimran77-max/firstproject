/* FuelParts KZ — Catalog, Smart Search, Vehicle Picker, SEO & Admin */

const DEFAULT_SEO = {
    title: "FuelParts KZ — Автозапчасти, топливные насосы и датчики с подбором по авто",
    description: "Интернет-магазин автозапчастей FuelParts KZ в Алматы и Казахстане: топливные насосы, датчики кислорода, фильтры, свечные провода. Умный поиск по OEM-номеру, артикулу, марке, модели, году и двигателю автомобиля."
};

let products = [
    { id: 105880851, category: "pumps", partCategory: "Топливные насосы", brand: "MASUMA", name: "Топливный насос MASUMA MPU-109", article: "MPU-109", oemNumbers: ["23221-50100"], analogNumbers: ["MPU-109"], isOriginal: "Аналог", compatibilityStatus: "Подтверждено", price: 8500, badge: "Хит", image: "https://resources.cdn-kaspi.kz/img/m/p/hd9/hfe/64443595259934.jpg?format=gallery-large", gallery: ["https://resources.cdn-kaspi.kz/img/m/p/hd9/hfe/64443595259934.jpg?format=gallery-large"], description: "Электрический топливный насос MASUMA MPU-109 для автомобилей Mitsubishi и Toyota 1997–2009 годов выпуска.", compatibility: [{ make: "Mitsubishi", model: "Montero / Pajero", yearFrom: 1997, yearTo: 2009, fuelType: "Бензин", verified: true }, { make: "Toyota", model: "Land Cruiser Prado", yearFrom: 1997, yearTo: 2009, fuelType: "Бензин", verified: true }] },
    { id: 101891000, category: "pumps", partCategory: "Топливные насосы", brand: "MASUMA", name: "Топливный насос MASUMA MPU-108", article: "MPU-108", oemNumbers: ["23220-21131", "23220-21132"], analogNumbers: ["MPU-108"], isOriginal: "Аналог", compatibilityStatus: "Подтверждено", price: 8500, badge: "", image: "https://resources.cdn-kaspi.kz/img/m/p/pac/p96/80210672.png?format=gallery-large", gallery: ["https://resources.cdn-kaspi.kz/img/m/p/pac/p96/80210672.png?format=gallery-large"], description: "Топливный насос MASUMA MPU-108 для Toyota Corolla и Vitz 2006–2015.", compatibility: [{ make: "Toyota", model: "Corolla", yearFrom: 2006, yearTo: 2015, fuelType: "Бензин", verified: true }, { make: "Toyota", model: "Vitz", yearFrom: 2006, yearTo: 2015, fuelType: "Бензин", verified: true }] },
    { id: 106106930, category: "pumps", partCategory: "Топливные насосы", brand: "MASUMA", name: "Топливный насос MASUMA MPU-102", article: "MPU-102", oemNumbers: ["23221-50060", "23221-46140"], analogNumbers: ["MPU-102"], isOriginal: "Аналог", compatibilityStatus: "Подтверждено", price: 11000, badge: "", image: "https://resources.cdn-kaspi.kz/img/m/p/p30/pbc/85354865.jpeg?format=gallery-large", gallery: ["https://resources.cdn-kaspi.kz/img/m/p/p30/pbc/85354865.jpeg?format=gallery-large"], description: "Топливный насос MASUMA MPU-102 для Lexus GS 300/IS 300 и Toyota Land Cruiser/Tundra 1994–2005.", compatibility: [{ make: "Toyota", model: "Land Cruiser", yearFrom: 1994, yearTo: 2005, fuelType: "Бензин", verified: true }, { make: "Lexus", model: "GS 300 / IS 300", yearFrom: 1994, yearTo: 2005, fuelType: "Бензин", verified: true }] }
];

const fallbackProducts = [...products];

let cart = (() => {
    try {
        return JSON.parse(localStorage.getItem("fuelpartsCart") || "[]");
    } catch (_) {
        return [];
    }
})();
let favorites = (() => {
    try {
        return new Set(JSON.parse(localStorage.getItem("fuelpartsFavorites") || "[]"));
    } catch (_) {
        return new Set();
    }
})();
let supabaseClient = null;
let accountUser = null;
let accountMode = "login";
let accountHydrating = false;
let accountWriteQueue = Promise.resolve();
let savedVehicles = [];
let accountOrders = [];
let accountRecoveryActive = false;
let accountLoadPendingUser = null;

let activeCategory = "all";
let favoritesOnly = false;
let catalogPageSize = 12;
let catalogCurrentPage = 1;
let lastSearchMeta = { partialFallback: false, query: "" };
let activeAdminTab = "edit";
let selectedAdminProductId = null;
let bulkSelectedIds = new Set();

// --- Transliteration, Slugs & Code Normalization ---

function transliterate(text) {
    const map = {
        а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",
        к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
        х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
    };
    return String(text || "").toLowerCase().split("").map(char => map[char] || char).join("");
}

function normalizeCode(str) {
    return String(str || "").toUpperCase().replace(/[^A-Z0-9А-ЯЁ]/g, "");
}

function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getProductSlug(product) {
    if (product?.seo?.slug) return product.seo.slug;
    const base = transliterate(product.name || "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return base ? `${base}-${product.id}` : `product-${product.id}`;
}

function getProductBySlug(slug) {
    if (!slug) return null;
    const exact = products.find(product => getProductSlug(product) === slug);
    if (exact) return exact;
    const idTail = /-(\d+)$/.exec(slug) || /^product-(\d+)$/.exec(slug);
    if (idTail) {
        const byId = products.find(product => product.id === Number(idTail[1]));
        if (byId) return byId;
    }
    const compactSlug = slug.replace(/[^a-z0-9]/gi, "").toLowerCase();
    return products.find(product =>
        getProductSlug(product).replace(/[^a-z0-9]/gi, "").toLowerCase() === compactSlug
    ) || null;
}

// --- Data Normalization & Enrich Helpers ---

function repairMojibake(text) {
    if (!text || !/[ÐÑ]/.test(text)) return text;
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const repaired = decodeURIComponent(escape(text));
            if (repaired && repaired !== text && /[А-Яа-яЁё]/.test(repaired)) {
                text = repaired;
            } else {
                break;
            }
        } catch (_) {
            break;
        }
    }
    return text.replace(/РЎ/g, "С").replace(/Рї/g, "п").replace(/Р/gu, "").replace(/\uFFFD/g, "");
}

function inferPartCategory(name, category) {
    const n = String(name || "").toLowerCase();
    if (/фильтр|фильт /.test(n)) return "Топливные фильтры";
    if (/корпус масляного/.test(n)) return "Корпуса масляных фильтров";
    if (/поддон кпп|поддона кпп/.test(n)) return "Поддоны и прокладки АКПП";
    if (/катушка зажигания/.test(n)) return "Катушки зажигания";
    if (/свечные провода/.test(n)) return "Свечные провода";
    if (/датчик кислорода/.test(n)) return "Датчики кислорода";
    if (/датчик уровня топлива/.test(n)) return "Датчики уровня топлива";
    if (/термостат/.test(n)) return "Термостаты";
    if (/клапан отопителя/.test(n)) return "Клапаны отопителя";
    if (/шланг сцепления/.test(n)) return "Шланги сцепления";
    if (/подогреватель/.test(n)) return "Подогреватели топлива";
    if (/крышка топливного бака/.test(n)) return "Крышки топливного бака";
    if (/обманка лямбда/.test(n)) return "Обманки лямбда-зонда";
    if (/лебедка|строп|компрессорный/.test(n)) return "Автоаксессуары и спецоборудование";
    if (/рулевой кардан|цепной комплект/.test(n)) return "Ходовая и ГРМ";
    if (category === "pumps" || /насос/.test(n)) return "Топливные насосы";
    if (category === "sensors") return "Датчики кислорода";
    if (category === "ignition") return "Свечные провода";
    return "Аксессуары и комплектующие";
}

function inferOriginality(brand) {
    const b = String(brand || "").trim().toLowerCase();
    if (b === "subaru" || b === "mitsubishi") return "Оригинал";
    if (["continental", "pierburg", "mahle", "zf parts"].includes(b)) return "Оригинал / OEM-поставщик";
    if (!b || b === "без бренда") return "Требует проверки";
    return "Аналог";
}

function extractArticleFromName(name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) return "";
    const tm = /(TM\s*97\s*97)/i.exec(trimmed);
    if (tm) return "TM 97 97";
    const complex = /([A-Z0-9]{2,}(?:-[A-Z0-9]{2,})+|\d{5}-\d{6}-\d{2}|2322043070\/KS17A)/i.exec(trimmed);
    if (complex) return complex[1];
    const tokens = trimmed.split(/\s+/);
    for (let i = tokens.length - 1; i >= 0; i--) {
        if (/^[A-Za-z0-9./-]{3,}$/.test(tokens[i]) && /\d/.test(tokens[i]) && !/^(12|24|13500LBS)$/i.test(tokens[i])) {
            return tokens[i];
        }
    }
    return /^[A-Za-z0-9./-]{3,}$/.test(tokens[tokens.length - 1] || "") ? tokens[tokens.length - 1] : "";
}

function normalizeCompatibilityRow(row) {
    if (!row || typeof row !== "object") return null;
    const make = String(row.make || "").trim();
    const model = String(row.model || "").trim();
    if (!make && !model) return null;
    const yearFrom = row.yearFrom !== "" && row.yearFrom != null ? Number(row.yearFrom) : null;
    const yearTo = row.yearTo !== "" && row.yearTo != null ? Number(row.yearTo) : null;
    return {
        make,
        model,
        generation: String(row.generation || "").trim(),
        yearFrom: Number.isFinite(yearFrom) ? yearFrom : null,
        yearTo: Number.isFinite(yearTo) ? yearTo : null,
        bodyType: String(row.bodyType || "").trim(),
        engineCode: String(row.engineCode || "").trim(),
        engineGeneration: String(row.engineGeneration || "").trim(),
        engineVolume: String(row.engineVolume || "").trim(),
        fuelType: String(row.fuelType || "").trim(),
        power: String(row.power || "").trim(),
        note: String(row.note || "").trim(),
        verified: row.verified !== false
    };
}

function buildSpecifications(item) {
    const specs = [];
    if (item.article) specs.push(["Артикул", item.article]);
    if (item.brand) specs.push(["Производитель", item.brand]);
    if (item.partCategory) specs.push(["Категория запчасти", item.partCategory]);
    if (item.isOriginal) specs.push(["Тип запчасти", item.isOriginal]);
    if (item.oemNumbers?.length) specs.push(["Номера OEM", item.oemNumbers.join(", ")]);
    if (item.analogNumbers?.length) specs.push(["Аналоги", item.analogNumbers.join(", ")]);

    const compat = item.compatibility || [];
    const makes = [...new Set(compat.map(c => c.make).filter(Boolean))];
    const models = [...new Set(compat.map(c => c.model).filter(Boolean))];
    const years = [...new Set(compat.filter(c => c.yearFrom).map(c => c.yearTo ? `${c.yearFrom}–${c.yearTo}` : `от ${c.yearFrom}`))];
    const engines = [...new Set(compat.map(c => c.engineCode).filter(Boolean))];
    const volumes = [...new Set(compat.map(c => c.engineVolume).filter(Boolean))];
    const fuels = [...new Set(compat.map(c => c.fuelType).filter(Boolean))];
    const bodies = [...new Set(compat.map(c => c.bodyType).filter(Boolean))];
    const powers = [...new Set(compat.map(c => c.power).filter(Boolean))];

    if (makes.length) specs.push(["Марка автомобиля", makes.join(", ")]);
    if (models.length) specs.push(["Модель автомобиля", models.join(", ")]);
    if (years.length) specs.push(["Годы выпуска", years.join("; ")]);
    if (bodies.length) specs.push(["Тип кузова", bodies.join(", ")]);
    if (engines.length) specs.push(["Двигатель / код", engines.join(", ")]);
    if (volumes.length) specs.push(["Объём двигателя", volumes.join(", ")]);
    if (fuels.length) specs.push(["Тип топлива", fuels.join(", ")]);
    if (powers.length) specs.push(["Мощность двигателя", powers.join(", ")]);

    // Preserve extra custom specs not auto-generated
    const autoKeys = new Set(specs.map(s => s[0]));
    autoKeys.add("Статус совместимости");
    (item.specifications || []).forEach(pair => {
        if (Array.isArray(pair) && pair.length >= 2 && !autoKeys.has(pair[0]) && pair[1]) {
            specs.push([pair[0], pair[1]]);
        }
    });
    specs.push(["Статус совместимости", item.compatibilityStatus || "Требует проверки"]);
    return specs;
}

function buildSearchIndex(product) {
    const compatParts = (product.compatibility || []).map(c => [
        c.make, c.model, c.generation, c.bodyType,
        c.engineCode, c.engineGeneration, c.engineVolume,
        c.fuelType, c.power, c.note,
        c.yearFrom || "", c.yearTo || ""
    ].join(" ")).join(" ");

    const specsText = (product.specifications || []).map(s => s.join(" ")).join(" ");
    const oemList = product.oemNumbers || [];
    const analogList = product.analogNumbers || [];
    const rawText = [
        product.name, product.partName, product.brand, product.article,
        product.partCategory, product.isOriginal, product.compatibilityStatus,
        oemList.join(" "), analogList.join(" "),
        compatParts, specsText, product.description
    ].join(" ").toLowerCase();

    const compactCodes = [
        normalizeCode(product.article),
        ...oemList.map(normalizeCode),
        ...analogList.map(normalizeCode)
    ].filter(Boolean);

    return {
        rawText,
        translitText: transliterate(rawText),
        compactCodes,
        tokens: [...new Set(rawText.split(/[^a-zа-яё0-9.]+/i).filter(t => t.length >= 2))]
    };
}

function normalizeProduct(item, index = 0) {
    const id = Number(item.id || Date.now() + index);
    const fallback = fallbackProducts.find(p => p.id === id);
    const name = repairMojibake(item.name || item.title || fallback?.name || "");
    const brand = repairMojibake(item.brand || fallback?.brand || "");
    const category = item.category || fallback?.category || "accessories";
    const partCategory = item.partCategory || inferPartCategory(name, category);
    const article = String(item.article || item.sku || extractArticleFromName(name) || "").trim();
    const oemNumbers = Array.isArray(item.oemNumbers)
        ? item.oemNumbers.map(s => String(s).trim()).filter(Boolean)
        : (typeof item.oemNumbers === "string" ? item.oemNumbers.split(/[,;]+/).map(s => s.trim()).filter(Boolean) : []);
    const analogNumbers = Array.isArray(item.analogNumbers)
        ? item.analogNumbers.map(s => String(s).trim()).filter(Boolean)
        : (typeof item.analogNumbers === "string" ? item.analogNumbers.split(/[,;]+/).map(s => s.trim()).filter(Boolean) : []);
    const isOriginal = item.isOriginal || inferOriginality(brand);
    const compatibility = Array.isArray(item.compatibility)
        ? item.compatibility.map(normalizeCompatibilityRow).filter(Boolean)
        : (fallback?.compatibility || []);
    let compatibilityStatus = item.compatibilityStatus;
    if (!compatibilityStatus) {
        compatibilityStatus = compatibility.length ? "Подтверждено" : "Требует проверки";
    }
    const price = item.price == null || item.price === "" ? null : Number(item.price);
    const image = item.image || (Array.isArray(item.gallery) ? item.gallery[0] : "") || fallback?.image || "";
    const gallery = Array.isArray(item.gallery) && item.gallery.length ? item.gallery : (image ? [image] : []);

    const normalized = {
        schemaVersion: 2,
        id,
        name,
        partName: item.partName || name,
        brand,
        price: Number.isFinite(price) ? price : null,
        category,
        partCategory,
        article,
        oemNumbers,
        analogNumbers,
        isOriginal,
        compatibilityStatus,
        compatibility,
        badge: item.badge || fallback?.badge || "",
        image,
        gallery,
        description: repairMojibake(item.description || fallback?.description || `${name}. Применимость к автомобилю требует проверки по VIN или каталогу.`),
        specifications: Array.isArray(item.specifications) ? item.specifications : [],
        stock: item.stock ?? 1,
        rating: Number(item.rating ?? 0),
        reviews: Number(item.reviews ?? 0),
        kaspiUrl: item.kaspiUrl || ""
    };

    normalized.specifications = buildSpecifications(normalized);
    const baseSlug = transliterate(normalized.name).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = item.seo?.slug || (baseSlug ? `${baseSlug}-${id}` : `product-${id}`);
    const makes = [...new Set(compatibility.map(c => c.make).filter(Boolean))];
    const models = [...new Set(compatibility.map(c => c.model).filter(Boolean))];
    normalized.seo = {
        slug,
        title: item.seo?.title || `${normalized.name} — купить в Алматы и Казахстане | FuelParts KZ`,
        description: item.seo?.description || `${normalized.name} (${brand}).${oemNumbers.length ? ` OEM: ${oemNumbers.join(", ")}.` : ""}${makes.length ? ` Подходит для ${makes.join(", ")} (${models.join(", ")}).` : " Проверка совместимости по VIN."}${normalized.price != null ? ` Цена: ${normalized.price} ₸.` : ""}`
    };
    normalized._search = buildSearchIndex(normalized);
    return normalized;
}

function normalizeCatalog(items) {
    const seenIds = new Set();
    const result = [];
    (items || []).forEach((item, idx) => {
        if (!item) return;
        const p = normalizeProduct(item, idx);
        if (!p.name || seenIds.has(p.id)) return;
        seenIds.add(p.id);
        result.push(p);
    });
    return result;
}

function persistCatalogToLocal() {
    const serializable = products.map(({ _search, ...rest }) => rest);
    localStorage.setItem("fuelpartsCatalog", JSON.stringify(serializable));
    localStorage.setItem("fuelpartsCatalogImported", "true");
}

// --- Smart Search & Fuzzy Matching Engine ---

const SYNONYM_GROUPS = [
    ["бензонасос", "топливный насос", "насос", "модуль", "помпа"],
    ["лямбда", "лямбда-зонд", "зонд", "кислородный", "датчик кислорода"],
    ["мерседес", "мерс", "mercedes", "mercedes-benz", "mb"],
    ["бмв", "bmw"],
    ["фольксваген", "фв", "volkswagen", "vw"],
    ["ауди", "audi"],
    ["шкода", "skoda"],
    ["сеат", "seat"],
    ["порше", "porsche"],
    ["тойота", "toyota"],
    ["лексус", "lexus"],
    ["субару", "subaru"],
    ["хендай", "хундай", "хёндай", "hyundai"],
    ["киа", "kia"],
    ["ниссан", "nissan"],
    ["инфинити", "infiniti"],
    ["митсубиси", "мицубиси", "mitsubishi"],
    ["ленд ровер", "land rover", "range rover", "рендж ровер"],
    ["хонда", "honda"],
    ["форд", "ford"],
    ["чери", "chery"],
    ["джили", "geely"],
    ["газ", "газель", "gaz"],
    ["фильтр", "фильт"],
    ["акпп", "кпп", "коробка", "поддон"],
    ["бензин", "petrol", "gasoline", "tsi", "tfsi", "fsi", "gdi", "mpi"],
    ["дизель", "diesel", "tdi", "crd"]
];

const SYNONYM_MAP = (() => {
    const map = new Map();
    SYNONYM_GROUPS.forEach(group => {
        group.forEach(term => {
            map.set(term, group);
        });
    });
    return map;
})();

function fixKeyboardLayout(str) {
    const en = "qwertyuiop[]asdfghjkl;'zxcvbnm,.";
    const ru = "йцукенгшщзхъфывапролджэячсмитьбю";
    let converted = "";
    let changed = false;
    for (const ch of str.toLowerCase()) {
        const ruIdx = ru.indexOf(ch);
        if (ruIdx !== -1) {
            converted += en[ruIdx];
            changed = true;
            continue;
        }
        const enIdx = en.indexOf(ch);
        if (enIdx !== -1) {
            converted += ru[enIdx];
            changed = true;
            continue;
        }
        converted += ch;
    }
    return changed ? converted : "";
}

function damerauLevenshtein(a, b) {
    const m = a.length, n = b.length;
    if (Math.abs(m - n) > 2) return 99;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost);
            }
        }
    }
    return dp[m][n];
}

function matchYearInCompat(compat, year) {
    if (!compat.length) return false;
    return compat.some(c => {
        if (!c.yearFrom && !c.yearTo) return false;
        const from = c.yearFrom || 1900;
        const to = c.yearTo || 2030;
        return year >= from && year <= to;
    });
}

function expandTokenVariants(token) {
    const t = token.toLowerCase();
    const variants = new Set([t]);
    const layoutSwapped = fixKeyboardLayout(t);
    if (layoutSwapped) variants.add(layoutSwapped);
    for (const v of [...variants]) {
        const synGroup = SYNONYM_MAP.get(v);
        if (synGroup) synGroup.forEach(s => variants.add(s));
        // Prefix match for common brand typos / abbreviations
        if (v.length >= 4) {
            SYNONYM_GROUPS.forEach(group => {
                group.forEach(term => {
                    if (term.startsWith(v) || (v.length >= 5 && damerauLevenshtein(v, term) <= 1)) {
                        group.forEach(s => variants.add(s));
                    }
                });
            });
        }
    }
    return [...variants];
}

function scoreProductQuery(product, rawQuery) {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return { score: 0, matchedTokens: 0, totalTokens: 0 };

    const idx = product._search || buildSearchIndex(product);
    const compactQuery = normalizeCode(query);
    let score = 0;

    // 1. Direct OEM / Article / Analog match
    if (compactQuery.length >= 4) {
        if (idx.compactCodes.some(c => c === compactQuery)) score += 300;
        else if (idx.compactCodes.some(c => c.includes(compactQuery) || compactQuery.includes(c))) score += 160;
    }
    if (idx.rawText.includes(query)) score += 100;

    // 2. Tokenized search (multi-parameter: make + model + year + engine + part)
    const tokens = query.split(/\s+/).filter(Boolean);
    let matchedTokens = 0;

    for (const token of tokens) {
        let tokenScore = 0;
        const compactTok = normalizeCode(token);

        // Year token
        if (/^(19\d{2}|20[0-3]\d)$/.test(token)) {
            const yr = Number(token);
            if (matchYearInCompat(product.compatibility || [], yr)) {
                tokenScore = 65;
            } else if (idx.rawText.includes(token)) {
                tokenScore = 40;
            }
        }

        // Code token (OEM / Article / Analog)
        if (!tokenScore && compactTok.length >= 4 && /\d/.test(compactTok)) {
            if (idx.compactCodes.some(c => c === compactTok)) tokenScore = 220;
            else if (idx.compactCodes.some(c => c.includes(compactTok))) tokenScore = 130;
        }

        // Direct substring or synonym match
        if (!tokenScore) {
            const variants = expandTokenVariants(token);
            for (const v of variants) {
                if (idx.rawText.includes(v)) {
                    tokenScore = Math.max(tokenScore, v === token ? 60 : 48);
                    break;
                }
                const tr = transliterate(v);
                if (tr.length >= 3 && idx.translitText.includes(tr)) {
                    tokenScore = Math.max(tokenScore, 36);
                }
            }
        }

        // Fuzzy typo tolerance on indexed tokens
        if (!tokenScore && token.length >= 4) {
            const maxDist = token.length >= 7 ? 2 : 1;
            const tLower = token.toLowerCase();
            for (const candidate of idx.tokens) {
                if (Math.abs(candidate.length - tLower.length) <= maxDist && damerauLevenshtein(tLower, candidate) <= maxDist) {
                    tokenScore = 24;
                    break;
                }
            }
        }

        if (tokenScore > 0) {
            matchedTokens += 1;
            score += tokenScore;
        }
    }

    return { score, matchedTokens, totalTokens: tokens.length };
}

// --- Compatibility Filtering Helpers ---

function getProductYearsRange(product) {
    const compat = product.compatibility || [];
    return compat.map(c => ({ from: c.yearFrom, to: c.yearTo }));
}

function productMatchesVehicle(product, { make, model, year, engine }) {
    const compat = product.compatibility || [];
    if (!compat.length) return false;
    return compat.some(c => {
        if (make && make !== "all" && c.make !== make) return false;
        if (model && model !== "all" && c.model !== model) return false;
        if (year) {
            const y = Number(year);
            if (!c.yearFrom && !c.yearTo) return false;
            const from = c.yearFrom || 1900;
            const to = c.yearTo || 2030;
            if (y < from || y > to) return false;
        }
        if (engine && engine !== "all") {
            const engText = `${c.engineCode || ""} ${c.engineGeneration || ""} ${c.engineVolume || ""} ${c.fuelType || ""}`.toLowerCase();
            if (!engText.includes(engine.toLowerCase())) return false;
        }
        return true;
    });
}

// --- Populate Filters & 4-Step Vehicle Picker ---

function populateAllFilters() {
    // Brands
    const brandSelect = document.getElementById("brandFilter");
    const prevBrand = brandSelect.value;
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru"));
    brandSelect.innerHTML = `<option value="all">Все производители</option>` +
        brands.map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join("");
    if (brands.includes(prevBrand)) brandSelect.value = prevBrand;

    // Part Categories
    const partCatSelect = document.getElementById("partCategoryFilter");
    const prevPartCat = partCatSelect.value;
    const partCats = [...new Set(products.map(p => p.partCategory).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru"));
    partCatSelect.innerHTML = `<option value="all">Все категории</option>` +
        partCats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
    if (partCats.includes(prevPartCat)) partCatSelect.value = prevPartCat;

    // Vehicle Makes (both catalog makeFilter and pickerMake)
    const makes = [...new Set(products.flatMap(p => (p.compatibility || []).map(c => c.make)).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "ru"));

    const makeFilter = document.getElementById("makeFilter");
    const prevMake = makeFilter.value;
    makeFilter.innerHTML = `<option value="all">Все марки</option>` +
        makes.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("");
    if (makes.includes(prevMake)) makeFilter.value = prevMake;

    const pickerMake = document.getElementById("pickerMake");
    const prevPickerMake = pickerMake.value;
    pickerMake.innerHTML = `<option value="">Выберите марку</option>` +
        makes.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("");
    if (makes.includes(prevPickerMake)) pickerMake.value = prevPickerMake;

    populateModelSelect(makeFilter.value, "modelFilter", "all", "Все модели");
    populateEngineFilter();
    updatePickerModels();
}

function populateModelSelect(selectedMake, targetId, defaultVal, defaultLabel) {
    const select = document.getElementById(targetId);
    const prev = select.value;
    const models = [...new Set(
        products.flatMap(p => (p.compatibility || [])
            .filter(c => !selectedMake || selectedMake === "all" || c.make === selectedMake)
            .map(c => c.model))
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, "ru"));

    select.innerHTML = `<option value="${escapeHtml(defaultVal)}">${escapeHtml(defaultLabel)}</option>` +
        models.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("");
    if (models.includes(prev)) select.value = prev;
}

function populateEngineFilter() {
    const select = document.getElementById("engineFilter");
    const prev = select.value;
    const engines = new Set();
    products.forEach(p => {
        (p.compatibility || []).forEach(c => {
            if (c.engineCode) {
                c.engineCode.split("/").forEach(part => {
                    const clean = part.trim();
                    if (clean) engines.add(clean);
                });
            }
            if (c.fuelType) {
                c.fuelType.split("/").forEach(part => {
                    const clean = part.trim();
                    if (clean) engines.add(clean);
                });
            }
            if (c.engineVolume) {
                c.engineVolume.split("/").forEach(part => {
                    const clean = part.trim();
                    if (clean) engines.add(clean);
                });
            }
        });
    });
    const list = [...engines].sort((a, b) => a.localeCompare(b, "ru"));
    select.innerHTML = `<option value="all">Любой двигатель</option>` +
        list.map(e => `<option value="${escapeHtml(e)}">${escapeHtml(e)}</option>`).join("");
    if (list.includes(prev)) select.value = prev;
}

// --- 4-Step Vehicle Picker Cascade ---

function updatePickerModels() {
    const make = document.getElementById("pickerMake").value;
    const modelSelect = document.getElementById("pickerModel");
    if (!make) {
        modelSelect.disabled = true;
        modelSelect.innerHTML = `<option value="">Сначала марка</option>`;
        updatePickerYears();
        return;
    }
    const modelMap = new Map();
    products.forEach(p => {
        (p.compatibility || []).forEach(c => {
            if (c.make === make && c.model) {
                if (!modelMap.has(c.model)) modelMap.set(c.model, new Set());
                if (c.generation) modelMap.get(c.model).add(c.generation);
            }
        });
    });
    const models = [...modelMap.keys()].sort((a, b) => a.localeCompare(b, "ru"));
    modelSelect.disabled = false;
    modelSelect.innerHTML = `<option value="">Любая модель</option>` + models.map(m => {
        const gens = [...modelMap.get(m)].slice(0, 2).join(", ");
        const label = gens ? `${m} (${gens})` : m;
        return `<option value="${escapeHtml(m)}">${escapeHtml(label)}</option>`;
    }).join("");
    updatePickerYears();
}

function updatePickerYears() {
    const make = document.getElementById("pickerMake").value;
    const model = document.getElementById("pickerModel").value;
    const yearSelect = document.getElementById("pickerYear");
    if (!make) {
        yearSelect.disabled = true;
        yearSelect.innerHTML = `<option value="">Любой год</option>`;
        updatePickerEngines();
        return;
    }
    const years = new Set();
    products.forEach(p => {
        (p.compatibility || []).forEach(c => {
            if (c.make !== make) return;
            if (model && c.model !== model) return;
            if (c.yearFrom) {
                const start = Math.max(1980, Number(c.yearFrom));
                const end = Math.min(2026, Number(c.yearTo || 2025));
                for (let y = start; y <= end; y++) years.add(y);
            }
        });
    });
    const sorted = [...years].sort((a, b) => b - a);
    yearSelect.disabled = false;
    yearSelect.innerHTML = `<option value="">Любой год</option>` +
        sorted.map(y => `<option value="${y}">${y}</option>`).join("");
    updatePickerEngines();
}

function updatePickerEngines() {
    const make = document.getElementById("pickerMake").value;
    const model = document.getElementById("pickerModel").value;
    const year = document.getElementById("pickerYear").value;
    const engSelect = document.getElementById("pickerEngine");
    if (!make) {
        engSelect.disabled = true;
        engSelect.innerHTML = `<option value="">Любой двигатель</option>`;
        return;
    }
    const engines = new Set();
    products.forEach(p => {
        (p.compatibility || []).forEach(c => {
            if (c.make !== make) return;
            if (model && c.model !== model) return;
            if (year) {
                const y = Number(year);
                if (c.yearFrom && y < c.yearFrom) return;
                if (c.yearTo && y > c.yearTo) return;
                if (!c.yearFrom && !c.yearTo) return;
            }
            const parts = [];
            if (c.engineCode) c.engineCode.split("/").forEach(x => engines.add(x.trim()));
            if (c.engineVolume) c.engineVolume.split("/").forEach(x => engines.add(x.trim()));
            if (c.fuelType) c.fuelType.split("/").forEach(x => engines.add(x.trim()));
        });
    });
    const list = [...engines].filter(Boolean).sort((a, b) => a.localeCompare(b, "ru"));
    engSelect.disabled = false;
    engSelect.innerHTML = `<option value="">Любой двигатель</option>` +
        list.map(e => `<option value="${escapeHtml(e)}">${escapeHtml(e)}</option>`).join("");
}

function applyVehiclePicker(scrollToCatalog = true) {
    const make = document.getElementById("pickerMake").value;
    const model = document.getElementById("pickerModel").value;
    const year = document.getElementById("pickerYear").value;
    const engine = document.getElementById("pickerEngine").value;

    document.getElementById("makeFilter").value = make || "all";
    populateModelSelect(make || "all", "modelFilter", "all", "Все модели");
    document.getElementById("modelFilter").value = model || "all";
    document.getElementById("yearFilter").value = year || "";
    document.getElementById("engineFilter").value = engine || "all";

    catalogCurrentPage = 1;
    const visible = getVisibleProducts();
    renderProducts(visible);
    observeProducts();

    const banner = document.getElementById("activeVehicleBanner");
    const resetBtn = document.getElementById("pickerReset");
    if (make) {
        const parts = [make, model, year, engine].filter(Boolean);
        banner.hidden = false;
        banner.innerHTML = `
            <div>
                <strong>Подобранные запчасти для:</strong> ${escapeHtml(parts.join(" • "))}
                <span class="active-vehicle-banner__count">Найдено: ${visible.length}</span>
            </div>
            <button type="button" id="bannerResetVehicle">Сбросить подбор</button>
        `;
        resetBtn.hidden = false;
        if (scrollToCatalog) {
            document.getElementById("catalog").scrollIntoView({ behavior: "smooth", block: "start" });
        }
    } else {
        banner.hidden = true;
        resetBtn.hidden = true;
    }
}

function resetVehiclePicker() {
    document.getElementById("pickerMake").value = "";
    updatePickerModels();
    document.getElementById("makeFilter").value = "all";
    populateModelSelect("all", "modelFilter", "all", "Все модели");
    document.getElementById("modelFilter").value = "all";
    document.getElementById("yearFilter").value = "";
    document.getElementById("engineFilter").value = "all";
    document.getElementById("activeVehicleBanner").hidden = true;
    document.getElementById("pickerReset").hidden = true;
    catalogCurrentPage = 1;
    renderProducts(getVisibleProducts());
    observeProducts();
}

// --- Main Catalog Filtering & Rendering ---

function getVisibleProducts() {
    const query = document.getElementById("searchInput").value.trim();
    const minPrice = Number(document.getElementById("priceMin").value);
    const maxPrice = Number(document.getElementById("priceMax").value);
    const brand = document.getElementById("brandFilter").value;
    const make = document.getElementById("makeFilter").value;
    const model = document.getElementById("modelFilter").value;
    const year = document.getElementById("yearFilter").value.trim();
    const engine = document.getElementById("engineFilter").value;
    const partCategory = document.getElementById("partCategoryFilter").value;
    const originality = document.getElementById("originalityFilter").value;
    const compatStatus = document.getElementById("compatStatusFilter").value;
    const vehicleText = document.getElementById("vehicleFilter").value.trim().toLowerCase();

    lastSearchMeta = { partialFallback: false, query };

    // First apply structured catalog filters
    let filtered = products.filter(product => {
        if (favoritesOnly && !favorites.has(product.id)) return false;
        if (activeCategory !== "all" && product.category !== activeCategory) return false;
        if (partCategory !== "all" && product.partCategory !== partCategory) return false;
        if (brand !== "all" && product.brand !== brand) return false;
        if (originality !== "all" && product.isOriginal !== originality) return false;
        if (compatStatus !== "all" && product.compatibilityStatus !== compatStatus) return false;
        if (minPrice && product.price != null && product.price < minPrice) return false;
        if (maxPrice && product.price != null && product.price > maxPrice) return false;

        if (make !== "all" || model !== "all" || year || engine !== "all") {
            if (!productMatchesVehicle(product, { make, model, year, engine })) return false;
        }
        if (vehicleText) {
            const idx = product._search || buildSearchIndex(product);
            const variants = expandTokenVariants(vehicleText);
            if (!variants.some(v => idx.rawText.includes(v))) return false;
        }
        return true;
    });

    // Apply Smart Search Query scoring
    const scoreMap = new Map();
    if (query) {
        const scored = filtered.map(p => ({ p, res: scoreProductQuery(p, query) }));
        const strictMatches = scored.filter(x => x.res.score > 0 && x.res.matchedTokens >= x.res.totalTokens);

        if (strictMatches.length > 0) {
            filtered = strictMatches.map(x => {
                scoreMap.set(x.p.id, x.res.score);
                return x.p;
            });
        } else {
            const tokensCount = query.split(/\s+/).filter(Boolean).length;
            const minRequired = tokensCount >= 2 ? Math.max(1, tokensCount - 1) : 1;
            const partialMatches = scored.filter(x => x.res.score >= 30 && x.res.matchedTokens >= minRequired);
            if (partialMatches.length > 0) {
                lastSearchMeta.partialFallback = true;
                filtered = partialMatches.map(x => {
                    scoreMap.set(x.p.id, x.res.score);
                    return x.p;
                });
            } else {
                filtered = [];
            }
        }
    }

    const sort = document.getElementById("sortProducts").value;
    if (sort === "relevance" || (query && sort === "default")) {
        return [...filtered].sort((a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0));
    }
    if (sort === "priceAsc") return [...filtered].sort((a, b) => (a.price ?? 9e9) - (b.price ?? 9e9));
    if (sort === "priceDesc") return [...filtered].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === "popular") return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
    if (sort === "name") return [...filtered].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    return filtered;
}

function renderActiveFilterChips() {
    const container = document.getElementById("activeFilterChips");
    const chips = [];
    const push = (label, key) => chips.push(`<button type="button" class="filter-chip" data-clear-filter="${key}">${escapeHtml(label)} <span>×</span></button>`);

    const q = document.getElementById("searchInput").value.trim();
    if (q) push(`Поиск: ${q}`, "search");
    if (favoritesOnly) push("Только избранное", "favorites");
    if (activeCategory !== "all") {
        const activeBtn = document.querySelector(`.filter[data-category="${activeCategory}"]`);
        push(`Раздел: ${activeBtn ? activeBtn.textContent : activeCategory}`, "category");
    }
    const make = document.getElementById("makeFilter").value;
    if (make !== "all") push(`Марка: ${make}`, "make");
    const model = document.getElementById("modelFilter").value;
    if (model !== "all") push(`Модель: ${model}`, "model");
    const year = document.getElementById("yearFilter").value.trim();
    if (year) push(`Год: ${year}`, "year");
    const engine = document.getElementById("engineFilter").value;
    if (engine !== "all") push(`Двигатель: ${engine}`, "engine");
    const partCat = document.getElementById("partCategoryFilter").value;
    if (partCat !== "all") push(`Категория: ${partCat}`, "partCategory");
    const brand = document.getElementById("brandFilter").value;
    if (brand !== "all") push(`Производитель: ${brand}`, "brand");
    const orig = document.getElementById("originalityFilter").value;
    if (orig !== "all") push(`Тип: ${orig}`, "originality");
    const status = document.getElementById("compatStatusFilter").value;
    if (status !== "all") push(`Совместимость: ${status}`, "compatStatus");
    const pMin = document.getElementById("priceMin").value;
    const pMax = document.getElementById("priceMax").value;
    if (pMin || pMax) push(`Цена: ${pMin || "0"}–${pMax || "∞"} ₸`, "price");
    const vf = document.getElementById("vehicleFilter").value.trim();
    if (vf) push(`Авто: ${vf}`, "vehicleFilter");

    container.hidden = chips.length === 0;
    container.innerHTML = chips.join("");
    document.getElementById("resetCatalogFilters").hidden = chips.length === 0 && document.getElementById("sortProducts").value === "default";
}

function getCompatPreviewHtml(product) {
    const compat = product.compatibility || [];
    if (compat.length > 0) {
        const first = compat[0];
        const yrs = first.yearFrom ? (first.yearTo ? ` (${first.yearFrom}–${first.yearTo})` : ` (от ${first.yearFrom})`) : "";
        const more = compat.length > 1 ? ` <b>+${compat.length - 1}</b>` : "";
        return `<div class="product__compat product__compat--ok" title="Подтвержденная совместимость">✓ ${escapeHtml(first.make)} ${escapeHtml(first.model)}${escapeHtml(yrs)}${more}</div>`;
    }
    if (product.compatibilityStatus === "Универсальный") {
        return `<div class="product__compat product__compat--univ">● Универсальная деталь</div>`;
    }
    return `<div class="product__compat product__compat--check">⚠ Совместимость: Требует проверки</div>`;
}

function getOriginalityBadgeClass(orig) {
    if (orig === "Оригинал") return "badge-orig";
    if (orig === "Оригинал / OEM-поставщик") return "badge-oem";
    if (orig === "Аналог") return "badge-analog";
    return "badge-check";
}

function formatPrice(price) {
    return new Intl.NumberFormat("kk-KZ").format(price) + " ₸";
}

function renderProducts(items = products) {
    const productGrid = document.getElementById("products");
    const countWord = items.length === 1 ? "товар" : (items.length >= 2 && items.length <= 4 ? "товара" : "товаров");
    document.getElementById("productCount").textContent = `${items.length} ${countWord}`;

    const matchNote = document.getElementById("searchMatchNote");
    if (lastSearchMeta.partialFallback && items.length > 0) {
        matchNote.hidden = false;
        matchNote.textContent = "Точного совпадения по всем словам нет — показаны ближайшие подходящие варианты";
    } else {
        matchNote.hidden = true;
    }

    renderActiveFilterChips();

    if (!items.length) {
        productGrid.innerHTML = `
            <div class="catalog-empty">
                <strong>Ничего не найдено</strong>
                <p>Попробуйте указать только марку/модель или OEM-артикул, либо сбросьте фильтры.</p>
                <button type="button" id="emptyResetCatalog">Сбросить фильтры</button>
            </div>
        `;
        document.getElementById("pagination").innerHTML = "";
        return;
    }

    const totalPages = Math.max(1, Math.ceil(items.length / catalogPageSize));
    if (catalogCurrentPage > totalPages) catalogCurrentPage = totalPages;
    const start = (catalogCurrentPage - 1) * catalogPageSize;
    const visibleItems = items.slice(start, start + catalogPageSize);

    productGrid.innerHTML = visibleItems.map((product, index) => {
        const slug = getProductSlug(product);
        const oemPreview = product.oemNumbers?.[0] || "";
        return `
        <article class="product" data-product-id="${product.id}">
            <div class="product__image">
                <div class="product__badges">
                    ${product.badge ? `<span class="product__badge">${escapeHtml(product.badge)}</span>` : ""}
                    <span class="product__orig-badge ${getOriginalityBadgeClass(product.isOriginal)}">${escapeHtml(product.isOriginal === "Оригинал / OEM-поставщик" ? "OEM" : product.isOriginal)}</span>
                </div>
                <button class="product__favorite ${favorites.has(product.id) ? "active" : ""}" type="button" data-favorite="${product.id}" aria-label="В избранное">${favorites.has(product.id) ? "♥" : "♡"}</button>
                <img class="product__photo" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="${index < 8 ? "eager" : "lazy"}" decoding="async">
            </div>
            <div class="product__info">
                <div class="product__meta-row">
                    <span class="product__brand">${escapeHtml(product.brand || "—")}</span>
                    ${product.article ? `<span class="product__sku" title="Артикул">${escapeHtml(product.article)}</span>` : ""}
                </div>
                <h3 class="product__name">${escapeHtml(product.name || "Название уточняется")}</h3>
                <div class="product__submeta">
                    <span class="product__cat-tag">${escapeHtml(product.partCategory)}</span>
                    ${oemPreview && oemPreview !== product.article ? `<span class="product__oem-tag">OEM: ${escapeHtml(oemPreview)}</span>` : ""}
                </div>
                ${getCompatPreviewHtml(product)}
                <div class="product__bottom">
                    <div>
                        <div class="product__price">${product.price != null ? formatPrice(product.price) : "Цена по запросу"}</div>
                        <span class="product__stock">${product.stock > 0 ? "● В наличии" : "○ Под заказ"}</span>
                    </div>
                    <div>
                        <a class="product__details" href="?product=${encodeURIComponent(slug)}" data-details="${product.id}">Подробнее</a>
                        <button class="product__cart" type="button" data-id="${product.id}" aria-label="Добавить в корзину">В корзину</button>
                    </div>
                </div>
            </div>
        </article>`;
    }).join("");
    renderPagination(items.length);
}

function renderPagination(totalItems) {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(totalItems / catalogPageSize);
    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }
    const pages = [];
    const maxVisible = window.innerWidth <= 430 ? 3 : 5;
    let startPage = Math.max(1, catalogCurrentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    for (let page = startPage; page <= endPage; page++) pages.push(page);

    pagination.innerHTML = `
        <button type="button" data-catalog-page="${catalogCurrentPage - 1}" ${catalogCurrentPage === 1 ? "disabled" : ""} aria-label="Назад">Назад</button>
        ${startPage > 1 ? `<button type="button" data-catalog-page="1">1</button><span>…</span>` : ""}
        ${pages.map(page => `<button type="button" class="${page === catalogCurrentPage ? "active" : ""}" data-catalog-page="${page}" ${page === catalogCurrentPage ? 'aria-current="page"' : ""}>${page}</button>`).join("")}
        ${endPage < totalPages ? `<span>…</span><button type="button" data-catalog-page="${totalPages}">${totalPages}</button>` : ""}
        <button type="button" data-catalog-page="${catalogCurrentPage + 1}" ${catalogCurrentPage === totalPages ? "disabled" : ""} aria-label="Вперёд">Вперёд</button>
    `;
}

// --- Search Suggestions Dropdown ---

function renderSearchSuggestions() {
    const input = document.getElementById("searchInput");
    const box = document.getElementById("searchSuggestions");
    const clearBtn = document.getElementById("searchClear");
    const query = input.value.trim();
    clearBtn.hidden = !query;

    if (query.length < 2) {
        box.hidden = true;
        box.innerHTML = "";
        return;
    }

    const scored = products
        .map(p => ({ p, res: scoreProductQuery(p, query) }))
        .filter(x => x.res.score > 0)
        .sort((a, b) => b.res.score - a.res.score || b.res.matchedTokens - a.res.matchedTokens);

    const topProducts = scored.slice(0, 6).map(x => x.p);

    // Collect quick vehicle / OEM suggestions
    const qLower = query.toLowerCase();
    const matchedVehicles = new Set();
    products.forEach(p => {
        (p.compatibility || []).forEach(c => {
            const label = `${c.make} ${c.model}${c.generation ? ` ${c.generation}` : ""}`;
            if (label.toLowerCase().includes(qLower) || expandTokenVariants(qLower).some(v => label.toLowerCase().includes(v))) {
                matchedVehicles.add(label);
            }
        });
    });

    if (!topProducts.length && !matchedVehicles.size) {
        box.hidden = false;
        box.innerHTML = `<div class="suggestions-empty">Ничего не найдено по «${escapeHtml(query)}». Попробуйте ввести OEM-номер, артикул или марку авто.</div>`;
        return;
    }

    const vehicleHtml = matchedVehicles.size ? `
        <div class="suggestions-group">
            <div class="suggestions-group__title">Подходящие автомобили</div>
            <div class="suggestions-pills">
                ${[...matchedVehicles].slice(0, 5).map(v => `<button type="button" class="suggestion-pill" data-suggest-query="${escapeHtml(v)}">🚗 ${escapeHtml(v)}</button>`).join("")}
            </div>
        </div>` : "";

    const productsHtml = topProducts.length ? `
        <div class="suggestions-group">
            <div class="suggestions-group__title">Товары (${scored.length})</div>
            ${topProducts.map(p => {
                const firstCompat = p.compatibility?.[0];
                const compatText = firstCompat ? `${firstCompat.make} ${firstCompat.model}` : p.compatibilityStatus;
                return `
                <button type="button" class="suggestion-item" data-suggest-product="${p.id}">
                    <img src="${escapeHtml(p.image)}" alt="">
                    <div class="suggestion-item__info">
                        <strong>${escapeHtml(p.name)}</strong>
                        <span>${escapeHtml(p.brand)} ${p.article ? `• ${escapeHtml(p.article)}` : ""} • ${escapeHtml(compatText)}</span>
                    </div>
                    <b class="suggestion-item__price">${p.price != null ? formatPrice(p.price) : "По запросу"}</b>
                </button>`;
            }).join("")}
        </div>` : "";

    box.hidden = false;
    box.innerHTML = vehicleHtml + productsHtml;
}

// --- SEO & Schema.org Structured Data ---

function updateSeoForCatalog() {
    document.title = DEFAULT_SEO.title;
    document.getElementById("metaDescription")?.setAttribute("content", DEFAULT_SEO.description);
    document.getElementById("ogTitle")?.setAttribute("content", DEFAULT_SEO.title);
    document.getElementById("ogDescription")?.setAttribute("content", DEFAULT_SEO.description);
    const canonical = document.getElementById("canonicalLink");
    if (canonical) canonical.setAttribute("href", window.location.origin + window.location.pathname);

    const schemaEl = document.getElementById("productSchema");
    if (schemaEl) {
        schemaEl.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoPartsStore",
            "name": "FuelParts KZ",
            "description": DEFAULT_SEO.description,
            "telephone": "+77087577834",
            "address": { "@type": "PostalAddress", "addressLocality": "Алматы", "addressCountry": "KZ" }
        });
    }
}

function updateSeoForProduct(product) {
    const title = product.seo?.title || `${product.name} — FuelParts KZ`;
    const desc = product.seo?.description || product.description;
    document.title = title;
    document.getElementById("metaDescription")?.setAttribute("content", desc);
    document.getElementById("ogTitle")?.setAttribute("content", title);
    document.getElementById("ogDescription")?.setAttribute("content", desc);

    const url = new URL(window.location.href);
    url.searchParams.set("product", getProductSlug(product));
    document.getElementById("canonicalLink")?.setAttribute("href", url.toString());

    const additionalProperties = [
        { "@type": "PropertyValue", "name": "Тип запчасти", "value": product.isOriginal },
        { "@type": "PropertyValue", "name": "Статус совместимости", "value": product.compatibilityStatus }
    ];
    if (product.oemNumbers?.length) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "OEM", "value": product.oemNumbers.join(", ") });
    }
    if (product.compatibility?.length) {
        additionalProperties.push({
            "@type": "PropertyValue",
            "name": "Совместимые автомобили",
            "value": product.compatibility.map(c => `${c.make} ${c.model}${c.generation ? ` ${c.generation}` : ""}`).join("; ")
        });
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "sku": product.article || String(product.id),
        "mpn": product.oemNumbers?.[0] || product.article || String(product.id),
        "category": product.partCategory,
        "image": getProductGallery(product),
        "description": desc,
        "brand": { "@type": "Brand", "name": product.brand || "FuelParts" },
        "additionalProperty": additionalProperties,
        "offers": {
            "@type": "Offer",
            "url": url.toString(),
            "priceCurrency": "KZT",
            "price": product.price != null ? product.price : 0,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder"
        }
    };
    if (product.rating > 0 && product.reviews > 0) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviews
        };
    }
    const schemaEl = document.getElementById("productSchema");
    if (schemaEl) schemaEl.textContent = JSON.stringify(schema);
}

// --- Product Detail Page ---

function getProductGallery(product) {
    return [...new Set([product.image, ...(product.gallery || [])].filter(Boolean))];
}

function openProductPage(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;
    const slug = getProductSlug(product);
    const url = new URL(window.location.href);
    url.searchParams.set("product", slug);
    window.history.pushState({ productId }, "", url);
    renderProductPage(product);
}

function backToCatalog() {
    const url = new URL(window.location.href);
    url.searchParams.delete("product");
    window.history.pushState({}, "", url);
    renderCatalogPage();
}

function renderCatalogPage() {
    document.getElementById("productPage").hidden = true;
    document.getElementById("catalogMain").hidden = false;
    updateSeoForCatalog();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCompatibilityRowHtml(c) {
    const years = c.yearFrom ? (c.yearTo ? `${c.yearFrom}–${c.yearTo}` : `от ${c.yearFrom}`) : "Требует проверки";
    const metaTags = [
        c.bodyType ? `Кузов: ${c.bodyType}` : "",
        c.engineCode ? `Двигатель: ${c.engineCode}` : "",
        c.engineGeneration ? `Поколение ДВС: ${c.engineGeneration}` : "",
        c.engineVolume ? `Объём: ${c.engineVolume}` : "",
        c.fuelType ? `Топливо: ${c.fuelType}` : "",
        c.power ? `Мощность: ${c.power}` : "",
        c.note || ""
    ].filter(Boolean);

    return `
    <div class="compat-item">
        <div class="compat-item__main">
            <strong>${escapeHtml(c.make)} ${escapeHtml(c.model)}${c.generation ? ` <span class="compat-gen">${escapeHtml(c.generation)}</span>` : ""}</strong>
            <span class="compat-years">${escapeHtml(years)}</span>
        </div>
        ${metaTags.length ? `<div class="compat-item__tags">${metaTags.map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>` : ""}
    </div>`;
}

function renderCompatibilitySection(product) {
    const compat = product.compatibility || [];
    const status = product.compatibilityStatus || "Требует проверки";
    const statusBadgeClass = status === "Подтверждено" ? "compat-status--ok" : (status === "Универсальный" ? "compat-status--univ" : "compat-status--check");

    if (status === "Универсальный" && !compat.length) {
        return `
        <section class="product-detail__section compatibility-block">
            <div class="compatibility-block__head">
                <h2>Совместимость с автомобилями</h2>
                <span class="compat-status ${statusBadgeClass}">● Универсальная деталь</span>
            </div>
            <p class="compat-note">Подходит для широкого спектра легковых и коммерческих автомобилей с соответствующими параметрами подключения. При необходимости уточните параметры по VIN.</p>
        </section>`;
    }

    if (!compat.length) {
        const waText = encodeURIComponent(`Здравствуйте! Прошу проверить совместимость товара: ${product.name} (Артикул: ${product.article || product.id})`);
        return `
        <section class="product-detail__section compatibility-block">
            <div class="compatibility-block__head">
                <h2>Совместимость с автомобилями</h2>
                <span class="compat-status compat-status--check">⚠ Требует проверки</span>
            </div>
            <p class="compat-note">Для данной позиции точный список совместимых автомобилей не подтверждён в базе. Не рекомендуется подбирать без сверки по VIN-коду или оригинальному каталогу.</p>
            <div class="compat-actions">
                <a class="compat-vin-btn" href="https://wa.me/77087577834?text=${waText}" target="_blank" rel="noopener">Проверить по VIN в WhatsApp</a>
                <button type="button" class="compat-edit-btn" data-admin-edit-product="${product.id}">Указать совместимость (Админ)</button>
            </div>
        </section>`;
    }

    const previewCount = 3;
    const initialRows = compat.slice(0, previewCount);
    const hiddenRows = compat.slice(previewCount);

    return `
    <section class="product-detail__section compatibility-block">
        <div class="compatibility-block__head">
            <h2>Совместимость с автомобилями</h2>
            <span class="compat-status ${statusBadgeClass}">✓ ${escapeHtml(status)} (${compat.length})</span>
        </div>
        <div class="compat-list">
            ${initialRows.map(renderCompatibilityRowHtml).join("")}
        </div>
        ${hiddenRows.length ? `
            <div class="compat-list compat-list--extra" id="extraCompatList" hidden>
                ${hiddenRows.map(renderCompatibilityRowHtml).join("")}
            </div>
            <button type="button" class="compat-toggle-btn" id="toggleAllCompatBtn" data-total-compat="${compat.length}">
                Показать все совместимые автомобили (${compat.length})
            </button>
        ` : ""}
    </section>`;
}

function renderProductPage(product) {
    if (!product) {
        document.getElementById("catalogMain").hidden = true;
        document.getElementById("productPage").hidden = false;
        document.getElementById("productPageContent").innerHTML = `
            <div class="product-detail__section">
                <h2>Товар не найден</h2>
                <p>Такой товар отсутствует в каталоге.</p>
                <button type="button" class="product-detail__add" data-back-catalog>Вернуться в каталог</button>
            </div>
        `;
        return;
    }

    updateSeoForProduct(product);

    // Similar products: prioritize same vehicle make, then same partCategory/category
    const myMakes = new Set((product.compatibility || []).map(c => c.make));
    const similar = products
        .filter(item => item.id !== product.id)
        .map(item => {
            let rel = 0;
            if (item.partCategory === product.partCategory) rel += 2;
            if (item.category === product.category) rel += 1;
            if ((item.compatibility || []).some(c => myMakes.has(c.make))) rel += 3;
            return { item, rel };
        })
        .sort((a, b) => b.rel - a.rel)
        .slice(0, 4)
        .map(x => x.item);

    const gallery = getProductGallery(product);
    const specifications = product.specifications || [];

    document.getElementById("catalogMain").hidden = true;
    document.getElementById("productPage").hidden = false;

    document.getElementById("productPageContent").innerHTML = `
        <div class="product-page-topbar">
            <button class="product-back-button" type="button" data-back-catalog>
                <span aria-hidden="true">←</span> Назад в каталог
            </button>
            <button class="product-admin-shortcut" type="button" data-admin-edit-product="${product.id}">
                ✎ Редактировать карточку
            </button>
        </div>
        <nav class="product-breadcrumbs" aria-label="Навигационная цепочка">
            <a href="#" data-back-catalog>Главная</a><span>/</span>
            <a href="#" data-back-catalog>${escapeHtml(product.partCategory)}</a><span>/</span>
            <strong>${escapeHtml(product.name)}</strong>
        </nav>
        <div class="product-detail">
            <div class="product-detail__gallery">
                <div class="product-detail__main-image" data-zoom-image>
                    <img id="productMainImage" src="${escapeHtml(gallery[0] || "")}" alt="${escapeHtml(product.name)}">
                </div>
                ${gallery.length > 1 ? `
                    <div class="product-detail__thumbs">
                        ${gallery.map((image, index) => `
                            <button class="product-detail__thumb ${index === 0 ? "active" : ""}" type="button" data-main-image="${escapeHtml(image)}" aria-label="Показать фотографию товара">
                                <img src="${escapeHtml(image)}" alt="">
                            </button>
                        `).join("")}
                    </div>
                ` : ""}
            </div>
            <div class="product-detail__info">
                <div class="product-detail__badges">
                    <span class="product-detail__brand">${escapeHtml(product.brand)}</span>
                    <span class="product__orig-badge ${getOriginalityBadgeClass(product.isOriginal)}">${escapeHtml(product.isOriginal)}</span>
                    <span class="product__cat-tag">${escapeHtml(product.partCategory)}</span>
                </div>
                <h1>${escapeHtml(product.name)}</h1>
                <div class="product-detail__codes">
                    ${product.article ? `<div><span>Артикул:</span> <strong class="code-copy" data-copy-code="${escapeHtml(product.article)}" title="Нажмите, чтобы скопировать">${escapeHtml(product.article)}</strong></div>` : ""}
                    ${product.oemNumbers?.length ? `<div><span>OEM:</span> ${product.oemNumbers.map(o => `<button type="button" class="oem-search-chip" data-search-code="${escapeHtml(o)}">${escapeHtml(o)}</button>`).join(" ")}</div>` : ""}
                    ${product.analogNumbers?.length ? `<div><span>Аналоги:</span> ${product.analogNumbers.map(a => `<button type="button" class="oem-search-chip oem-search-chip--analog" data-search-code="${escapeHtml(a)}">${escapeHtml(a)}</button>`).join(" ")}</div>` : ""}
                </div>
                ${product.reviews > 0 ? `<div class="product-detail__rating">★ ${product.rating} (${product.reviews} отзывов)</div>` : ""}
                <div class="product-detail__price">${product.price != null ? formatPrice(product.price) : "Цена по запросу"}</div>
                <span class="product-detail__stock">${product.stock > 0 ? "● В наличии" : "○ Под заказ"}</span>
                <p class="product-detail__short">${escapeHtml(product.description)}</p>
                <div class="product-detail__delivery">
                    <strong>Доставка:</strong> по Алматы за 1–2 дня<br>
                    Доступен самовывоз и отправка по Казахстану
                </div>
                <div class="product-detail__quantity">
                    <span>Количество</span>
                    <div class="quantity-control">
                        <button type="button" data-quantity-minus aria-label="Уменьшить количество">−</button>
                        <output id="productQuantity">1</output>
                        <button type="button" data-quantity-plus aria-label="Увеличить количество">+</button>
                    </div>
                </div>
                <div class="product-detail__actions">
                    <button class="product-detail__add" type="button" data-detail-add="${product.id}">Добавить в корзину</button>
                    <button class="product-detail__buy" type="button" data-detail-buy="${product.id}">Купить сейчас</button>
                </div>
            </div>
        </div>
        <div class="product-detail__sections">
            ${renderCompatibilitySection(product)}
            <section class="product-detail__section">
                <h2>Описание</h2>
                <p>${escapeHtml(product.description)}</p>
            </section>
            ${specifications.length ? `
                <section class="product-detail__section product-specifications">
                    <h2>Характеристики и параметры</h2>
                    <dl>
                        ${specifications.map(([name, value]) => `
                            <div>
                                <dt>${escapeHtml(name)}</dt>
                                <dd>${escapeHtml(value)}</dd>
                            </div>
                        `).join("")}
                    </dl>
                </section>
            ` : ""}
        </div>
        ${similar.length ? `
            <section class="similar-products">
                <h2>Похожие и совместимые товары</h2>
                <div class="products">
                    ${similar.map(item => `
                        <article class="product" data-similar-id="${item.id}">
                            <div class="product__image">
                                ${item.badge ? `<span class="product__badge">${escapeHtml(item.badge)}</span>` : ""}
                                <img class="product__photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
                            </div>
                            <div class="product__info">
                                <div class="product__brand">${escapeHtml(item.brand)}</div>
                                <h3 class="product__name">${escapeHtml(item.name)}</h3>
                                ${getCompatPreviewHtml(item)}
                                <div class="product__bottom">
                                    <div class="product__price">${item.price != null ? formatPrice(item.price) : "По запросу"}</div>
                                    <button class="product__cart" type="button" data-similar-buy="${item.id}">В корзину</button>
                                </div>
                            </div>
                        </article>
                    `).join("")}
                </div>
            </section>
        ` : ""}
    `;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- Cart, Checkout & Modals ---

function persistCart() {
    localStorage.setItem("fuelpartsCart", JSON.stringify(cart));
    if (supabaseClient && accountUser && !accountHydrating) {
        const userId = accountUser.id;
        const items = cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            name: item.name,
            article: item.article || "",
            price: Number(item.price) || 0,
            image: item.image || ""
        }));
        queueAccountWrite(async () => {
            const { error } = await supabaseClient.from("saved_carts").upsert(
                { user_id: userId, items },
                { onConflict: "user_id" }
            );
            if (error) throw error;
        }, "Не удалось сохранить корзину в аккаунте");
    }
}

function persistFavorites() {
    localStorage.setItem("fuelpartsFavorites", JSON.stringify([...favorites]));
    if (supabaseClient && accountUser && !accountHydrating) {
        const userId = accountUser.id;
        const productIds = [...favorites];
        queueAccountWrite(async () => {
            const { error } = await supabaseClient.rpc("replace_my_favorites", {
                p_product_ids: productIds
            });
            if (error) throw error;
        }, "Не удалось сохранить избранное в аккаунте");
    }
}

function renderCart() {
    persistCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = count;
    document.getElementById("cartTitleCount").textContent = `(${count})`;
    document.getElementById("clearCartButton").disabled = cart.length === 0;
    const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    document.getElementById("cartTotal").textContent = formatPrice(total);

    const cartItems = document.getElementById("cartItems");
    if (!cart.length) {
        cartItems.innerHTML = `<div class="cart-empty">
            <svg class="cart-empty__icon" width="58" height="58" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20.5 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9.5" cy="19" r="1.5" fill="currentColor"/>
                <circle cx="17" cy="19" r="1.5" fill="currentColor"/>
            </svg>
            <p>Корзина пока пуста</p>
        </div>`;
        return;
    }
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item__thumb">
                <img class="cart-item__photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
            </div>
            <div>
                <h4>${escapeHtml(item.name)}</h4>
                <strong>${item.price != null ? formatPrice(item.price) : "По запросу"} × ${item.quantity}</strong>
            </div>
            <button class="cart-item__remove" type="button" data-remove="${item.id}" aria-label="Удалить">×</button>
        </div>
    `).join("");
}

function openCart() {
    document.getElementById("cartPanel").classList.add("open");
    document.getElementById("cartOverlay").classList.add("open");
    document.body.classList.add("modal-open");
}

function closeCart() {
    document.getElementById("cartPanel").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("open");
    if (!document.getElementById("checkoutModal").classList.contains("open")) {
        document.body.classList.remove("modal-open");
    }
}

let toastTimer;
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function openCheckout() {
    if (!cart.length) {
        showToast("Корзина пуста");
        return;
    }
    if (!supabaseClient || !accountUser) {
        showToast("Войдите в аккаунт, чтобы отправить заявку");
        openAccountModal();
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    document.getElementById("checkoutTotal").textContent = formatPrice(total);
    closeCart();
    document.getElementById("checkoutOverlay").classList.add("open");
    document.getElementById("checkoutModal").classList.add("open");
    document.body.classList.add("modal-open");
}

function closeCheckout() {
    document.getElementById("checkoutOverlay").classList.remove("open");
    document.getElementById("checkoutModal").classList.remove("open");
    document.body.classList.remove("modal-open");
}

function openClearCartConfirm() {
    document.getElementById("clearCartOverlay").classList.add("open");
    document.getElementById("clearCartModal").classList.add("open");
    document.body.classList.add("modal-open");
    document.getElementById("cancelClearCart").focus();
}

function closeClearCartConfirm() {
    document.getElementById("clearCartOverlay").classList.remove("open");
    document.getElementById("clearCartModal").classList.remove("open");
    if (!document.getElementById("cartPanel").classList.contains("open")) {
        document.body.classList.remove("modal-open");
    }
}

function closeProductModal() {
    document.getElementById("productModalOverlay").classList.remove("open");
    document.getElementById("productModal").classList.remove("open");
    document.body.classList.remove("modal-open");
}

// --- Admin Panel (Manual Editing, Bulk Update & JSON/CSV Import-Export) ---

function openAdminModal(tab = "edit", productId = null) {
    activeAdminTab = tab;
    if (productId) selectedAdminProductId = productId;
    else if (!selectedAdminProductId && products.length) selectedAdminProductId = products[0].id;

    document.querySelectorAll(".admin-tab").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.adminTab === activeAdminTab);
    });
    renderAdminBody();
    document.getElementById("adminOverlay").classList.add("open");
    document.getElementById("adminModal").classList.add("open");
    document.body.classList.add("modal-open");
}

function closeAdminModal() {
    document.getElementById("adminOverlay").classList.remove("open");
    document.getElementById("adminModal").classList.remove("open");
    document.body.classList.remove("modal-open");
}

function renderAdminCompatRow(c = {}, idx = 0) {
    return `
    <div class="admin-compat-row" data-compat-row="${idx}">
        <input type="text" data-cf="make" value="${escapeHtml(c.make || "")}" placeholder="Марка (BMW)">
        <input type="text" data-cf="model" value="${escapeHtml(c.model || "")}" placeholder="Модель (5-Series)">
        <input type="text" data-cf="generation" value="${escapeHtml(c.generation || "")}" placeholder="Поколение (F10)">
        <input type="number" data-cf="yearFrom" value="${c.yearFrom || ""}" placeholder="Год от">
        <input type="number" data-cf="yearTo" value="${c.yearTo || ""}" placeholder="Год до">
        <input type="text" data-cf="bodyType" value="${escapeHtml(c.bodyType || "")}" placeholder="Кузов">
        <input type="text" data-cf="engineCode" value="${escapeHtml(c.engineCode || "")}" placeholder="Код ДВС (N20)">
        <input type="text" data-cf="engineVolume" value="${escapeHtml(c.engineVolume || "")}" placeholder="Объём (2.0)">
        <input type="text" data-cf="fuelType" value="${escapeHtml(c.fuelType || "")}" placeholder="Топливо">
        <input type="text" data-cf="power" value="${escapeHtml(c.power || "")}" placeholder="Мощность">
        <input type="text" data-cf="note" value="${escapeHtml(c.note || "")}" placeholder="Примечание">
        <button type="button" class="admin-remove-row" data-remove-compat-row aria-label="Удалить строку">×</button>
    </div>`;
}

function renderAdminBody() {
    const body = document.getElementById("adminModalBody");
    if (activeAdminTab === "edit") {
        const product = products.find(p => p.id === selectedAdminProductId) || products[0];
        if (!product) {
            body.innerHTML = "<p>Каталог пуст.</p>";
            return;
        }
        body.innerHTML = `
            <div class="admin-edit-toolbar">
                <label>Выберите товар для редактирования:
                    <select id="adminProductSelect">
                        ${products.map(p => `<option value="${p.id}" ${p.id === product.id ? "selected" : ""}>[${p.id}] ${escapeHtml(p.name)} (${escapeHtml(p.compatibilityStatus)})</option>`).join("")}
                    </select>
                </label>
            </div>
            <form id="adminEditForm" class="admin-form">
                <div class="admin-form-grid">
                    <label>Название запчасти<input type="text" name="name" value="${escapeHtml(product.name)}" required></label>
                    <label>Производитель<input type="text" name="brand" value="${escapeHtml(product.brand)}"></label>
                    <label>Артикул<input type="text" name="article" value="${escapeHtml(product.article)}"></label>
                    <label>Цена (₸)<input type="number" name="price" min="0" value="${product.price ?? ""}"></label>
                    <label>Раздел каталога
                        <select name="category">
                            <option value="pumps" ${product.category === "pumps" ? "selected" : ""}>Топливные насосы (pumps)</option>
                            <option value="sensors" ${product.category === "sensors" ? "selected" : ""}>Датчики кислорода (sensors)</option>
                            <option value="ignition" ${product.category === "ignition" ? "selected" : ""}>Свечные провода (ignition)</option>
                            <option value="accessories" ${product.category === "accessories" ? "selected" : ""}>Фильтры и аксессуары (accessories)</option>
                        </select>
                    </label>
                    <label>Категория детали<input type="text" name="partCategory" value="${escapeHtml(product.partCategory)}"></label>
                    <label>Оригинал / Аналог
                        <select name="isOriginal">
                            <option value="Оригинал" ${product.isOriginal === "Оригинал" ? "selected" : ""}>Оригинал</option>
                            <option value="Оригинал / OEM-поставщик" ${product.isOriginal === "Оригинал / OEM-поставщик" ? "selected" : ""}>Оригинал / OEM-поставщик</option>
                            <option value="Аналог" ${product.isOriginal === "Аналог" ? "selected" : ""}>Аналог</option>
                            <option value="Требует проверки" ${product.isOriginal === "Требует проверки" ? "selected" : ""}>Требует проверки</option>
                        </select>
                    </label>
                    <label>Статус совместимости
                        <select name="compatibilityStatus">
                            <option value="Подтверждено" ${product.compatibilityStatus === "Подтверждено" ? "selected" : ""}>Подтверждено</option>
                            <option value="Универсальный" ${product.compatibilityStatus === "Универсальный" ? "selected" : ""}>Универсальный</option>
                            <option value="Требует проверки" ${product.compatibilityStatus === "Требует проверки" ? "selected" : ""}>Требует проверки</option>
                        </select>
                    </label>
                    <label>OEM-номера (через запятую)<input type="text" name="oemNumbers" value="${escapeHtml((product.oemNumbers || []).join(", "))}"></label>
                    <label>Аналоги и альтернативы (через запятую)<input type="text" name="analogNumbers" value="${escapeHtml((product.analogNumbers || []).join(", "))}"></label>
                </div>
                <label>Описание<textarea name="description" rows="2">${escapeHtml(product.description)}</textarea></label>

                <div class="admin-compat-section">
                    <div class="admin-compat-section__head">
                        <h3>Совместимость с автомобилями</h3>
                        <button type="button" id="adminAddCompatRow" class="admin-btn-secondary">+ Добавить автомобиль</button>
                    </div>
                    <div id="adminCompatRows">
                        ${(product.compatibility || []).map((c, idx) => renderAdminCompatRow(c, idx)).join("")}
                    </div>
                </div>
                <div class="admin-form-actions">
                    <button type="submit" class="admin-btn-primary">Сохранить изменения</button>
                </div>
            </form>
        `;
        return;
    }

    if (activeAdminTab === "bulk") {
        const filterText = (document.getElementById("bulkSearchInput")?.value || "").trim().toLowerCase();
        const statusFilter = document.getElementById("bulkStatusFilter")?.value || "all";
        const matched = products.filter(p => {
            if (statusFilter !== "all" && p.compatibilityStatus !== statusFilter) return false;
            if (!filterText) return true;
            return (p._search?.rawText || p.name.toLowerCase()).includes(filterText);
        });

        body.innerHTML = `
            <div class="admin-bulk-controls">
                <input type="search" id="bulkSearchInput" value="${escapeHtml(filterText)}" placeholder="Фильтр товаров по названию, бренду, артикулу...">
                <select id="bulkStatusFilter">
                    <option value="all" ${statusFilter === "all" ? "selected" : ""}>Все статусы (${products.length})</option>
                    <option value="Требует проверки" ${statusFilter === "Требует проверки" ? "selected" : ""}>Требует проверки</option>
                    <option value="Подтверждено" ${statusFilter === "Подтверждено" ? "selected" : ""}>Подтверждено</option>
                </select>
                <button type="button" id="bulkSelectAllBtn" class="admin-btn-secondary">Выбрать все (${matched.length})</button>
                <button type="button" id="bulkClearSelBtn" class="admin-btn-secondary">Снять выбор</button>
            </div>
            <div class="admin-bulk-list">
                ${matched.slice(0, 80).map(p => `
                    <label class="admin-bulk-item">
                        <input type="checkbox" data-bulk-id="${p.id}" ${bulkSelectedIds.has(p.id) ? "checked" : ""}>
                        <span><strong>${escapeHtml(p.name)}</strong> <small>${escapeHtml(p.brand)} • ${escapeHtml(p.article || p.id)} • ${escapeHtml(p.compatibilityStatus)}</small></span>
                    </label>
                `).join("")}
                ${matched.length > 80 ? `<div class="admin-bulk-more">Показаны первые 80 из ${matched.length}. Уточните поиск или нажмите «Выбрать все».</div>` : ""}
            </div>
            <form id="adminBulkApplyForm" class="admin-bulk-apply">
                <h3>Применить ко всем выбранным (<span id="bulkSelectedCount">${bulkSelectedIds.size}</span>)</h3>
                <div class="admin-form-grid">
                    <label>Категория детали (оставить пустым — не менять)<input type="text" name="partCategory" placeholder="Напр. Топливные фильтры"></label>
                    <label>Оригинал / Аналог
                        <select name="isOriginal">
                            <option value="">— Не менять —</option>
                            <option value="Оригинал">Оригинал</option>
                            <option value="Оригинал / OEM-поставщик">Оригинал / OEM-поставщик</option>
                            <option value="Аналог">Аналог</option>
                            <option value="Требует проверки">Требует проверки</option>
                        </select>
                    </label>
                    <label>Статус совместимости
                        <select name="compatibilityStatus">
                            <option value="">— Не менять —</option>
                            <option value="Подтверждено">Подтверждено</option>
                            <option value="Универсальный">Универсальный</option>
                            <option value="Требует проверки">Требует проверки</option>
                        </select>
                    </label>
                    <label>Производитель (не менять — пусто)<input type="text" name="brand" placeholder="Напр. Bosch"></label>
                </div>
                <div class="admin-form-grid">
                    <label>Добавить совместимость — Марка<input type="text" name="addMake" placeholder="Напр. Mercedes-Benz"></label>
                    <label>Модель<input type="text" name="addModel" placeholder="Напр. E-Class"></label>
                    <label>Поколение<input type="text" name="addGeneration" placeholder="Напр. W213"></label>
                    <label>Годы (от–до)<input type="text" name="addYears" placeholder="Напр. 2016-2020"></label>
                </div>
                <button type="submit" class="admin-btn-primary">Применить массовое обновление</button>
            </form>
        `;
        return;
    }

    // Tab: Import / Export
    body.innerHTML = `
        <div class="admin-import-box">
            <h3>Массовый импорт / обновление из JSON или CSV</h3>
            <p>Безопасное обновление: режим «Обновить и добавить» сохраняет существующие товары и обновляет поля совпадающих по ID или артикулу.</p>
            <div class="admin-import-controls">
                <select id="importModeSelect">
                    <option value="merge">Обновить существующие и добавить новые (рекомендуется)</option>
                    <option value="replace">Полностью заменить текущий каталог</option>
                </select>
                <input type="file" id="catalogFileInput" accept=".json,.csv">
            </div>
        </div>
        <div class="admin-export-box">
            <h3>Экспорт и резервное копирование</h3>
            <div class="admin-export-actions">
                <button type="button" id="exportJsonBtn" class="admin-btn-primary">Скачать catalog.json (${products.length} товаров)</button>
                <button type="button" id="exportCsvBtn" class="admin-btn-secondary">Скачать таблицу CSV</button>
                <button type="button" id="resetServerCatalogBtn" class="admin-btn-danger">Сбросить ручные правки к исходному catalog.json</button>
            </div>
        </div>
    `;
}

// --- CSV / JSON Import & Export ---

function parseCsv(text) {
    const rows = [];
    let row = [], value = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            if (quoted && text[i + 1] === '"') { value += '"'; i++; }
            else quoted = !quoted;
        } else if (char === "," && !quoted) {
            row.push(value.trim()); value = "";
        } else if ((char === "\n" || char === "\r") && !quoted) {
            if (char === "\r" && text[i + 1] === "\n") i++;
            row.push(value.trim());
            if (row.some(cell => cell)) rows.push(row);
            row = []; value = "";
        } else {
            value += char;
        }
    }
    row.push(value.trim());
    if (row.some(cell => cell)) rows.push(row);
    if (!rows.length) return [];
    const headers = rows.shift().map(h => h.trim().toLowerCase());
    return rows.map(values => {
        const item = {};
        headers.forEach((h, idx) => { item[h] = values[idx] || ""; });
        return item;
    });
}

async function importCatalogFile(file, mode = "merge") {
    try {
        const text = await file.text();
        let items;
        if (file.name.toLowerCase().endsWith(".json")) {
            const parsed = JSON.parse(text);
            items = Array.isArray(parsed) ? parsed : (parsed.products || []);
        } else {
            items = parseCsv(text);
        }
        if (!items.length) throw new Error("empty");

        const incoming = normalizeCatalog(items);
        if (mode === "replace") {
            products = incoming;
        } else {
            const byId = new Map(products.map(p => [p.id, p]));
            const byArt = new Map(products.filter(p => p.article).map(p => [normalizeCode(p.article), p]));
            incoming.forEach(inc => {
                const existing = byId.get(inc.id) || (inc.article ? byArt.get(normalizeCode(inc.article)) : null);
                if (existing) {
                    const merged = normalizeProduct({
                        ...existing,
                        ...inc,
                        id: existing.id,
                        compatibility: inc.compatibility?.length ? inc.compatibility : existing.compatibility,
                        oemNumbers: inc.oemNumbers?.length ? inc.oemNumbers : existing.oemNumbers,
                        analogNumbers: inc.analogNumbers?.length ? inc.analogNumbers : existing.analogNumbers
                    });
                    byId.set(existing.id, merged);
                } else {
                    byId.set(inc.id, inc);
                }
            });
            products = [...byId.values()];
        }

        persistCatalogToLocal();
        populateAllFilters();
        renderProducts(getVisibleProducts());
        observeProducts();
        showToast(`Обновлено. Всего товаров: ${products.length}`);
        renderAdminBody();
    } catch (_) {
        showToast("Не удалось импортировать файл");
    }
}

function downloadBlob(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// --- Load Catalog ---

async function loadCatalog() {
    const imported = localStorage.getItem("fuelpartsCatalogImported") === "true";
    if (imported) {
        const saved = localStorage.getItem("fuelpartsCatalog");
        if (saved) {
            try {
                products = normalizeCatalog(JSON.parse(saved));
            } catch (_) {}
        }
    } else {
        try {
            const response = await fetch("catalog.json", { cache: "no-store" });
            if (response.ok) {
                const catalog = await response.json();
                products = normalizeCatalog(catalog);
            } else {
                products = normalizeCatalog(fallbackProducts);
            }
        } catch (_) {
            products = normalizeCatalog(fallbackProducts);
        }
    }
    populateAllFilters();
    renderProducts(getVisibleProducts());
    observeProducts();
    routeFromUrl();
}

function observeProducts() {
    document.querySelectorAll(".product").forEach(card => card.classList.add("is-visible"));
}

// --- Reset Filters ---

function resetCatalogFilters() {
    activeCategory = "all";
    favoritesOnly = false;
    catalogCurrentPage = 1;
    document.getElementById("searchInput").value = "";
    document.getElementById("searchClear").hidden = true;
    document.getElementById("searchSuggestions").hidden = true;
    document.getElementById("priceMin").value = "";
    document.getElementById("priceMax").value = "";
    document.getElementById("brandFilter").value = "all";
    document.getElementById("makeFilter").value = "all";
    populateModelSelect("all", "modelFilter", "all", "Все модели");
    document.getElementById("modelFilter").value = "all";
    document.getElementById("yearFilter").value = "";
    document.getElementById("engineFilter").value = "all";
    document.getElementById("partCategoryFilter").value = "all";
    document.getElementById("originalityFilter").value = "all";
    document.getElementById("compatStatusFilter").value = "all";
    document.getElementById("vehicleFilter").value = "";
    document.getElementById("sortProducts").value = "default";
    document.getElementById("pickerMake").value = "";
    updatePickerModels();
    document.getElementById("activeVehicleBanner").hidden = true;
    document.getElementById("pickerReset").hidden = true;
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.category === "all"));
    renderProducts(getVisibleProducts());
    observeProducts();
}

// --- Event Listeners ---

document.getElementById("filters").addEventListener("click", event => {
    const button = event.target.closest(".filter");
    if (!button) return;
    favoritesOnly = false;
    catalogCurrentPage = 1;
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    document.getElementById("searchSuggestions").hidden = true;
    catalogCurrentPage = 1;
    if (!document.getElementById("productPage").hidden) backToCatalog();
    renderProducts(getVisibleProducts());
    observeProducts();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("searchInput").addEventListener("input", () => {
    catalogCurrentPage = 1;
    renderSearchSuggestions();
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("searchInput").addEventListener("focus", () => {
    if (document.getElementById("searchInput").value.trim().length >= 2) {
        renderSearchSuggestions();
    }
});

document.getElementById("searchClear").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchSuggestions").hidden = true;
    document.getElementById("searchClear").hidden = true;
    catalogCurrentPage = 1;
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("searchSuggestions").addEventListener("click", event => {
    const prodBtn = event.target.closest("[data-suggest-product]");
    if (prodBtn) {
        document.getElementById("searchSuggestions").hidden = true;
        openProductPage(Number(prodBtn.dataset.suggestProduct));
        return;
    }
    const queryBtn = event.target.closest("[data-suggest-query]");
    if (queryBtn) {
        document.getElementById("searchInput").value = queryBtn.dataset.suggestQuery;
        document.getElementById("searchSuggestions").hidden = true;
        catalogCurrentPage = 1;
        if (!document.getElementById("productPage").hidden) backToCatalog();
        renderProducts(getVisibleProducts());
        observeProducts();
        document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    }
});

document.addEventListener("click", event => {
    if (!event.target.closest("#searchWrap")) {
        document.getElementById("searchSuggestions").hidden = true;
    }
});

// Quick examples in Vehicle Picker
document.getElementById("pickerQuickExamples").addEventListener("click", event => {
    const btn = event.target.closest("[data-quick-query]");
    if (!btn) return;
    document.getElementById("searchInput").value = btn.dataset.quickQuery;
    document.getElementById("searchClear").hidden = false;
    catalogCurrentPage = 1;
    renderProducts(getVisibleProducts());
    observeProducts();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
});

// 4-step Vehicle Picker listeners
document.getElementById("pickerMake").addEventListener("change", updatePickerModels);
document.getElementById("pickerModel").addEventListener("change", updatePickerYears);
document.getElementById("pickerYear").addEventListener("change", updatePickerEngines);
document.getElementById("pickerApply").addEventListener("click", () => applyVehiclePicker(true));
document.getElementById("pickerReset").addEventListener("click", resetVehiclePicker);
document.getElementById("activeVehicleBanner").addEventListener("click", event => {
    if (event.target.closest("#bannerResetVehicle")) resetVehiclePicker();
});

// Catalog Filters listeners
document.getElementById("makeFilter").addEventListener("change", event => {
    populateModelSelect(event.target.value, "modelFilter", "all", "Все модели");
    catalogCurrentPage = 1;
    renderProducts(getVisibleProducts());
    observeProducts();
});

["modelFilter", "engineFilter", "partCategoryFilter", "brandFilter", "originalityFilter", "compatStatusFilter", "sortProducts"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
        catalogCurrentPage = 1;
        renderProducts(getVisibleProducts());
        observeProducts();
    });
});

["yearFilter", "priceMin", "priceMax", "vehicleFilter"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
        catalogCurrentPage = 1;
        renderProducts(getVisibleProducts());
        observeProducts();
    });
});

document.getElementById("activeFilterChips").addEventListener("click", event => {
    const chip = event.target.closest("[data-clear-filter]");
    if (!chip) return;
    const key = chip.dataset.clearFilter;
    if (key === "search") document.getElementById("searchInput").value = "";
    if (key === "favorites") favoritesOnly = false;
    if (key === "category") {
        activeCategory = "all";
        document.querySelectorAll(".filter").forEach(i => i.classList.toggle("active", i.dataset.category === "all"));
    }
    if (key === "make") {
        document.getElementById("makeFilter").value = "all";
        populateModelSelect("all", "modelFilter", "all", "Все модели");
    }
    if (key === "model") document.getElementById("modelFilter").value = "all";
    if (key === "year") document.getElementById("yearFilter").value = "";
    if (key === "engine") document.getElementById("engineFilter").value = "all";
    if (key === "partCategory") document.getElementById("partCategoryFilter").value = "all";
    if (key === "brand") document.getElementById("brandFilter").value = "all";
    if (key === "originality") document.getElementById("originalityFilter").value = "all";
    if (key === "compatStatus") document.getElementById("compatStatusFilter").value = "all";
    if (key === "price") {
        document.getElementById("priceMin").value = "";
        document.getElementById("priceMax").value = "";
    }
    if (key === "vehicleFilter") document.getElementById("vehicleFilter").value = "";
    catalogCurrentPage = 1;
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("resetCatalogFilters").addEventListener("click", resetCatalogFilters);

document.getElementById("pagination").addEventListener("click", event => {
    const button = event.target.closest("[data-catalog-page]");
    if (!button || button.disabled) return;
    const page = Number(button.dataset.catalogPage);
    if (!Number.isInteger(page) || page < 1) return;
    catalogCurrentPage = page;
    renderProducts(getVisibleProducts());
    observeProducts();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("products").addEventListener("click", event => {
    if (event.target.closest("#emptyResetCatalog")) {
        resetCatalogFilters();
        return;
    }

    const detailsLink = event.target.closest("[data-details]");
    if (detailsLink) {
        event.preventDefault();
        openProductPage(Number(detailsLink.dataset.details));
        return;
    }

    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
        const id = Number(favoriteButton.dataset.favorite);
        if (favorites.has(id)) favorites.delete(id);
        else favorites.add(id);
        persistFavorites();
        renderProducts(getVisibleProducts());
        observeProducts();
        showToast(favorites.has(id) ? "Добавлено в избранное" : "Удалено из избранного");
        document.getElementById("favoriteIcon").textContent = favorites.size ? "♥" : "♡";
        renderAccountDashboard();
        return;
    }

    const cartButton = event.target.closest(".product__cart");
    if (cartButton) {
        const product = products.find(item => item.id === Number(cartButton.dataset.id));
        if (!product) return;
        const existing = cart.find(item => item.id === product.id);
        if (existing) existing.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        renderCart();
        const cartAction = document.getElementById("cartButton");
        cartAction.classList.remove("bump");
        void cartAction.offsetWidth;
        cartAction.classList.add("bump");
        openCart();
        return;
    }

    const card = event.target.closest("[data-product-id]");
    if (card) openProductPage(Number(card.dataset.productId));
});

// Product Page Interactions
document.getElementById("productPageContent").addEventListener("click", event => {
    if (event.target.closest("[data-back-catalog]")) {
        event.preventDefault();
        backToCatalog();
        return;
    }

    const toggleCompat = event.target.closest("#toggleAllCompatBtn");
    if (toggleCompat) {
        const extra = document.getElementById("extraCompatList");
        if (extra) {
            const isHidden = extra.hidden;
            extra.hidden = !isHidden;
            toggleCompat.textContent = isHidden
                ? "Свернуть список автомобилей"
                : `Показать все совместимые автомобили (${toggleCompat.dataset.totalCompat})`;
        }
        return;
    }

    const searchCodeBtn = event.target.closest("[data-search-code]");
    if (searchCodeBtn) {
        document.getElementById("searchInput").value = searchCodeBtn.dataset.searchCode;
        document.getElementById("searchClear").hidden = false;
        backToCatalog();
        catalogCurrentPage = 1;
        renderProducts(getVisibleProducts());
        observeProducts();
        document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
        return;
    }

    const copyBtn = event.target.closest("[data-copy-code]");
    if (copyBtn) {
        navigator.clipboard?.writeText(copyBtn.dataset.copyCode).catch(() => {});
        showToast(`Скопировано: ${copyBtn.dataset.copyCode}`);
        return;
    }

    const adminEditBtn = event.target.closest("[data-admin-edit-product]");
    if (adminEditBtn) {
        openAdminModal("edit", Number(adminEditBtn.dataset.adminEditProduct));
        return;
    }

    const minus = event.target.closest("[data-quantity-minus]");
    if (minus) {
        const output = document.getElementById("productQuantity");
        output.textContent = Math.max(1, Number(output.textContent) - 1);
        return;
    }

    const plus = event.target.closest("[data-quantity-plus]");
    if (plus) {
        const output = document.getElementById("productQuantity");
        output.textContent = Math.min(99, Number(output.textContent) + 1);
        return;
    }

    const addButton = event.target.closest("[data-detail-add]");
    if (addButton) {
        const product = products.find(item => item.id === Number(addButton.dataset.detailAdd));
        if (!product) return;
        const quantity = Number(document.getElementById("productQuantity").textContent);
        const existing = cart.find(item => item.id === product.id);
        if (existing) existing.quantity += quantity;
        else cart.push({ ...product, quantity });
        renderCart();
        openCart();
        return;
    }

    const buyButton = event.target.closest("[data-detail-buy]");
    if (buyButton) {
        const product = products.find(item => item.id === Number(buyButton.dataset.detailBuy));
        if (!product) return;
        const quantity = Number(document.getElementById("productQuantity").textContent);
        const existing = cart.find(item => item.id === product.id);
        if (existing) existing.quantity += quantity;
        else cart.push({ ...product, quantity });
        renderCart();
        openCheckout();
        return;
    }

    const thumb = event.target.closest("[data-main-image]");
    if (thumb) {
        document.querySelectorAll("[data-main-image]").forEach(item => item.classList.remove("active"));
        thumb.classList.add("active");
        document.getElementById("productMainImage").src = thumb.dataset.mainImage;
        return;
    }

    const zoom = event.target.closest("[data-zoom-image]");
    if (zoom) {
        const image = document.getElementById("productMainImage");
        document.getElementById("imageZoomed").src = image.src;
        document.getElementById("imageZoomed").alt = image.alt;
        document.getElementById("imageZoomOverlay").classList.add("open");
        document.body.classList.add("modal-open");
        return;
    }

    const similar = event.target.closest("[data-similar-id]");
    if (similar && !event.target.closest("[data-similar-buy]")) {
        openProductPage(Number(similar.dataset.similarId));
        return;
    }

    const similarBuy = event.target.closest("[data-similar-buy]");
    if (similarBuy) {
        const product = products.find(item => item.id === Number(similarBuy.dataset.similarBuy));
        if (!product) return;
        const existing = cart.find(item => item.id === product.id);
        if (existing) existing.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        renderCart();
        openCart();
    }
});

// Admin Modal Listeners
document.getElementById("openAdminBtn").addEventListener("click", () => openAdminModal("edit"));
document.getElementById("closeAdminModal").addEventListener("click", closeAdminModal);
document.getElementById("adminOverlay").addEventListener("click", closeAdminModal);

document.querySelectorAll(".admin-tab").forEach(btn => {
    btn.addEventListener("click", () => {
        activeAdminTab = btn.dataset.adminTab;
        document.querySelectorAll(".admin-tab").forEach(t => t.classList.toggle("active", t === btn));
        renderAdminBody();
    });
});

document.getElementById("adminModalBody").addEventListener("change", event => {
    if (event.target.id === "adminProductSelect") {
        selectedAdminProductId = Number(event.target.value);
        renderAdminBody();
        return;
    }
    if (event.target.id === "bulkStatusFilter") {
        renderAdminBody();
        return;
    }
    const bulkCheck = event.target.closest("[data-bulk-id]");
    if (bulkCheck) {
        const id = Number(bulkCheck.dataset.bulkId);
        if (bulkCheck.checked) bulkSelectedIds.add(id);
        else bulkSelectedIds.delete(id);
        const countEl = document.getElementById("bulkSelectedCount");
        if (countEl) countEl.textContent = bulkSelectedIds.size;
        return;
    }
    if (event.target.id === "catalogFileInput" && event.target.files?.[0]) {
        const mode = document.getElementById("importModeSelect")?.value || "merge";
        importCatalogFile(event.target.files[0], mode);
    }
});

document.getElementById("adminModalBody").addEventListener("input", event => {
    if (event.target.id === "bulkSearchInput") {
        const pos = event.target.selectionStart;
        renderAdminBody();
        const input = document.getElementById("bulkSearchInput");
        if (input) {
            input.focus();
            input.setSelectionRange(pos, pos);
        }
    }
});

document.getElementById("adminModalBody").addEventListener("click", async event => {
    if (event.target.id === "adminAddCompatRow") {
        const container = document.getElementById("adminCompatRows");
        const idx = container.children.length;
        container.insertAdjacentHTML("beforeend", renderAdminCompatRow({}, idx));
        return;
    }
    const rmBtn = event.target.closest("[data-remove-compat-row]");
    if (rmBtn) {
        rmBtn.closest(".admin-compat-row")?.remove();
        return;
    }
    if (event.target.id === "bulkSelectAllBtn") {
        const filterText = (document.getElementById("bulkSearchInput")?.value || "").trim().toLowerCase();
        const statusFilter = document.getElementById("bulkStatusFilter")?.value || "all";
        products.forEach(p => {
            if (statusFilter !== "all" && p.compatibilityStatus !== statusFilter) return;
            if (filterText && !(p._search?.rawText || p.name.toLowerCase()).includes(filterText)) return;
            bulkSelectedIds.add(p.id);
        });
        renderAdminBody();
        return;
    }
    if (event.target.id === "bulkClearSelBtn") {
        bulkSelectedIds.clear();
        renderAdminBody();
        return;
    }
    if (event.target.id === "exportJsonBtn") {
        const clean = products.map(({ _search, ...rest }) => rest);
        downloadBlob(JSON.stringify(clean, null, 2), "catalog.json", "application/json;charset=utf-8");
        showToast("catalog.json скачан");
        return;
    }
    if (event.target.id === "exportCsvBtn") {
        const headers = ["id", "name", "brand", "article", "price", "category", "partCategory", "isOriginal", "compatibilityStatus", "oemNumbers", "analogNumbers"];
        const csvCell = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const rows = [
            headers.join(","),
            ...products.map(p => [
                p.id, p.name, p.brand, p.article, p.price ?? "", p.category, p.partCategory,
                p.isOriginal, p.compatibilityStatus, (p.oemNumbers || []).join("; "), (p.analogNumbers || []).join("; ")
            ].map(csvCell).join(","))
        ];
        downloadBlob("\uFEFF" + rows.join("\n"), "catalog.csv", "text/csv;charset=utf-8");
        showToast("catalog.csv скачан");
        return;
    }
    if (event.target.id === "resetServerCatalogBtn") {
        localStorage.removeItem("fuelpartsCatalog");
        localStorage.removeItem("fuelpartsCatalogImported");
        await loadCatalog();
        showToast("Каталог восстановлен из catalog.json");
        renderAdminBody();
    }
});

document.getElementById("adminModalBody").addEventListener("submit", event => {
    if (event.target.id === "adminEditForm") {
        event.preventDefault();
        const fd = new FormData(event.target);
        const idx = products.findIndex(p => p.id === selectedAdminProductId);
        if (idx === -1) return;

        const compatRows = [...document.querySelectorAll("#adminCompatRows .admin-compat-row")].map(row => {
            const get = f => row.querySelector(`[data-cf="${f}"]`)?.value.trim() || "";
            return normalizeCompatibilityRow({
                make: get("make"),
                model: get("model"),
                generation: get("generation"),
                yearFrom: get("yearFrom"),
                yearTo: get("yearTo"),
                bodyType: get("bodyType"),
                engineCode: get("engineCode"),
                engineVolume: get("engineVolume"),
                fuelType: get("fuelType"),
                power: get("power"),
                note: get("note"),
                verified: true
            });
        }).filter(Boolean);

        const updated = normalizeProduct({
            ...products[idx],
            name: fd.get("name").trim(),
            partName: fd.get("name").trim(),
            brand: fd.get("brand").trim(),
            article: fd.get("article").trim(),
            price: fd.get("price") ? Number(fd.get("price")) : null,
            category: fd.get("category"),
            partCategory: fd.get("partCategory").trim(),
            isOriginal: fd.get("isOriginal"),
            compatibilityStatus: fd.get("compatibilityStatus"),
            oemNumbers: fd.get("oemNumbers").split(/[,;]+/).map(s => s.trim()).filter(Boolean),
            analogNumbers: fd.get("analogNumbers").split(/[,;]+/).map(s => s.trim()).filter(Boolean),
            description: fd.get("description").trim(),
            compatibility: compatRows
        });

        products[idx] = updated;
        persistCatalogToLocal();
        populateAllFilters();
        renderProducts(getVisibleProducts());
        observeProducts();
        if (!document.getElementById("productPage").hidden) renderProductPage(updated);
        showToast("Карточка товара обновлена");
        return;
    }

    if (event.target.id === "adminBulkApplyForm") {
        event.preventDefault();
        if (!bulkSelectedIds.size) {
            showToast("Выберите хотя бы один товар");
            return;
        }
        const fd = new FormData(event.target);
        const partCategory = fd.get("partCategory").trim();
        const isOriginal = fd.get("isOriginal");
        const compatibilityStatus = fd.get("compatibilityStatus");
        const brand = fd.get("brand").trim();
        const addMake = fd.get("addMake").trim();
        const addModel = fd.get("addModel").trim();
        const addGeneration = fd.get("addGeneration").trim();
        const addYears = fd.get("addYears").trim();
        const yearMatch = /^(\d{4})\s*[-–]\s*(\d{4})$/.exec(addYears);
        const yearSingle = /^(\d{4})$/.exec(addYears);

        let updatedCount = 0;
        products = products.map(p => {
            if (!bulkSelectedIds.has(p.id)) return p;
            updatedCount++;
            const compat = [...(p.compatibility || [])];
            if (addMake || addModel) {
                const row = normalizeCompatibilityRow({
                    make: addMake,
                    model: addModel,
                    generation: addGeneration,
                    yearFrom: yearMatch ? Number(yearMatch[1]) : (yearSingle ? Number(yearSingle[1]) : null),
                    yearTo: yearMatch ? Number(yearMatch[2]) : null,
                    verified: true
                });
                if (row) compat.push(row);
            }
            return normalizeProduct({
                ...p,
                partCategory: partCategory || p.partCategory,
                isOriginal: isOriginal || p.isOriginal,
                compatibilityStatus: compatibilityStatus || (compat.length > p.compatibility.length ? "Подтверждено" : p.compatibilityStatus),
                brand: brand || p.brand,
                compatibility: compat
            });
        });

        persistCatalogToLocal();
        populateAllFilters();
        renderProducts(getVisibleProducts());
        observeProducts();
        renderAdminBody();
        showToast(`Массово обновлено товаров: ${updatedCount}`);
    }
});

// Cart, Nav & Global Listeners
document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
document.getElementById("productModalOverlay").addEventListener("click", closeProductModal);

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (document.getElementById("imageZoomOverlay").classList.contains("open")) {
        document.getElementById("imageZoomOverlay").classList.remove("open");
        document.body.classList.remove("modal-open");
        return;
    }
    if (document.getElementById("adminModal").classList.contains("open")) {
        closeAdminModal();
        return;
    }
    if (document.getElementById("clearCartModal").classList.contains("open")) {
        closeClearCartConfirm();
        return;
    }
    if (document.getElementById("productModal").classList.contains("open")) {
        closeProductModal();
        return;
    }
    if (document.getElementById("accountModal").classList.contains("open")) {
        closeAccountModal();
    }
});

document.getElementById("cartItems").addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove]");
    if (!removeButton) return;
    cart = cart.filter(item => item.id !== Number(removeButton.dataset.remove));
    renderCart();
});

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);
document.getElementById("catalogButton").addEventListener("click", () => {
    if (!document.getElementById("productPage").hidden) {
        backToCatalog();
        return;
    }
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("logoLink").addEventListener("click", event => {
    event.preventDefault();
    if (!document.getElementById("productPage").hidden) {
        backToCatalog();
        return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("footerLogoLink").addEventListener("click", event => {
    event.preventDefault();
    if (!document.getElementById("productPage").hidden) backToCatalog();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("showAll").addEventListener("click", event => {
    event.preventDefault();
    resetCatalogFilters();
});

document.getElementById("favoriteButton").addEventListener("click", () => {
    if (!favorites.size) {
        showToast("В избранном пока пусто");
        return;
    }
    favoritesOnly = !favoritesOnly;
    catalogCurrentPage = 1;
    if (!document.getElementById("productPage").hidden) backToCatalog();
    renderProducts(getVisibleProducts());
    observeProducts();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    showToast(favoritesOnly ? `Показано избранное: ${favorites.size}` : "Показаны все товары");
});

document.getElementById("checkoutButton").addEventListener("click", openCheckout);
document.getElementById("clearCartButton").addEventListener("click", () => {
    if (!cart.length) return;
    openClearCartConfirm();
});
document.getElementById("cancelClearCart").addEventListener("click", closeClearCartConfirm);
document.getElementById("confirmClearCart").addEventListener("click", () => {
    cart = [];
    renderCart();
    closeClearCartConfirm();
    showToast("Корзина очищена");
});
document.getElementById("clearCartOverlay").addEventListener("click", closeClearCartConfirm);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);
document.getElementById("checkoutOverlay").addEventListener("click", closeCheckout);

document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();
    submitOrderRequest(event.currentTarget);
});

const headerEl = document.querySelector(".header");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    headerEl.classList.toggle("scrolled", scrollTop > 36);
    backToTop.classList.toggle("visible", scrollTop > 600);
    scrollProgress.style.width = `${maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0}%`;
}, { passive: true });

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.getElementById("closeImageZoom").addEventListener("click", () => {
    document.getElementById("imageZoomOverlay").classList.remove("open");
    document.body.classList.remove("modal-open");
});

document.getElementById("imageZoomOverlay").addEventListener("click", event => {
    if (event.target.id === "imageZoomOverlay") {
        document.getElementById("imageZoomOverlay").classList.remove("open");
        document.body.classList.remove("modal-open");
    }
});

function routeFromUrl() {
    const slug = new URL(window.location.href).searchParams.get("product");
    if (!slug) {
        renderCatalogPage();
        return;
    }
    const product = getProductBySlug(slug);
    renderProductPage(product);
}

window.addEventListener("popstate", routeFromUrl);

document.getElementById("favoriteIcon").textContent = favorites.size ? "♥" : "♡";
renderCart();
loadCatalog().then(initializeAccount).catch(error => {
    console.error("Не удалось загрузить аккаунт", error);
    showToast("Не удалось инициализировать личный кабинет");
});

// --- Supabase Account, Saved Data & Order Requests ---

function showAccountMessage(message, type = "") {
    const element = document.getElementById("accountMessage");
    element.textContent = message;
    element.className = `account-message is-visible${type ? ` is-${type}` : ""}`;
}

function clearAccountMessage() {
    const element = document.getElementById("accountMessage");
    element.textContent = "";
    element.className = "account-message";
}

function queueAccountWrite(write, failureMessage) {
    accountWriteQueue = accountWriteQueue
        .then(write)
        .catch(error => {
            console.error(failureMessage, error);
            showAccountMessage(`${failureMessage}. ${error.message || ""}`.trim(), "error");
        });
}

function updateAccountButton() {
    const label = document.getElementById("accountButtonLabel");
    const displayName = accountUser && (
        accountUser.user_metadata?.full_name ||
        accountUser.user_metadata?.name ||
        accountUser.email
    );
    label.textContent = accountUser ? (displayName || "Кабинет") : "Войти";
}

function setAccountView() {
    const showDashboard = Boolean(accountUser && !accountRecoveryActive);
    document.getElementById("accountAuthView").hidden = showDashboard;
    document.getElementById("accountDashboard").hidden = !showDashboard;
    document.getElementById("accountTitle").textContent = showDashboard
        ? "Личный кабинет"
        : accountMode === "reset"
            ? "Восстановление пароля"
            : accountMode === "recovery"
                ? "Новый пароль"
                : accountMode === "signup"
                    ? "Создание аккаунта"
                    : "Вход в аккаунт";
}

function openAccountModal() {
    document.getElementById("accountOverlay").classList.add("open");
    document.getElementById("accountModal").classList.add("open");
    document.body.classList.add("modal-open");
    setAccountView();
}

function closeAccountModal() {
    document.getElementById("accountOverlay").classList.remove("open");
    document.getElementById("accountModal").classList.remove("open");
    document.body.classList.remove("modal-open");
}

function setAccountMode(mode) {
    accountMode = mode;
    const isSignup = mode === "signup";
    const isRecovery = mode === "recovery";
    document.getElementById("accountNameField").hidden = !isSignup;
    document.getElementById("accountName").required = isSignup;
    document.getElementById("accountPasswordField").hidden = mode === "reset";
    document.getElementById("accountPassword").required = mode !== "reset";
    document.getElementById("accountPassword").autocomplete = isSignup || isRecovery ? "new-password" : "current-password";
    document.getElementById("forgotPassword").hidden = mode !== "login";
    document.getElementById("accountBackToLogin").hidden = mode !== "reset";
    document.getElementById("accountLoginTab").classList.toggle("active", mode === "login");
    document.getElementById("accountSignupTab").classList.toggle("active", isSignup);
    document.getElementById("accountLoginTab").setAttribute("aria-selected", String(mode === "login"));
    document.getElementById("accountSignupTab").setAttribute("aria-selected", String(isSignup));
    document.querySelector(".account-tabs").hidden = isRecovery || mode === "reset";
    document.getElementById("googleSignIn").hidden = isRecovery || mode === "reset";
    document.querySelector(".account-divider").hidden = isRecovery || mode === "reset";
    document.getElementById("accountSubmit").textContent = isSignup
        ? "Зарегистрироваться"
        : isRecovery
            ? "Сохранить новый пароль"
            : mode === "reset"
                ? "Отправить ссылку"
                : "Войти";
    document.getElementById("accountPassword").value = "";
    setAccountView();
    clearAccountMessage();
}

function getAccountRedirectUrl() {
    return `${window.location.origin}${window.location.pathname}`;
}

function getAuthErrorMessage(error) {
    if (error.code === "invalid_credentials") return "Неверный email или пароль.";
    if (error.code === "email_not_confirmed") return "Сначала подтвердите email по ссылке из письма.";
    if (error.code === "user_already_exists") return "Аккаунт с таким email уже существует.";
    if (error.code === "weak_password") return "Пароль слишком простой. Используйте не менее 8 символов.";
    return error.message || "Не удалось выполнить запрос. Попробуйте ещё раз.";
}

async function initializeAccount() {
    const config = window.FUELPARTS_SUPABASE_CONFIG || {};
    if (!window.supabase || !config.url || !config.anonKey) {
        showAccountMessage("Авторизация пока не настроена. Добавьте Project URL и публичный anon key в supabase-config.js, затем примените SQL-миграцию.", "error");
        return;
    }

    supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
        auth: {
            flowType: "pkce",
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    });

    supabaseClient.auth.onAuthStateChange((event, session) => {
        const previousUserId = accountUser?.id;
        accountUser = session?.user || null;
        accountRecoveryActive = event === "PASSWORD_RECOVERY";
        updateAccountButton();
        setAccountView();

        if (accountUser && !accountRecoveryActive) {
            const userId = accountUser.id;
            window.setTimeout(() => {
                if (accountUser?.id === userId && accountHydrationUserId !== userId) {
                    loadAccountData(accountUser);
                }
            }, 0);
        } else if (!accountUser && previousUserId) {
            clearAccountLocalData();
        }

        if (event === "PASSWORD_RECOVERY") {
            setAccountMode("recovery");
            openAccountModal();
            showAccountMessage("Введите новый пароль для аккаунта.");
        }
    });

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
        showAccountMessage(getAuthErrorMessage(error), "error");
        return;
    }
    accountUser = data.session?.user || null;
    updateAccountButton();
    setAccountView();
    if (accountUser) await loadAccountData(accountUser);
}

function clearAccountLocalData() {
    accountHydrationVersion++;
    accountHydrating = false;
    accountLoadPendingUser = null;
    localStorage.removeItem("fuelpartsAccountOwner");
    localStorage.removeItem("fuelpartsCart");
    localStorage.removeItem("fuelpartsFavorites");
    accountHydrationUserId = null;
    cart = [];
    favorites = new Set();
    savedVehicles = [];
    accountOrders = [];
    renderCart();
    document.getElementById("favoriteIcon").textContent = "♡";
    renderAccountDashboard();
}

function mergeCartItems(remoteItems, guestItems) {
    const merged = new Map();
    [...remoteItems, ...guestItems].forEach(item => {
        const id = Number(item.id);
        const quantity = Number(item.quantity);
        if (!Number.isSafeInteger(id) || id < 1 || !Number.isInteger(quantity) || quantity < 1) return;
        const existing = merged.get(id);
        if (existing) {
            existing.quantity = Math.min(99, existing.quantity + quantity);
        } else {
            const product = products.find(candidate => candidate.id === id);
            merged.set(id, {
                ...(product || {}),
                ...item,
                id,
                quantity: Math.min(99, quantity)
            });
        }
    });
    return [...merged.values()];
}

async function loadAccountData(user) {
    if (!supabaseClient) return;
    if (accountHydrating) {
        if (accountUser?.id !== user.id) accountLoadPendingUser = user;
        return;
    }
    accountHydrating = true;
    const loadVersion = ++accountHydrationVersion;
    const previousOwner = localStorage.getItem("fuelpartsAccountOwner");
    const guestCart = previousOwner ? [] : cart;
    const guestFavorites = previousOwner ? [] : [...favorites];
    try {
        const results = await Promise.all([
            supabaseClient.from("profiles").select("display_name,avatar_url").eq("id", user.id).maybeSingle(),
            supabaseClient.from("saved_carts").select("items").eq("user_id", user.id).maybeSingle(),
            supabaseClient.from("favorites").select("product_id").eq("user_id", user.id),
            supabaseClient.from("saved_vehicles").select("id,make,model,year,engine,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
            supabaseClient.from("orders").select("id,customer_name,items,total,status,created_at").eq("user_id", user.id).order("created_at", { ascending: false })
        ]);
        if (loadVersion !== accountHydrationVersion || accountUser?.id !== user.id) return;
        const failed = results.find(result => result.error);
        if (failed) throw failed.error;

        const [profileResult, cartResult, favoritesResult, vehiclesResult, ordersResult] = results;
        const savedCart = Array.isArray(cartResult.data?.items) ? cartResult.data.items : [];
        const remoteFavorites = favoritesResult.data.map(item => Number(item.product_id)).filter(Number.isSafeInteger);
        const sameAccount = previousOwner === user.id;
        cart = mergeCartItems(savedCart, sameAccount ? [] : guestCart);
        favorites = new Set(sameAccount ? remoteFavorites : [...remoteFavorites, ...guestFavorites]);
        savedVehicles = vehiclesResult.data || [];
        accountOrders = ordersResult.data || [];
        localStorage.setItem("fuelpartsAccountOwner", user.id);
        localStorage.setItem("fuelpartsCart", JSON.stringify(cart));
        localStorage.setItem("fuelpartsFavorites", JSON.stringify([...favorites]));

        const profile = profileResult.data || {};
        document.getElementById("profileEmail").value = user.email || "";
        document.getElementById("profileName").value = profile.display_name || user.user_metadata?.full_name || user.user_metadata?.name || "";
        document.getElementById("profileAvatar").value = profile.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
        updateProfileAvatar(profile.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || "");
        const displayName = profile.display_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email;
        document.getElementById("accountButtonLabel").textContent = displayName || "Кабинет";
        document.getElementById("favoriteIcon").textContent = favorites.size ? "♥" : "♡";
        renderCart();
        renderProducts(getVisibleProducts());
        renderAccountDashboard();
        accountHydrationUserId = user.id;
        accountHydrating = false;
        if (!sameAccount && (guestCart.length || guestFavorites.length)) {
            persistCart();
            persistFavorites();
        }
    } catch (error) {
        if (loadVersion === accountHydrationVersion && accountUser?.id === user.id) {
            accountHydrationUserId = null;
            console.error("Не удалось загрузить данные аккаунта", error);
            showAccountMessage(`Не удалось загрузить данные аккаунта. Проверьте применение миграции Supabase. ${error.message || ""}`.trim(), "error");
        }
    } finally {
        if (loadVersion === accountHydrationVersion) {
            accountHydrating = false;
            const pendingUser = accountLoadPendingUser;
            accountLoadPendingUser = null;
            if (pendingUser && accountUser?.id === pendingUser.id) {
                window.setTimeout(() => loadAccountData(pendingUser), 0);
            }
        }
    }
}

let accountHydrationUserId = null;
let accountHydrationVersion = 0;

function renderAccountDashboard() {
    const vehicles = document.getElementById("savedVehiclesList");
    if (!vehicles) return;
    vehicles.innerHTML = savedVehicles.length ? savedVehicles.map(vehicle => `
        <div class="account-list-item">
            <div class="account-list-item__info">
                <strong>${escapeHtml([vehicle.make, vehicle.model].filter(Boolean).join(" "))}</strong>
                <small>${escapeHtml([vehicle.year, vehicle.engine].filter(Boolean).join(" · ") || "Автомобиль")}</small>
            </div>
            <button type="button" data-use-vehicle="${escapeHtml(vehicle.id)}">Подобрать</button>
            <button type="button" data-delete-vehicle="${escapeHtml(vehicle.id)}" aria-label="Удалить автомобиль">Удалить</button>
        </div>
    `).join("") : `<p class="account-empty">Сохранённых автомобилей пока нет.</p>`;

    const favoritesList = document.getElementById("accountFavoritesList");
    favoritesList.innerHTML = favorites.size ? [...favorites].map(id => {
        const product = products.find(item => item.id === Number(id));
        if (!product) {
            return `<div class="account-list-item"><div class="account-list-item__info"><strong>Товар ${escapeHtml(id)}</strong><small>Товара сейчас нет в каталоге</small></div><button type="button" data-remove-account-favorite="${escapeHtml(id)}">Убрать</button></div>`;
        }
        return `<div class="account-list-item">
            <img class="account-list-item__image" src="${escapeHtml(product.image || "")}" alt="">
            <div class="account-list-item__info"><strong>${escapeHtml(product.name)}</strong><small>${product.price != null ? formatPrice(product.price) : "Цена уточняется"}</small></div>
            <button type="button" data-open-favorite="${product.id}">К товару</button>
            <button type="button" data-remove-account-favorite="${product.id}" aria-label="Убрать из избранного">Убрать</button>
        </div>`;
    }).join("") : `<p class="account-empty">Избранные товары появятся здесь.</p>`;

    const statusLabels = {
        new: "Заявка получена",
        processing: "В обработке",
        confirmed: "Подтверждён",
        shipped: "Отправлен",
        completed: "Завершён",
        cancelled: "Отменён"
    };
    const ordersList = document.getElementById("accountOrdersList");
    ordersList.innerHTML = accountOrders.length ? accountOrders.map(order => {
        const items = Array.isArray(order.items) ? order.items : [];
        const summary = items.map(item => `${item.name} × ${item.quantity}`).join(", ");
        const date = new Date(order.created_at).toLocaleDateString("ru-RU");
        return `<div class="account-list-item account-order">
            <div class="account-list-item__info">
                <strong>Заявка от ${escapeHtml(date)} · ${formatPrice(order.total)}</strong>
                <small>${escapeHtml(summary)}</small>
            </div>
            <span class="account-list-item__status">${escapeHtml(statusLabels[order.status] || "Статус уточняется")}</span>
            <button type="button" data-repeat-order="${escapeHtml(order.id)}">Повторить</button>
        </div>`;
    }).join("") : `<p class="account-empty">Заявок пока нет. Здесь появятся только реально отправленные заявки.</p>`;
}

function updateProfileAvatar(url) {
    const preview = document.getElementById("profileAvatarPreview");
    if (!url || !url.startsWith("https://")) {
        preview.removeAttribute("src");
        preview.hidden = true;
        return;
    }
    preview.src = url;
    preview.hidden = false;
}

async function submitOrderRequest(form) {
    if (!accountUser || !supabaseClient) {
        showAccountMessage("Войдите в аккаунт, чтобы отправить заявку.", "error");
        closeCheckout();
        openAccountModal();
        return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
        const formData = new FormData(form);
        const items = cart.map(item => ({
            product_id: Number(item.id),
            name: String(item.name || "").slice(0, 250),
            article: String(item.article || "").slice(0, 100),
            quantity: Number(item.quantity),
            unit_price: Number(item.price) || 0
        }));
        const total = Math.round(items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) * 100) / 100;
        const { data, error } = await supabaseClient.rpc("create_order_request", {
            p_customer_name: String(formData.get("name") || "").trim(),
            p_phone: String(formData.get("phone") || "").trim(),
            p_address: String(formData.get("address") || "").trim(),
            p_delivery: String(formData.get("delivery") || ""),
            p_payment: String(formData.get("payment") || ""),
            p_comment: String(formData.get("comment") || "").trim(),
            p_items: items,
            p_total: total
        });
        if (error) throw error;

        cart = [];
        renderCart();
        form.reset();
        closeCheckout();
        await loadAccountData(accountUser);
        openAccountModal();
        showAccountMessage(`Заявка ${data ? `№${String(data).slice(0, 8)}` : ""} отправлена. Наличие и итоговую стоимость подтвердит менеджер.`, "success");
    } catch (error) {
        console.error("Не удалось отправить заявку", error);
        showToast("Не удалось отправить заявку. Проверьте подключение и повторите попытку.");
        openAccountModal();
        showAccountMessage(`Заявка не отправлена. ${error.message || "Проверьте соединение и настройки Supabase."}`, "error");
    } finally {
        button.disabled = false;
    }
}

document.getElementById("accountButton").addEventListener("click", openAccountModal);
document.getElementById("closeAccount").addEventListener("click", closeAccountModal);
document.getElementById("accountOverlay").addEventListener("click", closeAccountModal);
document.getElementById("accountLoginTab").addEventListener("click", () => setAccountMode("login"));
document.getElementById("accountSignupTab").addEventListener("click", () => setAccountMode("signup"));

document.getElementById("toggleAccountPassword").addEventListener("click", event => {
    const password = document.getElementById("accountPassword");
    const showing = password.type === "text";
    password.type = showing ? "password" : "text";
    event.currentTarget.textContent = showing ? "Показать" : "Скрыть";
    event.currentTarget.setAttribute("aria-label", showing ? "Показать пароль" : "Скрыть пароль");
});

document.getElementById("forgotPassword").addEventListener("click", () => {
    setAccountMode("reset");
    showAccountMessage("Укажите email — мы отправим ссылку для восстановления пароля.");
});

document.getElementById("accountBackToLogin").addEventListener("click", () => {
    setAccountMode("login");
    document.getElementById("accountPassword").focus();
});

document.getElementById("accountForm").addEventListener("submit", async event => {
    event.preventDefault();
    if (!supabaseClient) {
        showAccountMessage("Supabase не настроен. Заполните supabase-config.js и примените SQL-миграцию.", "error");
        return;
    }
    const form = event.currentTarget;
    const button = document.getElementById("accountSubmit");
    button.disabled = true;
    clearAccountMessage();
    const email = document.getElementById("accountEmail").value.trim();
    const password = document.getElementById("accountPassword").value;
    try {
        if (accountMode === "signup") {
            const displayName = document.getElementById("accountName").value.trim();
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: { data: { full_name: displayName }, emailRedirectTo: getAccountRedirectUrl() }
            });
            if (error) throw error;
            if (data.session) {
                showAccountMessage("Аккаунт создан.", "success");
            } else {
                showAccountMessage("Проверьте почту и подтвердите email, чтобы завершить регистрацию.", "success");
            }
        } else if (accountMode === "reset") {
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: getAccountRedirectUrl() });
            if (error) throw error;
            showAccountMessage("Если аккаунт с таким email существует, на него отправлена ссылка для восстановления пароля.", "success");
        } else if (accountMode === "recovery") {
            const { error } = await supabaseClient.auth.updateUser({ password });
            if (error) throw error;
            accountRecoveryActive = false;
            setAccountMode("login");
            setAccountView();
            if (accountUser) loadAccountData(accountUser);
            showAccountMessage("Пароль обновлён. Теперь вы можете войти с новым паролем.", "success");
        } else {
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            showAccountMessage("Вход выполнен.", "success");
        }
    } catch (error) {
        showAccountMessage(getAuthErrorMessage(error), "error");
    } finally {
        button.disabled = false;
    }
});

document.getElementById("googleSignIn").addEventListener("click", async event => {
    if (!supabaseClient) {
        showAccountMessage("Supabase не настроен. Заполните supabase-config.js и включите Google в Supabase Auth.", "error");
        return;
    }
    const button = event.currentTarget;
    button.disabled = true;
    try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: getAccountRedirectUrl() }
        });
        if (error) throw error;
    } catch (error) {
        showAccountMessage(getAuthErrorMessage(error), "error");
    } finally {
        button.disabled = false;
    }
});

document.getElementById("profileForm").addEventListener("submit", async event => {
    event.preventDefault();
    if (!accountUser || !supabaseClient) return;
    const name = document.getElementById("profileName").value.trim();
    const avatar = document.getElementById("profileAvatar").value.trim() || null;
    if (avatar && !avatar.startsWith("https://")) {
        showAccountMessage("Ссылка на фотографию должна начинаться с https://.", "error");
        return;
    }
    try {
        const { error } = await supabaseClient.from("profiles")
            .update({ display_name: name, avatar_url: avatar })
            .eq("id", accountUser.id);
        if (error) throw error;
        if (accountUser.user_metadata) accountUser.user_metadata.full_name = name;
        updateProfileAvatar(avatar || "");
        document.getElementById("accountButtonLabel").textContent = name || accountUser.email || "Кабинет";
        showAccountMessage("Профиль сохранён.", "success");
    } catch (error) {
        showAccountMessage(`Не удалось сохранить профиль. ${error.message || ""}`.trim(), "error");
    }
});

document.getElementById("accountSecurityForm").addEventListener("submit", async event => {
    event.preventDefault();
    if (!accountUser || !supabaseClient) return;
    const passwordInput = document.getElementById("accountNewPassword");
    try {
        const { error } = await supabaseClient.auth.updateUser({ password: passwordInput.value });
        if (error) throw error;
        passwordInput.value = "";
        showAccountMessage("Пароль аккаунта изменён.", "success");
    } catch (error) {
        showAccountMessage(getAuthErrorMessage(error), "error");
    }
});

document.getElementById("vehicleForm").addEventListener("submit", async event => {
    event.preventDefault();
    if (!accountUser || !supabaseClient) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const yearValue = String(data.get("year") || "").trim();
    try {
        const { data: vehicle, error } = await supabaseClient.from("saved_vehicles")
            .insert({
                user_id: accountUser.id,
                make: String(data.get("make") || "").trim(),
                model: String(data.get("model") || "").trim(),
                year: yearValue ? Number(yearValue) : null,
                engine: String(data.get("engine") || "").trim()
            })
            .select("id,make,model,year,engine,created_at")
            .single();
        if (error) throw error;
        savedVehicles.unshift(vehicle);
        form.reset();
        renderAccountDashboard();
        showAccountMessage("Автомобиль сохранён.", "success");
    } catch (error) {
        showAccountMessage(`Не удалось сохранить автомобиль. ${error.message || ""}`.trim(), "error");
    }
});

document.getElementById("savedVehiclesList").addEventListener("click", async event => {
    const deleteButton = event.target.closest("[data-delete-vehicle]");
    if (deleteButton) {
        try {
            const { error } = await supabaseClient.from("saved_vehicles")
                .delete().eq("id", deleteButton.dataset.deleteVehicle).eq("user_id", accountUser.id);
            if (error) throw error;
            savedVehicles = savedVehicles.filter(vehicle => vehicle.id !== deleteButton.dataset.deleteVehicle);
            renderAccountDashboard();
        } catch (error) {
            showAccountMessage(`Не удалось удалить автомобиль. ${error.message || ""}`.trim(), "error");
        }
        return;
    }
    const useButton = event.target.closest("[data-use-vehicle]");
    if (useButton) {
        const vehicle = savedVehicles.find(item => item.id === useButton.dataset.useVehicle);
        if (!vehicle) return;
        const filter = document.getElementById("vehicleFilter");
        filter.value = [vehicle.make, vehicle.model, vehicle.year, vehicle.engine].filter(Boolean).join(" ");
        filter.dispatchEvent(new Event("input", { bubbles: true }));
        closeAccountModal();
        if (!document.getElementById("productPage").hidden) backToCatalog();
        document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    }
});

document.getElementById("accountFavoritesList").addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove-account-favorite]");
    if (removeButton) {
        favorites.delete(Number(removeButton.dataset.removeAccountFavorite));
        persistFavorites();
        renderProducts(getVisibleProducts());
        document.getElementById("favoriteIcon").textContent = favorites.size ? "♥" : "♡";
        renderAccountDashboard();
        return;
    }
    const openButton = event.target.closest("[data-open-favorite]");
    if (openButton) {
        closeAccountModal();
        openProductPage(Number(openButton.dataset.openFavorite));
    }
});

document.getElementById("accountOrdersList").addEventListener("click", event => {
    const repeatButton = event.target.closest("[data-repeat-order]");
    if (!repeatButton) return;
    const order = accountOrders.find(item => item.id === repeatButton.dataset.repeatOrder);
    if (!order || !Array.isArray(order.items)) return;
    order.items.forEach(savedItem => {
        const id = Number(savedItem.product_id);
        const quantity = Number(savedItem.quantity);
        if (!Number.isSafeInteger(id) || !Number.isInteger(quantity) || quantity < 1) return;
        const product = products.find(item => item.id === id);
        const item = product
            ? { ...product, price: Number(savedItem.unit_price), quantity }
            : {
                id,
                name: savedItem.name,
                article: savedItem.article,
                price: Number(savedItem.unit_price),
                image: "",
                quantity
            };
        const existing = cart.find(cartItem => cartItem.id === id);
        if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
        else cart.push(item);
    });
    renderCart();
    closeAccountModal();
    openCart();
});

document.getElementById("accountSignOut").addEventListener("click", async () => {
    if (!supabaseClient) return;
    try {
        await accountWriteQueue;
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        closeAccountModal();
        showToast("Вы вышли из аккаунта");
    } catch (error) {
        showAccountMessage(`Не удалось выйти из аккаунта. ${error.message || ""}`.trim(), "error");
    }
});
