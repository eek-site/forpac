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

    // Create overlay and iframe
    function createMenuOverlay() {
        if (document.getElementById('fp-menu-overlay')) return;

        // Create overlay
        const overlay = document.createElement('div');
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

        // Add CSS animations
        const style = document.createElement('style');
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

        menuFrame = iframe;

        // Close on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hideMenu();
            }
        });

        return overlay;
    }

    function showMenu() {
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
        
        // Show welcome notification
        setTimeout(() => {
            showNotification('Press Ctrl+M for quick command access', 'info');
        }, 2000);
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
