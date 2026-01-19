/**
 * Antigravity Portfolio Script
 * Handles canvas background particles and magnetic mouse interaction.
 */

const canvas = document.getElementById('antigravity-bg');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let hue = 0; // For subtle color cycling if needed

// Mouse position object
const mouse = {
    x: undefined,
    y: undefined,
    radius: 150 // Radius of interaction
}

// Track mouse movement
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(); // Re-init particles on resize to maintain density
}

window.addEventListener('resize', resizeCanvas);

// Random number generator helper
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Low velocity for "floating" feel (antigravity)
        // Adjust these values to change base speed
        this.size = Math.random() * 3 + 1; // Different sizes for depth
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1; // Mass/Weight factor

        // Random drift velocity
        this.vx = randomRange(-0.5, 0.5);
        this.vy = randomRange(-0.5, 0.5);
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Faint white
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // 1. Base Float Movement (Antigravity drift)
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen edges (Infinite space feel)
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // 2. Mouse Interaction (Repulsion/Magnetic)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // If mouse is close enough
        if (distance < mouse.radius) {
            // Calculate force direction
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;

            // Force magnitude (stronger when closer)
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;

            // Direction multiplier: -1 for repulsion (push away), 1 for attraction
            // We want repulsion to feel like displacing matter
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
        }

        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    // Number of particles based on screen area logic
    const numberOfParticles = (canvas.height * canvas.width) / 9000;

    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    // Clear canvas with slight fade trail for "smear" effect if desired, 
    // but strict clear is cleaner for minimal style.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections lines (constellations) - Optional, adds complexity
    // connect(); 

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    requestAnimationFrame(animate);
}

// Optional: Join particles with lines if close
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                if (opacityValue > 0) {
                    ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue * 0.05 + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
}

// Initialize
resizeCanvas(); // Set size and init particles
animate();


// --- Custom Smooth Scroll with Easing ---
// Provides a more noticeable and premium scroll effect than default CSS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (!targetElement) return;

        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const headerOffset = 100; // Match the CSS scroll-margin-top
        const finalPosition = targetPosition - headerOffset;
        const distance = finalPosition - startPosition;
        const duration = 1500; // Duration in ms (1.5 seconds) - Slower and smoother
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;

            // Ease-in-out Cubic function for premium feel
            // t = current time, b = start value, c = change in value, d = duration
            const easeInOutCubic = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            };

            const y = easeInOutCubic(progress, startPosition, distance, duration);

            window.scrollTo(0, y);

            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    });
});


// --- Language Switcher Logic ---
const translations = {
    es: {
        nav_about: "Sobre Mí",
        nav_skills: "Habilidades",
        nav_projects: "Proyectos",
        nav_contact: "Contacto",
        hero_subtitle: "Denis Leandro Borri",
        hero_title: "ANALISTA FUNCIONAL <br><span class='highlight'>EN SISTEMAS INFORMATICOS</span>",
        hero_desc: "Desarrollador Frontend / Backend & Desarrollador UI/UX",
        hero_explore: "Explorar",
        about_title: "01. Sobre Mí",
        about_text1: "Soy Analista En Sistemas Informáticos y Programador, enfocado en el desarrollo web y en la creación de soluciones digitales funcionales. Trabajo con HTML, CSS y JavaScript, combinando una base técnica sólida con una mirada práctica orientada a resolver problemas reales.",
        about_text2: "Tengo experiencia desarrollando proyectos propios y emprendimientos, lo que me permitió integrar tecnología, organización y pensamiento estratégico. Me motiva aprender de forma constante y aplicar la programación para optimizar procesos y generar valor.",
        skills_title: "02. Habilidades",
        skills_frontend: "Frontend",
        skills_backend: "Backend",
        skills_tools: "Herramientas",
        projects_title: "03. Proyectos Seleccionados",
        project1_desc: "Sitio web desarrollado para AB Shine. Solución completa de presencia digital.",
        project_future_title: "Próximamente",
        project_future_desc: "Trabajando en nuevas ideas y soluciones innovadoras.",
        contact_title: "04. Contacto",
        contact_text: "¿Tienes un proyecto en mente que desafíe la gravedad? Hablemos.",
        contact_cta: "Iniciar Conversación"
    },
    en: {
        nav_about: "About Me",
        nav_skills: "Skills",
        nav_projects: "Projects",
        nav_contact: "Contact",
        hero_subtitle: "Denis Leandro Borri",
        hero_title: "SYSTEMS ANALYST <br><span class='highlight'>& DEVELOPER</span>",
        hero_desc: "Frontend / Backend Developer & UI/UX Designer",
        hero_explore: "Explore",
        about_title: "01. About Me",
        about_text1: "I am a Systems Analyst and Programmer, focused on web development and creating functional digital solutions. I work with HTML, CSS, and JavaScript, combining a solid technical foundation with a practical approach oriented towards solving real problems.",
        about_text2: "I have experience developing personal projects and ventures, which allowed me to integrate technology, organization, and strategic thinking. I am motivated by constant learning and applying programming to optimize processes and generate value.",
        skills_title: "02. Skills",
        skills_frontend: "Frontend",
        skills_backend: "Backend",
        skills_tools: "Tools",
        projects_title: "03. Selected Projects",
        project1_desc: "Website developed for AB Shine. Complete digital presence solution.",
        project_future_title: "Coming Soon",
        project_future_desc: "Working on new ideas and innovative solutions.",
        contact_title: "04. Contact",
        contact_text: "Have a project in mind that defies gravity? Let's talk.",
        contact_cta: "Start Conversation"
    }
};

let currentLang = 'es';
const langToggleBtn = document.getElementById('lang-toggle');

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // Check if content contains HTML tags (like <br> or <span>)
            if (translations[lang][key].includes('<')) {
                element.innerHTML = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update button text to show the OTHER language option (if current is ES, show EN)
    if (lang === 'es') {
        langToggleBtn.textContent = 'EN';
    } else {
        langToggleBtn.textContent = 'ES';
    }
}

if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        updateLanguage(currentLang);
    });
}


// --- Mobile Menu Logic ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');
        // Hamburger Animation
        hamburger.classList.toggle('toggle');

        // Animate Links (Optional refinement if needed, currently CSS handles simple fade)
    });
}

// Close menu when a link is clicked
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
        hamburger.classList.remove('toggle');
    });
});


// --- CV Button Logic ---
const cvBtn = document.getElementById('cv-btn');
if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = currentLang === 'es'
            ? "El Curriculum Vitae se está actualizando. Por favor, vuelve pronto."
            : "The Curriculum Vitae is being updated. Please come back soon.";
        alert(msg);
    });
}
