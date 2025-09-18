/**
 * FormanPacific Command Menu Loader
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

    // Device detection - simplified to show on all touch devices
    function isTouchOnlyDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
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

    // Create mobile floating action button
    function createMobileButton() {
        if (document.getElementById('fp-mobile-menu-btn')) return;
        
        const button = document.createElement('button');
        button.id = 'fp-mobile-menu-btn';
        button.innerHTML = 'FP';
        button.style.cssText = `
            position: fixed;
            bottom: 16px;
            right: 16px;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: white;
            border: none;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 999998;
            cursor: pointer;
            transition: transform 0.2s ease;
            touch-action: manipulation;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Add hover effect for devices that support it
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', showMenu);
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(1)';
        });
        
        // Ensure button stays on screen by adjusting for viewport
        function adjustButtonPosition() {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // For very narrow screens (like fold phones), move button more inward
            if (viewportWidth < 350) {
                button.style.right = '12px';
                button.style.bottom = '12px';
                button.style.width = '48px';
                button.style.height = '48px';
                button.style.fontSize = '14px';
            } else if (viewportWidth < 500) {
                button.style.right = '14px';
                button.style.bottom = '14px';
            }
            
            // For short screens, move button up a bit
            if (viewportHeight < 600) {
                button.style.bottom = '12px';
            }
        }
        
        // Adjust position on load and resize
        adjustButtonPosition();
        window.addEventListener('resize', adjustButtonPosition);
        window.addEventListener('orientationchange', () => {
            setTimeout(adjustButtonPosition, 100);
        });
        
        document.body.appendChild(button);
    }

    function showMenu() {
        // Check if user is authenticated first
        if (!isAuthenticated()) {
            // Not authenticated - redirect to login
            window.location.href = '/admin';
            return;
        }
        
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
        if (window.msal && msalInstance) {
            const account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];
            return !!account;
        }
        
        // Fallback: check for session storage indicators
        return sessionStorage.getItem('msal.account.keys') || 
               sessionStorage.getItem('msalAccount') ||
               document.cookie.includes('msal');
    }

    function hideMenu() {
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
                // Default behavior - you can customize this
                console.log('Command received:', event.data.command);
                showNotification(`Command: ${event.data.command}`, 'info');
            }
        } else if (event.data && event.data.type === 'fp-close-menu') {
            hideMenu();
        }
    }

    // Simple notification system
    function showNotification(message, type = 'info') {
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
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : type === 'warning' ? '#ed8936' : '#4299e1'};
        `;
        notification.textContent = message;

        // Add slide animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fpSlideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
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

        // Close menu with Escape (if focus is on parent page)
        if (e.key === 'Escape' && menuOpen) {
            hideMenu();
            return;
        }
    }

    // Initialize
    function initialize() {
        document.addEventListener('keydown', handleKeydown);
        window.addEventListener('message', handleMessage);
        
        // Create mobile button only for touch-only devices (no keyboard/mouse)
        if (isTouchOnlyDevice()) {
            createMobileButton();
            
            // Show mobile-specific notification
            setTimeout(() => {
                showNotification('Tap the menu button for quick commands', 'info');
            }, 2000);
        } else {
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
        showNotification: showNotification
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
