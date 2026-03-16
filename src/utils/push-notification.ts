const VAPID_PUBLIC_KEY = "BC2L0WrqEqiq5ICO9mo__0bSRqBq6UOJBnWlIs30CyYPSTG1sqHy6KhyxHAo66UbLw__vcchpk88lWNVt1WBAD0";

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

export async function subscribeToPush(axiosInstance: any) {
    try {
        const registration = await navigator.serviceWorker.ready;
        
        // Check if subscription already exists
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
        }

        // Send subscription to backend
        await axiosInstance.post('/push/subscribe', subscription);
        return true;
    } catch (error) {
        console.error('Push subscription failed:', error);
        return false;
    }
}

export async function unsubscribeFromPush(axiosInstance: any) {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
            await subscription.unsubscribe();
            // Optional: Tell backend to remove it too
            await axiosInstance.post('/push/unsubscribe', { endpoint: subscription.endpoint });
        }
        return true;
    } catch (error) {
        console.error('Push unsubscription failed:', error);
        return false;
    }
}

export async function checkPushPermission() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
}

export async function requestPushPermission() {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
}
