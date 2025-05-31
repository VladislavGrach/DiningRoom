document.addEventListener('DOMContentLoaded', () => {
    fetch('../data/constructor.json')
        .then(response => response.json())
        .then(data => {
            buildOptions(data);
            initSaveHandler();
        })
        .catch(error => console.error('Ошибка загрузки JSON:', error));
});

function buildOptions(data) {
    buildOptionGroup('garnish-options', data.garnish, 'garnish');
    buildOptionGroup('main-options', data.main, 'main');
    buildSauceOptions('sauce-options', data.sauce);
}

function buildOptionGroup(containerId, items, groupName) {
    const container = document.getElementById(containerId);
    items.forEach(item => {
        const option = document.createElement('div');
        option.className = 'option';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = groupName;
        checkbox.value = item.name;
        checkbox.dataset.price = item.price;

        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${item.name}`));
        option.appendChild(label);

        const quantityContainer = document.createElement('div');
        quantityContainer.className = 'quantity-container';

        const quantityValue = document.createElement('span');
        quantityValue.className = 'quantity-value';
        quantityValue.textContent = '0';
        quantityContainer.appendChild(quantityValue);

        const controls = document.createElement('div');
        controls.className = 'quantity-controls';

        const up = document.createElement('button');
        up.className = 'quantity-increase';
        up.textContent = '▲';

        const down = document.createElement('button');
        down.className = 'quantity-decrease';
        down.textContent = '▼';

        // Обработка нажатия на "увеличить"
        up.addEventListener('click', () => {
            let current = parseInt(quantityValue.textContent);
            current++;
            quantityValue.textContent = current;
            if (current > 0 && !checkbox.checked) {
                checkbox.checked = true;
            }
        });

        // Обработка нажатия на "уменьшить"
        down.addEventListener('click', () => {
            let current = parseInt(quantityValue.textContent);
            if (current > 0) {
                current--;
                quantityValue.textContent = current;
                if (current === 0) {
                    checkbox.checked = false;
                }
            }
        });

        // Обработка нажатия на чекбокс
        checkbox.addEventListener('change', () => {
            if (checkbox.checked && parseInt(quantityValue.textContent) === 0) {
                quantityValue.textContent = '1';
            } else if (!checkbox.checked) {
                quantityValue.textContent = '0';
            }
        });

        controls.appendChild(up);
        controls.appendChild(down);
        quantityContainer.appendChild(controls);
        option.appendChild(quantityContainer);

        container.appendChild(option);
    });
}


function buildSauceOptions(containerId, sauces) {
    const container = document.getElementById(containerId);
    sauces.forEach((sauce, i) => {
        const option = document.createElement('div');
        option.className = 'option';

        const label = document.createElement('label');
        label.innerHTML = `
            <input type="radio" name="sauce" value="${sauce.name}" data-price="${sauce.price}" ${sauce.name.toLowerCase() === 'нет' ? 'checked' : ''}> 
            ${sauce.name}
        `;
        option.appendChild(label);
        container.appendChild(option);
    });
}

function initSaveHandler() {
    const modal = document.getElementById('confirm-modal');
    const saveButton = document.getElementById('save-dish');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const closeBtn = document.querySelector('.modal-close');

    saveButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    confirmBtn.addEventListener('click', () => {
        const dish = collectSelectedDish();
        if (!dish) {
            alert('Пожалуйста, выберите хотя бы один компонент перед сохранением.');
            return;
        }
        addToCart(dish);
        modal.style.display = 'none';
    });

    updateCartCount();
}

function collectSelectedDish() {
    const dish = {
        name: 'Второе',
        components: [],
        quantity: 1,
        price: 0,
        image: '/images/categories/второе.png'
    };

    ['garnish', 'main'].forEach(group => {
        document.querySelectorAll(`input[name="${group}"]:checked`).forEach(input => {
            const name = input.value;
            const price = parseInt(input.dataset.price || '0');
            const quantity = parseInt(input.closest('.option').querySelector('.quantity-value').textContent);

            if (quantity > 0) {
                dish.components.push({ category: group, name, quantity, price });
                dish.price += price * quantity;
            }
        });
    });

    const selectedSauce = document.querySelector('input[name="sauce"]:checked');
    if (selectedSauce && selectedSauce.value.toLowerCase() !== 'нет') {
        const name = selectedSauce.value;
        const price = parseInt(selectedSauce.dataset.price || '0');
        dish.components.push({ category: 'sauce', name, quantity: 1, price });
        dish.price += price;
    }

    // Проверка: ничего не выбрано
    if (dish.components.length === 0) {
        return null;
    }

    return dish;
}

function addToCart(dish) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartItems.push(dish);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    alert('Блюдо добавлено в корзину!');
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById('cart-count').textContent = count;
}
