// Регистрация нового пользователя
function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.username === username)) {
        alert('Пользователь с таким именем уже существует.');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Регистрация успешна! Теперь вы можете войти.');
    window.location.href = 'login.html'; // Путь для страниц в папке html
}

// Вход пользователя
function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        alert('Неверное имя пользователя или пароль.');
        return;
    }

    localStorage.setItem('currentUser', username);
    alert('Вход успешен!');
    window.location.href = 'profile.html'; // Путь для страниц в папке html
}

// Выход из аккаунта
function logoutUser() {
    localStorage.removeItem('currentUser');
    alert('Вы вышли из аккаунта.');
    window.location.href = 'login.html'; // Путь для страниц в папке html
}

// Проверка авторизации
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const path = window.location.pathname;

    // Проверка для страниц, требующих авторизации
    if (!currentUser) {
        if (path.includes('profile.html') || path.includes('cart.html')) {
            alert('Пожалуйста, сначала авторизуйтесь.');
            window.location.href = path.includes('html/') ? 'login.html' : 'html/login.html';
            return false;
        }
    }

    // Перенаправление с login/register, если пользователь уже авторизован
    if (currentUser && (path.includes('login.html') || path.includes('register.html'))) {
        window.location.href = path.includes('html/') ? 'profile.html' : 'html/profile.html';
        return false;
    }

    updateHeader();
    return true;
}

// Обновление шапки в зависимости от авторизации
function updateHeader() {
    const currentUser = localStorage.getItem('currentUser');
    const profileBtn = document.getElementById('profile-btn');
    const headerButtons = document.querySelector('.header-buttons');

    if (!profileBtn) {
        console.error('Элемент с id="profile-btn" не найден!');
        return;
    }

    // Удаляем старую кнопку выхода, если она есть
    const existingLogout = document.querySelector('.logout-btn.header');
    if (existingLogout) headerButtons.removeChild(existingLogout);

    // Определяем базовый путь в зависимости от текущей страницы
    const basePath = window.location.pathname.includes('html/') ? '' : 'html/';

    if (currentUser) {
        profileBtn.textContent = 'Профиль';
        profileBtn.onclick = () => window.location.href = basePath + 'profile.html';
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Выход';
        logoutBtn.className = 'profile-button logout-btn header';
        logoutBtn.onclick = logoutUser;
        headerButtons.appendChild(logoutBtn);
    } else {
        profileBtn.textContent = 'Вход';
        profileBtn.onclick = () => window.location.href = basePath + 'login.html';
        if (existingLogout) headerButtons.removeChild(existingLogout);
    }
    console.log('Шапка обновлена, currentUser:', currentUser);
}

document.addEventListener('DOMContentLoaded', checkAuth);