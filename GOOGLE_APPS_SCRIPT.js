// Google Apps Script - Email Sending Web App
// Deploy this script as a Web App to send emails via Gmail API
// 
// SETUP INSTRUCTIONS:
// 1. Go to script.google.com
// 2. Create new project
// 3. Copy this entire code into the script editor
// 4. Click Deploy > New deployment > Web app
//    - Execute as: Your Google Account
//    - Who has access: Anyone (or your domain for security)
// 5. Copy the deployment URL and paste it in data/appsettings.js
//    in the gmail.webhookUrl field
// 6. Test by filling out a form on your website

// Configuration (Update with your email addresses)
const OWNER_EMAIL = 'salespearsonpharmaceutical@gmail.com';  // App owner email
const SENDER_NAME = 'Pearson Pharmaceutical';            // Display name

/**
 * Main handler for POST requests from frontend
 */
function doPost(e) {
    try {
        // Parse incoming data from FormData
        let payload;
        
        if (e.parameter && e.parameter.payload) {
            // FormData comes via e.parameter.payload
            payload = JSON.parse(e.parameter.payload);
        } else if (e.postData && e.postData.contents) {
            // JSON body comes via e.postData.contents
            payload = JSON.parse(e.postData.contents);
        } else {
            console.error('No data received in doPost');
            return createResponse(false, 'No data received');
        }
        
        // Validate required fields
        if (!payload.name || !payload.email) {
            return createResponse(false, 'Missing required fields: name, email');
        }

        // Send emails
        const emailType = payload.type || 'inquiry';
        const sent = sendEmails(payload, emailType);

        if (sent) {
            return createResponse(true, 'Email sent successfully');
        } else {
            return createResponse(false, 'Failed to send email');
        }

    } catch (error) {
        console.error('Error in doPost:', error);
        return createResponse(false, 'Server error: ' + error.message);
    }
}

/**
 * Send emails to app owner and user
 */
function sendEmails(data, emailType) {
    try {
        const emailHtml = buildEmailHtml(data, emailType);
        const subject = buildEmailSubject(data, emailType);

        // Email 1: Send to app owner
        GmailApp.sendEmail(
            OWNER_EMAIL,
            subject + ' [To: ' + OWNER_EMAIL + ']',
            '',  // plainTextBody (empty)
            {
                htmlBody: emailHtml,
                from: OWNER_EMAIL,
                name: SENDER_NAME,
                replyTo: data.email
            }
        );

        // Email 2: Send confirmation to user
        const confirmationHtml = buildConfirmationEmailHtml(data);
        GmailApp.sendEmail(
            data.email,
            'We received your ' + emailType + ' - ' + SENDER_NAME,
            '',  // plainTextBody (empty)
            {
                htmlBody: confirmationHtml,
                from: OWNER_EMAIL,
                name: SENDER_NAME
            }
        );

        return true;

    } catch (error) {
        console.error('Error sending emails:', error);
        return false;
    }
}

/**
 * Build email subject line
 */
function buildEmailSubject(data, emailType) {
    if (emailType === 'inquiry') {
        return `New Product Inquiry from ${data.name} - ${data.company || 'No Company'}`;
    } else {
        return `New Contact Form Submission from ${data.name}`;
    }
}

/**
 * Build HTML email for app owner
 */
function buildEmailHtml(data, emailType) {
    const productsHtml = (data.products && data.products.length > 0)
        ? `
        <h3 style="color: #0d9488; margin-top: 20px; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">
            Interested Products
        </h3>
        <ul style="list-style: none; padding: 0;">
            ${data.products.map(p => `
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <strong>${p.name}</strong> (${p.category})
                </li>
            `).join('')}
        </ul>
        `
        : '';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; }
            h2 { color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px; }
            h3 { color: #0d9488; margin-top: 20px; font-size: 16px; }
            .section { margin-bottom: 20px; padding: 15px; background-color: #fff; border-left: 4px solid #0d9488; }
            .field { margin-bottom: 10px; }
            .label { font-weight: 600; color: #0d9488; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #999; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>New ${emailType === 'inquiry' ? 'Product Inquiry' : 'Contact'} Submission</h2>

            <div class="section">
                <h3>Sender Information</h3>
                <div class="field">
                    <span class="label">Name:</span> ${escapeHtml(data.name)}
                </div>
                <div class="field">
                    <span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a>
                </div>
                <div class="field">
                    <span class="label">Phone:</span> ${escapeHtml(data.phone)}
                </div>
                ${data.company ? `
                <div class="field">
                    <span class="label">Company:</span> ${escapeHtml(data.company)}
                </div>
                ` : ''}
            </div>

            <div class="section">
                <h3>Message</h3>
                <p>${escapeHtml(data.message || '(No message)')}</p>
            </div>

            ${productsHtml}

            <div class="footer">
                <p>Sent at: ${new Date().toLocaleString()}</p>
                <p>Type: ${emailType}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return html;
}

/**
 * Build confirmation email for user
 */
function buildConfirmationEmailHtml(data) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; }
            h2 { color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px; }
            .section { margin-bottom: 20px; padding: 15px; background-color: #fff; border-left: 4px solid #0d9488; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #999; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Thank You, ${escapeHtml(data.name)}!</h2>

            <div class="section">
                <p>We have received your inquiry and will get back to you as soon as possible.</p>
                <p><strong>Your contact details:</strong></p>
                <ul>
                    <li>Name: ${escapeHtml(data.name)}</li>
                    <li>Email: ${escapeHtml(data.email)}</li>
                    <li>Phone: ${escapeHtml(data.phone)}</li>
                </ul>
            </div>

            <div class="section">
                <p>Our team at ${SENDER_NAME} will review your inquiry and contact you within 24 hours.</p>
                <p>If you have any urgent matters, please call us directly.</p>
            </div>

            <div class="footer">
                <p>Best regards,<br><strong>${SENDER_NAME}</strong></p>
            </div>
        </div>
    </body>
    </html>
    `;

    return html;
}

/**
 * Escape HTML special characters for security
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Create JSON response
 */
function createResponse(success, message) {
    return ContentService.createTextOutput(
        JSON.stringify({
            success: success,
            message: message
        })
    ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function (for debugging)
 * Run this in the Apps Script editor to test email sending
 */
function testEmailSending() {
    const testData = {
        name: 'Test User',
        email: 'testuser@example.com',
        phone: '9876543210',
        company: 'Test Company',
        message: 'This is a test message',
        products: [
            { id: '001', name: 'Product 1', category: 'Category 1' },
            { id: '002', name: 'Product 2', category: 'Category 2' }
        ],
        type: 'inquiry'
    };

    const result = sendEmails(testData, 'inquiry');
    Logger.log('Test result: ' + result);
}
