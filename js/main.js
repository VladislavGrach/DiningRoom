class Category {
    constructor(id, name, link) {
        this.id = id;
        this.name = name;
        this.link = link;
    }
}

function loadCategories() {
    const categories = [
        new Category(1, "Супы", "html/soups.html"),
        new Category(2, "Второе", "html/constructor.html"),
        new Category(3, "Закуски", "html/snacks.html"),
        new Category(4, "Напитки", "html/drinks.html"),
        new Category(5, "Другое", "html/other.html")
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
            <img src="images/${category.name.toLowerCase()}.jpg" alt="${category.name}">
            <p>${category.name}</p>
        `;
        tile.addEventListener('click', () => {
            window.location.href = category.link;
        });
        container.appendChild(tile);
    });
}

document.addEventListener('DOMContentLoaded', loadCategories);