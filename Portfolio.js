// DOM Elements
const loader = document.getElementById('loader');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
});

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Navbar scroll effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
});

// Active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Throttle function for performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
}, 100));

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Trigger skill progress animations
            if (entry.target.classList.contains('skill-card')) {
                const skillLevel = entry.target.getAttribute('data-skill');
                const progressBar = entry.target.querySelector('.skill-progress::after');
                if (progressBar) {
                    setTimeout(() => {
                        progressBar.style.width = skillLevel + '%';
                    }, 200);
                }
            }
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.hero-content, .hero-image, .section-header, .about-content, ' +
        '.skill-card, .timeline-item, .project-card, .education-item, ' +
        '.certification-card, .contact-info, .contact-form-container'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Skills animation with Intersection Observer
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillCards = entry.target.querySelectorAll('.skill-card');
            skillCards.forEach((card, index) => {
                setTimeout(() => {
                    const skillLevel = card.getAttribute('data-skill');
                    const progressBar = card.querySelector('.skill-progress');
                    if (progressBar) {
                        progressBar.style.setProperty('--progress-width', skillLevel + '%');
                        progressBar.querySelector('::after').style.width = skillLevel + '%';
                    }
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Apply skills animation
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Enhanced skills progress animation
document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const skillsIntersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.getAttribute('data-skill');
                const progressBar = entry.target.querySelector('.skill-progress');
                
                if (progressBar && skillLevel) {
                    setTimeout(() => {
                        progressBar.style.setProperty('--skill-width', skillLevel + '%');
                        // Create the progress animation
                        const progressAfter = window.getComputedStyle(progressBar, '::after');
                        progressBar.style.setProperty('--progress-width', skillLevel + '%');
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });
    
    skillCards.forEach(card => {
        skillsIntersectionObserver.observe(card);
    });
});

// Add CSS for skill progress animation
const skillProgressStyle = document.createElement('style');
skillProgressStyle.textContent = `
    .skill-progress::after {
        width: var(--progress-width, 0);
    }
    
    .skill-card[data-skill] .skill-progress::after {
        transition: width 2s ease-in-out 0.2s;
    }
`;
document.head.appendChild(skillProgressStyle);

// Scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Contact form functionality
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const subject = formData.get('subject').trim() || 'Portfolio Contact';
    const message = formData.get('message').trim() || 'Hello Vijay, I visited your portfolio and want to connect!';

    // Validation
    if (!name) {
        showNotification('Please enter your name.', 'error');
        return;
    }

    if (!email) {
        showNotification('Please enter your email address.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(
        `*${subject}*\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`
    );
    const whatsappURL = `https://wa.me/918861461964?text=${whatsappMessage}`;

    // Show success message
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalHTML = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Message Prepared!</span>';
    submitBtn.style.background = '#10b981';
    submitBtn.disabled = true;

    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        contactForm.reset();
        showNotification('Message prepared! WhatsApp will open shortly.', 'success');

        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 2000);
    }, 500);
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add notification styles
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 12px;
            padding: 16px 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            border-left: 4px solid var(--primary-color);
        }
        
        .notification-success {
            border-left-color: #10b981;
        }
        
        .notification-error {
            border-left-color: #ef4444;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
        }
        
        .notification-content i {
            font-size: 18px;
        }
        
        .notification-success .notification-content i {
            color: #10b981;
        }
        
        .notification-error .notification-content i {
            color: #ef4444;
        }
        
        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            color: #64748b;
            transition: all 0.2s;
        }
        
        .notification-close:hover {
            background: #f1f5f9;
            color: #334155;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add slide out animation
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideOutStyle);

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const heroName = document.querySelector('.hero-name');
            if (heroName && !heroName.classList.contains('typed')) {
                heroName.classList.add('typed');
                const nameText = heroName.textContent;
                setTimeout(() => {
                    typeWriter(heroName, nameText, 80);
                }, 1000);
            }
        }
    });
}, { threshold: 0.5 });

const heroSection = document.getElementById('home');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Parallax effect for hero particles
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroParticles) {
        const speed = 0.5;
        heroParticles.style.transform = `translateY(${scrolled * speed}px)`;
    }
});

// Project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(-10px) scale(1)';
    });
    
    card.addEventListener('click', function() {
        this.style.transform = 'translateY(-10px) scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        }, 150);
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Form input enhancements
const formInputs = document.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
        if (this.value.trim() !== '') {
            this.parentElement.classList.add('filled');
        } else {
            this.parentElement.classList.remove('filled');
        }
    });
});

// Add form enhancement styles
const formEnhancementStyles = document.createElement('style');
formEnhancementStyles.textContent = `
    .form-group.focused label {
        color: var(--primary-color);
        transform: translateY(-2px);
    }
    
    .form-group.filled label {
        color: var(--primary-color);
    }
    
    .form-group label {
        transition: all 0.2s ease;
    }
`;
document.head.appendChild(formEnhancementStyles);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add stagger animation to elements
    const staggerElements = document.querySelectorAll('.hero-stats .stat-card');
    staggerElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in-up');
    });
    
    // Add fade-in animation class
    const fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = `
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(fadeInStyle);
});

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250));

// Console welcome message
console.log(`
🚀 Portfolio loaded successfully!
💼 Vijay Shivapure - Full Stack Developer
📧 Contact: vijayshivapure@gmail.com
🌐 LinkedIn: https://www.linkedin.com/in/vijayshivapure

Built with ❤️ using HTML, CSS, and JavaScript
`);

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Image failed to load:', this.src);
    });
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ARIA labels to interactive elements
    const interactiveElements = document.querySelectorAll('button, a[href], input, textarea');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            const ariaLabel = element.getAttribute('title') || 
                            element.getAttribute('alt') || 
                            'Interactive element';
            element.setAttribute('aria-label', ariaLabel);
        }
    });
});