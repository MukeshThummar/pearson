// Inquiry management: add/remove products, modal control, and inquiry list rendering

function addProductToInquiry(productId) {
    const product = (typeof products !== 'undefined') ? products.find(p => p.id === productId) : null;
    if (!product) { console.error('Product not found:', productId); return; }
    const existing = inquiryList.find(item => item.id === productId);
    if (existing) { showNotification && showNotification('Product already in inquiry list', 'warning'); return; }
    inquiryList.push({ id: product.id, name: product.name, category: product.category });
    updateInquiryCount();
    updateInquiryList();
    showNotification && showNotification(`${product.name} added to inquiry list`, 'success');
}

function removeFromInquiry(productId) {
    const productName = inquiryList.find(item => item.id === productId)?.name || 'Product';
    inquiryList = inquiryList.filter(item => item.id !== productId);
    updateInquiryCount();
    updateInquiryList();
    showNotification && showNotification(`${productName} removed from inquiry list`, 'info');
}

function updateInquiryCount() {
    const countElement = document.getElementById('inquiryCount');
    if (countElement) countElement.textContent = inquiryList.length;
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
            <button class="remove-inquiry" onclick="removeFromInquiry('${item.id}')">Remove</button>
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
        setTimeout(() => { modal.style.opacity = '1'; }, 10);
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
    showNotification && showNotification('All inquiries cleared', 'info');
}

function sendInquiry() {
    showNotification && showNotification('Under Construction', 'info');
    const form = document.getElementById('InquiryForm');
    if (form) form.reset();
    closeInquiryModal();
}
