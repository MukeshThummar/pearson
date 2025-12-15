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
        }
        if (drawerBackdrop) {
            drawerBackdrop.classList.add('visible');
        }
        if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
        console.log('Closing drawer');
        if (mobileDrawer) {
            mobileDrawer.classList.remove('open');
        }
        if (drawerBackdrop) {
            drawerBackdrop.classList.remove('visible');
        }
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }

    // Toggle drawer on hamburger click
    if (navToggle) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            console.log('Toggle button clicked');
            if (mobileDrawer && mobileDrawer.classList.contains('open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    // CRITICAL: Backdrop should only close drawer on backdrop click, NOT propagate from drawer
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', function(e) {
            // STOP PROPAGATION - don't let drawer clicks bubble to backdrop
            const mobileDrawer = document.querySelector('.mobile-drawer');
            
            // Only close if the click is directly on the backdrop element itself
            // and NOT on any child of the drawer
            if (mobileDrawer && mobileDrawer.contains(e.target)) {
                console.log('Click inside drawer - STOPPING PROPAGATION');
                e.stopPropagation();
                return;
            }
            
            // Only close if backdrop is visible and click is on backdrop
            if (drawerBackdrop.classList.contains('visible')) {
                console.log('Click on backdrop background - closing drawer');
                closeDrawer();
            }
        }, false); // Use capture phase
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
        console.log('Auto-closing drawer after navigation');
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
