/* global clients */

importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js',
);

// import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBA9AaXct048KqNs0QlGbIUBEq88dJUFN8",
  authDomain: "areuhot-5d4dd.firebaseapp.com",
  projectId: "areuhot-5d4dd",
  storageBucket: "areuhot-5d4dd.firebasestorage.app",
  messagingSenderId: "498943643581",
  appId: "1:498943643581:web:a0e91ed803bafc24c28cd4",
  measurementId: "G-1713HHSPN3"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // const redirectUri = event?.notification?.data?.redirectUri;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then(function (clientList) {
        for (const client of clientList) {
          if (client.url === '/' && "focus" in client) {
            return client.focus();
          }
        } 
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});