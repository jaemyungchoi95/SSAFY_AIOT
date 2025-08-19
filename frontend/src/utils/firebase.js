import {
  getMessaging,
  isSupported,
  getToken as fcmGetToken,
  onMessage as fcmOnMessage,
} from 'firebase/messaging';
import { firebaseApp } from '../firebase/index';

export const messaging = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// 토큰 발급 (VAPID key 필수)
export const getToken = async (messagingInstance) => {
  if (!messagingInstance) return null;
  try {
    return await fcmGetToken(messagingInstance, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // 환경변수
    });
  } catch (err) {
    console.error('FCM getToken error:', err);
    return null;
  }
};

// 메시지 수신
export const onMessage = (messagingInstance, callback) => {
  if (!messagingInstance) return;
  try {
    fcmOnMessage(messagingInstance, callback);
  } catch (err) {
    console.error('FCM onMessage error:', err);
  }
};
