// Header and navigation related functions

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // Mobile drawer toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerBackdrop = document.createElement('div');
    drawerBackdrop.className = 'drawer-backdrop';
    document.body.appendChild(drawerBackdrop);

    function openDrawer() {
        if (mobileDrawer) mobileDrawer.classList.add('open');
        drawerBackdrop.classList.add('visible');
        if (navToggle) navToggle.setAttribute('aria-expanded','true');
    }

    function closeDrawer() {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        drawerBackdrop.classList.remove('visible');
        if (navToggle) navToggle.setAttribute('aria-expanded','false');
    }

    const drawerCloseBtn = document.querySelector('.drawer-close');
    
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            if (mobileDrawer && mobileDrawer.classList.contains('open')) closeDrawer(); else openDrawer();
        });
    }

    // Close drawer when clicking close button
    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    drawerBackdrop.addEventListener('click', closeDrawer);

    // Close drawer when a nav link is clicked (mobile)
    document.querySelectorAll('.mobile-drawer .nav-link').forEach(link => {
        link.addEventListener('click', function () { closeDrawer(); });
    });
}

function navigateToSection(sectionName) {
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) activeLink.classList.add('active');
}

function navigateToHome() { navigateToSection('home'); }
function navigateToProducts() { navigateToSection('products'); }
function navigateToContact() { navigateToSection('contact'); }

