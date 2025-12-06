// Pharmaceutical Website JavaScript - Fixed Normal Page Scrolling

// Global Variables
let currentSlide = 0;
let currentProductSlide = 0;
let inquiryList = [];
let currentProduct = null;
let homeAutoAdvance = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    loadProductData();
    initializeHomeSlider();
    initializeNavigation();
    initializeForms();
    initializeProductFilters();
    updateInquiryCount();
}

// Product Data - Using accurate data from GitHub
function loadProductData() {
    displayProducts(products);
    // displayFeaturedProducts();
}

// Image resolution helpers: build candidate URLs and preload to find existing images
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

// Resolve product images by testing common candidate filenames. Calls callback(imagesArray).
function resolveProductImages(product, callback, maxCount = 10) {
    // If explicit images provided (backwards compatibility), use them immediately
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
    // common patterns: 1..maxCount and main
    for (let i = 1; i <= maxCount; i++) {
        candidates.push(`./images/${folder}/${i}.png`);
        candidates.push(`./images/${folder}/${i}.jpg`);
    }
    candidates.push(`./images/${folder}/main.png`);
    candidates.push(`./images/${folder}/main.jpg`);

    const results = [];
    let remaining = candidates.length;

    // If no candidates, return empty
    if (remaining === 0) return callback([]);

    candidates.forEach(src => {
        const img = new Image();
        img.onload = function () {
            results.push(src);
            checkDone();
        };
        img.onerror = function () {
            checkDone();
        };
        img.src = src;
    });

    function checkDone() {
        remaining--;
        if (remaining <= 0) {
            // Remove duplicates and keep order
            const unique = Array.from(new Set(results));
            // Prefer any 'main' image (main.png/main.jpg/main.jpeg/main.webp) by moving it to the front
            const mainIdx = unique.findIndex(u => /\/main\.(png|jpg|jpeg|webp)$/i.test(u));
            if (mainIdx > 0) {
                const [main] = unique.splice(mainIdx, 1);
                unique.unshift(main);
            }
            callback(unique);
        }
    }
}

// FIXED: Navigation Functions - Use smooth scroll instead of hiding/showing sections
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            navigateToSection(section);
        });
    });
}

// FIXED: Use smooth scrolling to sections instead of show/hide
function navigateToSection(sectionName) {
    console.log('Navigating to:', sectionName);
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    // Update nav links active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function navigateToHome() {
    navigateToSection('home');
}

function navigateToProducts() {
    navigateToSection('products');
}


function navigateToContact() {
    navigateToSection('contact');
}

// Home Slider Functions
function initializeHomeSlider() {
    const slider = document.getElementById('homeSlider');
    const dotsContainer = document.getElementById('homeDots');

    if (!slider || !dotsContainer) return;

    // Use slides data from `data/homeSlide.js` instead of dynamic filename probing.
    // Expect `slides` to be an array of objects: { image, title?, subtitle? }
    try {
        if (!Array.isArray(slides) || slides.length === 0) return;
    } catch (e) {
        console.error('Error loading home slides data:', e);
        return;
    }
    const homeImagePath = (appsettings && appsettings.imagePathHomeSlide);

    const results = [];
    slides.forEach(s => {
        if (!s || !s.image) return; // skip if no image path provided
        const src = `${homeImagePath}${s.image}`;
        const img = new Image();
        img.onload = function () {
            results.push({ src: src, title: s.title, subtitle: s.subtitle });
            renderHomeSlidesFromImages(results, slider, dotsContainer);
        };
        img.onerror = function () {
            renderHomeSlidesFromImages(results, slider, dotsContainer);
        };
        img.src = src;
    });
}

// Helper to render Home slides from resolved images
function renderHomeSlidesFromImages(images, slider, dotsContainer) {
    slider.innerHTML = '';
    images.forEach((item, index) => {
        // item expected to be { src, title?, subtitle? } — if a string is passed, treat it as src
        const data = (typeof item === 'string') ? { src: item } : item || {};
        const src = data.src;
        if (!src) return;

        const slide = document.createElement('div');
        slide.classList.add('home-slide');
        if (index === 0) slide.classList.add('active');

        const titleHtml = data.title ? `<h1>${data.title}</h1>` : '';
        const subtitleHtml = data.subtitle ? `<p>${data.subtitle}</p>` : '';

        slide.innerHTML = `
            <img src="${src}" alt="Slide ${index + 1}">
            <div class="home-content">
                ${titleHtml}
                ${subtitleHtml}
            </div>
        `;
        slider.appendChild(slide);
    });
    // Create dots
    dotsContainer.innerHTML = '';
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('home-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    // Clear previous auto-advance if present
    if (homeAutoAdvance) clearInterval(homeAutoAdvance);
    homeAutoAdvance = setInterval(nextSlide, 5000);

    // Add basic touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    function handleTouchStart(e) { touchStartX = e.changedTouches[0].screenX; }
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const threshold = 40; // px
        if (Math.abs(diff) > threshold) {
            if (diff > 0) { nextSlide(); } else { previousSlide(); }
            // reset auto-advance timer on manual swipe
            if (homeAutoAdvance) { clearInterval(homeAutoAdvance); homeAutoAdvance = setInterval(nextSlide, 5000); }
        }
    }

    try {
        slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        slider.addEventListener('touchend', handleTouchEnd, { passive: true });
    } catch (e) {
        // ignore if environment doesn't support touch listeners
    }
}

// Helper to render home slides and dots
function renderHomeSlides(slides, slider, dotsContainer) {
    slider.innerHTML = '';
    slides.forEach((s, index) => {
        const slide = document.createElement('div');
        slide.classList.add('home-slide');
        if (index === 0) slide.classList.add('active');
        slide.innerHTML = `
            <img src="${s.image}" alt="${s.title}">
            <div class="home-content">
                <h1>${s.title}</h1>
                <p>${s.subtitle}</p>
            </div>
        `;
        slider.appendChild(slide);
    });

    // Create dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('home-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Auto-advance slides
    setInterval(nextSlide, 5000);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.home-slide');
    const dots = document.querySelectorAll('.home-dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    
    currentSlide = index;
    // reset auto-advance timer when user manually navigates
    if (homeAutoAdvance) { clearInterval(homeAutoAdvance); homeAutoAdvance = setInterval(nextSlide, 5000); }
}

function nextSlide() {
    const slides = document.querySelectorAll('.home-slide');
    if (slides.length === 0) return;
    
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
}

function previousSlide() {
    const slides = document.querySelectorAll('.home-slide');
    if (slides.length === 0) return;
    
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
}

// Product Functions
function displayProducts(products) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}


// Create product card with proper event handling
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.setAttribute('data-category', product.category);
    
    // Create image element with fallback
    // Start with a placeholder; we'll asynchronously resolve an actual image
    card.innerHTML = `
        <div class="product-image">
            <img class="product-thumb" src="" alt="${product.name}" style="display:none;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="fallback-icon">💊</div>
        </div>
        <div class="product-info">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-subtitle">${product.subtitle}</p>
            <span class="product-category">${product.category}</span>
            <p class="product-description">${product.description}</p>
            <button class="card-add-button" title="Add to Inquiry List">
                +
            </button>
        </div>
    `;

    // Add click event to + button for adding to inquiry
    const addButton = card.querySelector('.card-add-button');
    if (addButton) {
        addButton.addEventListener('click', function (e) {
            e.stopPropagation();
            addProductToInquiry(product.id);
        });
    }

    // Add click event to entire card for opening modal (except + button)
    card.addEventListener('click', function (e) {
        // Don't open modal if + button was clicked
        if (e.target.classList.contains('card-add-button') || e.target.closest('.card-add-button')) {
            return;
        }
        openProductModal(product.id);
    });

    // Resolve images asynchronously and set thumbnail when available
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

// Add product to inquiry from card + button
function addProductToInquiry(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const existing = inquiryList.find(item => item.id === productId);
    if (existing) {
        showNotification('Product already in inquiry list', 'warning');
        return;
    }

    inquiryList.push({
        id: product.id,
        name: product.name,
        category: product.category
    });

    updateInquiryCount();
    showNotification(`${product.name} added to inquiry list`, 'success');
    console.log('Current inquiry list:', inquiryList);
}

// Product Modal Functions with proper setup
function openProductModal(productId) {
    console.log('Opening product modal for:', productId);

    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Set current product FIRST
    currentProduct = product;
    console.log('Current product set to:', currentProduct);

    // Update modal content with product data
    updateModalContent(product);
    // Resolve images dynamically (will use product.images if present for backward compatibility)
    resolveProductImages(product, function (images) {
        setupProductImageSlider(images);
    });

    // Show modal
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Add fade in animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

// Helper function to update modal content
function updateModalContent(product) {
    const elements = {
        modalProductName: document.getElementById('modalProductName'),
        modalComposition: document.getElementById('modalComposition'),
        modalCategory: document.getElementById('modalCategory'),
        modalIndications: document.getElementById('modalIndications'),
        modalDosage: document.getElementById('modalDosage'),
        modalPackaging: document.getElementById('modalPackaging')
    };

    if (elements.modalProductName) {
        elements.modalProductName.textContent = product.name;
        console.log('Set modal name to:', product.name);
    }
    if (elements.modalComposition) elements.modalComposition.textContent = product.composition;
    if (elements.modalCategory) elements.modalCategory.textContent = product.category;
    if (elements.modalIndications) elements.modalIndications.textContent = product.indications;
    if (elements.modalDosage) elements.modalDosage.textContent = product.dosage;
    if (elements.modalPackaging) elements.modalPackaging.textContent = product.packaging;
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

        // Only create dots if there are multiple images
        if (images.length > 1) {
            const dot = document.createElement('div');
            dot.classList.add('image-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToProductSlide(index));
            dotsContainer.appendChild(dot);
        }
    });

    currentProductSlide = 0;
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

// Add to inquiry from modal bottom right + button
function addToInquiry() {
    console.log('Adding to inquiry from modal. Current product:', currentProduct);

    if (!currentProduct) {
        showNotification('No product selected', 'error');
        return;
    }

    const existing = inquiryList.find(item => item.id === currentProduct.id);
    if (existing) {
        showNotification('Product already in inquiry list', 'warning');
        return;
    }

    inquiryList.push({
        id: currentProduct.id,
        name: currentProduct.name,
        category: currentProduct.category
    });

    updateInquiryCount();
    showNotification(`${currentProduct.name} added to inquiry list`, 'success');
    console.log('Updated inquiry list:', inquiryList);
}

function removeFromInquiry(productId) {
    const productName = inquiryList.find(item => item.id === productId)?.name || 'Product';
    inquiryList = inquiryList.filter(item => item.id !== productId);
    updateInquiryCount();
    updateInquiryList();
    showNotification(`${productName} removed from inquiry list`, 'info');
}

function updateInquiryCount() {
    const countElement = document.getElementById('inquiryCount');
    if (countElement) {
        countElement.textContent = inquiryList.length;
        console.log('Updated inquiry count to:', inquiryList.length);
    }
}

function updateInquiryList() {
    const container = document.getElementById('inquiryList');
    if (!container) return;

    if (inquiryList.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--color-text-secondary); padding: 2rem;">No products in inquiry list</p>';
        return;
    }

    container.innerHTML = '';

    inquiryList.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('inquiry-item');
        itemElement.innerHTML = `
            <div>
                <span class="product-name" style="font-weight: 600;">${item.name}</span>
                <br>
                <small class="product-category" style="color: var(--color-text-secondary);">${item.category}</small>
            </div>
            <button class="remove-inquiry" onclick="removeFromInquiry('${item.id}')">
                Remove
            </button>
        `;
        container.appendChild(itemElement);
    });
}

function toggleInquiryCart() {
    updateInquiryList();
    const modal = document.getElementById('inquiryModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closeInquiryModal() {
    const modal = document.getElementById('inquiryModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function clearInquiries() {
    inquiryList = [];
    updateInquiryCount();
    updateInquiryList();
    showNotification('All inquiries cleared', 'info');
}

// Send Bulk Inquiry Functions
function sendInquiry() {
    // Email sending has been disabled. Show placeholder message instead.
    showNotification('Under Construction', 'info');
    const form = document.getElementById('InquiryForm');
    if (form) form.reset();
    closeInquiryModal();
}


// Basic email validator
function isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Basic phone validator: allow digits, spaces, +, -, (), min 7 digits
function isValidPhone(phone) {
    if (!phone) return false;
    // Count digits
    const digits = (phone.match(/\d/g) || []).length;
    if (digits < 7) return false;
    const re = /^[0-9+()\s-]{7,20}$/;
    return re.test(phone);
}


// Filter Functions
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

// Form Functions
function initializeForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    const InquiryForm = document.getElementById('InquiryForm');
    if (InquiryForm) {
        InquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            sendInquiry();
        });
    }
}

function handleContactForm(e) {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value || '';
    const email = document.getElementById('contactEmail')?.value || '';
    const phone = document.getElementById('contactPhone')?.value || '';
    const company = document.getElementById('contactCompany')?.value || '';
    const inquiryType = document.getElementById('inquiryType')?.value || '';
    const message = document.getElementById('contactMessage')?.value || '';

    if (!name || !email || !phone || !message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    showNotification('Under Construction', 'info');
    const form = document.getElementById('contactForm');
    if (form) form.reset();
}

// Email Functions
function showEmailPreview(subject, content, type) {
    // Email preview is disabled. Show placeholder notification instead.
    showNotification('Under Construction', 'info');
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.classList.add('notification', `notification--${type}`);
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        max-width: 400px;
        font-weight: 500;
        font-family: var(--font-family-base);
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    `;

    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.color = 'var(--color-success)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.color = 'var(--color-error)';
    } else if (type === 'warning') {
        notification.style.borderColor = 'var(--color-warning)';
        notification.style.color = 'var(--color-warning)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Event Listeners for modal clicks
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        if (e.target.id === 'productModal') {
            closeProductModal();
        } else if (e.target.id === 'inquiryModal') {
            closeInquiryModal();
        }
    }
});

// Phone link behavior: keep aria-disabled in sync and prevent accidental clicks on desktop
function debounce(fn, wait) {
    let t;
    return function () {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, arguments), wait);
    };
}

function updateContactLinkState() {
    const links = document.querySelectorAll('.phone-link, .email-link');
    if (!links || links.length === 0) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    links.forEach(link => {
        if (isMobile) {
            link.removeAttribute('aria-disabled');
        } else {
            link.setAttribute('aria-disabled', 'true');
        }
    });
}

// Prevent click on contact links when aria-disabled is true
document.addEventListener('click', function (e) {
    const link = e.target.closest && e.target.closest('.phone-link, .email-link');
    if (!link) return;
    if (link.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        if (typeof showNotification === 'function') {
            if (link.classList.contains('phone-link')) {
                showNotification('Tap the phone number on a mobile device to call.', 'info');
            } else if (link.classList.contains('email-link')) {
                showNotification('Tap the email address on a mobile device to compose an email.', 'info');
            } else {
                showNotification('Tap the contact on a mobile device to interact.', 'info');
            }
        }
    }
});

window.addEventListener('resize', debounce(updateContactLinkState, 150));
document.addEventListener('DOMContentLoaded', updateContactLinkState);

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const productModal = document.getElementById('productModal');
        const inquiryModal = document.getElementById('inquiryModal');

        if (productModal && !productModal.classList.contains('hidden')) {
            closeProductModal();
        } else if (inquiryModal && !inquiryModal.classList.contains('hidden')) {
            closeInquiryModal();
        }
    }

    // Arrow key navigation for sliders
    if (e.key === 'ArrowLeft') {
        const productModal = document.getElementById('productModal');
        if (productModal && !productModal.classList.contains('hidden')) {
            previousProductImage();
        } else {
            previousSlide();
        }
    } else if (e.key === 'ArrowRight') {
        const productModal = document.getElementById('productModal');
        if (productModal && !productModal.classList.contains('hidden')) {
            nextProductImage();
        } else {
            nextSlide();
        }
    }
});

// Error handling
window.addEventListener('error', function (e) {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Please refresh the page if issues persist.', 'error');
});