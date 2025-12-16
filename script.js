/**
 * Intelligent Sans - Font Display & Download System
 * 
 * To add a new font:
 * 1. Add image to fonts/images/ folder
 * 2. Add .ttf file to fonts/downloads/ folder
 * 3. Add entry to FONTS array below
 */

// Font data with prompts
const FONTS = [
    {
        name: "Candle Sans",
        prompt: "Warm, melting letterforms inspired by candlelight",
        imagePath: "fonts/images/candle-sans.png",
        downloadPath: "fonts/downloads/candle-sans.ttf"
    },
    {
        name: "Ocean Drift",
        prompt: "Flowing curves like waves on a calm sea",
        imagePath: "fonts/images/ocean-drift.png",
        downloadPath: "fonts/downloads/ocean-drift.ttf"
    },
    {
        name: "Neon Midnight",
        prompt: "Electric glowing letters from a 1980s arcade",
        imagePath: "fonts/images/neon-midnight.png",
        downloadPath: "fonts/downloads/neon-midnight.ttf"
    },
    {
        name: "Botanical Script",
        prompt: "Organic, vine-like characters from a secret garden",
        imagePath: "fonts/images/botanical-script.png",
        downloadPath: "fonts/downloads/botanical-script.ttf"
    },
    {
        name: "Pixel Nostalgia",
        prompt: "Crisp 8-bit letters from vintage video games",
        imagePath: "fonts/images/pixel-nostalgia.png",
        downloadPath: "fonts/downloads/pixel-nostalgia.ttf"
    },
    {
        name: "Marble Elegance",
        prompt: "Chiseled letters with the texture of Italian marble",
        imagePath: "fonts/images/marble-elegance.png",
        downloadPath: "fonts/downloads/marble-elegance.ttf"
    }
];

// State
let currentFontIndex = 0;

// DOM Elements
let fontDisplay, fontImage, fontPrompt, downloadBtn, emailInput, waitlistBtn;

// Initialize
function init() {
    // Cache DOM elements
    fontDisplay = document.getElementById('fontDisplay');
    fontImage = document.getElementById('fontImage');
    fontPrompt = document.getElementById('fontPrompt');
    downloadBtn = document.getElementById('downloadBtn');
    emailInput = document.getElementById('emailInput');
    waitlistBtn = document.getElementById('waitlistBtn');

    // Display first font
    updateFontDisplay();

    // Click to cycle fonts
    fontDisplay.addEventListener('click', nextFont);

    // Download button
    downloadBtn.addEventListener('click', downloadCurrentFont);

    // Waitlist (basic functionality)
    waitlistBtn.addEventListener('click', handleWaitlist);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleWaitlist();
    });
}

// Update the display with current font
function updateFontDisplay() {
    const font = FONTS[currentFontIndex];
    if (!font) return;

    fontImage.src = font.imagePath;
    fontImage.alt = `${font.name} Font Preview`;
    fontPrompt.textContent = `"${font.prompt}"`;
}

// Cycle to next font
function nextFont() {
    currentFontIndex = (currentFontIndex + 1) % FONTS.length;

    // Subtle animation
    fontImage.style.opacity = '0';
    fontImage.style.transform = 'scale(0.98)';

    setTimeout(() => {
        updateFontDisplay();
        fontImage.style.opacity = '1';
        fontImage.style.transform = 'scale(1)';
    }, 150);
}

// Download current font's TTF file
function downloadCurrentFont() {
    const font = FONTS[currentFontIndex];
    if (!font) return;

    const link = document.createElement('a');
    link.href = font.downloadPath;
    link.download = `${font.name.replace(/\s+/g, '-').toLowerCase()}.ttf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Handle waitlist signup
function handleWaitlist() {
    const email = emailInput.value.trim();

    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // TODO: Connect to your backend/email service
    // For now, just show confirmation
    alert(`Thanks! ${email} has been added to the waitlist.`);
    emailInput.value = '';
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Start
document.addEventListener('DOMContentLoaded', init);
