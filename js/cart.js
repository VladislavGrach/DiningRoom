// Загрузка корзины из localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    let total = 0;

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p class="dish-name">${item.name}</p>
            <p class="dish-price">${item.price} руб.</p>
        `;
        cartItems.appendChild(cartItem);
        total += parseInt(item.price);
    });

    document.getElementById('cart-total').textContent = total;
    cartCount.textContent = cart.length;
}

// Функция для добавления заказа в историю
function addOrderToHistory(orderId, date, total) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Пожалуйста, войдите в аккаунт.');
        window.location.href = 'login.html';
        return;
    }

    const order = { id: orderId, date: date, total: total, user: currentUser };
    let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    history.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(history));
}

// Оформление заказа
function confirmOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
    const orderId = `Заказ #${Date.now()}`;
    const date = new Date().toLocaleString();

    addOrderToHistory(orderId, date, total);
    localStorage.removeItem('cart');
    alert('Заказ оформлен! История обновлена.');
    window.location.href = 'profile.html';
}

// Загрузка корзины при открытии страницы
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        loadCart();
    }
});