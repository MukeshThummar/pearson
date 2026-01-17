// Contact form validators and form handling

function isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    if (!phone) return false;
    const digits = (phone.match(/\d/g) || []).length;
    if (digits < 7) return false;
    const re = /^[0-9+()\s-]{7,20}$/;
    return re.test(phone);
}

function initializeForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleContactForm);

    const InquiryForm = document.getElementById('InquiryForm');
    if (InquiryForm) InquiryForm.addEventListener('submit', function (e) {
        e.preventDefault(); sendInquiry();
    });
}

function handleContactForm(e) {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value?.trim() || '';
    const email = document.getElementById('contactEmail')?.value?.trim() || '';
    const phone = document.getElementById('contactPhone')?.value?.trim() || '';
    const company = document.getElementById('contactCompany')?.value?.trim() || '';
    const message = document.getElementById('contactMessage')?.value?.trim() || '';

    if (!name || !email || !phone || !message) {
        showNotification && showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification && showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (!isValidPhone(phone)) {
        showNotification && showNotification('Please enter a valid phone number', 'error');
        return;
    }

    sendContactFormEmail(name, email, phone, company, message);
}

async function sendContactFormEmail(name, email, phone, company, message) {
    const form = document.getElementById('contactForm');
    
    const sent = await sendEmail({
        name: name,
        email: email,
        phone: phone,
        company: company,
        message: message,
        products: [],
        type: 'contact'
    });

    if (sent) {
        if (form) form.reset();
    }
}
