const products = [
    { id: 1, category: "pumps", brand: "BOSCH", name: "Топливный насос электрический", price: 34990, badge: "Хит", symbol: "ТН", color: "#343b3e", bg: "#cfd5d7" },
    { id: 2, category: "filters", brand: "MAHLE", name: "Фильтр тонкой очистки топлива", price: 12490, badge: "Топ", symbol: "ФТ", color: "#b51f27", bg: "#d6dcde" },
    { id: 3, category: "injectors", brand: "DELPHI", name: "Форсунка дизельная Common Rail", price: 89990, badge: "Оригинал", symbol: "ФС", color: "#4e5a5f", bg: "#d1d7d9" },
    { id: 4, category: "pumps", brand: "PIERBURG", name: "Насос высокого давления GDI", price: 139990, badge: "Новинка", symbol: "HP", color: "#d7c16a", bg: "#cfd5d6" },
    { id: 5, category: "filters", brand: "BOSCH", name: "Фильтр грубой очистки бензина", price: 6990, badge: "", symbol: "ФГ", color: "#7d3d2f", bg: "#d8dcdd" },
    { id: 6, category: "injectors", brand: "MAGNETI MARELLI", name: "Ремкомплект форсунки", price: 18990, badge: "Хит", symbol: "RK", color: "#687176", bg: "#d3d8da" },
    { id: 7, category: "chemistry", brand: "LIQUI MOLY", name: "Очиститель топливной системы", price: 7490, badge: "", symbol: "ОТ", color: "#343a3d", bg: "#d1d6d8" },
    { id: 8, category: "chemistry", brand: "BARDHL", name: "Антигель для дизельного топлива", price: 9490, badge: "Зима", symbol: "АГ", color: "#cd8c16", bg: "#d4dadb" }
];

let cart = [];
let activeCategory = "all";
let favorites = new Set();
let compare = new Set();

const productGrid = document.getElementById("products");
const cartCount = document.getElementById("cartCount");
const cartTitleCount = document.getElementById("cartTitleCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const checkoutModal = document.getElementById("checkoutModal");
const toast = document.getElementById("toast");

function formatPrice(price) {
    return new Intl.NumberFormat("kk-KZ").format(price) + " ₸";
}

function renderProducts(items = products) {
    productGrid.innerHTML = items.map(product => `
        <article class="product">
            <div class="product__image">
                ${product.badge ? `<span class="product__badge">${product.badge}</span>` : ""}
                <button class="product__compare ${compare.has(product.id) ? "active" : ""}" type="button" data-compare="${product.id}" aria-label="Сравнить">⇄</button>
                <button class="product__favorite ${favorites.has(product.id) ? "active" : ""}" type="button" data-favorite="${product.id}" aria-label="В избранное">${favorites.has(product.id) ? "♥" : "♡"}</button>
                <div class="product-art" style="--art-symbol:'${product.symbol}';--art-color:${product.color};--art-bg:${product.bg}"></div>
            </div>
            <div class="product__info">
                <div class="product__brand">${product.brand}</div>
                <h3 class="product__name">${product.name}</h3>
                <div class="product__bottom">
                    <div>
                        <div class="product__price">${formatPrice(product.price)}</div>
                        <span class="product__stock">● В наличии</span>
                    </div>
                    <button class="product__cart" type="button" data-id="${product.id}" aria-label="Добавить в корзину">+</button>
                </div>
            </div>
        </article>
    `).join("");
}

function getVisibleProducts() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    return products.filter(product => {
        const matchesCategory = activeCategory === "all" || product.category === activeCategory;
        const matchesQuery = !query || `${product.name} ${product.brand}`.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });
}

function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
    cartTitleCount.textContent = `(${count})`;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = formatPrice(total);

    if (!cart.length) {
        cartItems.innerHTML = `<div class="cart-empty"><span>▣</span><p>Корзина пока пуста</p></div>`;
        return;
    }
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item__thumb">${item.symbol}</div>
            <div>
                <h4>${item.name}</h4>
                <strong>${formatPrice(item.price)} × ${item.quantity}</strong>
            </div>
            <button class="cart-item__remove" type="button" data-remove="${item.id}" aria-label="Удалить">×</button>
        </div>
    `).join("");
}

function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");
}

function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
}

let toastTimer;
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openCheckout() {
    if (!cart.length) {
        showToast("Корзина пуста");
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("checkoutTotal").textContent = formatPrice(total);
    closeCart();
    checkoutOverlay.classList.add("open");
    checkoutModal.classList.add("open");
}

function closeCheckout() {
    checkoutOverlay.classList.remove("open");
    checkoutModal.classList.remove("open");
}

renderProducts();
renderCart();

document.getElementById("filters").addEventListener("click", event => {
    const button = event.target.closest(".filter");
    if (!button) return;
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderProducts(getVisibleProducts());
});

document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    renderProducts(getVisibleProducts());
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("searchInput").addEventListener("input", () => {
    renderProducts(getVisibleProducts());
});

productGrid.addEventListener("click", event => {
    const compareButton = event.target.closest("[data-compare]");
    if (compareButton) {
        const id = Number(compareButton.dataset.compare);
        if (compare.has(id)) compare.delete(id);
        else if (compare.size < 3) compare.add(id);
        else {
            showToast("Можно сравнить до 3 товаров");
            return;
        }
        renderProducts(getVisibleProducts());
        showToast(compare.has(id) ? "Добавлено к сравнению" : "Удалено из сравнения");
        return;
    }

    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
        const id = Number(favoriteButton.dataset.favorite);
        if (favorites.has(id)) favorites.delete(id);
        else favorites.add(id);
        renderProducts(getVisibleProducts());
        showToast(favorites.has(id) ? "Добавлено в избранное" : "Удалено из избранного");
        document.getElementById("favoriteIcon").textContent = favorites.size ? "♥" : "♡";
        return;
    }

    const cartButton = event.target.closest(".product__cart");
    if (!cartButton) return;
    const product = products.find(item => item.id === Number(cartButton.dataset.id));
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    renderCart();
    openCart();
});

cartItems.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove]");
    if (!removeButton) return;
    cart = cart.filter(item => item.id !== Number(removeButton.dataset.remove));
    renderCart();
});

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("catalogButton").addEventListener("click", () => {
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("logoLink").addEventListener("click", event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("showAll").addEventListener("click", event => {
    event.preventDefault();
    activeCategory = "all";
    document.getElementById("searchInput").value = "";
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.category === "all"));
    renderProducts(products);
});

document.getElementById("favoriteButton").addEventListener("click", () => {
    if (!favorites.size) {
        showToast("В избранном пока пусто");
        return;
    }
    renderProducts(products.filter(product => favorites.has(product.id)));
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    showToast(`Избранное: ${favorites.size}`);
});

document.getElementById("compareButton").addEventListener("click", () => {
    if (!compare.size) {
        showToast("Добавьте товары через корзину");
        return;
    }
    showToast(`В сравнении: ${compare.size} товара`);
});

productGrid.addEventListener("contextmenu", event => {
    const card = event.target.closest(".product");
    if (!card) return;
});

document.getElementById("checkoutButton").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);
checkoutOverlay.addEventListener("click", closeCheckout);

document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name").trim();
    closeCheckout();
    cart = [];
    renderCart();
    event.currentTarget.reset();
    showToast(`Спасибо, ${name}! Заказ принят`);
});