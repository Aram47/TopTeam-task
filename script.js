/**
 * Nordisk Dekor - Main JavaScript File
 * Handles navigation, mobile menu, form validation, and scroll effects
 */

(function() {
    'use strict';

    // ===========================================
    // Mobile Navigation Toggle
    // ===========================================
    const handleMobileMenu = () => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav__link');

        if (!navToggle || !navMenu) return;

        const toggleMenu = () => {
            const isActive = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? '' : 'hidden';
        };

        navToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                toggleMenu();
            }
        });
    };

    // ===========================================
    // Smooth Scroll for Anchor Links
    // ===========================================
    const handleSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip empty hash or just #
                if (!href || href === '#') return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ===========================================
    // Header Scroll Effect
    // ===========================================
    const handleHeaderScroll = () => {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScroll = 0;
        
        const updateHeader = () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        };

        // Throttle scroll events for better performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateHeader();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial check
        updateHeader();
    };

    // ===========================================
    // Form Validation and Submission
    // ===========================================
    const handleContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const phoneInput = document.getElementById('phone');

        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };

        const validatePhone = (phone) => {
            if (!phone) return true; // Phone is optional
            const re = /^[\d\s\+\-\(\)]+$/;
            return re.test(phone);
        };

        const showError = (input, message) => {
            const formGroup = input.closest('.form-group');
            let errorElement = formGroup.querySelector('.form-error');
            
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'form-error';
                errorElement.setAttribute('role', 'alert');
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            input.setAttribute('aria-invalid', 'true');
            input.classList.add('form-input--error');
        };

        const clearError = (input) => {
            const formGroup = input.closest('.form-group');
            const errorElement = formGroup.querySelector('.form-error');
            
            if (errorElement) {
                errorElement.remove();
            }
            
            input.removeAttribute('aria-invalid');
            input.classList.remove('form-input--error');
        };

        // Real-time validation
        if (nameInput) {
            nameInput.addEventListener('blur', () => {
                if (nameInput.value.trim().length < 2) {
                    showError(nameInput, 'Navn skal være mindst 2 tegn langt');
                } else {
                    clearError(nameInput);
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                if (!validateEmail(emailInput.value)) {
                    showError(emailInput, 'Indtast venligst en gyldig email-adresse');
                } else {
                    clearError(emailInput);
                }
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                if (phoneInput.value && !validatePhone(phoneInput.value)) {
                    showError(phoneInput, 'Indtast venligst et gyldigt telefonnummer');
                } else {
                    clearError(phoneInput);
                }
            });
        }

        if (messageInput) {
            messageInput.addEventListener('blur', () => {
                if (messageInput.value.trim().length < 10) {
                    showError(messageInput, 'Besked skal være mindst 10 tegn lang');
                } else {
                    clearError(messageInput);
                }
            });
        }

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;

            // Validate all fields
            if (nameInput && nameInput.value.trim().length < 2) {
                showError(nameInput, 'Navn skal være mindst 2 tegn langt');
                isValid = false;
            }

            if (emailInput && !validateEmail(emailInput.value)) {
                showError(emailInput, 'Indtast venligst en gyldig email-adresse');
                isValid = false;
            }

            if (phoneInput && phoneInput.value && !validatePhone(phoneInput.value)) {
                showError(phoneInput, 'Indtast venligst et gyldigt telefonnummer');
                isValid = false;
            }

            if (messageInput && messageInput.value.trim().length < 10) {
                showError(messageInput, 'Besked skal være mindst 10 tegn lang');
                isValid = false;
            }

            if (isValid) {
                // In a real application, you would send the form data to a server
                // For now, we'll show a success message
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = 'Sender...';
                
                // Simulate form submission
                setTimeout(() => {
                    alert('Tak for din besked! Vi vender tilbage til dig snart.');
                    form.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 1000);
            } else {
                // Focus on first error
                const firstError = form.querySelector('.form-input--error');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    };

    // ===========================================
    // Scroll Animations (Fade In)
    // ===========================================
    const handleScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        const elementsToAnimate = document.querySelectorAll(
            '.service-card, .gallery-item, .feature-card, .testimonial-card'
        );
        
        elementsToAnimate.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    };

    // ===========================================
    // Initialize Everything
    // ===========================================
    const init = () => {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                handleMobileMenu();
                handleSmoothScroll();
                handleHeaderScroll();
                handleContactForm();
                handleScrollAnimations();
            });
        } else {
            // DOM is already ready
            handleMobileMenu();
            handleSmoothScroll();
            handleHeaderScroll();
            handleContactForm();
            handleScrollAnimations();
        }
    };

    // Start initialization
    init();
})();

