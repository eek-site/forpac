/**
 * FormanPacific Command Menu Loader - FIXED VERSION
 * Minimal script to enable Ctrl+M menu on any page
 * 
 * Usage: <script src="/assets/js/fp-menu-loader.js"></script>
 */

(function() {
    'use strict';

    let menuFrame = null;
    let menuOpen = false;

    // Configuration
    const MENU_URL = '/admin/command-menu.html';

    // Device detection - more reliable touch detection
    function isTouchOnlyDevice() {
        // Check multiple touch indicators
        const hasTouch = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
        
        // Check if it's likely a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                        (window.innerWidth <= 768 && hasTouch);
        
        console.log('Touch detection:', { hasTouch, isMobile, userAgent: navigator.userAgent });
        return hasTouch || isMobile;
    }

    // Create overlay and iframe
    function createMenuOverlay() {
        let overlay = document.getElementById('fp-menu-overlay');
        if (overlay) return overlay; // Return existing overlay

        // Create overlay
        overlay = document.createElement('div');
        overlay.id = 'fp-menu-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
            animation: fpFadeIn 0.2s ease;
        `;

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'fp-menu-iframe';
        iframe.src = MENU_URL;
        iframe.style.cssText = `
            width: 95%;
            max-width: 900px;
            height: 85vh;
            border: none;
            border-radius: 15px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.4);
            background: white;
            animation: fpSlideUp 0.3s ease;
        `;

        overlay.appendChild(iframe);
        document.body.appendChild(overlay);

        // Add CSS animations only once
        if (!document.getElementById('fp-menu-animations')) {
            const style = document.createElement('style');
            style.id = 'fp-menu-animations';
            style.textContent = `
                @keyframes fpFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fpSlideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        menuFrame = iframe;

        // Close on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hideMenu();
            }
        });

        return overlay;
    }

    // Create mobile floating action button - FIXED VERSION
    function createMobileButton() {
        // Remove existing button if any
        const existingButton = document.getElementById('fp-mobile-menu-btn');
        if (existingButton) {
            existingButton.remove();
        }
        
        console.log('Creating mobile button...');
        
        const button = document.createElement('button');
        button.id = 'fp-mobile-menu-btn';
        button.innerHTML = 'FP';
        button.type = 'button'; // Explicitly set button type
        
        // More robust styling
        button.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, #1e3c72, #2a5298) !important;
            color: white !important;
            border: none !important;
            font-weight: bold !important;
            font-size: 16px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
            z-index: 999998 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            touch-action: manipulation !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            -webkit-tap-highlight-color: transparent !important;
            outline: none !important;
        `;
        
        // Enhanced event handling
        let isPressed = false;
        
        // Mouse events
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isPressed = true;
            button.style.transform = 'scale(0.95)';
            console.log('Mouse down on button');
        });
        
        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            if (isPressed) {
                button.style.transform = 'scale(1)';
                console.log('Mouse up - triggering menu');
                showMenu();
            }
            isPressed = false;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            isPressed = false;
        });
        
        // Touch events - more reliable
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isPressed = true;
            button.style.transform = 'scale(0.95)';
            console.log('Touch start on button');
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isPressed) {
                button.style.transform = 'scale(1)';
                console.log('Touch end - triggering menu');
                // Small delay to ensure transform completes
                setTimeout(() => showMenu(), 50);
            }
            isPressed = false;
        }, { passive: false });
        
        button.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(1)';
            isPressed = false;
            console.log('Touch cancelled');
        });
        
        // Click event as fallback
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Click event on button');
            showMenu();
        });
        
        // Hover effects for non-touch devices
        if (!('ontouchstart' in window)) {
            button.addEventListener('mouseenter', () => {
                if (!isPressed) {
                    button.style.transform = 'scale(1.05)';
                }
            });
            button.addEventListener('mouseleave', () => {
                if (!isPressed) {
                    button.style.transform = 'scale(1)';
                }
            });
        }
        
        // Responsive positioning
        function adjustButtonPosition() {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            console.log('Adjusting button position for viewport:', viewportWidth, 'x', viewportHeight);
            
            // For very narrow screens
            if (viewportWidth < 350) {
                button.style.right = '12px';
                button.style.bottom = '12px';
                button.style.width = '48px';
                button.style.height = '48px';
                button.style.fontSize = '14px';
            } else if (viewportWidth < 500) {
                button.style.right = '16px';
                button.style.bottom = '16px';
                button.style.width = '52px';
                button.style.height = '52px';
            } else {
                button.style.right = '20px';
                button.style.bottom = '20px';
                button.style.width = '56px';
                button.style.height = '56px';
            }
            
            // For short screens
            if (viewportHeight < 600) {
                button.style.bottom = '12px';
            }
        }
        
        // Ensure button is added to DOM
        document.body.appendChild(button);
        console.log('Mobile button added to DOM');
        
        // Adjust position
        adjustButtonPosition();
        
        // Listen for viewport changes
        window.addEventListener('resize', adjustButtonPosition);
        window.addEventListener('orientationchange', () => {
            setTimeout(adjustButtonPosition, 200);
        });
        
        // Verify button is visible
        setTimeout(() => {
            const rect = button.getBoundingClientRect();
            console.log('Button position check:', {
                visible: rect.width > 0 && rect.height > 0,
                position: rect,
                computed: window.getComputedStyle(button).getPropertyValue('display')
            });
        }, 100);
    }

    function showMenu() {
        console.log('showMenu called, checking authentication...');
        
        // Check if user is authenticated first
        if (!isAuthenticated()) {
            console.log('Not authenticated, redirecting to login');
            // Not authenticated - redirect to login
            window.location.href = '/admin';
            return;
        }
        
        console.log('Authenticated, showing menu');
        // Authenticated - show menu
        const overlay = createMenuOverlay();
        overlay.style.display = 'flex';
        menuOpen = true;
        
        // Focus iframe for keyboard input
        setTimeout(() => {
            if (menuFrame) {
                menuFrame.focus();
            }
        }, 100);
    }
    
    function isAuthenticated() {
        // Check for active MSAL session
        if (typeof window.msal !== 'undefined' && window.msalInstance) {
            const account = window.msalInstance.getActiveAccount() || window.msalInstance.getAllAccounts()[0];
            if (account) {
                console.log('MSAL authentication found');
                return true;
            }
        }
        
        // Fallback: check for session storage indicators
        const hasSession = sessionStorage.getItem('msal.account.keys') || 
                          sessionStorage.getItem('msalAccount') ||
                          document.cookie.includes('msal');
        
        console.log('Authentication check:', {
            msal: typeof window.msal !== 'undefined',
            msalInstance: typeof window.msalInstance !== 'undefined',
            sessionKeys: !!sessionStorage.getItem('msal.account.keys'),
            sessionAccount: !!sessionStorage.getItem('msalAccount'),
            cookieCheck: document.cookie.includes('msal'),
            result: hasSession
        });
        
        return hasSession;
    }

    function hideMenu() {
        console.log('hideMenu called');
        const overlay = document.getElementById('fp-menu-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        menuOpen = false;
    }

    // Handle messages from iframe
    function handleMessage(event) {
        if (event.data && event.data.type === 'fp-command') {
            hideMenu();
            
            // Try to call page-specific handler
            if (window.fpHandleCommand && typeof window.fpHandleCommand === 'function') {
                window.fpHandleCommand(event.data.command);
            } else {
                // Default behavior
                console.log('Command received:', event.data.command);
                showNotification(`Command: ${event.data.command}`, 'info');
            }
        } else if (event.data && event.data.type === 'fp-close-menu') {
            hideMenu();
        }
    }

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        console.log('Showing notification:', message, type);
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000000;
            font-size: 0.9rem;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            animation: fpSlideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : type === 'warning' ? '#ed8936' : '#4299e1'};
        `;
        notification.textContent = message;

        // Add slide animation if not exists
        if (!document.getElementById('fp-notification-animations')) {
            const style = document.createElement('style');
            style.id = 'fp-notification-animations';
            style.textContent = `
                @keyframes fpSlideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fpSlideInRight 0.3s ease reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    // Keyboard handling
    function handleKeydown(e) {
        // Open menu with Ctrl+M
        if (e.ctrlKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            if (!menuOpen) {
                showMenu();
            }
            return;
        }

        // Close menu with Escape
        if (e.key === 'Escape' && menuOpen) {
            hideMenu();
            return;
        }
    }

    // Initialize
    function initialize() {
        console.log('Initializing FP Menu...');
        
        document.addEventListener('keydown', handleKeydown);
        window.addEventListener('message', handleMessage);
        
        const isTouchDevice = isTouchOnlyDevice();
        console.log('Is touch device:', isTouchDevice);
        
        // Always create mobile button for testing, or based on device detection
        if (isTouchDevice) {
            console.log('Creating mobile button for touch device');
            createMobileButton();
            
            // Show mobile-specific notification
            setTimeout(() => {
                showNotification('Tap the FP button for quick commands', 'info');
            }, 2000);
        } else {
            console.log('Desktop device detected');
            // Optionally still create button for testing
            // createMobileButton(); // Uncomment to always show button
            
            // Show desktop notification
            setTimeout(() => {
                showNotification('Press Ctrl+M for quick command access', 'info');
            }, 2000);
        }
    }

    // Expose public API
    window.FPMenu = {
        show: showMenu,
        hide: hideMenu,
        showNotification: showNotification,
        createMobileButton: createMobileButton, // For manual testing
        isTouchDevice: isTouchOnlyDevice
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
