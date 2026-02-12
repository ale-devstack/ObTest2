// ===========================
// Navbar Scroll Effect
// ===========================
const navbar = document.getElementById('mainNav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Cambiar el navbar a negro después de 50px de scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===========================
// Menú Hamburguesa Mobile
// ===========================
const navbarToggler = document.getElementById('navbarToggler');
const navbarContent = document.getElementById('navbarContent');
const body = document.body;

// Toggle del menú hamburguesa
navbarToggler.addEventListener('click', () => {
    // Toggle clases
    navbarToggler.classList.toggle('active');
    navbarContent.classList.toggle('show');
    body.classList.toggle('menu-open');
});

// Cerrar menú al hacer click en un link
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Solo cerrar en mobile
        if (window.innerWidth <= 991) {
            navbarToggler.classList.remove('active');
            navbarContent.classList.remove('show');
            body.classList.remove('menu-open');
        }
    });
});

// Cerrar menú al hacer click fuera del menú (en el overlay)
document.addEventListener('click', (e) => {
    const isClickInsideNav = navbar.contains(e.target);
    const isMenuOpen = navbarContent.classList.contains('show');

    if (!isClickInsideNav && isMenuOpen && window.innerWidth <= 991) {
        navbarToggler.classList.remove('active');
        navbarContent.classList.remove('show');
        body.classList.remove('menu-open');
    }
});

// ===========================
// Smooth Scroll para los enlaces
// ===========================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Solo hacer smooth scroll si es un anchor link (#)
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===========================
// Resize Handler
// ===========================
window.addEventListener('resize', () => {
    // Cerrar el menú mobile si se redimensiona a desktop
    if (window.innerWidth > 991) {
        navbarToggler.classList.remove('active');
        navbarContent.classList.remove('show');
        body.classList.remove('menu-open');
    }
});

// ===========================
// Active Link on Scroll
// ===========================
const sections = document.querySelectorAll('section[id]');

function highlightActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightActiveLink);

// ===========================
// Inicialización
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Highlight el link activo al cargar
    highlightActiveLink();
    
    // Pequeña animación de entrada del navbar
    setTimeout(() => {
        navbar.style.opacity = '1';
    }, 100);
    
    // Animar números de estadísticas
    animateStats();
    
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });
    
    // Inicializar carrusel de servicios
    initServicesCarousel();
});

// ===========================
// Carrusel de Servicios
// ===========================
function initServicesCarousel() {
    const cards = document.querySelectorAll('.service-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevService');
    const nextBtn = document.getElementById('nextService');
    const carouselContainer = document.querySelector('.servicios-carousel');
    
    if (!cards.length) return;
    
    let currentSlide = 0;
    let autoPlayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    function showSlide(index) {
        // Remove active class from all cards and indicators
        cards.forEach(card => {
            card.classList.remove('active');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to current slide
        if (cards[index]) {
            cards[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= cards.length) {
            next = 0;
        }
        showSlide(next);
    }
    
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = cards.length - 1;
        }
        showSlide(prev);
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 6000); // Cambio cada 6 segundos
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function handleGesture() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - prev slide
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        }
    }
    
    // Touch events para swipe en mobile
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, { passive: true });
        
        // Pausar autoplay cuando el mouse está sobre el carrusel
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Event listeners para botones
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay(); // Reiniciar autoplay
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay(); // Reiniciar autoplay
        });
    }
    
    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay(); // Reiniciar autoplay
        });
    });
    
    // Iniciar autoplay
    startAutoPlay();
    
    // Mostrar primera slide
    showSlide(0);
}

// ===========================
// Animación de Números de Estadísticas
// ===========================
function animateStats() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    
    // Determinar el sufijo
    const statLabel = element.nextElementSibling.textContent;
    let suffix = '';
    if (statLabel.includes('Tasa')) {
        suffix = '%';
    } else if (statLabel.includes('Empresas')) {
        suffix = '+';
    } else if (statLabel.includes('Años')) {
        suffix = '+';
    }
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}