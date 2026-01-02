// WhatsApp Button Handler
// Reads WhatsApp config from window.appsettings and sets up the button link

function initializeWhatsAppButton() {
    const whatsappButton = document.getElementById('whatsappButton');
    
    if (!whatsappButton) {
        console.warn('WhatsApp button element not found');
        return;
    }

    // Wait for appsettings to be available
    if (!window.appsettings) {
        console.warn('appsettings not loaded yet, retrying...');
        setTimeout(initializeWhatsAppButton, 100);
        return;
    }

    const whatsappConfig = window.appsettings.companyDetails?.whatsapp;
    if (!whatsappConfig || !whatsappConfig.phoneNumber) {
        console.warn('WhatsApp phone number not configured in appsettings');
        return;
    }

    const phoneNumber = whatsappConfig.phoneNumber.replace(/[^0-9+]/g, ''); // Clean phone number
    const message = whatsappConfig.message || ''; // Optional message
    
    // Build WhatsApp Web URL (https://wa.me/{phone_number}?text={message})
    let whatsappUrl = `https://wa.me/${phoneNumber}`;
    if (message) {
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        whatsappUrl += `?text=${encodedMessage}`;
    }

    // Set the href and open in new tab
    whatsappButton.href = whatsappUrl;
    whatsappButton.target = '_blank';
    whatsappButton.rel = 'noopener noreferrer';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWhatsAppButton);
} else {
    initializeWhatsAppButton();
}
