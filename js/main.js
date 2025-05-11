class Category {
    constructor(id, name, link) {
        this.id = id;
        this.name = name;
        this.link = link;
    }
}

function loadCategories() {
    const categories = [
        new Category(1, "Супы", "html/dish.html?category=soups"),
        new Category(2, "Второе", "html/constructor.html"),
        new Category(3, "Закуски", "html/dish.html?category=snacks"),
        new Category(4, "Выпечка", "html/dish.html?category=bakery"),
        new Category(5, "Напитки", "html/dish.html?category=drinks"),
        new Category(6, "Другое", "html/dish.html?category=other"),
    ];
    displayCategories(categories);
}

function displayCategories(categories) {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    categories.forEach(category => {
        const tile = document.createElement('div');
        tile.className = 'category-tile';
        tile.innerHTML = `
            <img src="images/categories/${category.name.toLowerCase()}.png" alt="${category.name}">
            <p>${category.name}</p>
        `;
        tile.addEventListener('click', () => {
            window.location.href = category.link;
        });
        container.appendChild(tile);
    });
}

function updateCartCount() {
    let cartCount = localStorage.getItem('cartCount');
    if (!cartCount) {
        cartCount = 0;
        localStorage.setItem('cartCount', cartCount);
    }
    document.getElementById('cart-count').textContent = cartCount;
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    updateCartCount();
});