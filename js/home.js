// Home slider and application initializer

function initializeHomeSlider() {
    const slider = document.getElementById('homeSlider');
    const dotsContainer = document.getElementById('homeDots');
    if (!slider || !dotsContainer) return;
    if (!Array.isArray(slides) || slides.length === 0) return;
    renderHomeSlides(slides, slider, dotsContainer);
}



function renderHomeSlides(slidesArr, slider, dotsContainer) {
    slider.innerHTML = '';
    slidesArr.forEach((s, index) => {
        const slide = document.createElement('div');
        slide.classList.add('home-slide');
        if (index === 0) slide.classList.add('active');
        slide.innerHTML = `
            <img src="./images/${s.image}" alt="${s.title}">
            <div class="home-content">
                <h1>${s.title}</h1>
                <p>${s.subtitle}</p>
            </div>
        `;
        slider.appendChild(slide);
    });
    dotsContainer.innerHTML = '';
    slidesArr.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('home-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    if (homeAutoAdvance) clearInterval(homeAutoAdvance);
    homeAutoAdvance = setInterval(nextSlide, 5000);

    let touchStartX = 0;
    let touchEndX = 0;
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const threshold = 40;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) nextSlide();
            else previousSlide();
            if (homeAutoAdvance) {
                clearInterval(homeAutoAdvance);
                homeAutoAdvance = setInterval(nextSlide, 5000);
            }
        }
    }
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.home-slide');
    const dots = document.querySelectorAll('.home-dot');
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
    if (homeAutoAdvance) { clearInterval(homeAutoAdvance); homeAutoAdvance = setInterval(nextSlide, 5000); }
}

function nextSlide() {
    const slides = document.querySelectorAll('.home-slide');
    if (slides.length === 0) return; currentSlide = (currentSlide + 1) % slides.length; goToSlide(currentSlide);
}

function previousSlide() {
    const slides = document.querySelectorAll('.home-slide');
    if (slides.length === 0) return; currentSlide = (currentSlide - 1 + slides.length) % slides.length; goToSlide(currentSlide);
}
