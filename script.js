// ========================================
// SMOOTH SCROLL & SECTION TRANSITIONS
// ========================================

let currentSection = 0;
let sections;
let scrollContainer;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    sections = document.querySelectorAll('.page-section');
    scrollContainer = document.querySelector('.scroll-container');
    
    initScrollBehavior();
    initJoinBetaButton();
    initDownloadButton();
    initIntersectionObserver();
});

// ========================================
// SCROLL BEHAVIOR
// ========================================

function initScrollBehavior() {
    let isScrolling = false;
    let scrollTimeout;

    // Track current section
    scrollContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            updateCurrentSection();
        }, 100);
    }, { passive: true });

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            scrollToNextSection();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            scrollToPreviousSection();
        }
    });

    // Optional: Touch swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartY - touchEndY;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe up
                scrollToNextSection();
            } else {
                // Swipe down
                scrollToPreviousSection();
            }
        }
    }
}

function updateCurrentSection() {
    const scrollPosition = scrollContainer.scrollTop + window.innerHeight / 2;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = index;
            section.classList.add('in-view');
            section.classList.remove('scrolled-past');
        } else if (scrollPosition >= sectionBottom) {
            section.classList.add('scrolled-past');
            section.classList.remove('in-view');
        } else {
            section.classList.remove('in-view', 'scrolled-past');
        }
    });

}

function scrollToNextSection() {
    if (currentSection < sections.length - 1) {
        sections[currentSection + 1].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        currentSection++;
    }
}

function scrollToPreviousSection() {
    if (currentSection > 0) {
        sections[currentSection - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        currentSection--;
    }
}

// ========================================
// JOIN BETA BUTTON
// ========================================

function initJoinBetaButton() {
    const joinBetaBtn = document.getElementById('joinBeta');

    joinBetaBtn.addEventListener('click', () => {
        // Add click animation
        joinBetaBtn.style.transform = 'scale(0.95)';

        setTimeout(() => {
            joinBetaBtn.style.transform = 'scale(1)';
        }, 150);

        // Placeholder for beta signup action
        handleBetaSignup();
    });
}

function handleBetaSignup() {
    // TODO: Add your beta signup logic here
    // For now, just show an alert
    alert('Beta signup coming soon! 🚀');

    // Example: You could open a modal, redirect to a form, etc.
    // window.location.href = '/beta-signup';
}

// ========================================
// DOWNLOAD BUTTON
// ========================================

function initDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');

    downloadBtn.addEventListener('click', () => {
        // Add click animation
        downloadBtn.style.transform = 'scale(0.95)';

        setTimeout(() => {
            downloadBtn.style.transform = 'scale(1)';
        }, 150);

        // Placeholder for download action
        handleDownload();
    });
}

function handleDownload() {
    // Font URL from GitHub
    const fontUrl = 'https://raw.githubusercontent.com/ebaad11/fonts_outputs/main/lines.ttf';
    const fileName = 'intelligent-sans-lines.ttf';
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = fontUrl;
    link.download = fileName;
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger animations when section comes into view
                const textElements = entry.target.querySelectorAll('.display-text');
                textElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// ========================================
// PARALLAX EFFECT (OPTIONAL ENHANCEMENT)
// ========================================

function initParallax() {
    scrollContainer.addEventListener('scroll', () => {
        const scrolled = scrollContainer.scrollTop;

        sections.forEach((section, index) => {
            const backgroundLayer = section.querySelector('.background-layer');
            const speed = 0.5; // Adjust for parallax intensity

            const sectionTop = section.offsetTop;
            const offset = (scrolled - sectionTop) * speed;

            if (backgroundLayer && Math.abs(scrolled - sectionTop) < window.innerHeight) {
                backgroundLayer.style.transform = `translateY(${offset}px)`;
            }
        });
    }, { passive: true });
}

// Uncomment to enable parallax effect
// initParallax();

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Check if user prefers reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Apply reduced motion if user prefers
if (prefersReducedMotion()) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// ========================================
// DEBUGGING (Remove in production)
// ========================================

// Log current section for debugging
// Uncomment for debugging:
// scrollContainer?.addEventListener('scroll', () => {
//     console.log('Current section:', currentSection);
// }, { passive: true });
