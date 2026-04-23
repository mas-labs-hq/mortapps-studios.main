// ============================================
// OPTICORE VIPRO - "BILLION DOLLAR" ENGINE UPGRADE
// Features: Decoupled Rendering, Physics Smoothing, Zero Lag
// ============================================

// ============================================
// ADMIN CONFIGURATION
// Edit values below to customize the entire application.
// All references throughout the code pull from here.
// ============================================
const ADMIN_CONFIG = {

    // ─── CONTACT INFORMATION ───────────────────────
    // Change these to update ALL phone/email references across the app
    phone: '254113400063',                        // Phone for calls, WhatsApp & analysis
    email: 'prescription@opticorevipro.com',        // Email for analysis reports

    // ─── BRANDING ───────────────────────────────────
    brandName: 'Opticore ViPro Demo',                // App name (watermark, reports, shares)
    brandTagline: 'Virtual Try-On Demo Experience',   // Tagline for messages & result pages

    // ─── HOW TO ADD NEW FRAMES ─────────────────────
    // 1. Place your frame PNG in the 'assets/glasses/' folder (e.g. frame13.png)
    // 2. Add a new entry in the GLASSES CATALOG below following this format:
    //    { id: 13, name: "Your Frame Name", price: "KES 3,500",
    //      image: "frame13.png", category: ["eyeglasses", "modern"],
    //      scale: 0.80, style: "modern", verticalAdjust: 0.00 }
    //
    //    KEY FIELDS:
    //    - id:         Next number in sequence (13, 14, 15...)
    //    - name:       Display name shown under the frame
    //    - image:      Filename in assets/glasses/ folder
    //    - price:      Display text (e.g. "KES 3,500", "KES 4,500")
    //    - scale:      Frame width multiplier (0.70-0.95). Start at 0.80, adjust if too wide/narrow
    //    - verticalAdjust: Fine-tune vertical position AFTER testing on a real face.
    //                   Negative = pull frame UP, Positive = push frame DOWN
    //                   Square/rectangular frames: 0.00 to 0.02
    //                   Round/oval frames:         -0.06 to -0.09
    //                   Aviator/tall frames:        -0.07 to -0.10
    //    - badge:      Optional. "Premium", "Trending", "Popular", or remove the line
    //    - category:   First tag = frame type: "eyeglasses" or "sunglasses"
    //                  Second tag = sub-category: "classic", "modern", "designer",
    //                  "vintage", "aviator", "budget", "premium"
    //                  Examples: ["eyeglasses", "classic"], ["sunglasses", "designer"]
    //    - style:      "classic", "modern", "designer", "vintage", "aviator",
    //                  "cateye", "round", "oversized", "rectangle", "rimless", "geometric"
    // 3. Save and reload — the new frame appears automatically!
};

// ============================================
// FACE SHAPE → FRAME STYLE RECOMMENDATION MAP
// Maps detected face shapes to frame styles that suit them.
// Used by the Face Shape AI to show "Best Fit" badges on matching frames.
// ============================================
const FACE_FRAME_MAP = {
    'oval':    ['rectangle', 'geometric', 'aviator', 'designer', 'vintage', 'classic'],
    'round':   ['rectangle', 'geometric', 'oversized', 'modern'],
    'square':  ['round', 'aviator', 'designer', 'vintage', 'rimless'],
    'heart':   ['aviator', 'cateye', 'round', 'designer'],
    'oblong':  ['oversized', 'rectangle', 'aviator', 'geometric']
};

// State Management
let state = {
    isCameraActive: false,
    selectedGlasses: {
        id: 1,
        name: "Classic Thick-Rim",
        price: "KES 3,500",
        image: "frame1.png",
        style: "classic",
        scale: 0.8,
        verticalAdjust: 0.00
    },
    isStaticMode: false,
    faceDetectionActive: false,
    currentFilter: "none",
    modelsLoaded: false,
    smartMode: false,
    glassesScale: 1.0,
    verticalOffset: 0.0,
    horizontalOffset: 0.0,
    glassesX: 50,
    glassesY: 40,
    lastCapturedImage: null,
    
    // SMOOTHING ENGINE: Separates Target (AI) from Render (Visuals)
    target: {
        x: 0,
        y: 0,
        scale: 0,
        angle: 0,
        valid: false,
        naturalDrop: 0,       // Nose bridge drop from eye center (pixels), set by detection
        eyeDistance: 0
    },
    
    // Current visual state (interpolated)
    render: {
        x: 0,
        y: 0,
        scale: 0,
        angle: 0,
        initialized: false
    },
    
    // BIOMETRICS STATE
    biometrics: {
        pd: 0,
        faceWidth: 0,
        lastUpdated: 0
    },
    
    // PREMIUM UPGRADES STATE
    faceShape: null,           // Detected face shape (oval, round, square, heart, oblong)
    soundEnabled: true,        // Ambient sound toggle
    autoCalActive: false,      // Auto-calibration in progress
    audioCtx: null             // Web Audio API context (lazy init on first gesture)
}

// ============================================
// GLASSES CATALOG — EDIT / ADD FRAMES HERE
// See ADMIN_CONFIG above for instructions on adding new frames
// ============================================
const glassesCatalog = [
    // DEMO VERSION: Only 5 frames. Premium has 12+.
    // verticalAdjust values are frame-specific fine-tuning only.
    // The nose bridge landmark (point 28) provides an adaptive base vertical drop
    // that scales with each user's face geometry.
    // Positive = push frame down, Negative = pull frame up.
    { id: 1, name: "Classic Thick-Rim", price: "KES 3,500", image: "frame1.png", category: ["eyeglasses", "classic"], badge: "Premium", scale: 0.8, style: "classic", verticalAdjust: -0.06 },
    { id: 2, name: "Wide Rectangular", price: "KES 2,800", image: "frame2.png", category: ["eyeglasses", "modern"], scale: 0.8, style: "modern", verticalAdjust: -0.05 },
    { id: 3, name: "Thin Metal", price: "KES 4,200", image: "frame3.png", category: ["eyeglasses", "designer"], badge: "Trending", scale: 0.95, style: "designer", verticalAdjust: -0.12 },
    { id: 5, name: "Aviator", price: "KES 3,200", image: "frame5.png", category: ["eyeglasses", "aviator"], scale: 1.05, style: "aviator", verticalAdjust: -0.13 },
    { id: 10, name: "Bold Square", price: "KES 3,500", image: "frame10.png", category: ["eyeglasses", "designer"], scale: 0.88, style: "oversized", verticalAdjust: -0.06 }
];

// ============================================
// DEMO VERSION — PREMIUM LOCK SYSTEM
// Blocks premium features and shows upgrade prompt
// ============================================
function showDemoPremiumPrompt() {
    // Remove any existing prompt
    const existing = document.getElementById('demoPremiumOverlay');
    if (existing) { existing.remove(); return; }

    playUISound('click');
    const overlay = document.createElement('div');
    overlay.id = 'demoPremiumOverlay';
    overlay.className = 'demo-premium-overlay';
    overlay.innerHTML = `
        <div class="demo-premium-card">
            <div class="premium-icon"><i class="fas fa-crown"></i></div>
            <h3>Upgrade to Premium</h3>
            <p>You're using the Demo version. Get the full experience with all features unlocked.</p>
            <ul class="premium-features">
                <li><i class="fas fa-check"></i> 12+ professional frame models</li>
                <li><i class="fas fa-check"></i> Download high-quality captures</li>
                <li><i class="fas fa-check"></i> Share via WhatsApp & Email reports</li>
                <li><i class="fas fa-check"></i> Professional consultation booking</li>
                <li><i class="fas fa-check"></i> Advanced lighting & filters</li>
                <li><i class="fas fa-check"></i> No watermarks on captures</li>
            </ul>
            <p style="color:#1a2980;font-weight:600;font-size:0.95rem;">Contact us to get the Premium version</p>
            <button class="demo-close-btn" id="demoPremiumClose">Close</button>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.demo-premium-overlay')?.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
    // Actually the overlay IS the .demo-premium-overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
    document.getElementById('demoPremiumClose').addEventListener('click', () => overlay.remove());
}

function demoLock(featureName) {
    playUISound('click');
    showNotification('Get the Premium Version to Unlock', 'premium');
}

// DOM Elements
const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const staticContainer = document.getElementById('staticContainer');
const staticGlasses = document.getElementById('staticGlasses');
const loadingOverlay = document.getElementById('loadingOverlay');
const permissionOverlay = document.getElementById('permissionOverlay');
const startCameraBtn = document.getElementById('startCameraBtn');
const useStaticModeBtn = document.getElementById('useStaticModeBtn');
const toggleCameraBtn = document.getElementById('toggleCameraBtn');
const cameraStatus = document.getElementById('cameraStatus');
const captureBtn = document.getElementById('captureBtn');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const resetBtn = document.getElementById('resetBtn');
const glassesGrid = document.getElementById('glassesGrid');
const selectedFrameImg = document.getElementById('selectedFrameImg');
const selectedFrameName = document.getElementById('selectedFrameName');
const selectedFramePrice = document.getElementById('selectedFramePrice');
const loadingText = document.getElementById('loadingText');
const sendToWhatsAppBtn = document.getElementById('sendToWhatsAppBtn');

// Biometrics DOM Elements
const pdValueDisplay = document.getElementById('pdValue');
const faceWidthValueDisplay = document.getElementById('faceWidthValue');
const biometricStatusDisplay = document.getElementById('biometricStatus');

// Consultation DOM Elements
const directCallBtn = document.getElementById('directCallBtn');
const whatsappConsultBtn = document.getElementById('whatsappConsultBtn');

// Navigation Elements
const framesLink = document.getElementById('framesLink');
const howItWorksLink = document.getElementById('howItWorksLink');
const privacyLink = document.getElementById('privacyLink');
const contactLink = document.getElementById('contactLink');

// Popup Elements
const howItWorksPopup = document.getElementById('howItWorksPopup');
const privacyPopup = document.getElementById('privacyPopup');
const contactPopup = document.getElementById('contactPopup');

// NEW: Ava DOM Elements
const avaToggleBtn = document.getElementById('avaToggleBtn');
const avaStatus = document.getElementById('avaStatus');
const avaInterface = document.getElementById('avaInterface');
const avaCloseBtn = document.getElementById('avaCloseBtn');
const avaMessages = document.getElementById('avaMessages');

// Image Cache
const imageCache = new Map();

// ===== PERFORMANCE GUARDS =====
// Prevents CPU overload — detection won't run faster than 15 times/second.
// This keeps the render loop buttery smooth (60fps) regardless of detection speed.
let lastDetectionTimestamp = 0;
const MIN_DETECTION_INTERVAL_MS = 66; // ~15 fps detection cap

// Tab visibility: pause detection when tab is hidden to save CPU/battery.
// requestAnimationFrame already pauses render — this catches the async detection loop.
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        state._wasDetecting = state.faceDetectionActive;
        state.faceDetectionActive = false;
    } else if (state._wasDetecting && state.isCameraActive && state.modelsLoaded) {
        state.faceDetectionActive = true;
        state._wasDetecting = false;
        detectionLoop();
    }
});

// ===== MOBILE EXIT FUNCTION =====
function attemptExit() {
    try {
        window.close();
    } catch (e) {
        window.location.href = "about:blank";
    }
}

// ===== CODE PROTECTION (ANTI-INSPECT) =====
// FIX #4: Hardened — blocks more shortcuts, NO scroll triggers, NO page takeovers
function enableCodeProtection() {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showNotification('🔒 System Protected: Source Code Access Restricted', 'warning');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
            (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))) {
            e.preventDefault();
            e.stopPropagation();
            if (e.key === 'F12') {
                showNotification('🔒 Developer Tools Disabled in Production Mode', 'warning');
            }
            return false;
        }
    });
}

// ===== POPUP MANAGEMENT =====
function showPopup(popupElement) {
    document.querySelectorAll('.popup-overlay').forEach(popup => {
        popup.style.display = 'none';
    });
    
    popupElement.style.display = 'flex';
    
    setTimeout(() => {
        popupElement.addEventListener('click', function(e) {
            if (e.target === this) {
                hidePopup(popupElement);
            }
        });
    }, 100);
}

function hidePopup(popupElement) {
    popupElement.style.display = 'none';
}

function setupPopupCloseButtons() {
    document.querySelectorAll('.popup-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const popup = this.closest('.popup-overlay');
            hidePopup(popup);
        });
    });
}

// ===== NAVIGATION FUNCTIONS =====
function setupNavigation() {
    framesLink.addEventListener('click', function(e) {
        e.preventDefault();
        const framesSection = document.getElementById('framesSection');
        if (framesSection) {
            framesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            updateActiveNavLink('frames');
        }
    });

    howItWorksLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPopup(howItWorksPopup);
        updateActiveNavLink('howItWorks');
    });

    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPopup(privacyPopup);
        updateActiveNavLink('privacy');
    });

    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPopup(contactPopup);
    });
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    switch(activeLink) {
        case 'frames':
            framesLink.classList.add('active');
            break;
        case 'howItWorks':
            howItWorksLink.classList.add('active');
            break;
        case 'privacy':
            privacyLink.classList.add('active');
            break;
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔬 Opticore ViPro DEMO - Engine Loaded (Limited Features)");
    
    enableCodeProtection();
    setupPopupCloseButtons();
    setupNavigation();
    
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        initApplication();
    }, 4200);
});

function initApplication() {
    renderGlassesGrid();
    setupEventListeners();
    showPermissionOverlay();
    loadFaceModels();
    shareBtn.disabled = false;
    
    // DEMO: Add locked visual classes to premium buttons
    if (downloadBtn) downloadBtn.classList.add('demo-locked');
    if (shareBtn) shareBtn.classList.add('demo-locked');
    if (sendToWhatsAppBtn) sendToWhatsAppBtn.classList.add('demo-locked');
    if (directCallBtn) directCallBtn.classList.add('demo-locked');
    if (whatsappConsultBtn) whatsappConsultBtn.classList.add('demo-locked');
    
    // FIXED: Initialize Ava Assistant
    setupAvaButton();
    
    // Update consultation UI — hides raw phone numbers from display
    updateConsultationUI();
    
    // PREMIUM UPGRADES
    injectPremiumCSS();
    createSoundToggleButton();
    showOnboardingGuide();
}

// ===== AVA AI ASSISTANT SETUP =====
function setupAvaButton() {
    if (avaToggleBtn) {
        avaToggleBtn.addEventListener('click', toggleAva);
        
        // Setup close button
        if (avaCloseBtn) {
            avaCloseBtn.addEventListener('click', toggleAva);
        }
        
        // Setup quick action buttons
        document.querySelectorAll('.ava-quick-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.dataset.action;
                handleAvaQuickAction(action);
            });
        });
        
        // Setup keyboard shortcut (Ctrl + M)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                toggleAva();
            }
        });
    }
}

function toggleAva() {
    if (avaInterface.style.display === 'flex') {
        avaInterface.style.display = 'none';
        avaStatus.textContent = 'Off';
        avaToggleBtn.style.background = 'linear-gradient(135deg, #9c27b0, #673ab7)';
    } else {
        avaInterface.style.display = 'flex';
        avaStatus.textContent = 'On';
        avaToggleBtn.style.background = 'linear-gradient(135deg, #4CAF50, #388E3C)';
        
        // Show welcome message if empty
        if (avaMessages.children.length === 0) {
            showAvaMessage("Hello! I'm Ava, your optical intelligence assistant. How can I help you with your virtual try-on experience today?", true);
        }
    }
}

function showAvaMessage(message, isAva = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ava-message ${isAva ? 'ava-message' : 'user-message'}`;
    messageDiv.textContent = message;
    
    if (isAva) {
        messageDiv.classList.add('ava-welcome-msg');
    }
    
    avaMessages.appendChild(messageDiv);
    avaMessages.scrollTop = avaMessages.scrollHeight;
}

function handleAvaQuickAction(action) {
    let message = '';
    let response = '';
    
    switch(action) {
        case 'neural':
            message = "Tell me about Neural Calibration";
            response = "Neural Calibration is our advanced AI layer that enables precise facial mapping. Activate it with Ctrl+D to see real-time biometric data and facial landmarks. This helps ensure your eyewear fits perfectly by analyzing 68 facial points.";
            break;
        case 'pupil':
            message = "How do I measure pupil distance?";
            response = "Pupillary Distance (PD) is automatically calculated when your face is detected. For accurate results:\n1. Position yourself 40-60cm from camera\n2. Ensure good lighting\n3. Look directly at the camera\n4. Keep your head straight\nThe system will display your PD in millimeters for professional prescription.";
            break;
        case 'frames':
            message = "How do I select frames?";
            response = "Selecting frames is easy:\n1. Browse our 12 professional models\n2. Click any frame to try it instantly\n3. Use +/- keys to adjust size\n4. Use arrow keys for positioning\n5. Try different categories: Eyeglasses, Designer, Budget, Premium\nPro tip: Frames with 'Premium' badges offer advanced optical features.";
            break;
        case 'help':
            message = "I need help";
            response = "I'm here to help! Here are key features:\n• Camera: Click 'Start Visual Analysis'\n• Static Mode: Use reference image\n• Capture: Save/download your try-on\n• Share: Send to consultation\n• Adjustments: Use keyboard shortcuts\n• Contact: Direct call/WhatsApp support\nPress Ctrl+M anytime to talk to me!";
            break;
    }
    
    if (message && response) {
        showAvaMessage(message, false);
        setTimeout(() => {
            showAvaMessage(response, true);
        }, 500);
    }
}

// ===== FACE MODEL LOADING =====
async function loadFaceModels() {
    loadingText.textContent = 'Loading visual intelligence...';
    loadingOverlay.style.display = 'flex';
    
    try {
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
        
        state.modelsLoaded = true;
        loadingText.textContent = 'Systems ready';
        
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 1000);
        
    } catch (error) {
        console.error('Model loading error:', error);
        loadingText.textContent = 'Basic mode activated';
        state.modelsLoaded = false;
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 2000);
    }
}

// ===== RENDER GLASSES GRID =====
function renderGlassesGrid() {
    glassesGrid.innerHTML = '';
    
    glassesCatalog.forEach(glasses => {
        const card = document.createElement('div');
        card.className = 'glasses-card';
        card.dataset.id = glasses.id;
        
        let badgeHTML = '';
        if (glasses.badge) {
            badgeHTML = `<div class="card-badge">${glasses.badge}</div>`;
        }
        
        card.innerHTML = `
            <img src="assets/glasses/${glasses.image}" alt="${glasses.name}">
            <h4>${glasses.name}</h4>
            <p>${glasses.price}</p>
            ${badgeHTML}
        `;
        
        card.addEventListener('click', () => selectGlasses(glasses));
        glassesGrid.appendChild(card);
        
        preloadImage(`assets/glasses/${glasses.image}`, glasses.id);
    });
    
    selectGlasses(glassesCatalog[0]);
}

// ===== PRELOAD IMAGE =====
function preloadImage(src, id) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        imageCache.set(id, img);
        console.log(`✅ Loaded: ${src}`);
    };
    img.onerror = function() {
        console.error(`❌ Failed: ${src}`);
    };
    img.src = src;
}

// ===== SELECT GLASSES =====
function selectGlasses(glasses) {
    playUISound('select');  // PREMIUM: Selection sound
    state.selectedGlasses = glasses;
    state.glassesScale = 1.0;
    state.verticalOffset = 0;
    state.horizontalOffset = 0;
    
    const cachedImg = imageCache.get(glasses.id);
    if (cachedImg) {
        selectedFrameImg.src = cachedImg.src;
    } else {
        selectedFrameImg.src = `assets/glasses/${glasses.image}`;
    }
    
    selectedFrameName.textContent = glasses.name;
    selectedFramePrice.textContent = glasses.price;
    
    if (state.isStaticMode) {
        if (cachedImg) {
            staticGlasses.src = cachedImg.src;
        } else {
            staticGlasses.src = `assets/glasses/${glasses.image}`;
        }
        staticGlasses.style.width = `${200 * state.glassesScale}px`;
    }
    
    document.querySelectorAll('.glasses-card').forEach(card => {
        if (card.dataset.id == glasses.id) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    startCameraBtn.addEventListener('click', startCamera);
    useStaticModeBtn.addEventListener('click', activateStaticMode);
    toggleCameraBtn.addEventListener('click', toggleCamera);
    
    captureBtn.addEventListener('click', () => capturePhoto('open'));
    downloadBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); demoLock('Download'); });
    shareBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); demoLock('Share'); });
    resetBtn.addEventListener('click', resetApp);
    
    document.querySelectorAll('.adjust-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.adjust;
            handleAdjustment(action);
        });
    });
    
    // DEMO: Lighting — only "Normal" works, others locked
    document.querySelectorAll('.light-btn').forEach((btn, index) => {
        if (index > 0) {
            // Lock non-Normal lighting buttons
            btn.classList.add('demo-locked');
            btn.addEventListener('click', function(e) {
                e.stopImmediatePropagation();
                demoLock('Lighting Filters');
            });
        } else {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.light-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                applyCanvasFilter('none');
            });
        }
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterGlasses(this.textContent.toLowerCase());
        });
    });
    
    sendToWhatsAppBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); demoLock('Send Analysis'); });
    
    // DEMO: Consultation buttons locked
    directCallBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); demoLock('Consultation'); });

    whatsappConsultBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); demoLock('Consultation'); });

    // Email analysis button — creates button dynamically if not in HTML
    setupEmailButton();
    
    // Setup How It Works popup start button
    document.querySelector('.start-try-on-btn').addEventListener('click', function() {
        hidePopup(howItWorksPopup);
        startCamera();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.ctrlKey && e.key === 'd') {
            state.autoCalActive = false; // Cancel auto-calibration if user takes manual control
            state.smartMode = !state.smartMode;
            playUISound('click');
            showNotification(
                `Neural Calibration Layer ${state.smartMode ? 'ENABLED' : 'DISABLED'}`, 
                state.smartMode ? 'success' : 'info'
            );
            e.preventDefault();
            return;
        }
        
        // PREMIUM: Shortcuts help panel
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            showShortcutsGuide();
            return;
        }
        
        // PREMIUM: Close shortcuts panel with Escape
        if (e.key === 'Escape') {
            const sp = document.getElementById('shortcutsPanel');
            if (sp) sp.remove();
        }
        
        switch(e.key) {
            case ' ':
                if (state.isCameraActive || state.isStaticMode) {
                    capturePhoto('open');
                    e.preventDefault();
                }
                break;
            case '+': case '=':
                state.glassesScale = Math.min(2.0, state.glassesScale + 0.1);
                if (state.isStaticMode) staticGlasses.style.width = `${200 * state.glassesScale}px`;
                e.preventDefault(); break;
            case '-': case '_':
                state.glassesScale = Math.max(0.5, state.glassesScale - 0.1);
                if (state.isStaticMode) staticGlasses.style.width = `${200 * state.glassesScale}px`;
                e.preventDefault(); break;
            case 'ArrowUp':
                handleAdjustment('position-up'); e.preventDefault(); break;
            case 'ArrowDown':
                handleAdjustment('position-down'); e.preventDefault(); break;
            case 'ArrowLeft':
                handleAdjustment('position-left'); e.preventDefault(); break;
            case 'ArrowRight':
                handleAdjustment('position-right'); e.preventDefault(); break;
        }
    });
}

// ===== BIOMETRICS CALCULATION =====
let lastBiometricUpdate = 0;

function calculateBiometrics(landmarks) {
    const now = Date.now();
    // THROTTLE: Update UI only every 200ms to save CPU and prevent lag
    if (now - lastBiometricUpdate < 200) return;
    lastBiometricUpdate = now;

    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    
    const leftEyeCenter = getCenterPoint(leftEye);
    const rightEyeCenter = getCenterPoint(rightEye);
    
    const pdPixels = Math.sqrt(
        Math.pow(rightEyeCenter.x - leftEyeCenter.x, 2) + 
        Math.pow(rightEyeCenter.y - leftEyeCenter.y, 2)
    );
    
    const jaw = landmarks.getJawOutline();
    const faceWidthPixels = Math.sqrt(
        Math.pow(jaw[16].x - jaw[0].x, 2) + 
        Math.pow(jaw[16].y - jaw[0].y, 2)
    );
    
    const averageFaceWidthMm = 145; 
    const mmPerPx = averageFaceWidthMm / faceWidthPixels;
    
    const pdMm = pdPixels * mmPerPx;
    const faceWidthMm = faceWidthPixels * mmPerPx;
    
    state.biometrics.pd = pdMm.toFixed(1);
    state.biometrics.faceWidth = faceWidthMm.toFixed(1);
    state.biometrics.lastUpdated = now;
    
    pdValueDisplay.textContent = `${state.biometrics.pd} mm`;
    faceWidthValueDisplay.textContent = `${state.biometrics.faceWidth} mm`;
    biometricStatusDisplay.innerHTML = '<i class="fas fa-check-circle"></i> Analysis Active';
    biometricStatusDisplay.style.color = '#81c784';
}

// ===== CAMERA FUNCTIONS =====
async function startCamera() {
    try {
        loadingOverlay.style.display = 'flex';
        loadingText.textContent = 'Requesting camera access...';
        
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            },
            audio: false
        });
        
        videoElement.srcObject = stream;
        videoElement.style.display = 'block';
        canvasElement.style.display = 'block';
        staticContainer.style.display = 'none';
        
        videoElement.onloadedmetadata = async () => {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            
            state.isCameraActive = true;
            state.isStaticMode = false;
            cameraStatus.textContent = 'On';
            toggleCameraBtn.innerHTML = '<i class="fas fa-video"></i> Camera: On';
            
            loadingOverlay.style.display = 'none';
            permissionOverlay.style.display = 'none';
            
            state.render.initialized = false;
            state.target.valid = false;
            biometricStatusDisplay.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Calibrating...';
            
            if (state.modelsLoaded) {
                startFaceDetection();
                startRenderLoop(); // CRITICAL: Start separate render loop
                startAutoCalibration();  // PREMIUM: 5s calibration flash on camera start
            } else {
                drawBasicVideo();
            }
        };
        
    } catch (error) {
        console.error('Camera error:', error);
        loadingOverlay.style.display = 'none';
        showNotification('Camera access denied. Using static mode.', 'warning');
        activateStaticMode();
    }
}

// ===== FACE DETECTION FUNCTIONS =====
async function startFaceDetection() {
    if (!state.isCameraActive || state.isStaticMode) return;
    
    state.faceDetectionActive = true;
    
    // Run detection loop independent of rendering
    detectionLoop();
}

// NEW: Separated Detection Loop (Async, updates Target)
async function detectionLoop() {
    if (!state.faceDetectionActive || !state.isCameraActive) return;
    
    try {
        // PERFORMANCE GUARD: Skip if detection ran too recently.
        // Prevents CPU saturation on fast machines. Does NOT affect accuracy.
        const detectionNow = performance.now();
        if (detectionNow - lastDetectionTimestamp < MIN_DETECTION_INTERVAL_MS) {
            requestAnimationFrame(detectionLoop);
            return;
        }
        lastDetectionTimestamp = detectionNow;

        const detections = await faceapi
            .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions({
                inputSize: 320, // Slightly smaller for speed (performance tweak)
                scoreThreshold: 0.4 // Lower threshold for better tracking
            }))
            .withFaceLandmarks(true);
        
        if (detections.length > 0) {
            const detection = detections[0];
            const landmarks = detection.landmarks;
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            
            const leftEyeCenter = getCenterPoint(leftEye);
            const rightEyeCenter = getCenterPoint(rightEye);
            
            const centerX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
            const centerY = (leftEyeCenter.y + rightEyeCenter.y) / 2;
            
            const eyeDistance = Math.sqrt(
                Math.pow(rightEyeCenter.x - leftEyeCenter.x, 2) + 
                Math.pow(rightEyeCenter.y - leftEyeCenter.y, 2)
            );
            
            const dx = rightEyeCenter.x - leftEyeCenter.x;
            const dy = rightEyeCenter.y - leftEyeCenter.y;
            const angle = Math.atan2(dy, dx);
            
            // ADAPTIVE POSITIONING: Use nose bridge landmark (point 28)
            // to calculate the natural vertical drop from eye center to where
            // glasses actually rest. This replaces the old fixed 0.20 multiplier
            // with a per-face-geometry adaptive value.
            const positions = landmarks.positions;
            const noseBridgeMid = positions[28]; // Mid nose bridge — where glasses sit
            const naturalDrop = noseBridgeMid.y - centerY; // Pixels below eye center
            
            const baseWidth = eyeDistance * 2.4;
            const frameScale = state.selectedGlasses.scale || 0.8;
            const userScale = state.glassesScale;
            
            // UPDATE TARGET STATE (Do not draw yet)
            state.target.x = centerX;
            state.target.y = centerY;
            state.target.scale = baseWidth * frameScale * userScale;
            state.target.angle = angle;
            state.target.valid = true;
            state.target.eyeDistance = eyeDistance;
            state.target.naturalDrop = naturalDrop; // Store for render loop
            
            calculateBiometrics(landmarks);
            classifyFaceShape(landmarks);  // PREMIUM: Face shape AI
            
            if (state.smartMode) {
                // Store detection for smart mode render (needs canvas context in render loop)
                state.lastSmartDetection = detection;
            }
        } else {
            // If no face, don't invalidate target immediately (allows smooth fade/hold)
            // But mark it as old so render loop can handle "lost face" logic if needed
            // For "Silicon Valley" feel, we keep them where they were
        }
        
        // Keep detecting
        detectionLoop();
        
    } catch (error) {
        console.error('Detection error:', error);
        setTimeout(detectionLoop, 100);
    }
}

// NEW: Separated Render Loop (60fps, draws Smooth)
function startRenderLoop() {
    if (!state.isCameraActive || state.isStaticMode) return;
    
    // PERFORMANCE: alpha:false + willReadFrequently:false tells the browser
    // to optimize this canvas for fast drawing (GPU-backed, no alpha compositing overhead).
    const ctx = canvasElement.getContext('2d', { alpha: false, willReadFrequently: false });
    
    function loop() {
        if (!state.isCameraActive) return;

        // 1. Draw Video Feed (Always happens, even if detection lags)
        // PERFORMANCE: fillRect instead of clearRect — faster on alpha:false canvases
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // 2. Apply Filters to Canvas
        if (state.currentFilter && state.currentFilter !== 'none') {
            ctx.filter = state.currentFilter;
        } else {
            ctx.filter = 'none';
        }

        // 3. Handle SmartMode Overlay (on top of video)
        if (state.smartMode && state.lastSmartDetection) {
            drawCoolSmartMode(ctx, state.lastSmartDetection);
        }

        // 4. Physics-Based Smoothing (LERP)
        // Move render state towards target state
        const smoothingFactor = 0.25; // Position/Scale smoothing
        const angleSmoothingFactor = 0.15; // Angle smoothing — stronger to reduce jitter
        
        if (state.target.valid) {
            if (!state.render.initialized) {
                // Instant snap on first detection
                state.render.x = state.target.x;
                state.render.y = state.target.y;
                state.render.scale = state.target.scale;
                state.render.angle = state.target.angle;
                state.render.initialized = true;
            } else {
                // Smoothly interpolate
                state.render.x += (state.target.x - state.render.x) * smoothingFactor;
                state.render.y += (state.target.y - state.render.y) * smoothingFactor;
                state.render.scale += (state.target.scale - state.render.scale) * smoothingFactor;
                
                // Angle smoothing with dead zone to eliminate micro-jitter
                let deltaAngle = state.target.angle - state.render.angle;
                // Handle angle wrapping (PI to -PI)
                while (deltaAngle <= -Math.PI) deltaAngle += Math.PI * 2;
                while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
                // Dead zone: ignore angle changes below ~0.5 degrees to prevent jitter
                if (Math.abs(deltaAngle) > 0.008) {
                    state.render.angle += deltaAngle * angleSmoothingFactor;
                }
            }
            
            // Draw Glasses at SMOOTHED position
            const glassesImg = imageCache.get(state.selectedGlasses.id);
            if (glassesImg && glassesImg.complete) {
                const aspectRatio = glassesImg.width / glassesImg.height;
                
                // ADAPTIVE VERTICAL POSITIONING:
                // 1. naturalDrop = nose bridge position below eye center (adapts to YOUR face)
                // 2. verticalAdjust = per-frame fine-tuning for frame image geometry
                // 3. userVerticalOffset = manual user adjustment
                const baseDrop = state.target.naturalDrop || 0;
                const frameAdjust = (state.selectedGlasses.verticalAdjust || 0) * state.target.eyeDistance;
                const userVerticalOffset = state.verticalOffset * state.target.eyeDistance;
                const userHorizontalOffset = state.horizontalOffset * state.target.eyeDistance;
                
                // Apply offsets to smoothed position
                const finalX = state.render.x + userHorizontalOffset;
                const finalY = state.render.y + baseDrop + frameAdjust + userVerticalOffset;

                drawGlasses(ctx, finalX, finalY, state.render.scale, state.render.angle, glassesImg, aspectRatio);
            }
        } else {
            biometricStatusDisplay.innerHTML = '<i class="fas fa-search"></i> Awaiting Face';
        }

        requestAnimationFrame(loop);
    }
    loop();
}

// Unified Draw Function
function drawGlasses(ctx, x, y, width, angle, img, aspectRatio) {
    const height = width / aspectRatio;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(
        img,
        -width / 2,
        -height / 2,
        width,
        height
    );
    
    // PREMIUM: Lens Reflection Effect — subtle glass glare
    drawLensReflection(ctx, width, height);
    
    ctx.restore();
}

// ===== COOL SMARTMODE VISUALS =====
function drawCoolSmartMode(ctx, detection) {
    const landmarks = detection.landmarks;
    const box = detection.detection.box;
    const positions = landmarks.positions;
    
    ctx.save();
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0, 255, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    
    for (let i = 0; i < positions.length - 1; i++) {
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[i+1].x, positions[i+1].y);
    }
    ctx.moveTo(positions[positions.length-1].x, positions[positions.length-1].y);
    ctx.lineTo(positions[0].x, positions[0].y);
    
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    
    ctx.fillStyle = '#ff00ff';
    const features = [30, 48, 54, 0, 16];
    
    features.forEach(idx => {
        ctx.beginPath();
        ctx.arc(positions[idx].x, positions[idx].y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const leftEyeCenter = getCenterPoint(leftEye);
    const rightEyeCenter = getCenterPoint(rightEye);
    
    const eyes = [
        { p: leftEyeCenter, label: 'R' },
        { p: rightEyeCenter, label: 'L' }
    ];
    
    ctx.font = 'bold 16px "Segoe UI"';
    eyes.forEach(eye => {
        ctx.beginPath();
        ctx.arc(eye.p.x, eye.p.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff0000';
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(eye.label, eye.p.x, eye.p.y + 1);
    });
    
    const centerX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
    const centerY = (leftEyeCenter.y + rightEyeCenter.y) / 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#00ff00';
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Segoe UI"';
    ctx.fillText('C', centerX, centerY + 1);
    
    ctx.restore();
}

function getCenterPoint(points) {
    let sumX = 0, sumY = 0;
    points.forEach(point => {
        sumX += point.x;
        sumY += point.y;
    });
    return { 
        x: sumX / points.length, 
        y: sumY / points.length 
    };
}

function drawCenteredGlasses(ctx) {
    const glassesImg = imageCache.get(state.selectedGlasses.id);
    if (!glassesImg || !glassesImg.complete) return;
    
    const scale = 0.3 * state.glassesScale;
    const x = canvasElement.width / 2;
    const y = canvasElement.height / 2;
    
    ctx.save();
    ctx.translate(x, y);
    
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;

    if (state.currentFilter && state.currentFilter !== 'none') {
        ctx.filter = state.currentFilter;
    }
    
    ctx.drawImage(
        glassesImg,
        -glassesImg.width * scale / 2,
        -glassesImg.height * scale / 2,
        glassesImg.width * scale,
        glassesImg.height * scale
    );
    
    ctx.restore();
}

function drawBasicVideo() {
    function drawLoop() {
        if (!state.isCameraActive || state.isStaticMode) return;
        
        const ctx = canvasElement.getContext('2d');
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        drawCenteredGlasses(ctx);
        
        requestAnimationFrame(drawLoop);
    }
    drawLoop();
}

function activateStaticMode() {
    state.isStaticMode = true;
    state.isCameraActive = false;
    state.faceDetectionActive = false;
    
    if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
    
    staticContainer.style.display = 'flex';
    videoElement.style.display = 'none';
    canvasElement.style.display = 'none';
    permissionOverlay.style.display = 'none';
    loadingOverlay.style.display = 'none';
    
    cameraStatus.textContent = 'Static';
    toggleCameraBtn.innerHTML = '<i class="fas fa-video-slash"></i> Camera: Static';
    
    const cachedImg = imageCache.get(state.selectedGlasses.id);
    staticGlasses.src = cachedImg ? cachedImg.src : `assets/glasses/${state.selectedGlasses.image}`;
    
    staticGlasses.style.position = 'absolute';
    staticGlasses.style.width = `${200 * state.glassesScale}px`;
    staticGlasses.style.left = `${state.glassesX}%`;
    staticGlasses.style.top = `${state.glassesY}%`;
    staticGlasses.style.transform = 'translate(-50%, -50%)';
    staticGlasses.style.cursor = 'grab';
    
    pdValueDisplay.textContent = "-- mm";
    faceWidthValueDisplay.textContent = "-- mm";
    biometricStatusDisplay.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Static Mode';
    biometricStatusDisplay.style.color = '#ffab91';
    
    makeDraggable(staticGlasses);
}

// FIX #5: Guard against duplicate event listeners when toggling modes
function makeDraggable(element) {
    if (element._dragSetup) return;
    element._dragSetup = true;
    
    let isDragging = false;
    let offsetX, offsetY;
    
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDragTouch);
    
    function startDrag(e) {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        element.style.cursor = 'grabbing';
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    }
    
    function startDragTouch(e) {
        isDragging = true;
        const touch = e.touches[0];
        const rect = element.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        document.addEventListener('touchmove', dragTouch);
        document.addEventListener('touchend', stopDrag);
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        const container = staticContainer.getBoundingClientRect();
        const x = e.clientX - container.left - offsetX;
        const y = e.clientY - container.top - offsetY;
        
        const percentX = (x / container.width) * 100;
        const percentY = (y / container.height) * 100;
        
        state.glassesX = Math.max(10, Math.min(percentX, 90));
        state.glassesY = Math.max(10, Math.min(percentY, 90));
        
        element.style.left = `${state.glassesX}%`;
        element.style.top = `${state.glassesY}%`;
        element.style.transform = 'translate(-50%, -50%)';
    }
    
    function dragTouch(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        const container = staticContainer.getBoundingClientRect();
        const x = touch.clientX - container.left - offsetX;
        const y = touch.clientY - container.top - offsetY;
        
        const percentX = (x / container.width) * 100;
        const percentY = (y / container.height) * 100;
        
        state.glassesX = Math.max(10, Math.min(percentX, 90));
        state.glassesY = Math.max(10, Math.min(percentY, 90));
        
        element.style.left = `${state.glassesX}%`;
        element.style.top = `${state.glassesY}%`;
        element.style.transform = 'translate(-50%, -50%)';
    }
    
    function stopDrag() {
        isDragging = false;
        element.style.cursor = 'grab';
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', dragTouch);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

function toggleCamera() {
    if (state.isCameraActive) {
        state.faceDetectionActive = false;
        const stream = videoElement.srcObject;
        if (stream) stream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
        
        state.isCameraActive = false;
        cameraStatus.textContent = 'Off';
        toggleCameraBtn.innerHTML = '<i class="fas fa-video-slash"></i> Camera: Off';
        
        const ctx = canvasElement.getContext('2d');
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        showPermissionOverlay();
    } else {
        startCamera();
    }
}

function showPermissionOverlay() {
    permissionOverlay.style.display = 'flex';
}

// ===== CAPTURE FUNCTION =====
function capturePhoto(action = 'open') {
    playUISound('capture');  // PREMIUM: Shutter sound
    try {
        let dataUrl;
        
        if (state.isCameraActive && !state.isStaticMode) {
            dataUrl = captureFromCanvas();
        } else if (state.isStaticMode) {
            dataUrl = captureFromStatic();
        } else {
            throw new Error('No active view to capture');
        }
        
        if (!dataUrl) throw new Error('Failed to generate image');
        
        state.lastCapturedImage = dataUrl;
        
        switch(action) {
            case 'open':
                openResultPage(dataUrl);
                showNotification('Capture successful!', 'success');
                break;
            case 'download':
                downloadImage(dataUrl);
                break;
            case 'share':
                shareImage(dataUrl);
                break;
        }
        
    } catch (error) {
        console.error('Capture error:', error);
        showNotification(`Capture failed: ${error.message}`, 'error');
    }
}

// ===== WATERMARK HELPER =====
function drawWatermark(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(ADMIN_CONFIG.brandName, width - 20, height - 20);
    
    // DEMO: Additional watermark
    ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('DEMO VERSION', 20, height - 20);
    
    ctx.restore();
}

// ===== PRO CAPTURE ENHANCEMENT =====
// Adds subtle color grading, soft contrast boost, and vignette
// to make captured images look like a high-end studio portrait.
function applyProEnhancement(ctx, width, height) {
    // Layer 1: Subtle warm color grade overlay (very slight golden tint)
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = '#ff9800';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Layer 2: Soft vignette (darker edges, natural focus on center)
    ctx.save();
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.max(width, height) * 0.7;
    const gradient = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Layer 3: Subtle brightness boost in center (lifts the face naturally)
    ctx.save();
    const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.5);
    innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
    innerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = innerGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
}

// FIX #1: Eliminated double-draw — apply filter BEFORE single drawImage
// PRO UPGRADE: Mirrored capture (matches the mirror display), higher resolution,
// subtle color grading + vignette for that "high-end studio" feel.
function captureFromCanvas() {
    try {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        // Capture at full video resolution for crisp quality
        tempCanvas.width = videoElement.videoWidth || canvasElement.width;
        tempCanvas.height = videoElement.videoHeight || canvasElement.height;

        // MIRROR the capture horizontally — matches the CSS scaleX(-1) mirror display.
        // This makes the user appear looking AT the camera (natural selfie/mirror perspective)
        ctx.save();
        ctx.translate(tempCanvas.width, 0);
        ctx.scale(-1, 1);

        // Apply filter before drawing (one draw, not two)
        if (state.currentFilter && state.currentFilter !== 'none') {
            ctx.filter = state.currentFilter;
        } else {
            ctx.filter = 'none';
        }
        ctx.drawImage(canvasElement, 0, 0, tempCanvas.width, tempCanvas.height);
        ctx.filter = 'none';
        ctx.restore();

        // PRO: Subtle color enhancement for that high-end studio look
        applyProEnhancement(ctx, tempCanvas.width, tempCanvas.height);

        // Draw Watermark
        drawWatermark(ctx, tempCanvas.width, tempCanvas.height);

        return tempCanvas.toDataURL('image/png', 1.0);
    } catch (e) {
        console.warn('Direct canvas capture failed. Trying video only.');
        return captureVideoOnly();
    }
}

// FIX #2: Same double-draw elimination for video-only fallback + mirror
function captureVideoOnly() {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    tempCanvas.width = videoElement.videoWidth || canvasElement.width;
    tempCanvas.height = videoElement.videoHeight || canvasElement.height;

    // MIRROR for natural selfie perspective
    ctx.save();
    ctx.translate(tempCanvas.width, 0);
    ctx.scale(-1, 1);
    
    // Apply filter before drawing (one draw, not two)
    if (state.currentFilter && state.currentFilter !== 'none') {
        ctx.filter = state.currentFilter;
    } else {
        ctx.filter = 'none';
    }
    ctx.drawImage(videoElement, 0, 0, tempCanvas.width, tempCanvas.height);
    ctx.filter = 'none';
    ctx.restore();
    
    // PRO enhancement
    applyProEnhancement(ctx, tempCanvas.width, tempCanvas.height);

    // Draw Watermark
    drawWatermark(ctx, tempCanvas.width, tempCanvas.height);
    
    return tempCanvas.toDataURL('image/png', 1.0);
}

// FIX #3: Reset filter before drawing glasses overlay so filter doesn't tint the frames
function captureFromStatic() {
    try {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        
        // Higher resolution for pro output
        tempCanvas.width = 1280;
        tempCanvas.height = 960;
        
        // Apply filter to background only
        if (state.currentFilter && state.currentFilter !== 'none') {
            ctx.filter = state.currentFilter;
        }
        
        const bg = document.getElementById('staticModel');
        if (bg && bg.complete) {
            const scale = Math.min(tempCanvas.width / bg.naturalWidth, tempCanvas.height / bg.naturalHeight) * 0.85;
            const width = bg.naturalWidth * scale;
            const height = bg.naturalHeight * scale;
            ctx.drawImage(bg, (tempCanvas.width - width)/2, (tempCanvas.height - height)/2, width, height);
        }
        
        // Reset filter before drawing glasses so frames aren't tinted
        ctx.filter = 'none';
        
        const glassesImg = imageCache.get(state.selectedGlasses.id);
        if (glassesImg && glassesImg.complete) {
            const container = staticContainer;
            const rect = staticGlasses.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            const x = (rect.left - containerRect.left) * (tempCanvas.width / container.offsetWidth);
            const y = (rect.top - containerRect.top) * (tempCanvas.height / container.offsetHeight);
            const width = rect.width * (tempCanvas.width / container.offsetWidth);
            const height = rect.height * (tempCanvas.height / container.offsetHeight);
            
            ctx.drawImage(glassesImg, x, y, width, height);
        }
        
        // PRO enhancement
        applyProEnhancement(ctx, tempCanvas.width, tempCanvas.height);

        // Draw Watermark
        drawWatermark(ctx, tempCanvas.width, tempCanvas.height);
        
        return tempCanvas.toDataURL('image/png', 1.0);
        
    } catch (error) {
        console.error('Static capture error:', error);
        return createFallbackCapture();
    }
}

function createFallbackCapture() {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    tempCanvas.width = 800;
    tempCanvas.height = 600;
    
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    const glassesImg = imageCache.get(state.selectedGlasses.id);
    if (glassesImg && glassesImg.complete) {
        const scale = 0.5;
        ctx.drawImage(glassesImg, tempCanvas.width/2 - (glassesImg.width*scale)/2, tempCanvas.height/2 - (glassesImg.height*scale)/2, glassesImg.width*scale, glassesImg.height*scale);
    }
    
    ctx.fillStyle = '#1a2980';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(state.selectedGlasses.name, tempCanvas.width / 2, 100);
    
    // Draw Watermark
    drawWatermark(ctx, tempCanvas.width, tempCanvas.height);
    
    return tempCanvas.toDataURL('image/png', 1.0);
}

function downloadImage(dataUrl) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const filename = `${ADMIN_CONFIG.brandName.toLowerCase().replace(/\s+/g, '-')}-tryon-${timestamp}.png`;
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
        
        showNotification('Download started!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Download failed.', 'error');
    }
}

async function shareImage(dataUrl) {
    try {
        const message = `Check out my virtual try-on with ${state.selectedGlasses.name} from ${ADMIN_CONFIG.brandName}!`;
        
        if (navigator.share) {
            try {
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const file = new File([blob], 'opticore-tryon.png', { type: 'image/png' });
                
                await navigator.share({
                    title: `My ${ADMIN_CONFIG.brandName} Virtual Try-On`,
                    text: message,
                    files: [file]
                });
                showNotification('Shared successfully!', 'success');
                return;
            } catch (shareError) {
                if (shareError.name !== 'AbortError') console.log('Web Share failed:', shareError);
            }
        }
        
        showShareOptions(dataUrl, message);
        
    } catch (error) {
        console.error('Share error:', error);
        showNotification('Share failed. Try downloading instead.', 'error');
    }
}

function showShareOptions(dataUrl, message) {
    const encodedMessage = encodeURIComponent(message);
    const shareHTML = `
        <div class="popup-overlay" id="sharePopup" style="display: flex;">
            <div class="popup-content">
                <div class="popup-header">
                    <h3><i class="fas fa-share-alt"></i> Share Your Try-On</h3>
                    <button class="popup-close" onclick="document.getElementById('sharePopup').remove()">×</button>
                </div>
                <div class="popup-body">
                    <p style="margin-bottom: 1.5rem; color: #5a6c7d;">Choose how to share:</p>
                    <div class="contact-options">
                        <a href="https://wa.me/?text=${encodedMessage}" target="_blank" class="contact-option-btn whatsapp-option">
                            <i class="fab fa-whatsapp"></i>
                            <div>
                                <strong>WhatsApp</strong>
                                <p style="font-size: 0.9rem; color: #7f8c8d; margin: 0;">Share via WhatsApp</p>
                            </div>
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="contact-option-btn" style="border-color: #3b5998;">
                            <i class="fab fa-facebook" style="color: #3b5998; font-size: 1.5rem;"></i>
                            <div>
                                <strong>Facebook</strong>
                                <p style="font-size: 0.9rem; color: #7f8c8d; margin: 0;">Share on Facebook</p>
                            </div>
                        </a>
                        <button onclick="navigator.clipboard.writeText('${dataUrl}').then(() => alert('Image data copied!')).catch(() => alert('Download first'));" class="contact-option-btn" style="border-color: #e74c3c;">
                            <i class="fas fa-download" style="color: #e74c3c; font-size: 1.5rem;"></i>
                            <div>
                                <strong>Download First</strong>
                                <p style="font-size: 0.9rem; color: #7f8c8d; margin: 0;">Download image to share</p>
                            </div>
                        </button>
                    </div>
                    <button onclick="document.getElementById('sharePopup').remove()" class="btn-secondary" style="width: 100%; margin-top: 1rem;">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = shareHTML;
    document.body.appendChild(div);
}

function openResultPage(dataUrl) {
    const win = window.open('', '_blank', 'width=1000,height=750,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes');
    if (!win) {
        showNotification('Please allow popups.', 'warning');
        downloadImage(dataUrl);
        return;
    }
    
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Your Try-On</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', sans-serif; background: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .result-container { background: white; border-radius: 24px; padding: 3rem; max-width: 900px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); text-align: center; }
                h1 { color: #1a2980; margin-bottom: 1rem; font-size: 2.5rem; }
                img { max-width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 2rem; }
                .btn-primary { background: linear-gradient(135deg, #1a2980, #2980b9); color: white; border: none; padding: 1rem 2rem; border-radius: 10px; font-weight: 600; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="result-container">
                <h1>Result</h1>
                <img src="${dataUrl}">
                <button class="btn-primary" onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    `);
    win.document.close();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'premium' ? 'lock' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">×</button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

if(!document.getElementById('notif-styles')) {
    const style = document.createElement('style');
    style.id = 'notif-styles';
    style.textContent = `
        .notification { position: fixed; top: 20px; right: 20px; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); z-index: 10000; display: flex; align-items: center; gap: 15px; border-left: 5px solid #3498db; transform: translateX(120%); transition: transform 0.3s; }
        .notification.show { transform: translateX(0); }
        .notification-success { border-left-color: #27ae60; background: linear-gradient(to right, #f0f9ff, white); }
        .notification-premium { border-left-color: #e74c3c; background: linear-gradient(to right, #fff5f5, white); }
        .notification-warning { border-left-color: #f39c12; background: linear-gradient(to right, #fef9e7, white); }
        .notification-content { display: flex; align-items: center; gap: 10px; }
        .notification-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #95a5a6; }
    `;
    document.head.appendChild(style);
}

// ===== ANALYSIS REPORT GENERATOR =====
// Generates a formatted report string for WhatsApp or Email
function generateAnalysisReport(format = 'whatsapp') {
    const timestamp = new Date().toLocaleString();
    const pd = state.biometrics.pd || "Not measured";
    const faceWidth = state.biometrics.faceWidth || "Not measured";
    const frame = state.selectedGlasses.name;

    if (format === 'whatsapp') {
        return `
*${ADMIN_CONFIG.brandName.toUpperCase()} - PRESCRIPTION READY REPORT*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *TRY-ON DETAILS*
├ Frame Selected: ${frame}
├ Analysis Time: ${timestamp}
└ Status: Ready for Review

📏 *CLINICAL MEASUREMENTS*
├ Pupillary Distance (PD): ${pd}
└ Face Width: ${faceWidth}

📋 *NEXT STEPS*
1. Review the attached try-on image
2. Confirm frame selection
3. Contact us for prescription fitting

_Powered by ${ADMIN_CONFIG.brandName}_
        `.trim();
    } else {
        // Email format — plain text, clean structure
        return `${ADMIN_CONFIG.brandName} - Prescription Ready Report
${'='.repeat(45)}

TRY-ON DETAILS
  Frame Selected:  ${frame}
  Analysis Time:   ${timestamp}
  Status:          Ready for Review

CLINICAL MEASUREMENTS
  Pupillary Distance (PD): ${pd}
  Face Width:                ${faceWidth}

NEXT STEPS
  1. Review the attached try-on image
  2. Confirm frame selection
  3. Contact us for prescription fitting

Powered by ${ADMIN_CONFIG.brandName}`;
    }
}

function sendToWhatsAppDirect() {
    const message = generateAnalysisReport('whatsapp');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${ADMIN_CONFIG.phone}?text=${encodedMessage}`;
    window.open(url, '_blank');
}

function applyCanvasFilter(filter) {
    state.currentFilter = filter;
    canvasElement.style.filter = filter;
    staticContainer.style.filter = filter;
}

function handleAdjustment(action) {
    switch(action) {
        case 'size-up':
            state.glassesScale = Math.min(2.0, state.glassesScale + 0.1);
            if (state.isStaticMode) staticGlasses.style.width = `${200 * state.glassesScale}px`;
            break;
        case 'size-down':
            state.glassesScale = Math.max(0.5, state.glassesScale - 0.1);
            if (state.isStaticMode) staticGlasses.style.width = `${200 * state.glassesScale}px`;
            break;
        case 'position-up':
            state.verticalOffset = Math.max(-0.3, state.verticalOffset - 0.03);
            if (state.isStaticMode) { state.glassesY = Math.max(10, state.glassesY - 2); staticGlasses.style.top = `${state.glassesY}%`; }
            break;
        case 'position-down':
            state.verticalOffset = Math.min(0.3, state.verticalOffset + 0.03);
            if (state.isStaticMode) { state.glassesY = Math.min(90, state.glassesY + 2); staticGlasses.style.top = `${state.glassesY}%`; }
            break;
        case 'position-left':
            // Camera mode: canvas is CSS-mirrored (scaleX(-1)), so +offset = LEFT on screen
            state.horizontalOffset = Math.min(0.3, state.horizontalOffset + 0.03);
            // Static mode: CSS left% is NOT mirrored, so -left% = LEFT on screen
            if (state.isStaticMode) { state.glassesX = Math.max(10, state.glassesX - 2); staticGlasses.style.left = `${state.glassesX}%`; }
            break;
        case 'position-right':
            state.horizontalOffset = Math.max(-0.3, state.horizontalOffset - 0.03);
            if (state.isStaticMode) { state.glassesX = Math.min(90, state.glassesX + 2); staticGlasses.style.left = `${state.glassesX}%`; }
            break;
    }
}

function filterGlasses(category) {
    const cards = document.querySelectorAll('.glasses-card');
    cards.forEach(card => {
        const id = parseInt(card.dataset.id);
        const glasses = glassesCatalog.find(g => g.id === id);
        if (category === 'all collections' || category === 'all') card.style.display = 'block';
        else card.style.display = (glasses && glasses.category.includes(category)) ? 'block' : 'none';
    });
}

function resetApp() {
    if (confirm("Reset?")) {
        if (state.isCameraActive) {
            state.faceDetectionActive = false;
            if (videoElement.srcObject) videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
        
        Object.assign(state, {
            isCameraActive: false, selectedGlasses: glassesCatalog[0], isStaticMode: false, faceDetectionActive: false,
            currentFilter: "none", modelsLoaded: state.modelsLoaded, smartMode: false,
            glassesScale: 1.0, verticalOffset: 0.0, horizontalOffset: 0.0, glassesX: 50, glassesY: 40,
            lastCapturedImage: null, 
            render: { x: 0, y: 0, scale: 0, angle: 0, initialized: false },
            target: { x:0, y:0, scale:0, angle:0, valid: false },
            biometrics: { pd: 0, faceWidth: 0, lastUpdated: 0 }
        });
        
        videoElement.style.display = 'none'; canvasElement.style.display = 'none'; staticContainer.style.display = 'none';
        canvasElement.style.filter = 'none'; staticContainer.style.filter = 'none';
        staticGlasses.style.left = '50%'; staticGlasses.style.top = '40%'; staticGlasses.style.transform = 'translate(-50%, -50%)'; staticGlasses.style.width = '200px';
        
        document.querySelectorAll('.light-btn').forEach((btn, i) => { btn.classList.remove('active'); if(i===0) btn.classList.add('active'); });
        document.querySelectorAll('.filter-btn').forEach((btn, i) => { btn.classList.remove('active'); if(i===0) btn.classList.add('active'); });
        
        pdValueDisplay.textContent = "-- mm";
        faceWidthValueDisplay.textContent = "-- mm";
        biometricStatusDisplay.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Awaiting Face Scan';
        
        showPermissionOverlay();
        selectGlasses(glassesCatalog[0]);
        filterGlasses('all');
        showNotification('Reset successfully', 'success');
    }
}

// ===== MEMORY CLEANUP =====
// Prevents memory leaks when the page is closed/navigated away.
// Stops camera tracks, cancels detection, and clears caches.
window.addEventListener('beforeunload', () => {
    state.faceDetectionActive = false;
    if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
    }
    imageCache.clear();
    faceShapeBuffer.length = 0;
});

console.log("✅ " + ADMIN_CONFIG.brandName + " - Demo Engine Active (Limited Features + Performance Guards)");

// ============================================
// PREMIUM UPGRADES — ALL NEW FUNCTIONS
// These add ON TOP of the engine. Zero core engine modifications.
// ============================================

// ===== 1. LENS REFLECTION EFFECT =====
// Draws directional glass glare on BOTH lenses after the frame is drawn.
// Left lens: stronger reflection (primary light source direction).
// Right lens: softer, offset reflection (secondary catch light).
// This mimics real-world directional lighting for maximum realism.
// Runs at 60fps inside drawGlasses. Uses radial gradients — GPU accelerated, zero lag.
function drawLensReflection(ctx, frameWidth, frameHeight) {
    if (!state.isCameraActive || state.isStaticMode) return;
    
    const lensW = frameWidth * 0.20;
    const lensH = frameHeight * 0.38;
    
    ctx.globalCompositeOperation = 'lighter';
    
    // ── LEFT LENS: Primary reflection (stronger) ──
    const leftX = -frameWidth * 0.14;
    const leftY = -frameHeight * 0.06;
    
    const leftGrad = ctx.createRadialGradient(
        leftX - lensW * 0.2, leftY - lensH * 0.2, 0,
        leftX, leftY, lensW
    );
    leftGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
    leftGrad.addColorStop(0.45, 'rgba(255,255,255,0.05)');
    leftGrad.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = leftGrad;
    ctx.beginPath();
    ctx.ellipse(leftX, leftY, lensW * 0.75, lensH * 0.55, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Left lens sharp glint
    const glintX = leftX + lensW * 0.18;
    const glintY = leftY - lensH * 0.12;
    const glintGrad = ctx.createRadialGradient(glintX, glintY, 0, glintX, glintY, lensW * 0.18);
    glintGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
    glintGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glintGrad;
    ctx.beginPath();
    ctx.arc(glintX, glintY, lensW * 0.14, 0, Math.PI * 2);
    ctx.fill();
    
    // ── RIGHT LENS: Secondary reflection (softer, offset angle) ──
    const rightX = frameWidth * 0.14;
    const rightY = -frameHeight * 0.06;
    
    const rightGrad = ctx.createRadialGradient(
        rightX + lensW * 0.15, rightY - lensH * 0.1, 0,
        rightX, rightY, lensW * 0.85
    );
    rightGrad.addColorStop(0, 'rgba(255,255,255,0.10)');
    rightGrad.addColorStop(0.5, 'rgba(255,255,255,0.03)');
    rightGrad.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = rightGrad;
    ctx.beginPath();
    ctx.ellipse(rightX, rightY, lensW * 0.65, lensH * 0.45, 0.25, 0, Math.PI * 2);
    ctx.fill();
    
    // Right lens subtle glint (much smaller)
    const rGlintX = rightX + lensW * 0.10;
    const rGlintY = rightY - lensH * 0.08;
    const rGlintGrad = ctx.createRadialGradient(rGlintX, rGlintY, 0, rGlintX, rGlintY, lensW * 0.12);
    rGlintGrad.addColorStop(0, 'rgba(255,255,255,0.14)');
    rGlintGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rGlintGrad;
    ctx.beginPath();
    ctx.arc(rGlintX, rGlintY, lensW * 0.09, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'source-over';
}

// ===== 2. FACE SHAPE AI =====
// Analyzes face landmarks to classify face shape and recommend frames.
// Uses a multi-signal scoring system with a running buffer for stability.
// Webcam perspective distortion is compensated — not every face is "round".
// Throttled to run once every 2 seconds — zero performance impact.

let lastFaceShapeUpdate = 0;
const faceShapeBuffer = []; // Running buffer of last N classifications
const FACE_SHAPE_BUFFER_SIZE = 3; // Majority vote from 3 readings

function classifyFaceShape(landmarks) {
    const now = Date.now();
    if (now - lastFaceShapeUpdate < 2000) return; // Throttle: every 2s
    lastFaceShapeUpdate = now;
    
    try {
        const positions = landmarks.positions;
        const jaw = landmarks.getJawOutline();
        
        // ── MEASUREMENTS ──
        const faceWidth = Math.sqrt(
            Math.pow(jaw[16].x - jaw[0].x, 2) + Math.pow(jaw[16].y - jaw[0].y, 2)
        );
        // Use forehead (19) to chin (8) for face height
        const faceHeight = Math.abs(jaw[8].y - positions[19].y);
        
        if (faceWidth === 0 || faceHeight <= 0) return;
        
        const ratio = faceHeight / faceWidth;
        const foreheadW = Math.abs(positions[17].x - positions[26].x);
        const cheekboneW = Math.abs(positions[1].x - positions[15].x);
        const jawW = Math.abs(jaw[5].x - jaw[11].x);
        
        // ── MULTI-SIGNAL SCORING ──
        // Each shape gets a score based on how strongly its indicators match.
        // This prevents single-threshold cascading that defaults everything to oval.
        const scores = { oval: 0, round: 0, square: 0, heart: 0, oblong: 0 };
        
        // Signal 1: Height-to-width ratio
        // Webcam faces appear wider due to perspective, so thresholds are adjusted.
        // Typical webcam ratio: 1.15 (very wide/round) to 1.65 (very narrow/oblong)
        if (ratio < 1.30) {
            scores.round += 3;   // Strong round signal
            scores.square += 1;  // Square faces also tend to be wider
        } else if (ratio > 1.50) {
            scores.oblong += 3;  // Strong oblong signal
            scores.heart += 1;   // Heart faces can also be longer
        } else {
            scores.oval += 2;    // Oval is the balanced middle
            scores.heart += 1;
            scores.square += 1;
        }
        
        // Signal 2: Jaw width vs forehead width
        // Square: jaw nearly as wide as forehead (strong jawline)
        // Heart: jaw significantly narrower than forehead
        const jawForeheadRatio = jawW / foreheadW;
        if (jawForeheadRatio > 0.88) {
            scores.square += 3;
            scores.round += 1;  // Round faces can also have wide jaws
        } else if (jawForeheadRatio < 0.78) {
            scores.heart += 3;
            scores.oblong += 1;
        } else {
            scores.oval += 2;
        }
        
        // Signal 3: Cheekbone prominence
        // Heart: cheekbones are the widest part, significantly wider than jaw
        // Square: cheekbones and jaw are similarly wide
        const cheekJawRatio = cheekboneW / jawW;
        if (cheekJawRatio > 1.10) {
            scores.heart += 2;
            scores.oval += 1;
        } else if (cheekJawRatio < 1.02) {
            scores.square += 2;
        } else {
            scores.oval += 1;
            scores.round += 1;
        }
        
        // Signal 4: Forehead vs cheekbone width
        // Heart: forehead wide, cheekbones moderate
        // Round: forehead and cheekbones similar width
        const foreheadCheekRatio = foreheadW / cheekboneW;
        if (foreheadCheekRatio > 1.05) {
            scores.heart += 2;
        } else if (foreheadCheekRatio < 0.90) {
            scores.round += 2;
        } else {
            scores.oval += 1;
        }
        
        // Signal 5: Chin point position relative to face center
        // Heart: chin is narrower and more pointed
        // Square: chin is wider/flatter
        const chinWidth = Math.abs(jaw[6].x - jaw[10].x);
        const chinForeheadRatio = chinWidth / foreheadW;
        if (chinForeheadRatio < 0.55) {
            scores.heart += 2;
        } else if (chinForeheadRatio > 0.70) {
            scores.square += 2;
        } else {
            scores.oval += 1;
        }
        
        // ── SELECT WINNER ──
        let bestShape = 'oval';
        let bestScore = 0;
        for (const [shape, score] of Object.entries(scores)) {
            if (score > bestScore) {
                bestScore = score;
                bestShape = shape;
            }
        }
        
        // ── STABILITY BUFFER (Majority vote from last 3 readings) ──
        faceShapeBuffer.push(bestShape);
        if (faceShapeBuffer.length > FACE_SHAPE_BUFFER_SIZE) {
            faceShapeBuffer.shift();
        }
        
        // Only update if buffer has enough readings
        if (faceShapeBuffer.length >= 2) {
            // Count votes
            const votes = {};
            faceShapeBuffer.forEach(s => { votes[s] = (votes[s] || 0) + 1; });
            let stableShape = bestShape;
            let maxVotes = 0;
            for (const [shape, count] of Object.entries(votes)) {
                if (count > maxVotes) {
                    maxVotes = count;
                    stableShape = shape;
                }
            }
            // Only trigger update if majority agrees (at least 2 out of 3)
            if (maxVotes >= 2 && state.faceShape !== stableShape) {
                state.faceShape = stableShape;
                updateFrameRecommendations(stableShape);
                showNotification(
                    `Face shape: ${stableShape.charAt(0).toUpperCase() + stableShape.slice(1)} — AI recommendations updated`, 
                    'info'
                );
            }
        }
    } catch (e) {
        // Silently fail — face shape is bonus, not critical
    }
}

function updateFrameRecommendations(faceShape) {
    const recommended = FACE_FRAME_MAP[faceShape] || [];
    
    document.querySelectorAll('.glasses-card').forEach(card => {
        // Remove existing badge
        const existing = card.querySelector('.recommend-badge');
        if (existing) existing.remove();
        
        const id = parseInt(card.dataset.id);
        const glasses = glassesCatalog.find(g => g.id === id);
        
        if (glasses && recommended.includes(glasses.style)) {
            const badge = document.createElement('div');
            badge.className = 'recommend-badge';
            badge.textContent = 'Best Fit';
            card.style.position = 'relative';
            card.appendChild(badge);
        }
    });
}

// ===== 3. AUTO-CALIBRATION FLASH =====
// Activates Neural Calibration for 5s when camera starts,
// making the system feel like it's intelligently scanning the face.

function startAutoCalibration() {
    if (state.smartMode) return; // Don't override if already manually on
    
    state.smartMode = true;
    state.autoCalActive = true;
    showNotification('Neural Calibration: Scanning face...', 'info');
    
    setTimeout(() => {
        if (state.autoCalActive) {
            state.smartMode = false;
            state.autoCalActive = false;
            showNotification('Calibration complete. Ready for try-on.', 'success');
        }
    }, 5000);
}

// ===== 4. AMBIENT SOUND ENGINE =====
// Uses Web Audio API — zero file loading, zero delay, zero network requests.
// Sounds are generated programmatically (oscillators + noise bursts).

function initAudioContext() {
    if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
    }
}

function playUISound(type) {
    if (!state.soundEnabled) return;
    
    try {
        initAudioContext();
        const ctx = state.audioCtx;
        const now = ctx.currentTime;
        
        if (type === 'click') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.04);
            gain.gain.setValueAtTime(0.07, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'select') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.13);
        } else if (type === 'capture') {
            const bufferSize = Math.floor(ctx.sampleRate * 0.07);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(3000, now);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            source.start(now);
        }
    } catch (e) {
        // Audio is optional — never let it break anything
    }
}

function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
        btn.innerHTML = state.soundEnabled 
            ? '<i class="fas fa-volume-up"></i>' 
            : '<i class="fas fa-volume-mute"></i>';
    }
    showNotification(`Sound ${state.soundEnabled ? 'Enabled' : 'Disabled'}`, 'info');
}

function createSoundToggleButton() {
    if (document.getElementById('soundToggleBtn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'soundToggleBtn';
    btn.innerHTML = '<i class="fas fa-volume-up"></i>';
    btn.title = 'Toggle Sound';
    btn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        width: 44px; height: 44px; border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.25);
        background: rgba(26,41,128,0.75);
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        color: white; cursor: pointer; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: transform 0.2s ease, background 0.2s ease;
    `;
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
        btn.style.background = 'rgba(26,41,128,0.95)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.background = 'rgba(26,41,128,0.75)';
    });
    btn.addEventListener('click', () => {
        playUISound('click');
        toggleSound();
    });
    document.body.appendChild(btn);
}

// ===== 5. KEYBOARD SHORTCUTS GUIDE =====

function showShortcutsGuide() {
    const existing = document.getElementById('shortcutsPanel');
    if (existing) { existing.remove(); return; }
    playUISound('click');
    
    const panel = document.createElement('div');
    panel.id = 'shortcutsPanel';
    panel.innerHTML = `
        <div class="shortcuts-overlay">
            <div class="shortcuts-card">
                <div class="shortcuts-header">
                    <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                    <button class="shortcuts-close" id="scCloseBtn">&times;</button>
                </div>
                <div class="shortcuts-body">
                    <div class="shortcut-row"><div class="shortcut-keys"><kbd>+</kbd> <kbd>-</kbd></div><span>Scale frames larger / smaller</span></div>
                    <div class="shortcut-row"><div class="shortcut-keys"><kbd>&uarr;</kbd> <kbd>&darr;</kbd> <kbd>&larr;</kbd> <kbd>&rarr;</kbd></div><span>Move frames up / down / left / right</span></div>
                    <div class="shortcut-row"><div class="shortcut-keys"><kbd>Ctrl</kbd>+<kbd>D</kbd></div><span>Toggle Neural Calibration</span></div>
                    <div class="shortcut-row"><div class="shortcut-keys"><kbd>Ctrl</kbd>+<kbd>M</kbd></div><span>Toggle Ava Assistant</span></div>
                    <div class="shortcut-row"><div class="shortcut-keys"><kbd>Ctrl</kbd>+<kbd>H</kbd></div><span>Show / hide this help panel</span></div>
                    <div class="shortcut-row"><div class="shortcut-keys"><kbd>Space</kbd></div><span>Capture photo</span></div>
                    <div class="shortcut-row"><div class="shortcut-keys"><kbd>Esc</kbd></div><span>Close any open popup</span></div>
                </div>
                <div class="shortcuts-footer">
                    <button class="sc-got-it-btn" id="scGotItBtn">Got It</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    
    document.getElementById('scCloseBtn').addEventListener('click', () => { panel.remove(); });
    document.getElementById('scGotItBtn').addEventListener('click', () => { panel.remove(); });
    panel.querySelector('.shortcuts-overlay').addEventListener('click', (e) => {
        if (e.target === panel.querySelector('.shortcuts-overlay')) panel.remove();
    });
}

// ===== 6. ONBOARDING GUIDE =====
// Shows once per session after the loading screen.

function showOnboardingGuide() {
    if (sessionStorage.getItem('opticore_demo_onboarded')) return;
    sessionStorage.setItem('opticore_demo_onboarded', 'true');
    
    setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.id = 'onboardingOverlay';
        overlay.innerHTML = `
            <div class="onboarding-overlay">
                <div class="onboarding-card">
                    <div style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#e74c3c,#c0392b);color:white;font-size:0.7rem;font-weight:700;padding:4px 12px;border-radius:20px;margin-bottom:0.8rem;text-transform:uppercase;letter-spacing:1px;">
                        <i class="fas fa-flask"></i> Demo Version
                    </div>
                    <div class="onboarding-icon"><i class="fas fa-eye"></i></div>
                    <h2>Welcome to ${ADMIN_CONFIG.brandName}</h2>
                    <p class="onboarding-subtitle">${ADMIN_CONFIG.brandTagline}</p>
                    <div class="onboarding-features">
                        <div class="onboarding-feature">
                            <i class="fas fa-camera"></i>
                            <div><strong>Smart Camera</strong><p>Frames auto-detect and fit your face precisely</p></div>
                        </div>
                        <div class="onboarding-feature">
                            <i class="fas fa-sliders-h"></i>
                            <div><strong>Precise Control</strong><p>Use +/- and arrow keys for micro-adjustments</p></div>
                        </div>
                        <div class="onboarding-feature">
                            <i class="fas fa-brain"></i>
                            <div><strong>Face Intelligence</strong><p>AI recommends the best frames for your face shape</p></div>
                        </div>
                        <div class="onboarding-feature">
                            <i class="fas fa-glasses"></i>
                            <div><strong>Try 5 Demo Frames</strong><p>Premium unlocks 12+ professional models</p></div>
                        </div>
                        <div class="onboarding-feature">
                            <i class="fas fa-keyboard"></i>
                            <div><strong>Keyboard Shortcuts</strong><p>Press <code style="background:#e8f0f8;padding:1px 5px;border-radius:4px;font-size:0.78rem;">Ctrl+H</code> anytime to view all shortcuts</p></div>
                        </div>
                    </div>
                    <p style="color:#95a5a6;font-size:0.78rem;margin-bottom:1.2rem;"><i class="fas fa-lock" style="margin-right:4px;"></i> Sharing, downloads, and consultation are premium features</p>
                    <button class="ob-start-btn" id="onboardingStartBtn">Get Started</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('onboardingStartBtn').addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
            playUISound('select');
        });
    }, 4600); // After loading screen (4.2s) + small buffer
}

// ===== 7. PREMIUM CSS INJECTION =====
// Micro-animations, glassmorphism, onboarding, shortcuts panel styles.
// Injected once on init. Uses only transform/opacity for GPU-accelerated animations.

function injectPremiumCSS() {
    if (document.getElementById('premium-upgrade-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'premium-upgrade-styles';
    style.textContent = `
        /* ── MICRO-ANIMATIONS ── */
        .btn-primary, .btn-secondary {
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease !important;
        }
        .btn-primary:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(26,41,128,0.25) !important;
        }
        .btn-primary:active { transform: translateY(0) !important; }
        
        .adjust-btn, .filter-btn, .light-btn {
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease !important;
        }
        .adjust-btn:hover {
            transform: scale(1.06) !important;
            box-shadow: 0 3px 10px rgba(0,0,0,0.12) !important;
        }
        .adjust-btn:active { transform: scale(0.97) !important; }
        
        .glasses-card {
            transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), 
                        box-shadow 0.3s ease !important;
        }
        .glasses-card:hover {
            transform: translateY(-5px) scale(1.02) !important;
            box-shadow: 0 10px 28px rgba(0,0,0,0.14) !important;
        }
        .glasses-card.selected {
            box-shadow: 0 0 0 3px rgba(26,41,128,0.35), 0 8px 22px rgba(0,0,0,0.10) !important;
        }
        
        /* ── RECOMMENDATION BADGE ── */
        .recommend-badge {
            position: absolute; top: 8px; right: 8px;
            background: linear-gradient(135deg, #4CAF50, #2E7D32);
            color: white; font-size: 0.65rem; font-weight: 700;
            padding: 3px 8px; border-radius: 10px;
            text-transform: uppercase; letter-spacing: 0.4px;
            z-index: 5;
            box-shadow: 0 2px 8px rgba(76,175,80,0.4);
            animation: badgeGlow 2.5s ease-in-out infinite;
        }
        @keyframes badgeGlow {
            0%, 100% { box-shadow: 0 2px 8px rgba(76,175,80,0.4); }
            50% { box-shadow: 0 2px 16px rgba(76,175,80,0.6); }
        }
        
        /* ── GLASSMORPHISM — Overlays & Popups ── */
        .popup-overlay {
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
        }
        .popup-content {
            border: 1px solid rgba(26,41,128,0.08) !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.15) inset !important;
        }
        
        #avaInterface {
            backdrop-filter: blur(18px) !important;
            -webkit-backdrop-filter: blur(18px) !important;
            border: 1px solid rgba(156,39,176,0.12) !important;
            box-shadow: 0 25px 60px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.12) inset !important;
        }
        
        /* ── NOTIFICATIONS ── */
        .notification {
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
            border: 1px solid rgba(255,255,255,0.20) !important;
            box-shadow: 0 8px 30px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.10) inset !important;
        }
        
        /* ── SHORTCUTS PANEL ── */
        .shortcuts-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.45);
            backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
            display: flex; align-items: center; justify-content: center;
            z-index: 20000;
            animation: premFadeIn 0.2s ease;
        }
        .shortcuts-card {
            background: rgba(255,255,255,0.97);
            backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
            border-radius: 20px; padding: 2rem; max-width: 460px; width: 92%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.22), 0 0 0 1px rgba(26,41,128,0.06) inset;
            border: 1px solid rgba(26,41,128,0.08);
        }
        .shortcuts-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 1.2rem;
        }
        .shortcuts-header h3 { color: #1a2980; font-size: 1.2rem; margin: 0; }
        .shortcuts-close {
            background: none; border: none; font-size: 1.6rem;
            cursor: pointer; color: #95a5a6; padding: 0 0.3rem;
            border-radius: 8px; transition: background 0.2s; line-height: 1;
        }
        .shortcuts-close:hover { background: #f0f0f0; }
        
        .shortcut-row {
            display: flex; align-items: center;
            padding: 0.6rem 0; border-bottom: 1px solid #f0f2f5; gap: 0.8rem;
        }
        .shortcut-row:last-child { border-bottom: none; }
        .shortcut-keys { display: flex; gap: 3px; min-width: 110px; }
        .shortcut-keys kbd {
            background: linear-gradient(135deg, #f5f6fa, #e8e9ed);
            border: 1px solid #d1d5db; border-radius: 5px;
            padding: 0.15rem 0.45rem; font-size: 0.8rem;
            font-family: 'Segoe UI', monospace;
            box-shadow: 0 2px 0 #c5c8ce; text-align: center;
        }
        .shortcut-row span { color: #5a6c7d; font-size: 0.88rem; }
        .shortcuts-footer { margin-top: 1.3rem; text-align: center; }
        .sc-got-it-btn {
            background: linear-gradient(135deg, #1a2980, #2980b9);
            color: white; border: none; padding: 0.65rem 2.5rem;
            border-radius: 10px; font-weight: 600; font-size: 0.95rem;
            cursor: pointer; transition: transform 0.2s ease;
        }
        .sc-got-it-btn:hover { transform: scale(1.04); }
        
        /* ── ONBOARDING GUIDE ── */
        .onboarding-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.55);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            display: flex; align-items: center; justify-content: center;
            z-index: 25000; animation: premFadeIn 0.3s ease;
        }
        .onboarding-card {
            background: rgba(255,255,255,0.98);
            backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
            border-radius: 24px; padding: 2.5rem 2rem;
            max-width: 420px; width: 90%; text-align: center;
            box-shadow: 0 25px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(26,41,128,0.06) inset;
            border: 1px solid rgba(26,41,128,0.08);
            transition: opacity 0.3s ease;
        }
        .onboarding-icon {
            width: 60px; height: 60px; border-radius: 50%;
            background: linear-gradient(135deg, #1a2980, #2980b9);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 1rem; font-size: 1.5rem; color: white;
            box-shadow: 0 8px 25px rgba(26,41,128,0.3);
        }
        .onboarding-card h2 { color: #1a2980; font-size: 1.5rem; margin: 0 0 0.3rem; }
        .onboarding-subtitle { color: #7f8c8d; font-size: 0.92rem; margin: 0 0 1.5rem; }
        .onboarding-features { text-align: left; margin-bottom: 2rem; }
        .onboarding-feature {
            display: flex; align-items: flex-start; gap: 0.9rem; padding: 0.7rem 0;
        }
        .onboarding-feature i {
            color: #1a2980; font-size: 1.15rem; margin-top: 0.1rem; min-width: 22px;
        }
        .onboarding-feature strong { color: #2c3e50; display: block; font-size: 0.92rem; }
        .onboarding-feature p { color: #7f8c8d; font-size: 0.82rem; margin: 0.1rem 0 0; }
        .ob-start-btn {
            background: linear-gradient(135deg, #1a2980, #2980b9);
            color: white; border: none; padding: 0.85rem 3rem;
            border-radius: 12px; font-size: 1rem; font-weight: 600;
            cursor: pointer; transition: transform 0.2s ease;
            box-shadow: 0 6px 20px rgba(26,41,128,0.3);
        }
        .ob-start-btn:hover { transform: scale(1.04); }
        
        @keyframes premFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ===== EMAIL ANALYSIS BUTTON =====
function setupEmailButton() {
    // Look for an existing email button in the HTML
    let emailBtn = document.getElementById('emailAnalysisBtn');
    
    if (!emailBtn) {
        // Create the button dynamically and insert it next to the WhatsApp button
        emailBtn = document.createElement('button');
        emailBtn.id = 'emailAnalysisBtn';
        emailBtn.innerHTML = '<i class="fas fa-envelope"></i> Email Report';
        emailBtn.className = sendToWhatsAppBtn.className;
        emailBtn.style.cssText = sendToWhatsAppBtn.style.cssText;
        
        // Insert after the WhatsApp button
        const parent = sendToWhatsAppBtn.parentNode;
        if (parent) {
            parent.insertBefore(emailBtn, sendToWhatsAppBtn.nextSibling);
        }
    }
    
    // DEMO: Lock email button
    emailBtn.addEventListener('click', (e) => { e.stopImmediatePropagation(); demoLock('Email Report'); });
    // Add locked visual class
    emailBtn.classList.add('demo-locked');
}

function sendAnalysisToEmail() {
    const report = generateAnalysisReport('email');
    const subject = encodeURIComponent(`${ADMIN_CONFIG.brandName} - Virtual Try-On Analysis Report`);
    const body = encodeURIComponent(report);
    
    window.open(`mailto:${ADMIN_CONFIG.email}?subject=${subject}&body=${body}`, '_self');
    showNotification('Opening email client...', 'info');
}

// ===== CONSULTATION UI UPDATE =====
// Hides raw phone numbers from display — actual links still work
function updateConsultationUI() {
    // Update consultation buttons to show clean labels without raw numbers
    if (directCallBtn) {
        directCallBtn.innerHTML = '<i class="fas fa-phone-alt"></i> Call Us Now';
    }
    if (whatsappConsultBtn) {
        whatsappConsultBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Message Us';
    }
    
    // If the contact popup has any hardcoded number text, mask it
    if (contactPopup) {
        const popupText = contactPopup.innerHTML;
        // Replace any visible full number with masked version
        if (popupText.includes(ADMIN_CONFIG.phone)) {
            const masked = ADMIN_CONFIG.phone.slice(0, -4) + '****';
            contactPopup.innerHTML = popupText.replace(ADMIN_CONFIG.phone, masked);
        }
    }
}