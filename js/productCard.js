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

function resolveProductImages(product, callback) {
    if (!product) {
        callback([]);
        return;
    }

    // Check if product has images array with GUID-based filenames
    if (Array.isArray(product.images) && product.images.length > 0) {
        const folder = getImageFolder(product);
        const imageUrls = product.images.map(imageName => `./images/${folder}/${imageName}`);
        
        // Validate that main image (first one) exists
        const mainImagePath = imageUrls[0];
        const testImg = new Image();
        
        testImg.onload = function () {
            callback(imageUrls);
        };
        
        testImg.onerror = function () {
            callback([]);
        };
        
        testImg.src = mainImagePath;
        return;
    }

    callback([]);
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
