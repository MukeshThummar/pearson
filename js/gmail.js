// Email sending module via Google Apps Script Web App
// Pre-configured backend (no OAuth popups, no user authentication)
// Frontend POSTs form data to Apps Script webhook, which sends emails via Gmail

/**
 * Send inquiry/contact email via Google Apps Script webhook
 * @param {object} data - Email data { name, email, phone, company, message, products }
 * @returns {Promise<boolean>} True if sent, false if failed
 */
async function sendEmail(data) {
    try {
        // Get webhook URL from appsettings
        const webhookUrl = window.appsettings?.companyDetails?.gmail?.webhookUrl;
        
        if (!webhookUrl) {
            console.error('Gmail webhook URL not configured in appsettings');
            showNotification && showNotification('Email configuration error. Please contact support.', 'error');
            return false;
        }

        // Show loading state
        showLoading && showLoading();

        // Build form data
        const formData = new FormData();
        const payload = {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            company: data.company || '',
            message: data.message || '',
            products: data.products || [],
            type: data.type || 'inquiry',  // 'inquiry' or 'contact'
            timestamp: new Date().toISOString()
        };
        formData.append('payload', JSON.stringify(payload));

        // POST data to Google Apps Script webhook
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData
        });

        hideLoading && hideLoading();

        if (!response.ok) {
            const error = await response.text();
            console.error('Apps Script error:', error);
            showNotification && showNotification('Failed to send inquiry. Please try again.', 'error');
            return false;
        }

        const result = await response.json();
        
        if (result.success) {
            showNotification && showNotification('Inquiry sent successfully!', 'success');
            return true;
        } else {
            console.error('Apps Script returned error:', result.message);
            showNotification && showNotification('Failed to send inquiry.', 'error');
            return false;
        }

    } catch (error) {
        console.error('Error sending email:', error);
        showNotification && showNotification('Error: ' + error.message, 'error');
        hideLoading && hideLoading();
        return false;
    }
}
