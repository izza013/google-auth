/**
 * Navigation Menu Controller
 * Handles smooth scrolling, active state management, and mobile menu toggle
 */

class NavigationController {
    constructor() {
        // DOM Elements
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        
        // State
        this.isMenuOpen = false;
        this.currentSection = 'home';
        
        // Initialize
        this.init();
    }

    /**
     * Initialize all event listeners and observers
     */
    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.handleInitialHash();
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard navigation
        this.navLinks.forEach(link => {
            link.addEventListener('keydown', (e) => this.handleKeyboardNav(e));
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    /**
     * Set up Intersection Observer for active section detection
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    this.updateActiveLink(sectionId);
                }
            });
        }, options);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Handle navigation link clicks
     * @param {Event} e - Click event
     */
    handleNavClick(e) {
        e.preventDefault();
        
        const targetId = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Smooth scroll to section
            this.scrollToSection(targetSection);
            
            // Update URL hash without jumping
            history.pushState(null, null, `#${targetId}`);
            
            // Close mobile menu
            if (this.isMenuOpen) {
                this.closeMenu();
            }
            
            // Update active state
            this.updateActiveLink(targetId);
        }
    }

    /**
     * Smooth scroll to a section
     * @param {HTMLElement} section - Target section element
     */
    scrollToSection(section) {
        const navHeight = this.navbar.offsetHeight;
        const targetPosition = section.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Update active navigation link
     * @param {string} sectionId - ID of the active section
     */
    updateActiveLink(sectionId) {
        if (this.currentSection === sectionId) return;
        
        this.currentSection = sectionId;
        
        this.navLinks.forEach(link => {
            const linkHref = link.getAttribute('href').substring(1);
            
            if (linkHref === sectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMenu() {
        this.isMenuOpen = true;
        this.hamburger.classList.add('active');
        this.navMenu.classList.add('active');
        this.hamburger.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile menu
     */
    closeMenu() {
        this.isMenuOpen = false;
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Handle clicks outside the menu
     * @param {Event} e - Click event
     */
    handleOutsideClick(e) {
        if (this.isMenuOpen && 
            !this.navMenu.contains(e.target) && 
            !this.hamburger.contains(e.target)) {
            this.closeMenu();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on desktop view
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardNav(e) {
        const currentIndex = Array.from(this.navLinks).indexOf(e.target);
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                this.focusNextLink(currentIndex);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.focusPreviousLink(currentIndex);
                break;
            case 'Home':
                e.preventDefault();
                this.navLinks[0].focus();
                break;
            case 'End':
                e.preventDefault();
                this.navLinks[this.navLinks.length - 1].focus();
                break;
        }
    }

    /**
     * Focus next navigation link
     * @param {number} currentIndex - Current link index
     */
    focusNextLink(currentIndex) {
        const nextIndex = (currentIndex + 1) % this.navLinks.length;
        this.navLinks[nextIndex].focus();
    }

    /**
     * Focus previous navigation link
     * @param {number} currentIndex - Current link index
     */
    focusPreviousLink(currentIndex) {
        const prevIndex = currentIndex === 0 ? this.navLinks.length - 1 : currentIndex - 1;
        this.navLinks[prevIndex].focus();
    }

    /**
     * Handle initial page load with hash
     */
    handleInitialHash() {
        const hash = window.location.hash;
        
        if (hash) {
            const targetId = hash.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Small delay to ensure page is fully loaded
                setTimeout(() => {
                    this.scrollToSection(targetSection);
                    this.updateActiveLink(targetId);
                }, 100);
            }
        }
    }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NavigationController();
    });
} else {
    new NavigationController();
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationController;
}