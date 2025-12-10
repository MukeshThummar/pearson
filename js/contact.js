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
    const name = document.getElementById('contactName')?.value || '';
    const email = document.getElementById('contactEmail')?.value || '';
    const phone = document.getElementById('contactPhone')?.value || '';
    const company = document.getElementById('contactCompany')?.value || '';
    const message = document.getElementById('contactMessage')?.value || '';

    if (!name || !email || !phone || !message) {
        showNotification && showNotification('Please fill in all required fields', 'error');
        return;
    }

    showNotification && showNotification('Under Construction', 'info');
    const form = document.getElementById('contactForm'); if (form) form.reset();
}

function showEmailPreview(subject, content, type) {
    showNotification && showNotification('Under Construction', 'info');
}

function copyToClipboard(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    else {
        const textArea = document.createElement('textarea');
        textArea.value = text; document.body.appendChild(textArea); textArea.select();
        document.execCommand('copy'); document.body.removeChild(textArea);
    }
}
