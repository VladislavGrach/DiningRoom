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
    window.location.href = 'login.html';
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
    window.location.href = 'profile.html';
}

// Выход из аккаунта
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Проверка авторизации
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && window.location.pathname.includes('profile.html')) {
        window.location.href = 'login.html';
    }
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'profile.html';
    }
    if (currentUser && window.location.pathname.includes('register.html')) {
        window.location.href = 'profile.html';
    }
    updateHeader();
}

// Обновление шапки в зависимости от авторизации
function updateHeader() {
    const currentUser = localStorage.getItem('currentUser');
    const profileButton = document.querySelector('.profile-button');
    if (currentUser) {
        profileButton.textContent = 'Профиль';
        profileButton.onclick = () => window.location.href = 'profile.html';
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Выход';
        logoutButton.className = 'profile-button';
        logoutButton.onclick = logoutUser;
        document.querySelector('.header-buttons').appendChild(logoutButton);
    } else {
        profileButton.textContent = 'Вход';
        profileButton.onclick = () => window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);