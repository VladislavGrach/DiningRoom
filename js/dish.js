const categoryParam = new URLSearchParams(window.location.search).get('category');

const dictionary = {
    "soups": "Супы",
    "snacks": "Закуски",
    "bakery": "Выпечка",
    "drinks": "Напитки",
    "other": "Другое",
};

let currentDishes = [];

async function loadDishes() {
    try {
        const path = `../data/${categoryParam}.json`;
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        currentDishes = await response.json();
        document.getElementById('category-title').textContent = dictionary[categoryParam];
        displayDishes(currentDishes);
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

function sortAndDisplayDishes(criteria) {
    let sorted = [...currentDishes];
    switch (criteria) {
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        default:
            break;
    }
    displayDishes(sorted);
}

function showConfirmModal(dish) {
    const modal = document.getElementById('confirm-modal');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const closeBtn = document.querySelector('.modal-close');

    const dishImage = document.getElementById('modal-dish-image');
    const dishName = document.getElementById('modal-dish-name');
    const dishPrice = document.getElementById('modal-dish-price');
    const quantityValue = document.getElementById('modal-quantity');
    const increaseBtn = modal.querySelector('.quantity-increase');
    const decreaseBtn = modal.querySelector('.quantity-decrease');

    dishImage.src = dish.image;
    dishImage.alt = dish.name;
    dishName.textContent = dish.name;
    dishPrice.textContent = `${dish.price} руб.`;
    quantityValue.textContent = '1';

    const updateQuantity = () => {
        let value = parseInt(quantityValue.textContent);
        if (value < 1) {
            value = 1;
            quantityValue.textContent = value;
        }
        return value;
    };

    increaseBtn.onclick = () => {
        let value = parseInt(quantityValue.textContent);
        quantityValue.textContent = value + 1;
    };

    decreaseBtn.onclick = () => {
        let value = parseInt(quantityValue.textContent);
        if (value > 1) {
            quantityValue.textContent = value - 1;
        }
    };

    modal.style.display = 'block';

    const confirmHandler = () => {
        const quantity = updateQuantity();
        addToCart(dish, quantity);
        modal.style.display = 'none';
        confirmBtn.removeEventListener('click', confirmHandler);
    };

    const cancelHandler = () => {
        modal.style.display = 'none';
        confirmBtn.removeEventListener('click', confirmHandler);
    };

    confirmBtn.addEventListener('click', confirmHandler);
    cancelBtn.addEventListener('click', cancelHandler);
    closeBtn.addEventListener('click', cancelHandler);

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            confirmBtn.removeEventListener('click', confirmHandler);
        }
    };
}

function addToCart(dish, quantity) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const dishWithQuantity = { ...dish, quantity };
    cartItems.push(dishWithQuantity);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    alert(`${dish.name} (${quantity} порций) добавлен в корзину!`);
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById('cart-count').textContent = totalItems;
}

document.addEventListener('DOMContentLoaded', () => {
    loadDishes();
    updateCartCount();

    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        sortAndDisplayDishes(e.target.value);
    });
});
