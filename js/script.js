// ===================================
// Al-Mulhem Contracting - JavaScript
// ===================================

// ===================================
// Mobile Menu Toggle
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// ===================================
// Smooth Scrolling for Anchor Links
// ===================================
function scrollToElement(selector, options) {
    var el = document.querySelector(selector);
    if (el) {
        el.scrollIntoView(Object.assign({ behavior: 'smooth', block: 'start' }, options || {}));
    }
}

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            scrollToElement(href);
            var navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Smooth scroll to hash on load (e.g. from index.html#contact)
if (window.location.hash) {
    window.addEventListener('load', function() {
        requestAnimationFrame(function() {
            scrollToElement(window.location.hash);
        });
    });
}

// ===================================
// Project Slider
// ===================================
const projectsSlider = document.querySelector('.projects-slider');
const sliderPrev = document.querySelector('.slider-prev');
const sliderNext = document.querySelector('.slider-next');

if (projectsSlider && sliderPrev && sliderNext) {
    sliderPrev.addEventListener('click', function() {
        projectsSlider.scrollBy({
            left: -320,
            behavior: 'smooth'
        });
    });
    
    sliderNext.addEventListener('click', function() {
        projectsSlider.scrollBy({
            left: 320,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Project Filter (Projects Page only – elements may be absent on division/other pages)
// ===================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length && projectCards.length) {
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                if (card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});
}

// ===================================
// Lead Form – validation & payload (Google Sheets ready)
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var firstNameEl = document.getElementById('firstName');
        var lastNameEl = document.getElementById('lastName');
        var emailEl = document.getElementById('email');
        var phoneEl = document.getElementById('phone');
        var companyEl = document.getElementById('company');
        var inquiryTypeEl = document.getElementById('inquiryType');
        var sourcePageEl = document.getElementById('sourcePage');
        var messageEl = document.getElementById('message');

        var firstName = firstNameEl ? firstNameEl.value.trim() : '';
        var lastName = lastNameEl ? lastNameEl.value.trim() : '';
        var email = emailEl ? emailEl.value.trim() : '';
        var phone = phoneEl ? phoneEl.value.trim() : '';
        var company = companyEl ? companyEl.value.trim() : '';
        var inquiryType = inquiryTypeEl ? inquiryTypeEl.value : '';
        var sourcePage = sourcePageEl ? sourcePageEl.value : '';
        var message = messageEl ? messageEl.value.trim() : '';

        var isValid = true;
        var errorMessage = '';

        if (!firstName) {
            errorMessage += 'First name is required.\n';
            isValid = false;
        }
        if (!lastName) {
            errorMessage += 'Last name is required.\n';
            isValid = false;
        }
        if (!email) {
            errorMessage += 'Email is required.\n';
            isValid = false;
        } else if (!isValidEmail(email)) {
            errorMessage += 'Please enter a valid email address.\n';
            isValid = false;
        }

        if (isValid) {
            // Lead payload – ready for Google Sheets / webhook
            var lead = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone || '',
                company: company || '',
                inquiryType: inquiryType || '',
                sourcePage: sourcePage || '',
                message: message || ''
            };
            // TODO: send to Google Sheets (e.g. fetch to Apps Script or form endpoint)
            if (typeof window.sendLeadToSheets === 'function') {
                window.sendLeadToSheets(lead);
            }
            var lang = localStorage.getItem('siteLang') || 'en';
            var t = window.SITE_TRANSLATIONS && window.SITE_TRANSLATIONS[lang];
            var msg = (t && t['leadform.success']) ? t['leadform.success'] : 'Thank you! We will get back to you soon.';
            alert(msg);
            contactForm.reset();
        } else {
            alert(errorMessage);
        }
    });
}

function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===================================
// Scroll Animations
// ===================================
function reveal() {
    const reveals = document.querySelectorAll('.division-card, .approach-item, .board-member, .project-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('animate-fade-in');
        }
    });
}

window.addEventListener('scroll', reveal);

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    .division-card,
    .approach-item,
    .board-member,
    .project-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Initial check on page load
document.addEventListener('DOMContentLoaded', reveal);

// ===================================
// Sticky Header on Scroll (only when .main-header exists, e.g. index)
// ===================================
let lastScroll = 0;
const header = document.querySelector('.main-header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        }
        lastScroll = currentScroll;
    });
}

// ===================================
// Active Navigation Link (both .nav-menu a and Bootstrap .nav-link)
// ===================================
const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
const navMenuLinks = document.querySelectorAll('.nav-menu a');
const navLinks = navMenuLinks.length ? navMenuLinks : document.querySelectorAll('.navbar .nav-link[href]');

navLinks.forEach(link => {
    const linkPath = link.getAttribute('href') || '';
    const pathFile = linkPath.split('/').pop().replace(/^#.*/, '') || linkPath;
    if (pathFile === currentLocation ||
        (currentLocation === '' && pathFile === 'index.html') ||
        (pathFile && pathFile !== 'index.html' && currentLocation.indexOf(pathFile.replace('.html', '')) !== -1)) {
        link.classList.add('active');
    }
});

// ===================================
// Counter Animation for Statistics
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            const display = element.getAttribute('data-stat-display');
            element.textContent = display != null && display !== '' ? display : formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    return num.toString();
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const targetText = stat.textContent.trim();
                const targetNum = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
                if (!stat.hasAttribute('data-animated')) {
                    stat.setAttribute('data-stat-display', targetText);
                    if (!Number.isNaN(targetNum)) {
                        animateCounter(stat, targetNum);
                    }
                    stat.setAttribute('data-animated', 'true');
                }
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.dependable-delivery');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===================================
// Image Lazy Loading Fallback
// ===================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// Back to Top Button
// ===================================
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: #324A93;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(50, 74, 147, 0.35);
`;

document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.backgroundColor = '#233467';
    backToTopButton.style.transform = 'scale(1.1)';
});

backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.backgroundColor = '#324A93';
    backToTopButton.style.transform = 'scale(1)';
});

// ===================================
// Dropdown Menu for Mobile
// ===================================
const dropdownToggles = document.querySelectorAll('.dropdown > a');

dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.parentElement;
            dropdown.classList.toggle('active');
            
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdown.classList.contains('active')) {
                dropdownMenu.style.display = 'block';
            } else {
                dropdownMenu.style.display = 'none';
            }
        }
    });
});

// ===================================
// Our Services carousel – 2s auto-rotate, pause only when hovering slide content (not nav buttons)
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    var carouselEl = document.getElementById('servicesCarousel');
    var carouselInner = carouselEl && carouselEl.querySelector('.carousel-inner');
    if (!carouselInner || !carouselEl || typeof bootstrap === 'undefined') return;

    function getCarousel() {
        return bootstrap.Carousel.getInstance(carouselEl) || new bootstrap.Carousel(carouselEl);
    }

    // Pause only when hovering the slide content; nav buttons are outside .carousel-inner so clicking them won't keep carousel paused
    carouselInner.addEventListener('mouseenter', function () {
        var carousel = getCarousel();
        if (carousel) carousel.pause();
    });

    carouselInner.addEventListener('mouseleave', function () {
        var carousel = getCarousel();
        if (carousel) carousel.cycle();
    });
});

// ===================================
// Loading Animation
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.5s ease;
        pointer-events: none;
    }
    
    body.loaded::before {
        opacity: 0;
    }
`;
document.head.appendChild(loadingStyle);

// Console branding (production-safe)
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log('%c Al-Mulhem Contracting ', 'background: #1e3a8a; color: #ffffff; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Building Excellence Since 2005 ', 'background: #3b82f6; color: #ffffff; font-size: 14px; padding: 5px;');
}