document.addEventListener('DOMContentLoaded', () => {
    fetch('../data/constructor.json')
        .then(response => response.json())
        .then(data => {
            window.constructorData = data;
            buildOptions(data);
            initSaveHandler();
        })
        .catch(error => console.error('Ошибка загрузки JSON:', error));

    document.getElementById('sort-garnish').addEventListener('change', (e) => {
        sortAndRebuild('garnish-options', 'garnish', e.target.value);
    });

    document.getElementById('sort-main').addEventListener('change', (e) => {
        sortAndRebuild('main-options', 'main', e.target.value);
    });
});

function buildOptions(data) {
    buildOptionGroup('garnish-options', data.garnish, 'garnish');
    buildOptionGroup('main-options', data.main, 'main');
    buildSauceOptions('sauce-options', data.sauce);
}

function buildOptionGroup(containerId, items, groupName) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const option = document.createElement('div');
        option.className = 'option';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = groupName;
        checkbox.value = item.name;
        checkbox.dataset.price = item.price;

        const label = document.createElement('label');
        label.innerHTML = `${item.name} — ${item.price}₽`;
        label.prepend(checkbox);
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

        up.addEventListener('click', () => {
            let current = parseInt(quantityValue.textContent);
            current++;
            quantityValue.textContent = current;
            if (current > 0 && !checkbox.checked) {
                checkbox.checked = true;
            }
        });

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
    container.innerHTML = '';

    sauces.forEach(sauce => {
        const option = document.createElement('div');
        option.className = 'option';

        const label = document.createElement('label');
        label.innerHTML = `
            <input type="radio" name="sauce" value="${sauce.name}" data-price="${sauce.price}" ${sauce.name.toLowerCase() === 'нет' ? 'checked' : ''}> 
            ${sauce.name} — ${sauce.price}₽
        `;
        option.appendChild(label);
        container.appendChild(option);
    });
}

function sortAndRebuild(containerId, groupName, sortType) {
    let items = [...window.constructorData[groupName]];

    switch (sortType) {
        case 'price-asc':
            items.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            items.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            items.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            items.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    buildOptionGroup(containerId, items, groupName);
}

function initSaveHandler() {
    const modal = document.getElementById('confirm-modal');
    const saveButton = document.getElementById('save-dish');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const closeBtn = document.querySelector('.modal-close');

    saveButton.addEventListener('click', () => {
        const dish = collectSelectedDish();
        if (!dish) {
            alert('Пожалуйста, выберите хотя бы один компонент перед сохранением.');
            return;
        }

        document.getElementById('modal-dish-image').src = dish.image;
        document.getElementById('modal-dish-price').textContent = dish.price + ' ₽';
        document.getElementById('modal-quantity').textContent = dish.quantity;

        const componentList = document.getElementById('modal-dish-components');
        componentList.innerHTML = '';
        dish.components.forEach(comp => {
            const li = document.createElement('li');
            li.textContent = `${comp.name} (${comp.quantity} × ${comp.price}₽)`;
            componentList.appendChild(li);
        });

        modal.dataset.dish = JSON.stringify(dish);
        modal.style.display = 'block';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    confirmBtn.addEventListener('click', () => {
        const dish = JSON.parse(modal.dataset.dish || '{}');
        const newQuantity = parseInt(document.getElementById('modal-quantity').textContent);
        dish.quantity = newQuantity;
        addToCart(dish);
        modal.style.display = 'none';
    });

    document.querySelector('.quantity-increase').addEventListener('click', () => {
        let quantityEl = document.getElementById('modal-quantity');
        let quantity = parseInt(quantityEl.textContent) + 1;
        quantityEl.textContent = quantity;
    });

    document.querySelector('.quantity-decrease').addEventListener('click', () => {
        let quantityEl = document.getElementById('modal-quantity');
        let quantity = parseInt(quantityEl.textContent);
        if (quantity > 1) {
            quantityEl.textContent = quantity - 1;
        }
    });

    // Закрытие модального окна при клике вне области
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
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

    return dish.components.length === 0 ? null : dish;
}

function addToCart(dish) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartItems.push(dish);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    alert('Блюдо добавлено в корзину!');
}

function updateCartCount() {
    const customDishes = JSON.parse(localStorage.getItem('customDishes') || '[]');
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        console.log('Обновление счетчика корзины...');
        console.log('customDishes:', customDishes);
        console.log('cartItems:', cartItems);
        // Подсчет количества порций для customDishes
        const customTotal = customDishes.reduce((sum, dish) => {
            return sum + dish.components.reduce((s, comp) => s + comp.quantity, 0);
        }, 0);
        // Подсчет количества порций для cartItems
        const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        // Общее количество порций
        const totalItems = customTotal + cartTotal;
        console.log('customTotal:', customTotal, 'cartTotal:', cartTotal, 'totalItems:', totalItems);
        cartCountElement.textContent = totalItems;
    } else {
        console.error('Элемент #cart-count не найден!');
    }
}