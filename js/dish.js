const categoryParam = new URLSearchParams(window.location.search).get('category');

const dictionary = {
    "soups": "Супы",
    "snacks": "Закуски",
    "bakery": "Выпечка",
    "drinks": "Напитки",
    "other": "Другое",
}

async function loadDishes() {
    try {
        const path = `../data/${categoryParam}.json`;
        console.log('Загрузка:', path);

        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dishes = await response.json();
        document.getElementById('category-title').textContent = dictionary[categoryParam];
        displayDishes(dishes);
    } catch (err) {
        console.error('Ошибка загрузки блюд:', err);
        document.getElementById('category-title').textContent = 'Категория не найдена';
    }
}

function displayDishes(dishes) {
    const container = document.getElementById('dishes-container');
    container.innerHTML = '';
    dishes.forEach(dish => {
        const card = document.createElement('div');
        card.className = 'dish-tile';
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p class="dish-name">${dish.name}</p>
            <p class="dish-price">${dish.price} руб.</p>
        `;
        card.addEventListener('click', () => showConfirmModal(dish));
        container.appendChild(card);
    });
}

function showConfirmModal(dish) {
    const modal = document.getElementById('confirm-modal');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const closeBtn = document.querySelector('.modal-close');

    modal.style.display = 'block';

    // Обработчик для кнопки "Да"
    const confirmHandler = () => {
        addToCart(dish);
        modal.style.display = 'none';
        confirmBtn.removeEventListener('click', confirmHandler);
    };

    // Обработчик для кнопки "Нет" и крестика
    const cancelHandler = () => {
        modal.style.display = 'none';
        confirmBtn.removeEventListener('click', confirmHandler);
    };

    confirmBtn.addEventListener('click', confirmHandler);
    cancelBtn.addEventListener('click', cancelHandler);
    closeBtn.addEventListener('click', cancelHandler);

    // Закрытие модального окна при клике вне контента
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            confirmBtn.removeEventListener('click', confirmHandler);
        }
    };
}

function addToCart(dish) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartItems.push(dish);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    alert(`${dish.name} добавлен в корзину!`);
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    document.getElementById('cart-count').textContent = cartItems.length;
}

document.addEventListener('DOMContentLoaded', () => {
    loadDishes();
    updateCartCount();
});