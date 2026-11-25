let products = [
    { id: 1, category: "pumps", brand: "MASUMA", name: "Топливный насос MASUMA MPU-109", price: 8500, badge: "Хит", symbol: "MP", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/hd9/hfe/64443595259934.jpg?format=gallery-large", description: "Топливный насос MASUMA MPU-109. Надежная подача топлива, проверка перед отправкой." },
    { id: 2, category: "pumps", brand: "MASUMA", name: "Топливный насос MASUMA MPU-108", price: 8500, badge: "", symbol: "MP", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/pac/p96/80210672.png?format=gallery-large", description: "Топливный насос MASUMA MPU-108 для стабильной работы топливной системы." },
    { id: 3, category: "pumps", brand: "MASUMA", name: "Топливный насос MASUMA MPU-102", price: 11000, badge: "", symbol: "MP", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/p30/pbc/85354865.jpeg?format=gallery-large", description: "Топливный насос MASUMA MPU-102 с проверенным качеством и быстрой доставкой." },
    { id: 4, category: "accessories", brand: "532401", name: "Подогреватель топливного фильтра автономный 532401 12 В", price: 20000, badge: "Новинка", symbol: "ПТ", color: "#d7c16a", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/hb7/h63/84935679574046.jpg?format=gallery-large", description: "Автономный подогреватель топливного фильтра 532401 на 12 В для зимней эксплуатации." },
    { id: 5, category: "accessories", brand: "Q BIRD", name: "Крышка топливного бака Q bird 77144-OH010", price: 10000, badge: "", symbol: "КТ", color: "#687176", bg: "#d3d8da", image: "https://resources.cdn-kaspi.kz/img/m/p/pda/p42/109942959.jpeg?format=gallery-large", description: "Крышка топливного бака Q bird 77144-OH010 для надежной герметизации." },
    { id: 6, category: "sensors", brand: "SUBARU", name: "Датчик кислорода Subaru 22690AA81A", price: 25000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/pdb/pb4/17572779.jpeg?format=gallery-large", description: "Датчик кислорода Subaru 22690AA81A для точного контроля состава выхлопных газов." },
    { id: 7, category: "sensors", brand: "Q BIRD", name: "Датчик кислорода Q bird 22641-AA54A", price: 35000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/p93/p49/88950131.jpeg?format=gallery-large", description: "Датчик кислорода Q bird 22641-AA54A для систем контроля и диагностики двигателя." },
    { id: 8, category: "sensors", brand: "Q BIRD", name: "Датчик кислорода Q bird 22641-AA150", price: 35000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/pb7/p41/88954745.jpeg?format=gallery-large", description: "Датчик кислорода Q bird 22641-AA150 для стабильной работы системы впрыска." },
    { id: 9, category: "sensors", brand: "Q BIRD", name: "Датчик кислорода Q bird 22641-AA71A", price: 35000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/pb6/p7b/88952572.jpeg?format=gallery-large", description: "Датчик кислорода Q bird 22641-AA71A для контроля работы каталитического нейтрализатора." },
    { id: 10, category: "sensors", brand: "Q BIRD", name: "Датчик кислорода Q bird 22690-AA560", price: 25000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/p1c/pe7/88953087.jpeg?format=gallery-large", description: "Датчик кислорода Q bird 22690-AA560 для диагностики и корректировки смеси." },
    { id: 11, category: "pumps", brand: "ZOREN", name: "Топливный насос ZOREN 000688187", price: 40000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/h4a/hb5/84584321974302.jpg?format=gallery-large", description: "Топливный насос ZOREN 000688187 для подачи топлива под заданным давлением." },
    { id: 12, category: "sensors", brand: "Q BIRD", name: "Датчик кислорода Q bird 22641AA180", price: 30000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/p7e/p3f/72062016.jpeg?format=gallery-large", description: "Датчик кислорода Q bird 22641AA180 для точной регулировки состава топливной смеси." },
    { id: 13, category: "pumps", brand: "SICMA", name: "Топливный насос SICMA 311103X500", price: 40000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/p2c/p49/73613900.jpeg?format=gallery-large", description: "Топливный насос SICMA 311103X500 для надежной подачи топлива." },
    { id: 14, category: "sensors", brand: "ALWAYS", name: "Датчик кислорода Always 0258003786", price: 12000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/he3/hdc/84784714940446.png?format=gallery-large", description: "Датчик кислорода Always 0258003786 для контроля состава выхлопных газов." },
    { id: 15, category: "pumps", brand: "SICMA", name: "Топливный насос SICMA E8755M", price: 45000, badge: "Хит", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/hd5/hf7/86177492598814.jpg?format=gallery-large", description: "Топливный насос SICMA E8755M с проверенным качеством изготовления." },
    { id: 16, category: "pumps", brand: "ACAR", name: "Топливный насос Acar 17040CA000", price: 40000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/p94/p1f/75741368.jpeg?format=gallery-large", description: "Топливный насос Acar 17040CA000 для стабильной работы системы подачи топлива." },
    { id: 17, category: "pumps", brand: "ALWAYS", name: "Топливный насос Always KW16", price: 10000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/h6a/he3/85042598117406.jpg?format=gallery-large", description: "Топливный насос Always KW16 для замены штатной детали." },
    { id: 18, category: "accessories", brand: "ROSUNPARTS", name: "Обманка лямбда-зонда Rosunparts 000180", price: 7500, badge: "", symbol: "ЛЗ", color: "#687176", bg: "#d3d8da", image: "https://resources.cdn-kaspi.kz/img/m/p/h53/h3a/84693137031198.png?format=gallery-large", description: "Обманка лямбда-зонда Rosunparts 000180 для тюнинговых и сервисных задач." },
    { id: 19, category: "ignition", brand: "Q BIRD", name: "Свечные провода Q bird 26769", price: 8000, badge: "", symbol: "СП", color: "#b51f27", bg: "#d6dcde", image: "https://resources.cdn-kaspi.kz/img/m/p/hea/h6c/85006878441502.jpg?format=gallery-large", description: "Свечные провода Q bird 26769 для надежной передачи высокого напряжения." },
    { id: 20, category: "ignition", brand: "Q BIRD", name: "Свечные провода Q bird HA60HA", price: 8000, badge: "", symbol: "СП", color: "#b51f27", bg: "#d6dcde", image: "https://resources.cdn-kaspi.kz/img/m/p/h7c/hbb/85006929362974.jpg?format=gallery-large", description: "Свечные провода Q bird HA60HA для стабильного зажигания." },
    { id: 21, category: "pumps", brand: "CONTINENTAL", name: "Топливный насос Continental 2224700094", price: 120000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/p3f/p90/91472794.jpeg?format=gallery-large", description: "Топливный насос Continental 2224700094 для современных систем подачи топлива." },
    { id: 22, category: "pumps", brand: "SICMA", name: "Топливный насос SICMA DG939H307BC", price: 50000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/p3d/p1a/82697257.jpeg?format=gallery-large", description: "Топливный насос SICMA DG939H307BC для эффективной подачи топлива." },
    { id: 23, category: "pumps", brand: "CONTINENTAL", name: "Топливный насос Continental 16117344066", price: 110000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/p12/p97/91472792.jpeg?format=gallery-large", description: "Топливный насос Continental 16117344066 для точной подачи топлива." },
    { id: 24, category: "pumps", brand: "CONTINENTAL", name: "Топливный насос Continental 7P6919088B", price: 120000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/p33/pda/92056317.jpeg?format=gallery-large", description: "Топливный насос Continental 7P6919088B для надежной работы топливной системы." },
    { id: 25, category: "sensors", brand: "ALWAYS", name: "Датчик кислорода Always 0258017014", price: 18000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/ha1/h23/84736214237214.png?format=gallery-large", description: "Датчик кислорода Always 0258017014 для контроля состава выхлопных газов." },
    { id: 26, category: "sensors", brand: "ALWAYS", name: "Датчик кислорода Always 0258006475", price: 12000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/hdd/h96/84784830316574.png?format=gallery-large", description: "Датчик кислорода Always 0258006475 для системы управления двигателем." },
    { id: 27, category: "sensors", brand: "ALWAYS", name: "Датчик кислорода Always 0258003597", price: 12000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/h5f/h64/84784715005982.png?format=gallery-large", description: "Датчик кислорода Always 0258003597 для диагностики состава выхлопных газов." },
    { id: 28, category: "ignition", brand: "Q BIRD", name: "Свечные провода Q bird 21607", price: 12000, badge: "", symbol: "СП", color: "#b51f27", bg: "#d6dcde", image: "https://resources.cdn-kaspi.kz/img/m/p/h52/hda/84968387805214.jpg?format=gallery-large", description: "Свечные провода Q bird 21607 для системы зажигания автомобиля." },
    { id: 29, category: "pumps", brand: "ROSUNPARTS", name: "Топливный насос Rosunparts 8764A321", price: 10000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/h6b/heb/84693137293342.png?format=gallery-large", description: "Топливный насос Rosunparts 8764A321 для стабильной подачи топлива." },
    { id: 30, category: "ignition", brand: "SEIWA", name: "Свечные провода Seiwa 90919-21528", price: 17400, badge: "", symbol: "СП", color: "#b51f27", bg: "#d6dcde", image: "https://resources.cdn-kaspi.kz/img/m/p/h80/h5a/85042711167006.jpg?format=gallery-large", description: "Свечные провода Seiwa 90919-21528 для системы зажигания." },
    { id: 31, category: "sensors", brand: "ALWAYS", name: "Датчик кислорода Always 0258006272", price: 12000, badge: "", symbol: "ДК", color: "#4e5a5f", bg: "#d1d7d9", image: "https://resources.cdn-kaspi.kz/img/m/p/h20/h7e/84736648282142.png?format=gallery-large", description: "Датчик кислорода Always 0258006272 для системы управления двигателем." },
    { id: 32, category: "pumps", brand: "KESHEN", name: "Топливный насос Keshen 2322043070/KS17A", price: 8000, badge: "", symbol: "TN", color: "#343b3e", bg: "#cfd5d7", image: "https://resources.cdn-kaspi.kz/img/m/p/he1/hd8/85042711232542.jpg?format=gallery-large", description: "Топливный насос Keshen 2322043070/KS17A для подачи топлива." },
    { id: 33, category: "ignition", brand: "Q BIRD", name: "Свечные провода Q bird 60GA", price: 8000, badge: "", symbol: "СП", color: "#b51f27", bg: "#d6dcde", image: "https://resources.cdn-kaspi.kz/img/m/p/h43/h1f/85006878375966.jpg?format=gallery-large", description: "Свечные провода Q bird 60GA для системы зажигания автомобиля." },
    { id: 34, category: "ignition", brand: "Q BIRD", name: "Свечные провода Q bird 338624", price: 7000, badge: "", symbol: "СП", color: "#b51f27", bg: "#d6dcde", image: "https://resources.cdn-kaspi.kz/img/m/p/h22/h92/84936179384350.jpg?format=gallery-large", description: "Свечные провода Q bird 338624 для стабильной передачи импульса зажигания." },
    { id: 35, category: "accessories", brand: "WARN", name: "Warn динамический строп GVM12000 6 6", price: 25000, badge: "", symbol: "СТ", color: "#687176", bg: "#d3d8da", image: "https://resources.cdn-kaspi.kz/img/m/p/h4f/h3c/85396616347678.jpg?format=gallery-large", description: "Динамический строп Warn GVM12000 6 6." },
    { id: 36, category: "accessories", brand: "Q BIRD", name: "Q bird обманка лямбда-зонда 54321", price: 10000, badge: "", symbol: "ЛЗ", color: "#687176", bg: "#d3d8da", image: "https://resources.cdn-kaspi.kz/img/m/p/p89/p23/11836908.jpeg?format=gallery-large", description: "Обманка лямбда-зонда Q bird 54321." }
];

const kaspiDetails = {
    1: { specifications: [
        ["Номер OEM", "23221-50100"], ["Артикул производителя", "MPU-109"],
        ["Марка автомобиля", "Mitsubishi, Toyota"], ["Модель автомобиля", "Montero, Montero Sport, Pajero Junior, Pajero Mini, Space Runner, Space Wagon, FJ Cruiser, Land Cruiser Prado"],
        ["Год выпуска автомобиля", "1997-2009"], ["Дополнительная информация", "Высота упаковки 60 мм; длина 160 мм; ширина 75 мм; вес 0.35 кг"]
    ]},
    2: { description: "Топливный насос MASUMA MPU-108 предназначен для автомобилей Toyota Corolla и Vitz 2006-2015 годов выпуска. Обеспечивает стабильную подачу топлива и совместим с указанными OEM-номерами.", specifications: [
        ["Номер OEM", "23220-21131, 23220-21132 и другие"], ["Артикул производителя", "MPU-108"],
        ["Марка автомобиля", "Toyota"], ["Модель автомобиля", "Corolla, Vitz"], ["Год выпуска автомобиля", "2006-2015"]
    ]},
    3: { description: "Топливный насос MASUMA MPU-102 предназначен для обеспечения стабильной подачи топлива в двигателе Toyota Land Cruiser и других совместимых моделей. Выпускается на сборочных линиях OEM-поставщика топливных систем.", specifications: [
        ["Номер OEM", "23221-50060, 23221-46140, 23221-46120, 23221-62010, 23221-70360"], ["Артикул производителя", "MPU-102"],
        ["Марка автомобиля", "Lexus, Toyota"], ["Модель автомобиля", "GS 300, IS 300, Land Cruiser, Tundra и другие"], ["Год выпуска автомобиля", "1994-2005"],
        ["Вид эксплуатации", "электрический"], ["Напряжение", "12 В"], ["Производительность", "120 л/ч"], ["Ток", "7.5 A"]
    ]},
    4: { description: "Автономный подогреватель топливного фильтра для дизельного топлива напряжением 12 В. Предназначен для легкового, грузового транспорта и спецтехники.", specifications: [
        ["Тип", "подогреватель топливного фильтра"], ["Назначение", "легковой транспорт, грузовой транспорт, спецтехника"],
        ["Вид обогревателя", "автономный"], ["Вид обогрева", "воздушный"], ["Вид топлива", "дизель"],
        ["Напряжение питания", "12 В"], ["Теплопроизводительность", "40 Вт"], ["Потребляемая мощность", "40 Вт"]
    ]},
    5: { specifications: [
        ["Номер OEM", "77144-OH010"], ["Артикул производителя", "77144-OH010"], ["Тип", "крышка топливного бака"],
        ["Марка автомобиля", "Toyota"], ["Модель автомобиля", "Avensis, Corolla"], ["Год выпуска автомобиля", "2007 и выше"]
    ]},
    6: { description: "Датчик кислорода Subaru 22690AA81A для контроля состава выхлопных газов и работы системы впрыска.", specifications: [
        ["Номер OEM", "22690AA81A"], ["Артикул производителя", "22690AA81A"], ["Марка автомобиля", "Subaru"],
        ["Модель автомобиля", "Forester, Legacy"], ["Год выпуска автомобиля", "2002"], ["Дополнительная информация", "С 2002 года и выше"]
    ]},
    7: { specifications: [["Номер OEM", "22641-AA54A"], ["Артикул производителя", "22641-AA54A"], ["Марка автомобиля", "Subaru"], ["Модель автомобиля", "Outback"], ["Год выпуска автомобиля", "2010-2012"]] },
    8: { specifications: [["Номер OEM", "22641-AA150"], ["Артикул производителя", "22641-AA150"], ["Марка автомобиля", "Subaru"], ["Модель автомобиля", "Forester, Impreza, Legacy, Outback"], ["Год выпуска автомобиля", "1998 и выше"]] },
    9: { specifications: [["Номер OEM", "22641-AA71A"], ["Артикул производителя", "22641-AA71A"], ["Марка автомобиля", "Subaru"], ["Модель автомобиля", "Legacy, Outback"], ["Год выпуска автомобиля", "2015 и выше"]] },
    10: { specifications: [["Номер OEM", "22690-AA560"], ["Артикул производителя", "22690-AA560"], ["Марка автомобиля", "Subaru"], ["Модель автомобиля", "Impreza"], ["Год выпуска автомобиля", "2005 и выше"]] },
    11: { description: "Топливный насос ZOREN 000688187 для Honda CR-V обеспечивает подачу топлива в соответствии с заводскими стандартами.", specifications: [
        ["Номер OEM", "SP025M"], ["Артикул производителя", "000688187"], ["Марка автомобиля", "Honda"], ["Модель автомобиля", "CR-V"], ["Год выпуска автомобиля", "2007, 2011"]
    ]},
    12: { description: "Датчик кислорода Q bird 22641AA180 обеспечивает контроль состава выхлопных газов для Subaru Forester и Impreza.", specifications: [
        ["Номер OEM", "22641AA180"], ["Артикул производителя", "22641AA180"], ["Марка автомобиля", "Subaru"], ["Модель автомобиля", "Forester, Impreza"], ["Год выпуска автомобиля", "2003 и выше"]
    ]},
    13: { specifications: [["Номер OEM", "311103X500"], ["Артикул производителя", "311103X500"], ["Марка автомобиля", "Hyundai"], ["Модель автомобиля", "Elantra"], ["Год выпуска автомобиля", "2011 и выше"]] },
    14: { description: "Датчик кислорода Always 0258003786 обеспечивает точный контроль состава выхлопных газов и работу системы управления двигателем.", specifications: [
        ["Номер OEM", "0258003786"], ["Артикул производителя", "0258003786"], ["Марка автомобиля", "Mercedes-Benz"], ["Модель автомобиля", "S-Series"], ["Год выпуска автомобиля", "1992"]
    ]},
    15: { description: "Топливный насос SICMA E8755M предназначен для Nissan Altima и обеспечивает стабильную работу топливной системы.", specifications: [
        ["Номер OEM", "E8755M"], ["Артикул производителя", "E8755M"], ["Марка автомобиля", "Nissan"], ["Модель автомобиля", "Altima"], ["Год выпуска автомобиля", "2005 и выше"]
    ]},
    16: { specifications: [["Номер OEM", "17040CA000"], ["Артикул производителя", "17040CA000"], ["Марка автомобиля", "Nissan"], ["Модель автомобиля", "Murano"], ["Год выпуска автомобиля", "2002 и выше"]] },
    17: { specifications: [["Номер OEM", "KW16"], ["Артикул производителя", "KW16"], ["Марка автомобиля", "ГАЗ"], ["Модель автомобиля", "ГАЗель"], ["Год выпуска автомобиля", "1988"]] },
    18: { specifications: [["Тип", "обманка лямбда-зонда"], ["Назначение", "легковые автомобили"], ["Номер OEM", "237895"], ["Артикул производителя", "000180"], ["Материал", "нержавеющая сталь"], ["Вес", "60 г"]] },
    19: { description: "Свечные провода Q bird 26769 предназначены для системы зажигания Geely Emgrand EC7 и Vision.", specifications: [
        ["Марка автомобиля", "Geely"], ["Модель автомобиля", "Emgrand EC7, Vision"], ["Год выпуска автомобиля", "2010"], ["Номер OEM", "101605026769"], ["Артикул производителя", "26769"]
    ]},
    20: { description: "Свечные провода Q bird HA60HA предназначены для Chery Tiggo и обеспечивают передачу импульса зажигания.", specifications: [
        ["Марка автомобиля", "Chery"], ["Модель автомобиля", "Tiggo, Tiggo 2, Tiggo 2 Pro"], ["Год выпуска автомобиля", "2010, 2025"], ["Дополнительная информация", "длина надсвечника 150 мм"], ["Номер OEM", "A113707130HA60HA"], ["Артикул производителя", "HA60HA"]
    ]},
    21: { specifications: [["Номер OEM", "2224700094"], ["Артикул производителя", "2224700094"], ["Марка автомобиля", "Mercedes-Benz"], ["Модель автомобиля", "S-CLASS"], ["Год выпуска автомобиля", "2015 и выше"]] },
    22: { specifications: [["Номер OEM", "DG939H307BC"], ["Артикул производителя", "DG939H307BC"], ["Марка автомобиля", "Ford"], ["Модель автомобиля", "Edge"], ["Год выпуска автомобиля", "2015 и выше"]] },
    23: { specifications: [["Номер OEM", "16117344066"], ["Артикул производителя", "16117344066"], ["Марка автомобиля", "BMW"], ["Модель автомобиля", "3-Series 315"], ["Год выпуска автомобиля", "2011 и выше"], ["Дополнительная информация", "BMW 3 серии F30/F31/F80"]] },
    24: { specifications: [["Номер OEM", "7P6919088B"], ["Артикул производителя", "7P6919088B"], ["Марка автомобиля", "Volkswagen"], ["Модель автомобиля", "Touareg"], ["Год выпуска автомобиля", "2014-2018"], ["Дополнительная информация", "3.0 TDI"]] }
};

let cart = (() => {
    try {
        return JSON.parse(localStorage.getItem("fuelpartsCart") || "[]");
    } catch (_) {
        return [];
    }
})();
let activeCategory = "all";
let favorites = new Set(JSON.parse(localStorage.getItem("fuelpartsFavorites") || "[]"));
let catalogPageSize = 24;
let catalogVisibleCount = catalogPageSize;
const fallbackProducts = [...products];

function transliterate(text) {
    const map = {
        а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",
        к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
        х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
    };
    return text.toLowerCase().split("").map(char => map[char] || char).join("");
}

function getProductSlug(product) {
    const slug = transliterate(product.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-|-$/g,"");
    return slug || `product-${product.id}`;
}

function getProductBySlug(slug) {
    const exact = products.find(product => getProductSlug(product) === slug);
    if (exact) return exact;
    const compactSlug = (slug || "").replace(/[^a-z0-9]/g, "");
    const compactMatch = products.find(product =>
        getProductSlug(product).replace(/[^a-z0-9]/g, "") === compactSlug
    );
    if (compactMatch) return compactMatch;
    const idMatch = /^product-(\d+)$/.exec(slug || "");
    return idMatch ? products.find(product => product.id === Number(idMatch[1])) : null;
}

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
const productModalOverlay = document.getElementById("productModalOverlay");
const productModal = document.getElementById("productModal");
const productModalContent = document.getElementById("productModalContent");

function formatPrice(price) {
    return new Intl.NumberFormat("kk-KZ").format(price) + " ₸";
}

function persistCart() {
    localStorage.setItem("fuelpartsCart", JSON.stringify(cart));
}

function persistFavorites() {
    localStorage.setItem("fuelpartsFavorites", JSON.stringify([...favorites]));
}

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
    return text
        .replace(/РЎ/g, "С")
        .replace(/Рї/g, "п")
        .replace(/Р/gu, "")
        .replace(/�/g, "");
}

function normalizeCatalog(items) {
    const seen = new Set();
    return items.map((item, index) => {
        const id = Number(item.id || index + 1);
        const fallback = fallbackProducts.find(product => product.id === id);
        return {
        id,
        category: item.category || fallback?.category || "accessories",
        brand: fallback?.brand || repairMojibake(item.brand || ""),
        name: fallback?.name || repairMojibake(item.name || item.title || ""),
        price: item.price == null || item.price === "" ? null : Number(item.price),
        badge: item.badge || fallback?.badge || "",
        symbol: item.symbol || fallback?.symbol || (item.brand ? item.brand.slice(0, 2).toUpperCase() : "Т"),
        color: item.color || fallback?.color || "#343b3e",
        bg: item.bg || fallback?.bg || "#d1d7d9",
        image: fallback?.image || item.image || (Array.isArray(item.gallery) ? item.gallery[0] : "") || "",
        gallery: fallback?.gallery || (Array.isArray(item.gallery) ? item.gallery : (item.image ? [item.image] : [])),
        description: fallback?.description || item.description || "",
        specifications: Array.isArray(fallback?.specifications) && fallback.specifications.length ? fallback.specifications : (Array.isArray(item.specifications) ? item.specifications : []),
        article: item.article || item.sku || item.kaspiId || item.id || "",
        stock: item.stock ?? 1,
        rating: item.rating ?? 0,
        reviews: item.reviews ?? 0,
        kaspiUrl: item.kaspiUrl || ""
    }}).filter(item => {
        if (!item.name || seen.has(item.name.toLowerCase())) return false;
        seen.add(item.name.toLowerCase());
        return true;
    });
}

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
            }
        } catch (_) {}
    }
    populateBrandFilter();
    renderProducts(getVisibleProducts());
    observeProducts();
}

function populateBrandFilter() {
    const select = document.getElementById("brandFilter");
    const brands = [...new Set(products.map(product => product.brand).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "ru"));
    select.innerHTML = `<option value="all">Все производители</option>` +
        brands.map(brand => `<option value="${brand.replace(/"/g, "&quot;")}">${brand}</option>`).join("");
}

function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            if (quoted && text[i + 1] === '"') {
                value += '"';
                i++;
            } else {
                quoted = !quoted;
            }
        } else if (char === "," && !quoted) {
            row.push(value.trim());
            value = "";
        } else if ((char === "\n" || char === "\r") && !quoted) {
            if (char === "\r" && text[i + 1] === "\n") i++;
            row.push(value.trim());
            if (row.some(cell => cell)) rows.push(row);
            row = [];
            value = "";
        } else {
            value += char;
        }
    }
    row.push(value.trim());
    if (row.some(cell => cell)) rows.push(row);
    if (!rows.length) return [];
    const headers = rows.shift().map(header => header.trim().toLowerCase());
    return rows.map(values => {
        const item = {};
        headers.forEach((header, index) => {
            item[header] = values[index] || "";
        });
        return item;
    });
}

async function importCatalogFile(file) {
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
        products = normalizeCatalog(items);
        localStorage.setItem("fuelpartsCatalog", JSON.stringify(products));
        localStorage.setItem("fuelpartsCatalogImported", "true");
        activeCategory = "all";
        document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.category === "all"));
        renderProducts(getVisibleProducts());
        observeProducts();
        showToast(`Импортировано товаров: ${products.length}`);
    } catch (_) {
        showToast("Не удалось импортировать файл");
    }
}

function renderProducts(items = products) {
    const countWord = items.length === 1 ? "товар" : (items.length >= 2 && items.length <= 4 ? "товара" : "товаров");
    document.getElementById("productCount").textContent = `${items.length} ${countWord}`;
    const resetButton = document.getElementById("resetCatalogFilters");
    const hasFilters =
        document.getElementById("searchInput").value.trim() ||
        activeCategory !== "all" ||
        document.getElementById("priceMin").value ||
        document.getElementById("priceMax").value ||
        document.getElementById("brandFilter").value !== "all" ||
        document.getElementById("vehicleFilter").value.trim() ||
        document.getElementById("sortProducts").value !== "default";
    resetButton.hidden = !hasFilters;
    if (!items.length) {
        productGrid.innerHTML = `
            <div class="catalog-empty">
                <strong>Ничего не найдено</strong>
                <p>Измените параметры поиска или сбросьте фильтры.</p>
                <button type="button" id="emptyResetCatalog">Сбросить фильтры</button>
            </div>
        `;
        return;
    }
    const visibleItems = items.slice(0, catalogVisibleCount);
    productGrid.innerHTML = visibleItems.map((product, index) => `
        <article class="product" data-product-id="${product.id}">
            <div class="product__image">
                ${product.badge ? `<span class="product__badge">${product.badge}</span>` : ""}
                <button class="product__favorite ${favorites.has(product.id) ? "active" : ""}" type="button" data-favorite="${product.id}" aria-label="В избранное">${favorites.has(product.id) ? "♥" : "♡"}</button>
                <img class="product__photo" src="${product.image}" alt="${product.name}" loading="${index < 8 ? "eager" : "lazy"}" decoding="async">
            </div>
            <div class="product__info">
                <div class="product__brand">${product.brand}</div>
                <h3 class="product__name">${product.name || "Название уточняется"}</h3>
                <div class="product__bottom">
                    <div>
                        <div class="product__price">${product.price != null ? formatPrice(product.price) : "Цена по запросу"}</div>
                        <span class="product__stock">● В наличии</span>
                    </div>
                    <div>
                        <a class="product__details" href="?product=product-${product.id}" data-details="${product.id}">Подробнее</a>
                        <button class="product__cart" type="button" data-id="${product.id}" aria-label="Добавить в корзину">В корзину</button>
                    </div>
                </div>
            </div>
        </article>
    `).join("") + (catalogVisibleCount < items.length ? `
        <button class="catalog-load-more" id="loadMoreProducts" type="button">
            Показать ещё <span>${Math.min(catalogPageSize, items.length - catalogVisibleCount)}</span>
        </button>
    ` : "");
}

function getVisibleProducts() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const minPrice = Number(document.getElementById("priceMin").value);
    const maxPrice = Number(document.getElementById("priceMax").value);
    const brand = document.getElementById("brandFilter").value;
    const vehicle = document.getElementById("vehicleFilter").value.trim().toLowerCase();
    const visible = products.filter(product => {
        const matchesCategory = activeCategory === "all" || product.category === activeCategory;
        const matchesQuery = !query || `${product.name} ${product.brand} ${product.article || ""}`.toLowerCase().includes(query);
        const matchesMin = !minPrice || product.price == null || product.price >= minPrice;
        const matchesMax = !maxPrice || product.price == null || product.price <= maxPrice;
        const matchesBrand = brand === "all" || product.brand === brand;
        const details = kaspiDetails[product.id];
        const vehicleText = details?.specifications
            ?.flatMap(spec => spec.slice(1))
            .join(" ")
            .toLowerCase() || "";
        const matchesVehicle = !vehicle || `${product.name} ${product.brand} ${vehicleText}`.toLowerCase().includes(vehicle);
        return matchesCategory && matchesQuery && matchesMin && matchesMax && matchesBrand && matchesVehicle;
    });
    const sort = document.getElementById("sortProducts").value;
    if (sort === "priceAsc") return [...visible].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") return [...visible].sort((a, b) => b.price - a.price);
    if (sort === "popular") return [...visible].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
    if (sort === "name") return [...visible].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    return visible;
}

function openProductModal(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    productModalContent.innerHTML = `
        <div class="product-modal__grid">
            <div class="product-modal__image">
                <img class="product-modal__photo" src="${product.image}" alt="${product.name}">
            </div>
            <div>
                <div class="product-modal__brand">${product.brand}</div>
                <h2>${product.name}</h2>
                <span class="product-modal__stock">● В наличии</span>
                <p class="product-modal__description">${product.description}</p>
                <div class="product-modal__bottom">
                    <div class="product-modal__price">${formatPrice(product.price)}</div>
                    <button class="product-modal__favorite ${favorites.has(product.id) ? "active" : ""}" type="button" data-modal-favorite="${product.id}" aria-label="В избранное">${favorites.has(product.id) ? "♥" : "♡"}</button>
                    <button class="product-modal__cart" type="button" data-modal-cart="${product.id}">В корзину</button>
                </div>
                <a class="product-modal__kaspi" href="https://l.kaspi.kz/shop/BoCtHpKeRZYKVMV?sessionId=0988e554-ca36-4eec-a993-d14db15ad7931795624108" target="_blank" rel="noopener">Открыть в Kaspi</a>
            </div>
        </div>
    `;
    productModalOverlay.classList.add("open");
    productModal.classList.add("open");
    document.body.classList.add("modal-open");
}

function closeProductModal() {
    productModalOverlay.classList.remove("open");
    productModal.classList.remove("open");
    document.body.classList.remove("modal-open");
}

function openProductPage(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;
    const slug = `product-${product.id}`;
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
    document.title = "FuelParts KZ — Запчасти топливной системы";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("productPageContent").addEventListener("click", event => {
    if (event.target.closest("[data-back-catalog]")) {
        event.preventDefault();
        backToCatalog();
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
        const existing = cart.find(item => item.id === product.id);
        if (existing) existing.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        renderCart();
        openCart();
    }
});

function getProductGallery(product) {
    return [...new Set([product.image, ...(product.gallery || [])].filter(Boolean))];
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

    const similar = products
        .filter(item => item.id !== product.id && item.category === product.category)
        .slice(0, 4);
    const details = kaspiDetails[product.id] || {};
    const fullDescription = details.description || product.description;
    const specifications = details.specifications || product.specifications || [];
    const gallery = getProductGallery(product);

    document.getElementById("catalogMain").hidden = true;
    document.getElementById("productPage").hidden = false;
    document.title = `${product.name} — FuelParts KZ`;

    document.getElementById("productPageContent").innerHTML = `
        <button class="product-back-button" type="button" data-back-catalog>
            <span aria-hidden="true">←</span> Назад в каталог
        </button>
        <nav class="product-breadcrumbs" aria-label="Навигационная цепочка">
            <a href="#" data-back-catalog>Главная</a><span>/</span>
            <a href="#" data-back-catalog>Каталог</a><span>/</span>
            <strong>${product.name}</strong>
        </nav>
        <div class="product-detail">
            <div class="product-detail__gallery">
                <div class="product-detail__main-image" data-zoom-image>
                    <img id="productMainImage" src="${gallery[0]}" alt="${product.name}">
                </div>
                <div class="product-detail__thumbs">
                    ${gallery.map((image, index) => `
                        <button class="product-detail__thumb ${index === 0 ? "active" : ""}" type="button" data-main-image="${image}" aria-label="Показать фотографию товара">
                            <img src="${image}" alt="">
                        </button>
                    `).join("")}
                </div>
            </div>
            <div class="product-detail__info">
                <div class="product-detail__brand">${product.brand}</div>
                <h1>${product.name}</h1>
                <div class="product-detail__price">${product.price != null ? formatPrice(product.price) : "Цена по запросу"}</div>
                <span class="product-detail__stock">● В наличии</span>
                <p class="product-detail__short">${fullDescription}</p>
                <div class="product-detail__delivery">
                    <strong>Доставка:</strong> по Алматы за 1–2 дня<br>
                    Доступен самовывоз и доставка по Казахстану
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
            <section class="product-detail__section">
                <h2>Описание</h2>
                <p>${fullDescription}</p>
            </section>
            ${specifications.length ? `
                <section class="product-detail__section product-specifications">
                    <h2>Характеристики</h2>
                    <dl>
                        ${specifications.map(([name, value]) => `
                            <div>
                                <dt>${name}</dt>
                                <dd>${value}</dd>
                            </div>
                        `).join("")}
                    </dl>
                </section>
            ` : ""}
        </div>
        ${similar.length ? `
            <section class="similar-products">
                <h2>Похожие товары</h2>
                <div class="products">
                    ${similar.map(item => `
                        <article class="product" data-similar-id="${item.id}">
                            <div class="product__image">
                                ${item.badge ? `<span class="product__badge">${item.badge}</span>` : ""}
                                <img class="product__photo" src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="product__info">
                                <div class="product__brand">${item.brand}</div>
                                <h3 class="product__name">${item.name}</h3>
                                <div class="product__bottom">
                                    <div class="product__price">${formatPrice(item.price)}</div>
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

function renderCart() {
    persistCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
    cartTitleCount.textContent = `(${count})`;
    const clearCartButton = document.getElementById("clearCartButton");
    clearCartButton.disabled = cart.length === 0;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = formatPrice(total);

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
                <img class="cart-item__photo" src="${item.image}" alt="${item.name}">
            </div>
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
    document.body.classList.add("modal-open");
}

function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
    if (!checkoutModal.classList.contains("open")) {
        document.body.classList.remove("modal-open");
    }
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
    document.body.classList.add("modal-open");
}

function closeCheckout() {
    checkoutOverlay.classList.remove("open");
    checkoutModal.classList.remove("open");
    document.body.classList.remove("modal-open");
}

const clearCartOverlay = document.getElementById("clearCartOverlay");
const clearCartModal = document.getElementById("clearCartModal");

function openClearCartConfirm() {
    clearCartOverlay.classList.add("open");
    clearCartModal.classList.add("open");
    document.body.classList.add("modal-open");
    document.getElementById("cancelClearCart").focus();
}

function closeClearCartConfirm() {
    clearCartOverlay.classList.remove("open");
    clearCartModal.classList.remove("open");
    if (!cartPanel.classList.contains("open")) {
        document.body.classList.remove("modal-open");
    } else {
        document.body.classList.add("modal-open");
    }
}

renderCart();
observeProducts();
loadCatalog();

function observeProducts() {
    document.querySelectorAll(".product").forEach(card => card.classList.add("is-visible"));
}

document.getElementById("filters").addEventListener("click", event => {
    const button = event.target.closest(".filter");
    if (!button) return;
    catalogVisibleCount = catalogPageSize;
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    renderProducts(getVisibleProducts());
    observeProducts();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("searchInput").addEventListener("input", () => {
    catalogVisibleCount = catalogPageSize;
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("sortProducts").addEventListener("change", () => {
    catalogVisibleCount = catalogPageSize;
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("priceMin").addEventListener("input", () => {
    catalogVisibleCount = catalogPageSize;
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("priceMax").addEventListener("input", () => {
    catalogVisibleCount = catalogPageSize;
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("brandFilter").addEventListener("change", () => {
    catalogVisibleCount = catalogPageSize;
    renderProducts(getVisibleProducts());
    observeProducts();
});

document.getElementById("vehicleFilter").addEventListener("input", () => {
    catalogVisibleCount = catalogPageSize;
    renderProducts(getVisibleProducts());
    observeProducts();
});


function resetCatalogFilters() {
    activeCategory = "all";
    catalogVisibleCount = catalogPageSize;
    document.getElementById("searchInput").value = "";
    document.getElementById("priceMin").value = "";
    document.getElementById("priceMax").value = "";
    document.getElementById("brandFilter").value = "all";
    document.getElementById("vehicleFilter").value = "";
    document.getElementById("sortProducts").value = "default";
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.category === "all"));
    renderProducts(getVisibleProducts());
    observeProducts();
}

document.getElementById("resetCatalogFilters").addEventListener("click", resetCatalogFilters);
productGrid.addEventListener("click", event => {
    if (event.target.closest("#emptyResetCatalog")) {
        resetCatalogFilters();
    }
});

productGrid.addEventListener("click", event => {
    const loadMoreButton = event.target.closest("#loadMoreProducts");
    if (loadMoreButton) {
        catalogVisibleCount += catalogPageSize;
        renderProducts(getVisibleProducts());
        observeProducts();
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
        showToast(favorites.has(id) ? "Добавлено в избранное" : "Удалено из избранного");
        document.getElementById("favoriteIcon").textContent = favorites.size ? "♥" : "♡";
        return;
    }

    const cartButton = event.target.closest(".product__cart");
    if (cartButton) {
        const product = products.find(item => item.id === Number(cartButton.dataset.id));
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

productModalContent.addEventListener("click", event => {
    const favoriteButton = event.target.closest("[data-modal-favorite]");
    if (favoriteButton) {
        const id = Number(favoriteButton.dataset.modalFavorite);
        if (favorites.has(id)) favorites.delete(id);
        else favorites.add(id);
        document.getElementById("favoriteIcon").textContent = favorites.size ? "♥" : "♡";
        persistFavorites();
        renderProducts(getVisibleProducts());
        observeProducts();
        openProductModal(id);
        showToast(favorites.has(id) ? "Добавлено в избранное" : "Удалено из избранного");
        return;
    }

    const cartButton = event.target.closest("[data-modal-cart]");
    if (!cartButton) return;
    const product = products.find(item => item.id === Number(cartButton.dataset.modalCart));
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    renderCart();
    closeProductModal();
    openCart();
});

document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
productModalOverlay.addEventListener("click", closeProductModal);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && clearCartModal.classList.contains("open")) {
        closeClearCartConfirm();
        return;
    }
    if (event.key === "Escape" && productModal.classList.contains("open")) {
        closeProductModal();
    }
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
    activeCategory = "all";
    document.getElementById("searchInput").value = "";
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.category === "all"));
    renderProducts(products);
    observeProducts();
});

document.getElementById("favoriteButton").addEventListener("click", () => {
    if (!favorites.size) {
        showToast("В избранном пока пусто");
        return;
    }
    renderProducts(products.filter(product => favorites.has(product.id)));
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    observeProducts();
    showToast(`Избранное: ${favorites.size}`);
});

productGrid.addEventListener("contextmenu", event => {
    const card = event.target.closest(".product");
    if (!card) return;
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
clearCartOverlay.addEventListener("click", closeClearCartConfirm);
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

const header = document.querySelector(".header");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", scrollTop > 36);
    backToTop.classList.toggle("visible", scrollTop > 600);
    scrollProgress.style.width = `${maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0}%`;
}, { passive: true });

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

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

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.getElementById("imageZoomOverlay").classList.contains("open")) {
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
routeFromUrl();