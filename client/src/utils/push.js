import pushService from '../services/pushService';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

export const isPushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window;

export const enablePush = async () => {
  if (!isPushSupported()) throw new Error('Push notifications are not supported in this browser');

  const { configured, publicKey } = await pushService.getStatus();
  if (!configured) throw new Error('Push notifications are not configured on this deployment yet');

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notification permission was not granted');

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  await pushService.subscribe(subscription.toJSON());
  return subscription;
};

export const disablePush = async () => {
  if (!isPushSupported()) return;
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription) {
    await pushService.unsubscribe(subscription.endpoint);
    await subscription.unsubscribe();
  }
};
