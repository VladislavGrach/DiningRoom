class CustomDish {
    constructor(garnishes, mains, sauce) {
        this.garnishes = garnishes; // Объект {name: quantity}
        this.mains = mains;         // Объект {name: quantity}
        this.sauce = sauce;         // Соус/масло/нет
        this.id = Date.now();       // Уникальный ID
        this.name = "Кастомное второе"; // Название для корзины
        this.price = this.calculatePrice(); // Рассчитываем цену
    }

    calculatePrice() {
        // Пример расчета цены: 100 руб за каждый гарнир и 200 руб за каждую основу
        const garnishPrice = Object.values(this.garnishes).reduce((sum, qty) => sum + qty * 100, 0);
        const mainPrice = Object.values(this.mains).reduce((sum, qty) => sum + qty * 200, 0);
        const saucePrice = this.sauce === "нет" ? 0 : 30; // 30 руб за соус или масло
        return garnishPrice + mainPrice + saucePrice;
    }
}

function updateCartCount() {
    const customDishes = JSON.parse(localStorage.getItem('customDishes') || '[]');
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        // Подсчет количества порций для customDishes
        const customTotal = customDishes.reduce((sum, dish) => {
            const garnishQty = Object.values(dish.garnishes).reduce((s, q) => s + q, 0);
            const mainQty = Object.values(dish.mains).reduce((s, q) => s + q, 0);
            return sum + garnishQty + mainQty;
        }, 0);
        // Подсчет количества порций для cartItems
        const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        // Общее количество порций
        const totalItems = customTotal + cartTotal;
        cartCountElement.textContent = totalItems;
    }
}

function initializeQuantities() {
    document.querySelectorAll('.option').forEach(option => {
        const quantityContainer = option.querySelector('.quantity-container');
        const decreaseBtn = quantityContainer.querySelector('.quantity-decrease');
        const increaseBtn = quantityContainer.querySelector('.quantity-increase');
        const quantityValue = option.querySelector('.quantity-value');

        if (!quantityValue || !decreaseBtn || !increaseBtn) {
            console.error('Не найдены элементы управления количеством:', option);
            return;
        }

        decreaseBtn.addEventListener('click', () => {
            let value = parseInt(quantityValue.textContent);
            if (value > 1) { // Минимальное значение 1
                quantityValue.textContent = value - 1;
            }
        });

        increaseBtn.addEventListener('click', () => {
            let value = parseInt(quantityValue.textContent);
            quantityValue.textContent = value + 1;
        });
    });
}

function showConfirmModal(dish) {
    console.log('Открытие модального окна для блюда:', dish);

    const modal = document.getElementById('confirm-modal');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal || !confirmBtn || !cancelBtn || !closeBtn) {
        console.error('Не найдены элементы модального окна:', { modal, confirmBtn, cancelBtn, closeBtn });
        return;
    }

    modal.style.display = 'block';
    console.log('Модальное окно отображено, display:', modal.style.display);
    console.log('Стили модального окна:', window.getComputedStyle(modal).display);

    // Обработчик для кнопки "Да"
    const confirmHandler = () => {
        console.log('Подтверждение: блюдо добавляется в корзину');
        saveDishToCart(dish);
        modal.style.display = 'none';
        confirmBtn.removeEventListener('click', confirmHandler);
    };

    // Обработчик для кнопки "Нет" и крестика
    const cancelHandler = () => {
        console.log('Отмена: модальное окно закрывается');
        modal.style.display = 'none';
        confirmBtn.removeEventListener('click', confirmHandler);
    };

    confirmBtn.addEventListener('click', confirmHandler);
    cancelBtn.addEventListener('click', cancelHandler);
    closeBtn.addEventListener('click', cancelHandler);

    // Закрытие модального окна при клике вне контента
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            console.log('Закрытие модального окна кликом вне контента');
            modal.style.display = 'none';
            confirmBtn.removeEventListener('click', confirmHandler);
        }
    });
}

function saveDish() {
    console.log('Функция saveDish вызвана');

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

    const sauce = document.querySelector('input[name="sauce"]:checked')?.value;

    if (!sauce) {
        console.error('Соус не выбран');
        alert('Пожалуйста, выберите соус!');
        return;
    }

    if (Object.keys(garnishes).length === 0 || Object.keys(mains).length === 0) {
        console.log('Ошибка: не выбран гарнир или основа');
        alert('Выберите хотя бы один гарнир и одну основу!');
        return;
    }

    const dish = new CustomDish(garnishes, mains, sauce);
    console.log('Блюдо создано:', dish);
    showConfirmModal(dish);
}

function saveDishToCart(dish) {
    console.log('Сохранение блюда в корзину:', dish);
    const customDishes = JSON.parse(localStorage.getItem('customDishes') || '[]');
    customDishes.push(dish);
    localStorage.setItem('customDishes', JSON.stringify(customDishes));
    updateCartCount();
    alert('Блюдо сохранено в корзину!');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена, инициализация...');
    initializeQuantities();
    const saveDishButton = document.getElementById('save-dish');
    if (saveDishButton) {
        saveDishButton.addEventListener('click', saveDish);
        console.log('Обработчик для кнопки "Сохранить блюдо" установлен');
    } else {
        console.error('Кнопка с id="save-dish" не найдена');
    }
    updateCartCount();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Загрузка constructor.html, обновление счетчика...');
    updateCartCount();
    // Добавляем отладочную информацию
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const customDishes = JSON.parse(localStorage.getItem('customDishes') || '[]');
    console.log('cartItems:', cartItems);
    console.log('customDishes:', customDishes);
});