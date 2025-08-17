import { getMessaging, isSupported } from "firebase/messaging";
import { firebaseApp } from "../firebase/index";

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