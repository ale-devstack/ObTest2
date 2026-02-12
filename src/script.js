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
});

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