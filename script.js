// ========================================
// SMOOTH SCROLL & SECTION TRANSITIONS
// ========================================

let currentSection = 0;
let sections;
let scrollContainer;

// Font configuration for download popups (default values)
let fontConfig = {
    'font-rust': { file: 'rust.ttf', name: 'Rust' },
    'font-fire': { file: 'fire.ttf', name: 'Fire' },
    'font-glow': { file: 'glow.ttf', name: 'Glow' },
    'font-spray': { file: 'spray_paint.ttf', name: 'SprayPaint' },
    'font-blood': { file: 'blood.ttf', name: 'Blood' },
    'font-dna': { file: 'DNA.ttf', name: 'DNA' },
    'font-glass': { file: 'glass.ttf', name: 'Glass' },
    'font-diamond': { file: 'diamond plate.ttf', name: 'DiamondPlate' },
    'font-folded': { file: 'folded paper.ttf', name: 'FoldedPaper' },
    'font-vectors': { file: 'vectors.ttf', name: 'Vectors' },
    'font-gold': { file: 'Gold.ttf', name: 'Gold' },
    'font-wood': { file: 'solid_wood.ttf', name: 'Wood' },
    'font-metal': { file: 'solid_metal.ttf', name: 'Metal' },
    'font-concrete': { file: 'solid_concrete.ttf', name: 'Concrete' },
    'font-fabric': { file: 'knitted.ttf', name: 'Fabric' }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    sections = document.querySelectorAll('.page-section');
    scrollContainer = document.querySelector('.scroll-container');

    // Load configuration first
    loadConfiguration();

    initScrollBehavior();
    initJoinBetaButton();
    initDownloadButton();
    initIntersectionObserver();
    initFontLoader();
    initFontDownloadPopups();
    initRotatingFont();
});

// ========================================
// CONFIGURATION LOADER
// ========================================

function loadConfiguration() {
    // FONT_CONFIGURATION is loaded from config.js
    if (typeof FONT_CONFIGURATION === 'undefined') {
        console.log('Using default font configuration (config.js not loaded)');
        return;
    }

    // Step 1: Dynamically create @font-face declarations for all fonts
    const uniqueFonts = new Map();
    FONT_CONFIGURATION.fonts.forEach(fontData => {
        if (fontData.fontFile && fontData.fontFamily) {
            uniqueFonts.set(fontData.fontFamily, fontData.fontFile);
        }
    });

    // Create a style element with @font-face rules
    const styleEl = document.createElement('style');
    let fontFaceRules = '';

    uniqueFonts.forEach((fontFile, fontFamily) => {
        fontFaceRules += `
@font-face {
    font-family: '${fontFamily}';
    src: url('fonts/${fontFile}') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
`;
    });

    styleEl.textContent = fontFaceRules;
    document.head.appendChild(styleEl);
    console.log(`Loaded ${uniqueFonts.size} font families`);

    // Step 2: Apply configuration to each font element
    FONT_CONFIGURATION.fonts.forEach(fontData => {
        const selector = `[data-section="${fontData.section}"][data-position="${fontData.position}"]`;
        const element = document.querySelector(selector);

        if (element) {
            // Update text content
            element.textContent = fontData.text;

            // Apply color and text shadow (with defaults if not specified)
            element.style.color = fontData.color || '#ffffff';
            element.style.textShadow = fontData.textShadow || 'none';

            // Update font family
            if (fontData.fontFamily) {
                element.style.fontFamily = `'${fontData.fontFamily}', serif`;
            }

            // Apply font size if specified
            if (fontData.fontSize) {
                element.style.fontSize = fontData.fontSize;
            }

            // Store in fontConfig for downloads
            const fontClass = Array.from(element.classList).find(cls => cls.startsWith('font-'));
            if (fontClass && fontData.fontFile && fontData.fontFamily) {
                fontConfig[fontClass] = {
                    file: fontData.fontFile,
                    name: fontData.fontFamily
                };
            }
        }
    });

    console.log('Configuration loaded successfully from config.js');
}

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
    const downloadBtn = document.getElementById('downloadBtn');

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = index;
            section.classList.add('in-view');
            section.classList.remove('scrolled-past');

            // Show download button only on section 1 (index 0)
            // Hide on all other sections
            if (downloadBtn) {
                if (index === 0) {
                    downloadBtn.classList.remove('hidden');
                } else {
                    downloadBtn.classList.add('hidden');
                }
            }
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
    // Open the beta signup form in a new tab
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSf8Lpbr-bJn9X1q0uUSud0Q1FcO5esdJkIU_RCTXLOW-B3bKw/viewform?usp=header', '_blank');
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
// FONT LOADER - WAIT FOR FONT TO DOWNLOAD
// ========================================

function initFontLoader() {
    const heroText1 = document.querySelector('.hero-text-1');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    if (!heroText1) return;

    const applyFontLoaded = () => {
        heroText1.classList.add('font-loaded');
        if (heroSubtitle) heroSubtitle.classList.add('font-loaded');
    };

    // Font URL from GitHub
    const fontUrl = 'https://raw.githubusercontent.com/ebaad11/fonts_outputs/main/lines.ttf';

    // Use Font Loading API to wait for the font to actually download
    if ('fonts' in document) {
        const font = new FontFace('Intelligent Sans', `url(${fontUrl})`);

        font.load().then((loadedFont) => {
            // Font is downloaded, add it to the document
            document.fonts.add(loadedFont);
            // Apply the font-loaded class to show the custom font
            applyFontLoaded();
        }).catch((error) => {
            console.error('Font failed to load:', error);
            // Fallback: still try to apply after a delay if Font Loading API fails
            setTimeout(applyFontLoaded, 2000);
        });
    } else {
        // Fallback for browsers that don't support Font Loading API
        setTimeout(applyFontLoaded, 2000);
    }
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

// ========================================
// FONT DOWNLOAD POPUPS
// ========================================

let activeFontInfo = null; // Track currently hovered font globally

function initFontDownloadPopups() {
    const popup = document.getElementById('fontDownloadPopup');
    const popupText = document.getElementById('popupText');

    if (!popup || !popupText) {
        console.log('Popup elements not found');
        return;
    }

    // Get all express items (font showcase elements)
    const expressItems = document.querySelectorAll('.express-item');
    console.log('Found express items:', expressItems.length);

    expressItems.forEach(item => {
        // Find which font class this item has
        const fontClass = Array.from(item.classList).find(cls =>
            cls.startsWith('font-') && fontConfig[cls]
        );

        if (!fontClass) {
            console.log('No font class found for item:', item.textContent);
            return;
        }

        const fontInfo = fontConfig[fontClass];
        console.log('Setting up hover for:', fontClass, fontInfo);

        // Mouse enter - show popup
        item.addEventListener('mouseenter', (e) => {
            activeFontInfo = fontInfo;
            popupText.textContent = `Download ${fontInfo.name}`;
            // Apply the same font to the popup text
            popup.style.fontFamily = `'${fontInfo.name}', serif`;
            positionPopup(e, popup);
            popup.classList.add('visible');
            console.log('Showing popup for:', fontInfo.name);
        });

        // Mouse move - update popup position
        item.addEventListener('mousemove', (e) => {
            positionPopup(e, popup);
        });

        // Mouse leave - hide popup
        item.addEventListener('mouseleave', () => {
            popup.classList.remove('visible');
            activeFontInfo = null;
        });

        // Click on font item - trigger download
        item.addEventListener('click', () => {
            if (fontInfo) {
                downloadFont(fontInfo);
            }
        });
    });

    // Popup click - also trigger download
    popup.addEventListener('click', () => {
        if (activeFontInfo) {
            downloadFont(activeFontInfo);
        }
    });
}

function positionPopup(event, popup) {
    const offset = { x: 20, y: -40 }; // Offset from cursor
    let x = event.clientX + offset.x;
    let y = event.clientY + offset.y;

    // Viewport boundaries check
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Prevent overflow right
    if (x + popupRect.width > viewportWidth - 20) {
        x = event.clientX - popupRect.width - 20;
    }

    // Prevent overflow bottom
    if (y + popupRect.height > viewportHeight - 20) {
        y = event.clientY - popupRect.height + 20;
    }

    // Prevent overflow top
    if (y < 20) {
        y = 20;
    }

    // Prevent overflow left
    if (x < 20) {
        x = 20;
    }

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
}

function downloadFont(fontInfo) {
    // Use absolute URL for deployed site
    const fontUrl = `${window.location.origin}/fonts/${fontInfo.file}`;
    const fileName = `intelligent-sans-${fontInfo.name.toLowerCase()}.ttf`;

    // Create temporary link element
    const link = document.createElement('a');
    link.href = fontUrl;
    link.download = fileName;

    // Append, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Visual feedback
    const popup = document.getElementById('fontDownloadPopup');
    const popupText = document.getElementById('popupText');

    if (popup && popupText) {
        const originalText = popupText.textContent;
        popupText.textContent = 'Downloading...';

        setTimeout(() => {
            popupText.textContent = originalText;
        }, 1000);
    }
}

// ========================================
// ROTATING FONT EFFECT FOR "ZAVIA"
// ========================================

function initRotatingFont() {
    const rotatingText = document.getElementById('rotatingText');

    if (!rotatingText || typeof FONT_CONFIGURATION === 'undefined') {
        console.log('Rotating text element or font configuration not found');
        return;
    }

    // Collect all unique font families from configuration
    const allFonts = [];
    FONT_CONFIGURATION.fonts.forEach(fontData => {
        if (fontData.fontFamily && !allFonts.includes(fontData.fontFamily)) {
            allFonts.push(fontData.fontFamily);
        }
    });

    console.log(`Rotating through ${allFonts.length} fonts`);

    let currentFontIndex = 0;

    // Function to cycle to next font
    function cycleFont() {
        const fontFamily = allFonts[currentFontIndex];
        rotatingText.style.fontFamily = `'${fontFamily}', serif`;

        // Move to next font
        currentFontIndex = (currentFontIndex + 1) % allFonts.length;
    }

    // Start with first font
    cycleFont();

    // Rotate every 500ms (adjust frequency as needed)
    setInterval(cycleFont, 500);
}
