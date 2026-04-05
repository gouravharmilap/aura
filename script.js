// ==========================================
// AURA - Ethical Hacker Blog Scripts
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initMatrixBackground();
    initNavbar();
    initCounters();
    initBlogFilter();
    initNewsletterForm();
    initScrollAnimations();
    initHackerCursorFollow();
});

// Matrix Background Effect
function initMatrixBackground() {
    const canvas = document.createElement('canvas');
    const matrixBg = document.getElementById('matrixBg');

    if (!matrixBg) return;

    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.12;';
    matrixBg.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Resize canvas to window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = 'AURA0123456789ABCDEFHACKERSECURITY@#$%^&*()+=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
    }

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 50);
}

// Navbar Scroll Effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Blog Filter
function initBlogFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (filterBtns.length === 0 || blogCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            blogCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Newsletter Form
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = form.querySelector('.newsletter-input');
        const btn = form.querySelector('.newsletter-btn');

        if (input.value.trim() === '') {
            input.style.borderColor = '#ff0055';
            input.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                input.style.borderColor = '';
                input.style.animation = '';
            }, 500);
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            input.style.borderColor = '#ff0055';
            input.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                input.style.borderColor = '';
                input.style.animation = '';
            }, 500);
            return;
        }

        // Simulate submission
        btn.innerHTML = '<span>Subscribing...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>Subscribed!</span> <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
            input.value = '';

            setTimeout(() => {
                btn.innerHTML = '<span>Subscribe</span> <i class="fas fa-paper-plane"></i>';
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Scroll Animations using Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.post-card, .social-card, .blog-card');

    if (animatedElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroVisual = document.querySelector('.hero-visual');
    const blogHero = document.querySelector('.blog-hero');

    if (heroVisual && scrolled < 600) {
        heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
    }

    if (blogHero && scrolled < 600) {
        blogHero.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});

// Add shake animation for invalid inputs
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Hacker Cursor Follow Effect
function initHackerCursorFollow() {
    const cornerHacker = document.getElementById('cornerHacker');
    if (!cornerHacker) return;

    const eyeLeft = document.getElementById('hackerEyeLeft');
    const eyeRight = document.getElementById('hackerEyeRight');

    document.addEventListener('mousemove', (e) => {
        const hackerRect = cornerHacker.getBoundingClientRect();
        const hackerCenterX = hackerRect.left + hackerRect.width / 2;
        const hackerCenterY = hackerRect.top + 50; // eyes area

        // Calculate angle from hacker to cursor
        const dx = e.clientX - hackerCenterX;
        const dy = e.clientY - hackerCenterY;
        const angle = Math.atan2(dy, dx);

        // Distance to cursor
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Max eye movement (in pixels)
        const maxMove = 5;

        // Calculate eye offset based on cursor position
        let eyeMoveX = 0;
        let eyeMoveY = 0;

        if (distance > 0) {
            const moveAmount = Math.min(maxMove, 200 / distance * 5);
            eyeMoveX = (dx / distance) * moveAmount;
            eyeMoveY = (dy / distance) * moveAmount;
        }

        // Apply eye movement with CSS transform
        if (eyeLeft && eyeRight) {
            eyeLeft.style.transform = `translate(${eyeMoveX}px, ${eyeMoveY}px)`;
            eyeRight.style.transform = `translate(${eyeMoveX}px, ${eyeMoveY}px)`;
        }

        // Head rotation effect (subtle body lean towards cursor)
        const headTilt = Math.atan2(dy, dx) * 180 / Math.PI;
        const bodyLean = Math.min(Math.abs(dx) / 500, 0.1);
        const leanDirection = dx > 0 ? 1 : -1;

        cornerHacker.style.transform = `rotate(${leanDirection * bodyLean * 10}deg)`;
    });
}
