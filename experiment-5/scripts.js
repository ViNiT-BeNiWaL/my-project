
const products = [
    { name: 'laptop', category: 'electronics' },
    { name: 'T-shirt', category: 'clothing' },
    { name: 'Headphones', category: 'electronics' },
    { name: 'Jeans', category: 'clothing' },
    { name: 'novel', category: 'books' },
    { name: 'Cookbook', category: 'books' },
];

const productlistContainer = document.getElementById('product-list');

function filterProducts() {
    const selectedCategory = document.getElementById('filter').value;
    
    let htmlContent = ''; 

    products.forEach((productItem) => {
        if (selectedCategory === 'all' || productItem.category === selectedCategory) {
            htmlContent += `<div class="product">${productItem.name}</div>`;
        }
    });

    productlistContainer.innerHTML = htmlContent;
}
filterProducts();