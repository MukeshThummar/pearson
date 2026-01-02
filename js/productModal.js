// Product modal: open/close modal and image slider inside modal

function openProductModal(productId) {
    const product = (typeof products !== 'undefined') ? products.find(p => p.id === productId) : null;
    if (!product) { console.error('Product not found:', productId); return; }

    currentProduct = product;
    updateModalContent(product);
    resolveProductImages(product, function (images) { setupProductImageSlider(images); });

    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => { modal.style.opacity = '1'; }, 10);
    }
}

function updateModalContent(product) {
    const elements = {
        modalProductName: document.getElementById('modalProductName'),
        modalMrp: document.getElementById('modalMrp'),
        modalComposition: document.getElementById('modalComposition'),
        modalCategory: document.getElementById('modalCategory'),
        modalIndications: document.getElementById('modalIndications'),
        modalDosage: document.getElementById('modalDosage'),
        modalPackaging: document.getElementById('modalPackaging')
    };

    if (elements.modalProductName) elements.modalProductName.textContent = product.name;
    if (elements.modalMrp) elements.modalMrp.textContent = product.mrp ? `₹${product.mrp}` : 'N/A';
    if (elements.modalComposition) elements.modalComposition.textContent = product.composition || '';
    if (elements.modalCategory) elements.modalCategory.textContent = product.category || '';
    if (elements.modalIndications) elements.modalIndications.textContent = product.indications || '';
    if (elements.modalDosage) elements.modalDosage.textContent = product.dosage || '';
    if (elements.modalPackaging) elements.modalPackaging.textContent = product.packaging || '';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
    currentProduct = null;
}

function setupProductImageSlider(images) {
    const slider = document.getElementById('productImageSlider');
    const dotsContainer = document.getElementById('productImageDots');
    if (!slider || !dotsContainer) return;

    slider.innerHTML = '';
    dotsContainer.innerHTML = '';

    if (!images || images.length === 0) {
        slider.innerHTML = '<div class="product-slide active"><div class="fallback-icon">💊</div></div>';
        return;
    }

    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.classList.add('product-slide');
        if (index === 0) slide.classList.add('active');

        slide.innerHTML = `
            <img src="${image}" alt="Product Image ${index + 1}" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                 onload="this.style.display='block'; this.nextElementSibling.style.display='none'">
            <div class="fallback-icon" style="display:none;">💊</div>
        `;

        slider.appendChild(slide);

        if (images.length > 1) {
            const dot = document.createElement('div');
            dot.classList.add('image-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToProductSlide(index));
            dotsContainer.appendChild(dot);
        }
    });

    currentProductSlide = 0;

    // Add touch/swipe support for mobile
    if (images.length > 1) {
        let touchStartX = 0;
        let touchEndX = 0;
        const sliderContainer = slider.parentElement;

        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 40;
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swiped left → next image
                nextProductImage();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swiped right → previous image
                previousProductImage();
            }
        }
    }
}

function goToProductSlide(index) {
    const slides = document.querySelectorAll('.product-slide');
    const dots = document.querySelectorAll('.image-dot');
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentProductSlide = index;
}

function nextProductImage() {
    const slides = document.querySelectorAll('.product-slide');
    if (slides.length <= 1) return;
    currentProductSlide = (currentProductSlide + 1) % slides.length;
    goToProductSlide(currentProductSlide);
}

function previousProductImage() {
    const slides = document.querySelectorAll('.product-slide');
    if (slides.length <= 1) return;
    currentProductSlide = (currentProductSlide - 1 + slides.length) % slides.length;
    goToProductSlide(currentProductSlide);
}

function addToInquiry() {
    if (!currentProduct) { showNotification && showNotification('No product selected', 'error'); return; }
    const existing = inquiryList.find(item => item.id === currentProduct.id);
    if (existing) { showNotification && showNotification('Product already in inquiry list', 'warning'); return; }
    inquiryList.push({ id: currentProduct.id, name: currentProduct.name, category: currentProduct.category });
    updateInquiryCount();
    updateInquiryList();
    showNotification && showNotification(`${currentProduct.name} added to inquiry list`, 'success');
}

// Close modals by clicking on backdrop
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        if (e.target.id === 'productModal') closeProductModal();
        else if (e.target.id === 'inquiryModal') closeInquiryModal();
    }
});

// Keyboard navigation for slides and Escape handling
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const productModal = document.getElementById('productModal');
        const inquiryModal = document.getElementById('inquiryModal');
        if (productModal && !productModal.classList.contains('hidden')) closeProductModal();
        else if (inquiryModal && !inquiryModal.classList.contains('hidden')) closeInquiryModal();
    }

    if (e.key === 'ArrowLeft') {
        const productModal = document.getElementById('productModal');
        if (productModal && !productModal.classList.contains('hidden')) previousProductImage(); else previousSlide && previousSlide();
    } else if (e.key === 'ArrowRight') {
        const productModal = document.getElementById('productModal');
        if (productModal && !productModal.classList.contains('hidden')) nextProductImage(); else nextSlide && nextSlide();
    }
});
