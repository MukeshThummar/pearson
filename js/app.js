// Pharmaceutical Website JavaScript - Fixed Normal Page Scrolling

// Global Variables
let currentSlide = 0;
let currentProductSlide = 0;
let inquiryList = [];
let currentProduct = null;
let products = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
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
    products = [
        {
            id: "001",
            name: "Pearflam-SP",
            subtitle: "Accelofenac, Serratiopeptidase & Paracetamol Tablets",
            composition: "Each tablet contains Accelofenac 100mg, Serratiopeptidase 15mg, and Paracetamol 500mg",
            indications: "For the treatment of pain and inflammation in conditions like rheumatoid arthritis, osteoarthritis, ankylosing spondylitis, dental pain, and post-operative inflammation",
            dosage: "As directed by the physician. Usually 1 tablet twice daily after meals",
            packaging: "10 strips of 10 tablets each, Aluminium Foil",
            category: "Pain Relief",
            description: "Triple action formula for effective pain and inflammation management",
            images: [
                "./images/pearflam/1.png",
                "./images/pearflam/2.png",
                "./images/pearflam/3.png"
            ]
        },
        {
            id: "002", 
            name: "Limson-LC",
            subtitle: "Levocetirizine & Montelukast Tablets",
            composition: "Levocetirizine 5mg + Montelukast 10mg",
            indications: "Allergic rhinitis, hay fever, and chronic urticaria",
            dosage: "As prescribed by the physician. Usually once daily at night",
            packaging: "10 strips of 10 tablets each",
            category: "Allergy Care",
            description: "Dual action allergy relief for respiratory conditions",
            images: [
                "./images/limson/1.png",
                "./images/limson/2.png",
                "./images/limson/3.png",
                "./images/limson/4.png"
            ]
        },
        {
            id: "003",
            name: "Oflar-OZ",
            subtitle: "Ofloxacin & Ornidazole Tablets",
            composition: "Ofloxacin 200mg + Ornidazole 500mg",
            indications: "Acute diarrhea, dysentery, and other gastrointestinal infections",
            dosage: "As directed by the physician. Typically twice daily",
            packaging: "10 strips of 10 tablets each",
            category: "Antibiotic",
            description: "Broad spectrum antibiotic with anti-protozoal action",
            images: [
                "./images/Oflar/1.png",
                "./images/Oflar/2.png",
                "./images/Oflar/3.png",
                "./images/Oflar/4.png"
            ]
        },
        {
            id: "004",
            name: "PearCEF 200 DT",
            subtitle: "Cefixime Dispersible Tablets 200mg",
            composition: "Each dispersible tablet contains Cefixime 200mg",
            indications: "Used for respiratory tract infections, urinary tract infections, and otitis media",
            dosage: "As advised by the physician",
            packaging: "10 strips of 10 dispersible tablets",
            category: "Antibiotic",
            description: "Third generation cephalosporin antibiotic in dispersible form",
            images: [
                "./images/pearcef/1.png",
                "./images/pearcef/2.png",
                "./images/pearcef/3.png",
                "./images/pearcef/4.png"
            ]
        },
        {
            id: "005",
            name: "Bitson-B12",
            subtitle: "Methylcobalamin, Niacinamide & Pyridoxine Injection",
            composition: "Each ampoule contains Methylcobalamin 1500mcg, Niacinamide 100mg, Pyridoxine HCl 100mg",
            indications: "Used in the treatment of peripheral neuropathy, vitamin B12 deficiency, and general weakness",
            dosage: "As prescribed by the physician",
            packaging: "1ml ampoule, box of 5 ampoules",
            category: "Injectable",
            description: "Advanced neurotropic supplement for nerve health",
            images: [
                "./images/bitson/1.png",
                "./images/bitson/2.png"
            ]
        },
        {
            id: "006",
            name: "Clavson-CV 625",
            subtitle: "Amoxicillin & Potassium Clavulanate Tablets IP",
            composition: "Amoxicillin 500mg + Clavulanic Acid 125mg",
            indications: "Effective in respiratory tract infections, sinusitis, urinary tract infections, skin infections, and dental infections",
            dosage: "As directed by the physician. Usually 1 tablet every 8 or 12 hours",
            packaging: "10 strips of 10 tablets each",
            category: "Antibiotic",
            description: "Beta-lactam antibiotic with beta-lactamase inhibitor",
            images: [
                "./images/clavson/1.png",
                "./images/clavson/2.png",
                "./images/clavson/3.png"
            ]
        },
        {
            id: "007",
            name: "RSON-DSR",
            subtitle: "Rabeprazole Sodium (EC) & Domperidone (SR) Capsules",
            composition: "Rabeprazole Sodium 20mg (enteric coated) + Domperidone 30mg (sustained release)",
            indications: "GERD, acid reflux, and other gastric disorders",
            dosage: "One capsule daily before meal or as directed by physician",
            packaging: "10 strips of 10 capsules",
            category: "Gastro Care",
            description: "Proton pump inhibitor with prokinetic agent",
            images: [
                "./images/rson/1.jpg"
            ]
        },
        {
            id: "008",
            name: "Qcold-X",
            subtitle: "Terbutaline, Guaiphenesin, Ambroxol HCL & Menthol Syrup",
            composition: "Terbutaline 1.25mg, Guaiphenesin 50mg, Ambroxol HCL 15mg, Menthol 2.5mg per 5ml",
            indications: "Relief from productive cough, congestion, and bronchospasm",
            dosage: "5ml 2–3 times daily or as prescribed",
            packaging: "100ml bottle with measuring cap, Mix Fruit flavour",
            category: "Syrup",
            description: "Multi-action syrup for productive cough relief",
            images: [
                "./images/qcoldx/1.jpg"
            ]
        },
        {
            id: "009",
            name: "Qcold-Dx",
            subtitle: "Dextromethorphan, Phenylephrine HCL & Chlorpheniramine Maleate Syrup",
            composition: "Dextromethorphan 10mg, Phenylephrine 5mg, Chlorpheniramine Maleate 2mg per 5ml",
            indications: "Dry cough, cold, nasal congestion, and allergic symptoms",
            dosage: "5ml 2–3 times daily or as directed",
            packaging: "100ml bottle with measuring cap, Strawberry flavour",
            category: "Syrup",
            description: "Effective dry cough suppressant with decongestant",
            images: [
                "./images/qcolddx/1.jpg"
            ]
        },
        {
            id: "010",
            name: "Cefvit 1gm",
            subtitle: "Ceftriaxone Injection IP",
            composition: "Each vial contains Ceftriaxone Sodium equivalent to Ceftriaxone 1gm",
            indications: "Bacterial infections including respiratory tract, urinary tract, skin, soft tissue, and gynecological infections",
            dosage: "As directed by the physician. Administered IM/IV",
            packaging: "Vial with sterile water for injection",
            category: "Injectable",
            description: "Third generation cephalosporin for severe infections",
            images: [
                "./images/cefvit/1.png",
                "./images/cefvit/2.png",
                "./images/cefvit/3.png"
            ]
        }
    ];
    
    displayProducts();
    // displayFeaturedProducts();
}

// FIXED: Navigation Functions - Use smooth scroll instead of hiding/showing sections
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

function navigateToAbout() {
    navigateToSection('about');
}

function navigateToContact() {
    navigateToSection('contact');
}

// Hero Slider Functions
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('heroDots');
    
    if (!dotsContainer || slides.length === 0) return;
    
    // Create dots
    slides.forEach((slide, index) => {
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
function displayProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// function displayFeaturedProducts() {
//     const container = document.getElementById('featuredProducts');
//     if (!container) return;
    
//     container.innerHTML = '';
    
//     // Show first 3 products as featured
//     const featuredProducts = products.slice(0, 3);
    
//     featuredProducts.forEach(product => {
//         const productCard = createProductCard(product);
//         container.appendChild(productCard);
//     });
// }

// Create product card with proper event handling
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.setAttribute('data-category', product.category);
    
    // Create image element with fallback
    const imageHtml = product.images && product.images.length > 0 
        ? `<img src="${product.images[0]}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="fallback-icon" style="display:none;">💊</div>`
        : `<div class="fallback-icon">💊</div>`;
    
    card.innerHTML = `
        <div class="product-image">
            ${imageHtml}
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
        addButton.addEventListener('click', function(e) {
            e.stopPropagation();
            addProductToInquiry(product.id);
        });
    }
    
    // Add click event to entire card for opening modal (except + button)
    card.addEventListener('click', function(e) {
        // Don't open modal if + button was clicked
        if (e.target.classList.contains('card-add-button') || e.target.closest('.card-add-button')) {
            return;
        }
        openProductModal(product.id);
    });
    
    return card;
}

// Add product to inquiry from card + button
function addProductToInquiry(productId) {
    console.log('Adding product to inquiry from card:', productId);
    
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
    setupProductImageSlider(product.images);
    
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
    
    if (!name || !email || !phone) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const productList = inquiryList.map(item => `- ${item.name} (${item.category})`).join('\n');
    
    const subject = `Bulk Partnership Inquiry - ${inquiryList.length} Products - New Business`;
    const body = `Dear Business Development Team,

I am interested in establishing a partnership with Pearson Pharmaceutical (Est. 2024) and would like to inquire about bulk pricing and distribution opportunities.

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}

Products of Interest:
${productList}

Partnership Interests:
□ Bulk purchasing with competitive pricing
□ Distribution rights for my region
□ Long-term partnership with growing company
□ Flexible terms for new business relationships

Additional Message:
${message}

As you are newly established, I believe there are mutual growth opportunities. Please provide detailed information about:
- Competitive bulk pricing
- Partnership terms and conditions
- Distribution support
- Business development opportunities

Best regards,
${name}

Pearson Pharmaceutical Contact:
Business Development: bd@pearsonpharma.com
General Inquiries: info@pearsonpharma.com
Phone: +91 9876543210
Address: Plot No. 45, Pharmaceutical Park, Phase-I, Vapi - 396191, Gujarat, India`;
    
    // Create mailto link for proper email functionality
    const emailLink = `mailto:bd@pearsonpharma.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    try {
        window.open(emailLink, '_blank');
        showNotification('Email client opened. Please send the inquiry.', 'success');
    } catch (error) {
        // Fallback: show email content for copying
        showEmailPreview(subject, body, 'Bulk Partnership Inquiry');
    }
    
    // Reset form and clear inquiries
    const form = document.getElementById('bulkInquiryForm');
    if (form) form.reset();
    
    clearInquiries();
    closeInquiryModal();
}

// Filter Functions
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
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
        bulkInquiryForm.addEventListener('submit', function(e) {
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

Pearson Pharmaceutical Contact:
Business Development: bd@pearsonpharma.com
General Inquiries: info@pearsonpharma.com
Phone: +91 9876543210
Address: Plot No. 45, Pharmaceutical Park, Phase-I, Vapi - 396191, Gujarat, India
Established: 2024 - "Newly Established - Growing Together"`;
    
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
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        if (e.target.id === 'productModal') {
            closeProductModal();
        } else if (e.target.id === 'inquiryModal') {
            closeInquiryModal();
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
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
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Please refresh the page if issues persist.', 'error');
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing application');
});