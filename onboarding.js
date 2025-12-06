/**
 * Onboarding Tour System
 * Interactive walkthrough for first-time users
 */

const Onboarding = (function() {
    const STORAGE_KEY = 'onboarding_completed';
    const TOUR_VERSION = '2.0'; // Increment to show tour again after major updates

    let currentStep = 0;
    let tourOverlay = null;
    let tourPopup = null;
    let isActive = false;
    let onCompleteCallback = null;

    const TOUR_STEPS = [
        {
            target: '#file-input-zone',
            title: 'Upload Screenshots',
            content: 'Drag and drop your app screenshots here, or click to browse. We support multiple uploads!',
            position: 'right'
        },
        {
            target: '#magical-titles-btn',
            title: 'Magic Design',
            content: 'Click the star button to let AI automatically design your screenshots with optimal layouts, backgrounds, and headlines.',
            position: 'bottom'
        },
        {
            target: '.canvas-wrapper',
            title: 'Preview Canvas',
            content: 'See your screenshot design in real-time. Changes are reflected instantly as you adjust settings.',
            position: 'left'
        },
        {
            target: '#background-tab-btn',
            title: 'Background Settings',
            content: 'Choose from 80+ professional presets, or create custom gradients and solid colors.',
            position: 'left'
        },
        {
            target: '#device-tab-btn',
            title: 'Device Settings',
            content: 'Adjust device position, scale, rotation, and choose between 2D and 3D mockup modes.',
            position: 'left'
        },
        {
            target: '#text-tab-btn',
            title: 'Text Settings',
            content: 'Add compelling headlines and subheadlines. Use the AI to generate conversion-optimized copy.',
            position: 'left'
        },
        {
            target: '#layout-picker',
            title: 'Layout Presets',
            content: 'Choose from 26+ professional layouts including panoramic, dual-device, and zoom views.',
            position: 'right',
            optional: true
        },
        {
            target: '#theme-picker',
            title: 'Design Themes',
            content: 'Apply complete design themes with coordinated colors, fonts, and styles.',
            position: 'right',
            optional: true
        },
        {
            target: '.export-row',
            title: 'Export Your Work',
            content: 'Export single screenshots or batch export all as PNG. Choose from multiple device sizes including App Store and Play Store formats.',
            position: 'top'
        },
        {
            target: '#language-picker',
            title: 'Multi-Language Support',
            content: 'Manage screenshots in multiple languages. Upload localized versions and switch between them easily.',
            position: 'bottom'
        }
    ];

    /**
     * Check if onboarding should be shown
     */
    function shouldShowTour() {
        const completed = localStorage.getItem(STORAGE_KEY);
        if (!completed) return true;

        try {
            const data = JSON.parse(completed);
            return data.version !== TOUR_VERSION;
        } catch {
            return true;
        }
    }

    /**
     * Mark tour as completed
     */
    function markComplete() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: TOUR_VERSION,
            completedAt: Date.now()
        }));
    }

    /**
     * Reset tour (for testing or showing again)
     */
    function resetTour() {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Create tour overlay
     */
    function createOverlay() {
        if (tourOverlay) return;

        tourOverlay = document.createElement('div');
        tourOverlay.className = 'onboarding-overlay';
        tourOverlay.innerHTML = `
            <div class="onboarding-spotlight"></div>
        `;
        document.body.appendChild(tourOverlay);
    }

    /**
     * Create tour popup
     */
    function createPopup() {
        if (tourPopup) return;

        tourPopup = document.createElement('div');
        tourPopup.className = 'onboarding-popup';
        tourPopup.innerHTML = `
            <div class="onboarding-popup-content">
                <div class="onboarding-popup-header">
                    <h3 class="onboarding-title"></h3>
                    <button class="onboarding-close">&times;</button>
                </div>
                <p class="onboarding-content"></p>
                <div class="onboarding-footer">
                    <div class="onboarding-progress">
                        <span class="onboarding-step-count"></span>
                    </div>
                    <div class="onboarding-buttons">
                        <button class="onboarding-skip">Skip Tour</button>
                        <button class="onboarding-prev">Previous</button>
                        <button class="onboarding-next">Next</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(tourPopup);

        // Event listeners
        tourPopup.querySelector('.onboarding-close').addEventListener('click', endTour);
        tourPopup.querySelector('.onboarding-skip').addEventListener('click', endTour);
        tourPopup.querySelector('.onboarding-prev').addEventListener('click', prevStep);
        tourPopup.querySelector('.onboarding-next').addEventListener('click', nextStep);
    }

    /**
     * Position popup next to target element
     */
    function positionPopup(step) {
        const target = document.querySelector(step.target);
        if (!target) {
            // Skip if target not found
            nextStep();
            return;
        }

        const rect = target.getBoundingClientRect();
        const popup = tourPopup;
        const spotlight = tourOverlay.querySelector('.onboarding-spotlight');

        // Highlight target
        spotlight.style.top = `${rect.top - 8}px`;
        spotlight.style.left = `${rect.left - 8}px`;
        spotlight.style.width = `${rect.width + 16}px`;
        spotlight.style.height = `${rect.height + 16}px`;

        // Update popup content
        popup.querySelector('.onboarding-title').textContent = step.title;
        popup.querySelector('.onboarding-content').textContent = step.content;
        popup.querySelector('.onboarding-step-count').textContent =
            `${currentStep + 1} of ${getValidSteps().length}`;

        // Position popup
        const popupRect = popup.getBoundingClientRect();
        const padding = 20;

        let top, left;

        switch (step.position) {
            case 'right':
                top = rect.top + rect.height / 2 - popupRect.height / 2;
                left = rect.right + padding;
                break;
            case 'left':
                top = rect.top + rect.height / 2 - popupRect.height / 2;
                left = rect.left - popupRect.width - padding;
                break;
            case 'top':
                top = rect.top - popupRect.height - padding;
                left = rect.left + rect.width / 2 - popupRect.width / 2;
                break;
            case 'bottom':
            default:
                top = rect.bottom + padding;
                left = rect.left + rect.width / 2 - popupRect.width / 2;
                break;
        }

        // Keep within viewport
        top = Math.max(padding, Math.min(top, window.innerHeight - popupRect.height - padding));
        left = Math.max(padding, Math.min(left, window.innerWidth - popupRect.width - padding));

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;

        // Update button states
        popup.querySelector('.onboarding-prev').style.display = currentStep > 0 ? 'block' : 'none';
        popup.querySelector('.onboarding-next').textContent =
            currentStep === getValidSteps().length - 1 ? 'Finish' : 'Next';
    }

    /**
     * Get valid steps (filter out those with missing targets)
     */
    function getValidSteps() {
        return TOUR_STEPS.filter(step => {
            if (step.optional) {
                return document.querySelector(step.target) !== null;
            }
            return true;
        });
    }

    /**
     * Show specific step
     */
    function showStep(index) {
        const steps = getValidSteps();
        if (index < 0 || index >= steps.length) return;

        currentStep = index;
        const step = steps[index];

        // Check if target exists
        const target = document.querySelector(step.target);
        if (!target) {
            // Skip this step
            if (index < steps.length - 1) {
                showStep(index + 1);
            } else {
                endTour();
            }
            return;
        }

        // Scroll target into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Small delay to allow scroll
        setTimeout(() => positionPopup(step), 300);
    }

    /**
     * Go to next step
     */
    function nextStep() {
        const steps = getValidSteps();
        if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
        } else {
            endTour();
        }
    }

    /**
     * Go to previous step
     */
    function prevStep() {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    }

    /**
     * Start the tour
     */
    function startTour(onComplete) {
        if (isActive) return;

        isActive = true;
        onCompleteCallback = onComplete;
        currentStep = 0;

        createOverlay();
        createPopup();

        tourOverlay.classList.add('active');
        tourPopup.classList.add('active');

        showStep(0);

        // Handle window resize
        window.addEventListener('resize', handleResize);
    }

    /**
     * End the tour
     */
    function endTour() {
        if (!isActive) return;

        isActive = false;
        markComplete();

        if (tourOverlay) {
            tourOverlay.classList.remove('active');
            setTimeout(() => {
                tourOverlay.remove();
                tourOverlay = null;
            }, 300);
        }

        if (tourPopup) {
            tourPopup.classList.remove('active');
            setTimeout(() => {
                tourPopup.remove();
                tourPopup = null;
            }, 300);
        }

        window.removeEventListener('resize', handleResize);

        if (onCompleteCallback) {
            onCompleteCallback();
            onCompleteCallback = null;
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        if (isActive) {
            const steps = getValidSteps();
            positionPopup(steps[currentStep]);
        }
    }

    /**
     * Initialize onboarding
     */
    function initialize(autoStart = true) {
        // Add styles if not present
        if (!document.getElementById('onboarding-styles')) {
            const styles = document.createElement('style');
            styles.id = 'onboarding-styles';
            styles.textContent = `
                .onboarding-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 9998;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s, visibility 0.3s;
                }
                .onboarding-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }
                .onboarding-spotlight {
                    position: absolute;
                    background: transparent;
                    border-radius: 8px;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
                    transition: all 0.3s ease;
                }
                .onboarding-popup {
                    position: fixed;
                    z-index: 9999;
                    background: #1a1a1a;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    max-width: 340px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(10px);
                    transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
                }
                .onboarding-popup.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                .onboarding-popup-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .onboarding-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #fff;
                }
                .onboarding-close {
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                .onboarding-close:hover {
                    color: #fff;
                }
                .onboarding-content {
                    color: #aaa;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0 0 16px 0;
                }
                .onboarding-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .onboarding-progress {
                    color: #666;
                    font-size: 13px;
                }
                .onboarding-buttons {
                    display: flex;
                    gap: 8px;
                }
                .onboarding-buttons button {
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .onboarding-skip {
                    background: transparent;
                    border: 1px solid #444;
                    color: #888;
                }
                .onboarding-skip:hover {
                    background: #333;
                    color: #fff;
                }
                .onboarding-prev {
                    background: #333;
                    border: none;
                    color: #fff;
                }
                .onboarding-prev:hover {
                    background: #444;
                }
                .onboarding-next {
                    background: #007AFF;
                    border: none;
                    color: #fff;
                }
                .onboarding-next:hover {
                    background: #0066DD;
                }
            `;
            document.head.appendChild(styles);
        }

        if (autoStart && shouldShowTour()) {
            // Small delay to let the app initialize
            setTimeout(() => startTour(), 1000);
        }
    }

    return {
        initialize,
        startTour,
        endTour,
        resetTour,
        shouldShowTour,
        nextStep,
        prevStep
    };
})();

// Export for use in app.js
window.Onboarding = Onboarding;
