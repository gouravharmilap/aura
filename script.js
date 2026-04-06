// ==========================================
// AURA - Refined Interactions
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCounters();
    initScrollReveal();
    initMobileMenu();
    initBlogFilter();
    initNewsletterForm();
});

// Navbar scroll effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

// Mobile menu toggle
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        element.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// Scroll reveal animations
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.querySelector('.nav-links')?.classList.remove('active');
        }
    });
});

// Blog filter
function initBlogFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (!filterBtns.length || !blogCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            blogCards.forEach((card, i) => {
                const category = card.getAttribute('data-category');
                const show = filter === 'all' || category === filter;

                if (show) {
                    card.classList.remove('hidden');
                    card.style.animationDelay = `${i * 50}ms`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Newsletter form - standard Formspree HTML form
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const messageEl = document.getElementById('newsletterMessage');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = form.querySelector('#emailInput');
        const btn = form.querySelector('.newsletter-btn');

        if (input.value.trim() === '') {
            input.style.borderColor = '#ef4444';
            setTimeout(() => { input.style.borderColor = ''; }, 500);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            input.style.borderColor = '#ef4444';
            setTimeout(() => { input.style.borderColor = ''; }, 500);
            return;
        }

        btn.innerHTML = '<span>Subscribing...</span>';
        btn.disabled = true;

        // Standard fetch POST to Formspree
        const formData = new FormData();
        formData.append('email', input.value);

        try {
            const res = await fetch('https://formspree.io/f/xpqokrdr', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                btn.innerHTML = '<span>Subscribed</span>';
                input.value = '';
                if (messageEl) {
                    messageEl.textContent = 'Thanks for subscribing!';
                    messageEl.className = 'newsletter-message success';
                }
                setTimeout(() => {
                    btn.innerHTML = `<span>Subscribe</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
                    btn.disabled = false;
                    messageEl.className = 'newsletter-message';
                }, 3000);
            } else {
                throw new Error('Server error');
            }
        } catch (err) {
            btn.innerHTML = `<span>Subscribe</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
            btn.disabled = false;
            if (messageEl) {
                messageEl.textContent = 'Something went wrong. Please try again.';
                messageEl.className = 'newsletter-message error';
            }
            setTimeout(() => {
                if (messageEl) messageEl.className = 'newsletter-message';
            }, 3000);
        }
    });
}
