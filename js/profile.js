document.addEventListener("DOMContentLoaded", () => {
    console.log('DOMContentLoaded сработал');

    // Проверяем базовые элементы
    const loginDisplay = document.getElementById("nickname-text");
    const currentUser = localStorage.getItem("currentUser");
    console.log('currentUser:', currentUser);
    if (loginDisplay && currentUser) {
        loginDisplay.textContent = currentUser;
    } else {
        console.log('loginDisplay или currentUser не найдены:', { loginDisplay, currentUser });
    }

    // Проверяем logout-button
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        console.log('logout-button найден');
        logoutButton.addEventListener("click", () => {
            console.log('logout-button нажат');
            if (confirm("Вы действительно хотите выйти?")) {
                localStorage.removeItem("currentUser");
                window.location.href = "login.html";
            }
        });
    } else {
        console.error('Кнопка с id="logout-button" не найдена');
    }

    // Проверяем элементы для смены пароля
    const passwordPlaceholder = document.getElementById("password-placeholder");
    const newPasswordInput = document.getElementById("new-password");
    const repeatPasswordInput = document.getElementById("repeat-password");
    const editPasswordBtn = document.getElementById("edit-password");
    const savePasswordBtn = document.getElementById("save-password");
    const confirmGroup = document.getElementById("confirm-password-group");
    const toggleBtn = document.getElementById("toggle-password");

    console.log('Элементы для смены пароля:', {
        passwordPlaceholder,
        newPasswordInput,
        repeatPasswordInput,
        editPasswordBtn,
        savePasswordBtn,
        confirmGroup,
        toggleBtn
    });

    if (!savePasswordBtn) {
        console.error('Кнопка с id="save-password" не найдена');
        return;
    }

    // Проверка сложности пароля
    function isPasswordStrong(pw) {
        return pw.length >= 6 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
    }

    // Обработчик для кнопки "Сохранить"
    savePasswordBtn.addEventListener("click", async () => {
        console.log('Кнопка "save-password" нажата');
        try {
            const newPassword = newPasswordInput.value.trim();
            const repeatPassword = repeatPasswordInput.value.trim();

            if (!newPassword || !repeatPassword) {
                alert("Поля не могут быть пустыми.");
                return;
            }

            if (newPassword !== repeatPassword) {
                alert("Пароли не совпадают.");
                return;
            }

            if (!isPasswordStrong(newPassword)) {
                alert("Пароль должен содержать минимум 6 символов, буквы и цифры.");
                return;
            }

            const success = await changePassword(newPassword);
            if (success) {
                newPasswordInput.value = "";
                repeatPasswordInput.value = "";
                newPasswordInput.style.display = "none";
                confirmGroup.style.display = "none";
                passwordPlaceholder.style.display = "inline-block";
                editPasswordBtn.style.display = "inline-block";
                toggleBtn.textContent = "👁";
                alert("Пароль обновлён.");
            }
        } catch (error) {
            console.error('Ошибка при смене пароля:', error);
            alert('Произошла ошибка при смене пароля.');
        }
    });

    // Показать поля
    if (editPasswordBtn) {
        editPasswordBtn.addEventListener("click", () => {
            console.log('Кнопка "edit-password" нажата');
            passwordPlaceholder.style.display = "none";
            newPasswordInput.style.display = "inline-block";
            editPasswordBtn.style.display = "none";
            confirmGroup.style.display = "flex";
        });
    }

    // Показать/скрыть пароль
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            console.log('Кнопка "toggle-password" нажата');
            const isHidden = newPasswordInput.type === "password";
            newPasswordInput.type = isHidden ? "text" : "password";
            repeatPasswordInput.type = isHidden ? "text" : "password";
            toggleBtn.textContent = isHidden ? "🙈" : "👁";
        });
    }

    const avatarImg = document.querySelector(".profile-img");
    const changeAvatarBtn = document.getElementById("change-avatar-btn");
    const avatarInput = document.getElementById("avatar-input");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userData = users.find(u => u.username === currentUser);
    if (userData && userData.avatar) {
        avatarImg.src = userData.avatar;
    }

    changeAvatarBtn.addEventListener("click", () => {
        avatarInput.click(); // открываем файловый диалог
    });

    avatarInput.addEventListener("change", () => {
        const file = avatarInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const dataURL = event.target.result;
            avatarImg.src = dataURL;

            // сохраняем аватар в localStorage
            if (userData) {
                userData.avatar = dataURL;
                const updatedUsers = users.map(u => u.username === currentUser ? userData : u);
                localStorage.setItem("users", JSON.stringify(updatedUsers));
            }
        };
        reader.readAsDataURL(file);
    });

});