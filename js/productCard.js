// Product image resolving and product card creation

function slugifyName(name) {
    if (!name) return '';
    return name.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getImageFolder(product) {
    if (!product) return '';
    if (product.image_folder) return product.image_folder;
    if (product.folder) return product.folder;
    return slugifyName(product.name || product.id || 'product');
}

function resolveProductImages(product, callback, maxCount = 10) {
    if (product && Array.isArray(product.images) && product.images.length > 0) {
        callback(product.images);
        return;
    }

    const folder = getImageFolder(product);
    if (!folder) {
        callback([]);
        return;
    }

    const candidates = [];
    for (let i = 1; i <= maxCount; i++) {
        candidates.push(`./images/${folder}/${i}.png`);
        candidates.push(`./images/${folder}/${i}.jpg`);
    }
    candidates.push(`./images/${folder}/main.png`);
    candidates.push(`./images/${folder}/main.jpg`);

    const results = [];
    let remaining = candidates.length;
    if (remaining === 0) return callback([]);

    candidates.forEach(src => {
        const img = new Image();
        img.onload = function () { results.push(src); checkDone(); };
        img.onerror = function () { checkDone(); };
        img.src = src;
    });

    function checkDone() {
        remaining--;
        if (remaining <= 0) {
            const unique = Array.from(new Set(results));
            const mainIdx = unique.findIndex(u => /\/main\.(png|jpg|jpeg|webp)$/i.test(u));
            if (mainIdx > 0) {
                const [main] = unique.splice(mainIdx, 1);
                unique.unshift(main);
            }
            callback(unique);
        }
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.setAttribute('data-category', product.category);

    card.innerHTML = `
        <div class="product-image">
            <img class="product-thumb" src="" alt="${product.name}" style="display:none;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="fallback-icon">💊</div>
        </div>
        <div class="product-info">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-subtitle">${product.subtitle || ''}</p>
            <span class="product-category">${product.category || ''}</span>
            <p class="product-description">${product.description || ''}</p>
            <button class="card-add-button" title="Add to Inquiry List">+</button>
        </div>
    `;

    const addButton = card.querySelector('.card-add-button');
    if (addButton) {
        addButton.addEventListener('click', function (e) {
            e.stopPropagation();
            if (typeof addProductToInquiry === 'function') addProductToInquiry(product.id);
        });
    }

    card.addEventListener('click', function (e) {
        if (e.target.classList.contains('card-add-button') || e.target.closest('.card-add-button')) return;
        if (typeof openProductModal === 'function') openProductModal(product.id);
    });

    resolveProductImages(product, function (images) {
        const imageElem = card.querySelector('.product-thumb');
        const fallback = card.querySelector('.fallback-icon');
        if (images && images.length > 0) {
            if (imageElem) {
                imageElem.src = images[0];
                imageElem.style.display = 'block';
            }
            if (fallback) fallback.style.display = 'none';
        } else {
            if (imageElem) imageElem.style.display = 'none';
            if (fallback) fallback.style.display = 'flex';
        }
    });

    return card;
}
