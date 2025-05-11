const categoryParam = new URLSearchParams(window.location.search).get('category');

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

async function loadDishes() {
    try {
        const response = await fetch(`../data/${categoryParam}.json`);
        const dishes = await response.json();

        document.getElementById('category-title').textContent = capitalize(categoryParam);
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
