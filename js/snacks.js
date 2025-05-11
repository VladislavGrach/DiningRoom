class CustomSalad {
    constructor(name, quantity, sauce) {
        this.name = name;           // Название салата
        this.quantity = quantity;   // Количество
        this.sauce = sauce;         // Заправка
        this.id = Date.now();       // Уникальный ID
    }
}

function updateCartCount() {
    const customSalads = JSON.parse(localStorage.getItem('customSalads') || '[]');
    const totalItems = customSalads.reduce((sum, salad) => sum + salad.quantity, 0);
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

function saveSalad() {
    const selectedSalads = document.querySelectorAll('input[name="salad"]:checked');
    if (selectedSalads.length === 0) {
        alert('Выберите хотя бы один салат!');
        return;
    }

    const sauce = document.querySelector('input[name="sauce"]:checked').value;
    const customSalads = JSON.parse(localStorage.getItem('customSalads') || '[]');

    selectedSalads.forEach(saladInput => {
        const quantity = parseInt(saladInput.closest('.option').querySelector('.quantity-value').textContent);
        const salad = new CustomSalad(saladInput.value, quantity, sauce);
        customSalads.push(salad);
    });

    localStorage.setItem('customSalads', JSON.stringify(customSalads));
    updateCartCount();
    alert('Салаты сохранены в корзину!');
}

document.addEventListener('DOMContentLoaded', () => {
    initializeQuantities();
    document.getElementById('save-dish').addEventListener('click', saveSalad);
    updateCartCount();
});