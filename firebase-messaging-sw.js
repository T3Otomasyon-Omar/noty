// Import and configure the Firebase SDK
// Use these scripts if you serve or deploy your project using Firebase Hosting.
// For other hosting, refer to https://firebase.google.com/docs/web/setup.
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker using your Firebase config
firebase.initializeApp({
  apiKey: "AIzaSyBBFtxoPU6_Wa92wL-1YGFvGe5rqk_oxYo",
  authDomain: "notification-3c0be.firebaseapp.com",
  projectId: "notification-3c0be",
  storageBucket: "notification-3c0be.firebasestorage.app",
  messagingSenderId: "492100026014",
  appId: "1:492100026014:web:88b0624ec055d10d17c58f",
  measurementId: "G-GZ1LGYWB85"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

/**
 * Handle background messages
 * This will trigger when the app is in the background or closed and a message is received.
 */
messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Background message received:', payload);

    // Extract notification details from payload
    const notificationTitle = payload.notification?.title || 'Default Title';
    const notificationOptions = {
        body: payload.notification?.body || 'Default body text',
        icon: payload.notification?.icon || './firebase-icon.png', // Fallback icon
        click_action: payload.notification?.click_action || '/', // Fallback action
    };

    // Show the notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * Optional: Add a push event listener for more advanced use cases
 * This provides full control over notifications when a push event occurs.
 */
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push event received:', event);

    if (event.data) {
        const data = event.data.json();

        const notificationTitle = data.notification?.title || 'Fallback Title';
        const notificationOptions = {
            body: data.notification?.body || 'Fallback body text',
            icon: data.notification?.icon || './firebase-icon.png',
            data: data, // Store additional data for click actions
        };

        event.waitUntil(
            self.registration.showNotification(notificationTitle, notificationOptions)
        );
    }
});

/**
 * Handle notification click events
 * This is triggered when a user clicks on a notification.
 */
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click received:', event.notification);

    event.notification.close(); // Close the notification

    // Handle click action from the notification data
    const clickAction = event.notification.data?.click_action || '/';

    event.waitUntil(
        clients.openWindow(clickAction) // Open the specified URL
    );
});
