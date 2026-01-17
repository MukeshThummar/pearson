// App: central global state, module loader, and startup trigger
// The application logic is split across module files under `js/`.
// This file dynamically loads all required modules and initializes the app.

/* Shared globals used by modules */
var currentSlide = 0;
var currentProductSlide = 0;
var inquiryList = [];
var currentProduct = null;
var homeAutoAdvance = null;

// Load all required module scripts dynamically
function loadModules() {
    const modules = [
        'data/products.js',
        'data/appsettings.js',
        'data/homeSlide.js',
        'js/gmail.js',
        'js/header.js',
        'js/footer.js',
        'js/productCard.js',
        'js/productModal.js',
        'js/product.js',
        'js/inquiry.js',
        'js/contact.js',
        'js/whatsapp.js',
        'js/home.js'
    ];

    let loadedCount = 0;
    
    modules.forEach((modulePath) => {
        const script = document.createElement('script');
        script.src = modulePath;
        script.async = false; // Load in order
        script.onload = () => {
            loadedCount++;
            if (loadedCount === modules.length) {
                initializeAppAfterModules();
            }
        };
        script.onerror = () => {
            console.error(`Failed to load module: ${modulePath}`);
            loadedCount++;
            if (loadedCount === modules.length) {
                initializeAppAfterModules();
            }
        };
        document.head.appendChild(script);
    });
}

// Initialize app after all modules load
function initializeAppAfterModules() {
    try { if (typeof populateAppSettings === 'function') populateAppSettings(); } catch (e) { console.error('populateAppSettings error:', e); }
    try { initializeNavigation(); } catch (e) { console.error('initializeNavigation error:', e); }
    try { initializeHomeSlider(); } catch (e) { console.error('initializeHomeSlider error:', e); }
    try { if (typeof displayProducts === 'function') loadProductData(); } catch (e) { console.error('displayProducts error:', e); }
    try { initializeProductFilters(); } catch (e) { console.error('initializeProductFilters error:', e); }
    try { initializeForms(); } catch (e) { console.error('initializeForms error:', e); }
    try { if (typeof updateContactLinkState === 'function') updateContactLinkState(); } catch (e) { console.error('updateContactLinkState error:', e); }
    try { updateInquiryCount(); } catch (e) { console.error('updateInquiryCount error:', e); }
}

// loadProductData kept as tiny wrapper for backwards compatibility
function loadProductData() {
    if (typeof displayProducts === 'function' && typeof products !== 'undefined') displayProducts(products);
}

// Start module loading on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadModules);