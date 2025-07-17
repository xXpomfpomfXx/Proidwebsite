// PWA Registration Script
class PWARegistration {
    constructor() {
        this.swRegistration = null;
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                await this.registerServiceWorker();
                this.setupUpdateListener();
                this.requestNotificationPermission();
            } catch (error) {
                console.error('PWA registration failed:', error);
            }
        } else {
            console.log('Service Worker not supported');
        }
    }

    async registerServiceWorker() {
        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered successfully:', this.swRegistration);

            // Check for updates
            this.swRegistration.addEventListener('updatefound', () => {
                const newWorker = this.swRegistration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateNotification();
                    }
                });
            });

        } catch (error) {
            console.error('Service Worker registration failed:', error);
            throw error;
        }
    }

    setupUpdateListener() {
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', event => {
            console.log('Message from Service Worker:', event.data);
            
            if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                this.showUpdateNotification();
            }
        });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('New service worker activated');
            window.location.reload();
        });
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-icon">🔄</div>
                <div class="update-text">
                    <h4>New Update Available</h4>
                    <p>A new version of Urban Quest is available. Refresh to update!</p>
                </div>
                <button class="update-btn" onclick="window.location.reload()">Update Now</button>
                <button class="update-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        }
    }

    async installPWA() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            console.log('PWA install outcome:', outcome);
            window.deferredPrompt = null;
        }
    }

    showInstallPrompt() {
        const installButton = document.createElement('button');
        installButton.className = 'pwa-install-btn';
        installButton.innerHTML = `
            <span class="install-icon">📱</span>
            <span class="install-text">Install Urban Quest</span>
        `;
        installButton.addEventListener('click', () => this.installPWA());

        // Add to page
        const container = document.querySelector('.hero-buttons');
        if (container) {
            container.appendChild(installButton);
        }
    }

    checkInstallability() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.deferredPrompt = e;
            this.showInstallPrompt();
        });
    }

    // Offline/Online status
    setupConnectivityListener() {
        window.addEventListener('online', () => {
            this.showStatusNotification('You are back online! 🌐', 'success');
        });

        window.addEventListener('offline', () => {
            this.showStatusNotification('You are offline. Some features may be limited. 📱', 'info');
        });
    }

    showStatusNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `status-notification status-${type}`;
        notification.innerHTML = `
            <div class="status-content">
                <span class="status-message">${message}</span>
                <button class="status-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Background sync
    async registerBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            try {
                await this.swRegistration.sync.register('background-sync');
                console.log('Background sync registered');
            } catch (error) {
                console.error('Background sync registration failed:', error);
            }
        }
    }

    // Push notifications
    async subscribeToPushNotifications() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const subscription = await this.swRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                });

                console.log('Push notification subscription:', subscription);
                return subscription;
            } catch (error) {
                console.error('Push notification subscription failed:', error);
            }
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwaRegistration = new PWARegistration();
});

// Add PWA-specific styles
const pwaStyles = `
    .pwa-update-notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--white);
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        padding: 1rem;
        z-index: 3000;
        max-width: 350px;
        border-left: 4px solid var(--primary-color);
    }

    .update-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .update-icon {
        font-size: 1.5rem;
    }

    .update-text h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        color: var(--text-dark);
    }

    .update-text p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-light);
    }

    .update-btn {
        background: var(--primary-color);
        color: var(--white);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: var(--transition);
    }

    .update-btn:hover {
        background: var(--secondary-color);
    }

    .update-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-light);
        padding: 0.2rem;
        border-radius: 50%;
        transition: var(--transition);
    }

    .update-close:hover {
        color: var(--text-dark);
        background: rgba(0, 0, 0, 0.1);
    }

    .pwa-install-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--accent-color);
        color: var(--white);
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: var(--transition);
        margin-top: 1rem;
    }

    .pwa-install-btn:hover {
        background: var(--secondary-color);
        transform: translateY(-2px);
    }

    .install-icon {
        font-size: 1.2rem;
    }

    .status-notification {
        position: fixed;
        top: 2rem;
        left: 2rem;
        background: var(--white);
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        padding: 1rem 1.5rem;
        z-index: 3000;
        max-width: 350px;
        transform: translateX(-400px);
        transition: transform 0.3s ease;
    }

    .status-notification.show {
        transform: translateX(0);
    }

    .status-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .status-message {
        flex: 1;
        margin-right: 1rem;
        font-weight: 500;
    }

    .status-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-light);
        transition: var(--transition);
    }

    .status-close:hover {
        color: var(--text-dark);
    }

    .status-success {
        border-left: 4px solid #28a745;
    }

    .status-info {
        border-left: 4px solid #17a2b8;
    }

    .status-warning {
        border-left: 4px solid #ffc107;
    }

    .status-error {
        border-left: 4px solid #dc3545;
    }

    @media (max-width: 768px) {
        .pwa-update-notification,
        .status-notification {
            left: 1rem;
            right: 1rem;
            max-width: none;
        }
    }
`;

// Inject PWA styles
const styleSheet = document.createElement('style');
styleSheet.textContent = pwaStyles;
document.head.appendChild(styleSheet); 