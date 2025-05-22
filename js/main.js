class Category {
    constructor(id, name, link) {
        this.id = id;
        this.name = name;
        this.link = link;
    }
}

function loadCategories() {
    const categories = [
        new Category(1, "Супы", "html/dish.html?category=soups"),
        new Category(2, "Второе", "html/constructor.html"),
        new Category(3, "Закуски", "html/dish.html?category=snacks"),
        new Category(4, "Выпечка", "html/dish.html?category=bakery"),
        new Category(5, "Напитки", "html/dish.html?category=drinks"),
        new Category(6, "Другое", "html/dish.html?category=other"),
    ];
    displayCategories(categories);
}

function displayCategories(categories) {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    categories.forEach(category => {
        const tile = document.createElement('div');
        tile.className = 'category-tile';
        tile.innerHTML = `
            <img src="images/categories/${category.name.toLowerCase()}.png" alt="${category.name}">
            <p>${category.name}</p>
        `;
        tile.addEventListener('click', () => {
            window.location.href = category.link;
        });
        container.appendChild(tile);
    });
}

function updateCartCount() {
    let cartCount = localStorage.getItem('cartCount');
    if (!cartCount) {
        cartCount = 0;
        localStorage.setItem('cartCount', cartCount);
    }
    document.getElementById('cart-count').textContent = cartCount;
}

// Функция для загрузки истории заказов из localStorage
function loadOrderHistory() {
    const history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const historyContent = document.querySelector('.history-content');
    historyContent.innerHTML = ''; // Очищаем текущую историю
    history.forEach(order => {
        const p = document.createElement('p');
        p.textContent = `${order.id} ${order.date} Итог: ${order.total} руб.`;
        historyContent.appendChild(p);
    });
}

// Функция для добавления нового заказа в историю
function addOrderToHistory(orderId, date, total) {
    const order = { id: orderId, date: date, total: total };
    let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    history.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(history));
    loadOrderHistory(); // Обновляем отображение
}

// Пример вызова (можно привязать к кнопке или другому событию)
function simulateOrder() {
    const orderId = `Заказ #${Math.floor(Math.random() * 1000)}`;
    const date = new Date().toLocaleString();
    const total = Math.floor(Math.random() * 1000) + 100; // Случайная сумма
    addOrderToHistory(orderId, date, total);
}

// Функция для загрузки истории заказов из localStorage
function loadOrderHistory() {
    const currentUser = localStorage.getItem('currentUser');
    let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    history = history.filter(order => order.user === currentUser);
    const historyContent = document.querySelector('.history-content');
    historyContent.innerHTML = '';
    history.forEach(order => {
        const p = document.createElement('p');
        p.textContent = `${order.id} ${order.date} Итог: ${order.total} руб.`;
        historyContent.appendChild(p);
    });
}

// Загружаем историю при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadOrderHistory();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelector('.cart-count').textContent = cart.length;
});

// Загружаем историю при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadOrderHistory();
    // Пример: можно привязать simulateOrder к кнопке
    document.querySelector('.cart-button')?.addEventListener('click', simulateOrder);
});

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    updateCartCount();
});