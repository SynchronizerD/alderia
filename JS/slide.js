/* ========================================
   ALDERIA — SLIDER
   Appelé après chaque chargement de page
======================================== */

let slideInterval;

function initSlider() {

    // Arrête l'ancien slider s'il existe
    clearInterval(slideInterval);

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // La page n'a pas de slider
    if (!slides.length) return;

    let currentIndex = 0;

    // Afficher une diapositive précise
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');

        currentIndex = index;
    }

    // Clic sur les points
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showSlide(parseInt(dot.dataset.index, 10));
            resetAutoPlay();
        });
    });

    // Défilement automatique toutes les 5 secondes
    function startAutoPlay() {
        slideInterval = setInterval(() => {
            showSlide((currentIndex + 1) % slides.length);
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(slideInterval);
        startAutoPlay();
    }

    startAutoPlay();
}