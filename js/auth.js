// Функция регистрации пользователя (асинхронная)
async function registerUser() {
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

    // Генерируем случайную соль и хешируем пароль с помощью PBKDF2
    const salt = crypto.getRandomValues(new Uint8Array(16)); // 16 байт соли
    const hashedPassword = await hashPassword(password, salt);

    // Преобразуем хэш и соль в hex-строки
    const saltHex = Array.from(salt)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    const hashHex = Array.from(hashedPassword)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    // Сохраняем соль и хэш как строки
    users.push({ username, password: { hash: hashHex, salt: saltHex }, avatar: users?.avatar || "" });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Регистрация успешна! Теперь вы можете войти.');
    window.location.href = 'login.html';
}

// Функция входа пользователя (асинхронная)
async function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username);

    if (!user) {
        alert('Неверное имя пользователя или пароль.');
        return;
    }

    // Преобразуем сохраненную соль из hex-строки в Uint8Array
    const salt = new Uint8Array(
        user.password.salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );
    const storedHash = new Uint8Array(
        user.password.hash.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );
    const hashedInput = await hashPassword(password, salt);

    // Сравниваем хэши (безопасное сравнение для защиты от тайминговых атак)
    if (arraysEqual(hashedInput, storedHash)) {
        localStorage.setItem('currentUser', username);
        alert('Вход успешен!');
        window.location.href = 'profile.html';
    } else {
        alert('Неверное имя пользователя или пароль.');
        return;
    }
}

async function changePassword(newPassword) {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('Вы не авторизованы.');
        return false;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex === -1) {
        alert('Пользователь не найден.');
        return false;
    }

    const newSalt = crypto.getRandomValues(new Uint8Array(16));
    const newHashedPassword = await hashPassword(newPassword, newSalt);

    const newSaltHex = Array.from(newSalt)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    const newHashHex = Array.from(newHashedPassword)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    users[userIndex].password = { hash: newHashHex, salt: newSaltHex };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Пароль успешно изменен!');
    return true;
}

async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const derivedKey = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    return new Uint8Array(derivedKey);
}

// Безопасное сравнение массивов (защита от тайминговых атак)
function arraysEqual(a, b) {
    if (a.byteLength !== b.byteLength) return false;
    const view1 = new DataView(a.buffer);
    const view2 = new DataView(b.buffer);
    let result = 0;
    for (let i = 0; i < a.byteLength; i++) {
        result |= view1.getUint8(i) ^ view2.getUint8(i);
    }
    return result === 0;
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
    //updateHeader();
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

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("toggle-password");
    const eyeOpen = document.getElementById("eye-open");
    const eyeClosed = document.getElementById("eye-closed");

    if (passwordInput && toggleBtn && eyeOpen && eyeClosed) {
        toggleBtn.addEventListener("click", () => {
            const isHidden = passwordInput.type === "password";
            passwordInput.type = isHidden ? "text" : "password";
            eyeOpen.style.display = isHidden ? "none" : "inline";
            eyeClosed.style.display = isHidden ? "inline" : "none";
        });
    }
});