// Загрузка корзины из localStorage
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const customDishes = JSON.parse(localStorage.getItem('customDishes') || '[]');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.querySelector('.cart-count');
    let total = 0;

    cartItemsContainer.innerHTML = '';
    cartItems.forEach((item, index) => {
        const quantity = item.quantity || 1; // Если quantity отсутствует, считаем как 1
        const itemTotalPrice = parseInt(item.price) * quantity;
        total += itemTotalPrice;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        let componentsHTML = '';
        if (item.components && Array.isArray(item.components)) {
            componentsHTML = `
                <div class="dish-components">
                    <p><strong>Состав:</strong></p>
                    <ul>
                        ${item.components.map(component => {
                const compTotal = component.price * component.quantity;
                return `<li>${component.name} — ${component.price} руб. x ${component.quantity} = ${compTotal} руб.</li>`;
            }).join('')}
                    </ul>
                </div>
            `;
        }

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <p class="dish-name">${item.name}</p>
                ${componentsHTML}
                <p class="dish-price"><strong>Итог:</strong> ${item.price} руб. x ${quantity} = ${itemTotalPrice} руб.</p>
            </div>
            <button class="remove-item" data-index="${index}">Удалить</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    document.getElementById('cart-total').textContent = total;

    // Подсчет общего количества порций
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const customTotal = customDishes.reduce((sum, dish) => {
        return sum + (dish.components ? dish.components.reduce((s, comp) => s + comp.quantity, 0) : 0);
    }, 0);
    const totalItems = cartTotal + customTotal;
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }

    // Обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            showRemoveConfirmModal(index);
        });
    });
}

// Функция для отображения модального окна подтверждения удаления
function showRemoveConfirmModal(index) {
    const modal = document.getElementById('remove-confirm-modal');
    const confirmBtn = document.getElementById('remove-confirm-btn');
    const cancelBtn = document.getElementById('remove-cancel-btn');
    const closeBtn = document.querySelector('#remove-confirm-modal .modal-close');

    // Получаем информацию о товаре
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const item = cart[index];
    if (!item) {
        console.error('Товар не найден:', index);
        return;
    }

    // Заполняем модальное окно информацией о товаре
    document.getElementById('modal-dish-image').src = item.image;
    document.getElementById('modal-dish-name').textContent = item.name;
    document.getElementById('modal-dish-price').textContent = `${item.price} руб.`;
    document.getElementById('modal-quantity').textContent = item.quantity || 1;

    modal.style.display = 'block';

    // Обработчик для кнопки "Да"
    const confirmHandler = () => {
        const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        cart.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cart));
        loadCart();
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
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            confirmBtn.removeEventListener('click', confirmHandler);
        }
    });
}

// Функция для добавления заказа в историю
function addOrderToHistory(orderId, date, total) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Пожалуйста, войдите в аккаунт.');
        window.location.href = 'login.html';
        return false; // Возвращаем false, если авторизация отсутствует
    }

    const order = { id: orderId, date: date, total: total, user: currentUser };
    let history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    history.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(history));
    return true; // Возвращаем true, если заказ добавлен
}

// Оформление заказа
function confirmOrder() {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }

    // Учитываем количество порций при расчете итога
    const total = cart.reduce((sum, item) => sum + parseInt(item.price) * (item.quantity || 1), 0);
    const orderId = `Заказ #${Date.now()}`;
    const date = new Date().toLocaleString();

    // Проверяем результат addOrderToHistory
    if (!addOrderToHistory(orderId, date, total)) {
        return; // Прерываем выполнение, если авторизация отсутствует
    }

    localStorage.removeItem('cartItems');
    alert('Заказ оформлен! История обновлена.');
    window.location.href = 'profile.html';
}

// Назначение обработчика события
document.getElementById('confirm-order').addEventListener('click', confirmOrder);

// Загрузка корзины при открытии страницы
document.addEventListener('DOMContentLoaded', loadCart);