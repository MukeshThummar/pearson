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
        if (mobileDrawer) {
            mobileDrawer.classList.add('open');
            mobileDrawer.style.pointerEvents = 'auto';
        }
        if (drawerBackdrop) {
            drawerBackdrop.classList.add('visible');
            // Allow backdrop to receive clicks
            drawerBackdrop.style.pointerEvents = 'auto';
        }
        if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
        console.log('Closing drawer');
        if (mobileDrawer) {
            mobileDrawer.classList.remove('open');
            mobileDrawer.style.pointerEvents = 'auto';
        }
        if (drawerBackdrop) {
            drawerBackdrop.classList.remove('visible');
            // Disable backdrop clicks when closed
            drawerBackdrop.style.pointerEvents = 'none';
        }
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

    // Close drawer when clicking on backdrop (empty area outside drawer)
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', function(e) {
            console.log('Backdrop clicked - checking if should close');
            // Check if click originated from outside the drawer
            const mobileDrawer = document.querySelector('.mobile-drawer');
            if (mobileDrawer && !mobileDrawer.contains(e.target)) {
                console.log('Click outside drawer - closing');
                closeDrawer();
            } else {
                console.log('Click inside drawer - NOT closing');
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
    
    // Close drawer after navigation
    const mobileDrawer = document.querySelector('.mobile-drawer');
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        const backdrop = document.querySelector('.drawer-backdrop');
        mobileDrawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');
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
