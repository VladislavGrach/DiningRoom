class CustomDish {
    constructor(garnishes, mains, sauce) {
        this.garnishes = garnishes; // Объект {name: quantity}
        this.mains = mains;         // Объект {name: quantity}
        this.sauce = sauce;         // Соус/масло/нет
        this.id = Date.now();       // Уникальный ID
    }
}

function updateCartCount() {
    const customDishes = JSON.parse(localStorage.getItem('customDishes') || '[]');
    const totalItems = customDishes.length;
    document.getElementById('cart-count').textContent = totalItems;
}

function initializeQuantities() {
    document.querySelectorAll('.option').forEach(option => {
        const quantityContainer = option.querySelector('.quantity-container');
        const decreaseBtn = quantityContainer.querySelector('.quantity-decrease');
        const increaseBtn = quantityContainer.querySelector('.quantity-increase');
        const quantityValue = quantityContainer.querySelector('.quantity-value');

        decreaseBtn.addEventListener('click', () => {
            let value = parseInt(quantityValue.textContent);
            if (value > 1) {
                quantityValue.textContent = value - 1;
            }
        });

        increaseBtn.addEventListener('click', () => {
            let value = parseInt(quantityValue.textContent);
            quantityValue.textContent = value + 1;
        });
    });
}

function saveDish() {
    const garnishes = {};
    document.querySelectorAll('input[name="garnish"]:checked').forEach(input => {
        const quantity = parseInt(input.closest('.option').querySelector('.quantity-value').textContent);
        garnishes[input.value] = quantity;
    });

    const mains = {};
    document.querySelectorAll('input[name="main"]:checked').forEach(input => {
        const quantity = parseInt(input.closest('.option').querySelector('.quantity-value').textContent);
        mains[input.value] = quantity;
    });

    const sauce = document.querySelector('input[name="sauce"]:checked').value;

    if (Object.keys(garnishes).length === 0 || Object.keys(mains).length === 0) {
        alert('Выберите хотя бы один гарнир и одну основу!');
        return;
    }

    const dish = new CustomDish(garnishes, mains, sauce);
    const customDishes = JSON.parse(localStorage.getItem('customDishes') || '[]');
    customDishes.push(dish);
    localStorage.setItem('customDishes', JSON.stringify(customDishes));

    updateCartCount();
    alert('Блюдо сохранено в корзину!');
}


document.addEventListener('DOMContentLoaded', () => {
    initializeQuantities();
    document.getElementById('save-dish').addEventListener('click', saveDish);
    updateCartCount();
});
