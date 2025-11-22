// Pharmaceutical Website JavaScript - Fixed Normal Page Scrolling

// Global Variables
let currentSlide = 0;
let currentProductSlide = 0;
let inquiryList = [];
let currentProduct = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    loadProductData();
    initializeHeroSlider();
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

// Hero Slider Functions
function initializeHeroSlider() {
    const slider = document.getElementById('heroSlider');
    const dotsContainer = document.getElementById('heroDots');

    if (!slider || !dotsContainer) return;

    // Use the in-page `homeSlide` data (loaded via `data/home_slide.js`).
    // `data/home_slide.js` should define `window.homeSlide` as an array of slide objects.
    const slidesSource = window.homeSlide;
    if (Array.isArray(slidesSource) && slidesSource.length > 0) {
        renderHeroSlides(slidesSource, slider, dotsContainer);
        return;
    }

    // No slide data available — fall back to static DOM slides if present
    const staticSlides = document.querySelectorAll('.hero-slide');
    if (!staticSlides || staticSlides.length === 0) return;
    dotsContainer.innerHTML = '';
    staticSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('hero-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    setInterval(nextSlide, 5000);
}

// Helper to render hero slides and dots
function renderHeroSlides(slides, slider, dotsContainer) {
    slider.innerHTML = '';
    slides.forEach((s, index) => {
        const slide = document.createElement('div');
        slide.classList.add('hero-slide');
        if (index === 0) slide.classList.add('active');
        slide.innerHTML = `
            <img src="${s.image}" alt="${s.title}">
            <div class="hero-content">
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
        dot.classList.add('hero-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Auto-advance slides
    setInterval(nextSlide, 5000);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    
    currentSlide = index;
}

function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
}

function previousSlide() {
    const slides = document.querySelectorAll('.hero-slide');
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
function sendBulkInquiry() {
    if (inquiryList.length === 0) {
        showNotification('Please add products to inquiry list first', 'warning');
        return;
    }

    const name = document.getElementById('inquiryName')?.value || '';
    const email = document.getElementById('inquiryEmail')?.value || '';
    const phone = document.getElementById('inquiryPhone')?.value || '';
    const company = document.getElementById('inquiryCompany')?.value || '';
    const message = document.getElementById('inquiryMessage')?.value || '';

    // Basic validation
    if (!name || !email || !phone) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (!isValidPhone(phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }

    const productList = inquiryList.map(item => `- ${item.name} (${item.category})`).join('\n');

    const subject = `Portal Inquiry - ${inquiryList.length} Products`;
    const body = `Dear Team,

I would like to inquire for,

Products of Interest:
${productList}

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}


Additional Message:
${message}

Best regards,
${name}
`;

    const recipient = (window.emailConfig && window.emailConfig.to) || 'mukeshnthummar@gmail.com';

    // If an EmailJS-like config is provided, try to send directly from the client.
    const cfg = window.emailConfig || {};

    // Prefer SMTP.js when configured
    if (cfg.method === 'smtpjs' && (cfg.secureToken || (cfg.username && cfg.password && cfg.host))) {
        console.log('Sending inquiry via SMTP.js');
        loadSMTPJSSDK(() => {
            if (window.Email && typeof window.Email.send === 'function') {
                const mailParams = {
                    To: cfg.to || recipient,
                    From: cfg.from || email,
                    Subject: subject,
                    Body: body
                };

                if (cfg.secureToken) mailParams.SecureToken = cfg.secureToken;
                if (cfg.username) mailParams.Username = cfg.username;
                if (cfg.password) mailParams.Password = cfg.password;
                if (cfg.host) mailParams.Host = cfg.host;
                if (cfg.Port) mailParams.Port = cfg.Port;

                showNotification('Sending inquiry...', 'info');
                window.Email.send(mailParams)
                    .then(() => {
                        showNotification('Inquiry sent successfully', 'success');
                    })
                    .catch(err => {
                        console.error('SMTP send failed:', err);
                        showNotification('Failed to send inquiry via SMTP. Opening email client as fallback.', 'error');
                        openMailClientFallback(recipient, subject, body);
                    });
            } else {
                openMailClientFallback(recipient, subject, body);
            }
        });

        // Next, try EmailJS if configured (backwards compatibility)
    } else if (cfg.serviceId && cfg.templateId) {
        console.log('Sending inquiry via EmailJS SDK');
        // Ensure SDK is loaded
        loadEmailJSSDK(() => {
            const params = {
                to_email: recipient,
                from_name: name,
                from_email: email,
                from_phone: phone,
                company: company,
                message: message,
                product_list: productList,
                subject: subject,
                body: body
            };

            // emailjs (or similar) is expected to be available as `emailjs`
            if (window.emailjs && typeof window.emailjs.send === 'function') {
                showNotification('Sending inquiry...', 'info');
                window.emailjs.send(cfg.serviceId, cfg.templateId, params, cfg.publicKey)
                    .then(() => {
                        showNotification('Inquiry sent successfully', 'success');
                    })
                    .catch(err => {
                        console.error('Email send failed:', err);
                        showNotification('Failed to send inquiry. Opening email client as fallback.', 'error');
                        // fallback to mailto
                        openMailClientFallback(recipient, subject, body);
                    });
            } else {
                // SDK not available; fallback
                openMailClientFallback(recipient, subject, body);
            }
        });
    } else {
        console.log('No email config; using mailto fallback');
        // No direct-send config; open the user's email client with a prefilled recipient (mailto fallback)
        openMailClientFallback(recipient, subject, body);
    }

    // Reset form and clear inquiries
    const form = document.getElementById('bulkInquiryForm');
    if (form) form.reset();

    clearInquiries();
    closeInquiryModal();
}

// Open mail client fallback helper
function openMailClientFallback(recipient, subject, body) {
    const emailLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
        window.open(emailLink, '_blank');
        showNotification('Email client opened. Please send the inquiry.', 'success');
    } catch (error) {
        showEmailPreview(subject, body, 'Bulk Partnership Inquiry');
    }
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

// Dynamically load EmailJS SDK (only if needed). Calls callback when loaded or immediately if already present.
function loadEmailJSSDK(callback) {
    if (window.emailjs && typeof window.emailjs.send === 'function') {
        callback();
        return;
    }
    // If script already injected, poll until available
    if (document.getElementById('emailjs-sdk')) {
        const check = setInterval(() => {
            if (window.emailjs && typeof window.emailjs.send === 'function') {
                clearInterval(check);
                callback();
            }
        }, 200);
        return;
    }

    const script = document.createElement('script');
    script.id = 'emailjs-sdk';
    script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
    script.onload = function () {
        if (window.emailjs && window.emailConfig && window.emailConfig.publicKey) {
            try { window.emailjs.init(window.emailConfig.publicKey); } catch (e) { }
        }
        callback();
    };
    script.onerror = function () {
        console.warn('Failed to load EmailJS SDK');
        callback();
    };
    document.head.appendChild(script);
}

// Dynamically load SMTP.js (smtpjs.com) helper. Calls callback when ready.
function loadSMTPJSSDK(callback) {
    if (window.Email && typeof window.Email.send === 'function') {
        callback();
        return;
    }
    if (document.getElementById('smtpjs-sdk')) {
        const check = setInterval(() => {
            if (window.Email && typeof window.Email.send === 'function') {
                clearInterval(check);
                callback();
            }
        }, 200);
        return;
    }

    const script = document.createElement('script');
    script.id = 'smtpjs-sdk';
    // smtpjs official script
    script.src = 'https://smtpjs.com/v3/smtp.js';
    script.onload = function () {
        // SMTP.js exposes `Email` global
        callback();
    };
    script.onerror = function () {
        console.warn('Failed to load SMTP.js SDK');
        callback();
    };
    document.head.appendChild(script);
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

    const bulkInquiryForm = document.getElementById('bulkInquiryForm');
    if (bulkInquiryForm) {
        bulkInquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            sendBulkInquiry();
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

    const subject = `Partnership Inquiry - ${inquiryType} - ${name}`;
    const body = `Dear Business Development Team,

I am interested in connecting with Pearson Pharmaceutical (Est. 2024) regarding new business opportunities.

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Inquiry Type: ${inquiryType}

Message:
${message}

As a newly established company, I believe there are excellent opportunities for mutual growth. Please contact me to discuss potential partnerships, distribution opportunities, or business collaboration.

Looking forward to growing together with Pearson Pharmaceutical.

Best regards,
${name}
`;

    // Create mailto link for proper email functionality
    const emailLink = `mailto:info@pearsonpharma.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Try to open email client
    try {
        window.open(emailLink, '_blank');
        showNotification('Email client opened. Please send the inquiry.', 'success');
        e.target.reset();
    } catch (error) {
        // Fallback: show email content for copying
        showEmailPreview(subject, body, 'Partnership Contact Inquiry');
        e.target.reset();
    }
}

// Email Functions
function showEmailPreview(subject, content, type) {
    // Create modal for email preview
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.zIndex = '3000';

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3>Email Preview - ${type}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove();">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>To:</strong> info@pearsonpharma.com</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr>
                <div style="white-space: pre-wrap; font-family: monospace; background: var(--color-bg-1); padding: 1rem; border-radius: var(--radius-base);">${content}</div>
                <div style="margin-top: 1rem;">
                    <button class="btn btn--primary" onclick="copyToClipboard('${content.replace(/'/g, "\\'")}'); showNotification('Email content copied to clipboard', 'success');">
                        Copy Content
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Auto remove after 10 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 10000);
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