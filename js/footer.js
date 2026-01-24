// Footer and utility functions (notifications, loading, appsettings population)

function showNotification(message, type = 'info') {
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

    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => { setTimeout(() => notification.remove(), 300); }, 5000);
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.remove('hidden');
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function populateAppSettings() {
    try {
        const company = window.appsettings && window.appsettings.companyDetails;
        if (!company) return;

        const settings = company.contact || {};

        const addrEl = document.getElementById('contact-address');
        if (addrEl && settings.address) addrEl.textContent = settings.address;

        const phoneEl = document.getElementById('contact-phone');
        if (phoneEl && settings.phone) {
            const raw = settings.phone;
            const href = 'tel:' + raw.replace(/[^+0-9]/g, '');
            phoneEl.setAttribute('href', href);
            phoneEl.textContent = raw;
        }

        const emailEl = document.getElementById('contact-email');
        if (emailEl && settings.email) {
            emailEl.setAttribute('href', 'mailto:' + settings.email);
            emailEl.textContent = settings.email;
        }

        const reg = company.regulatory || {};
        const gstEl = document.getElementById('reg-gst');
        if (gstEl && reg.gst) gstEl.textContent = reg.gst;
        const licEl = document.getElementById('reg-drug-license');
        if (licEl && reg.drugLicense) licEl.textContent = reg.drugLicense;
        const estEl = document.getElementById('reg-established');
        if (estEl && reg.established) estEl.textContent = reg.established;

        const name = company.name;
        const desc = company.description;

        if (name) {
            // try { document.title = name; } catch (e) {}
            // if (company.logoPath) {
            //     const favicon = document.querySelector('link[rel="icon"]');
            //     if (favicon) favicon.setAttribute('href', company.logoPath);
            // }
            const logoImg = document.getElementById('company-logo');
            if (logoImg) {
                if (company.logoPath) logoImg.setAttribute('src', company.logoPath);
                logoImg.setAttribute('alt', name);
            }
            const welcomeEl = document.getElementById('company-welcome');
            if (welcomeEl) welcomeEl.textContent = 'Welcome to ' + name;
            const footerName = document.getElementById('footer-company-name');
            if (footerName) footerName.textContent = name;
            const copyEl = document.getElementById('footer-copyright');
            if (copyEl) copyEl.innerHTML = '&copy; ' + new Date().getFullYear() + ' ' + (name || '') + '. All rights reserved.';
            
            // // Populate SEO hidden H1 tag
            // const seoHeading = document.getElementById('seo-main-heading');
            // if (seoHeading) seoHeading.textContent = name;
        }

        if (desc) {
            // const metaDesc = document.querySelector('meta[name="description"]');
            // if (metaDesc) metaDesc.setAttribute('content', name + ' - ' + desc);
            const introDesc = document.getElementById('company-description');
            if (introDesc) introDesc.textContent = desc;
            const footerDesc = document.getElementById('footer-company-desc');
            if (footerDesc) footerDesc.textContent = desc;
            
            // // Populate SEO hidden P tag
            // const seoDescription = document.getElementById('seo-main-description');
            // if (seoDescription) seoDescription.textContent = desc;
        }
    } catch (err) {
        console.error('Failed to populate contact from settings', err);
    }
}

// Debounce helper (used by resize listener)
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
// This mirrors previous behavior in the monolith.
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
