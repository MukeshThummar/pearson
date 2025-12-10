// Product list and filter functions

function displayProducts(productsArr) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    container.innerHTML = '';
    productsArr.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

