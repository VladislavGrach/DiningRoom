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
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', loadDishes);
