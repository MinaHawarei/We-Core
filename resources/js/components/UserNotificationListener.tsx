// resources/js/components/UserNotificationListener.tsx

import { useEffect } from 'react';
import { echo } from '@laravel/echo-react';


export default function UserNotificationListener() {
    useEffect(() => {
        const echoInstance = echo(); // 👈 نحصل على الـ Echo الحقيقي هنا

        if (!echoInstance) {
            console.error('Echo is not initialized');
            return;
        }

        const userId = window?.appUserId;

        if (!userId) {
            console.warn('User ID is missing');
            return;
        }

        const channel = echoInstance.private(`users.${userId}`);

        if (!channel) {
            console.error('Failed to subscribe to private channel');
            return;
        }

        channel.notification((notification: any) => {
            console.log('📣 New notification:', notification);
            alert('🔔 New notification: ' + notification.title);
        });

        return () => {
            echoInstance.leave(`private-users.${userId}`);
        };
    }, []);

    return null;
}
