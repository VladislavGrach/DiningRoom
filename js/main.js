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
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountElement.textContent = totalItems;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

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

// Функция для добавления нового заказа в историю
function addOrderToHistory(orderId, date, total) {
    const order = { id: orderId, date: date, total: total };
    let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    history.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(history));
    loadOrderHistory(); // Обновляем отображение
}

// Функция для загрузки истории заказов из localStorage с фильтром по пользователю
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
    loadCategories();
    updateCartCount();
});

document.addEventListener('DOMContentLoaded', () => {
    loadOrderHistory();
    document.querySelector('.cart-button')?.addEventListener('click', simulateOrder);
});

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    updateCartCount();
});