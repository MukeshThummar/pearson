// Header and navigation related functions

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-list:not(.mobile-drawer .nav-list) .nav-link');
    
    // Handler function for nav link clicks (DESKTOP ONLY)
    function handleNavLinkClick(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        console.log('Desktop nav link clicked - Section:', section);
        navigateToSection(section);
    }
    
    // Add click handler to DESKTOP nav links only
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

    // Close drawer ONLY when clicking OUTSIDE the drawer (on backdrop)
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', function(e) {
            console.log('Backdrop clicked - target:', e.target);
            // Only close if click is directly on backdrop, not on drawer
            if (e.target === drawerBackdrop) {
                closeDrawer();
            }
        });
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
    
    // Update active link - both desktop and mobile
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLinks = document.querySelectorAll(`[data-section="${sectionName}"]`);
    activeLinks.forEach(link => {
        link.classList.add('active');
        console.log('Active link updated for:', sectionName);
    });
}

function navigateToHome() { navigateToSection('home'); }
function navigateToProducts() { navigateToSection('products'); }
function navigateToContact() { navigateToSection('contact'); }
