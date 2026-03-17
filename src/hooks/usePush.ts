import { useState } from 'react';
import api from '../lib/axios';

const PUBLIC_VAPID_KEY = "BC2L0WrqEqiq5ICO9mo__0bSRqBq6UOJBnWlIs30CyYPSTG1sqHy6KhyxHAo66UbLw__vcchpk88lWNVt1WBAD0";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const usePush = () => {
    const [loading, setLoading] = useState(false);

    const subscribe = async () => {
        if (!('serviceWorker' in navigator)) {
            console.error('Service Worker not supported');
            return;
        }

        setLoading(true);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error('Notification permission denied');
            }

            const registration = await navigator.serviceWorker.ready;
            
            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();
            
            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
                });
            }

            // Send to backend
            await api.post('/push/subscribe', subscription);
            console.log('Push subscription sent to backend successfully');
            return true;
        } catch (error: any) {
            console.error('Push subscription failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const unsubscribe = async () => {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                await api.post('/push/unsubscribe', { endpoint: subscription.endpoint });
            }
            return true;
        } catch (error) {
            console.error('Push unsubscription failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        subscribe,
        unsubscribe,
        loading
    };
};
