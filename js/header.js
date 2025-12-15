// Header and navigation related functions

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handler function for nav link clicks
    function handleNavLinkClick(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        console.log('Nav link clicked - Section:', section);
        navigateToSection(section);
        // Close drawer if this is a mobile drawer link
        const drawer = document.querySelector('.mobile-drawer');
        if (drawer && drawer.classList.contains('open')) {
            closeDrawer();
        }
    }
    
    // Add click handler to ALL nav links (both desktop and mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    // Mobile drawer toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    let drawerBackdrop = document.querySelector('.drawer-backdrop');
    
    // Create backdrop if it doesn't exist
    if (!drawerBackdrop) {
        drawerBackdrop = document.createElement('div');
        drawerBackdrop.className = 'drawer-backdrop';
        document.body.appendChild(drawerBackdrop);
    }

    function openDrawer() {
        console.log('Opening drawer');
        if (mobileDrawer) mobileDrawer.classList.add('open');
        if (drawerBackdrop) drawerBackdrop.classList.add('visible');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
        console.log('Closing drawer');
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        if (drawerBackdrop) drawerBackdrop.classList.remove('visible');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }

    // Toggle drawer on hamburger click
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            console.log('Toggle button clicked');
            if (mobileDrawer && mobileDrawer.classList.contains('open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    // Close drawer on backdrop click
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeDrawer);
    }
}

function navigateToSection(sectionName) {
    console.log('Navigating to section:', sectionName);
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        console.log('Scrolled to section:', sectionName);
    } else {
        console.warn('Section not found:', sectionName);
    }
    
    // Update active link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        console.log('Active link updated for:', sectionName);
    }
}

function navigateToHome() { navigateToSection('home'); }
function navigateToProducts() { navigateToSection('products'); }
function navigateToContact() { navigateToSection('contact'); }
