import { router } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export type InboxNotification = {
    id: string;
    title: string;
    body: string;
    conference_id: number | null;
    read_at: string | null;
    created_at: string | null;
};

export type NotificationInbox = {
    unread_count: number;
    notifications: InboxNotification[];
};

const emptyInbox: NotificationInbox = {
    unread_count: 0,
    notifications: [],
};

const pollIntervalMs = 30_000;

async function requestInbox(
    url: string,
    method: 'GET' | 'POST' = 'GET',
): Promise<NotificationInbox> {
    const response = await axios.request<NotificationInbox>({
        url,
        method,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    return response.data;
}

export function useNotificationInbox() {
    const [inbox, setInbox] = useState<NotificationInbox>(emptyInbox);

    const refresh = useCallback(async (): Promise<void> => {
        try {
            setInbox(await requestInbox(route('notifications.index')));
        } catch {
            // Keep the last known inbox if a poll fails.
        }
    }, []);

    useEffect(() => {
        void refresh();

        const interval = window.setInterval(() => {
            if (!document.hidden) {
                void refresh();
            }
        }, pollIntervalMs);

        const onVisibility = (): void => {
            if (!document.hidden) {
                void refresh();
            }
        };

        const removeNavigateListener = router.on('navigate', () => {
            void refresh();
        });

        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            window.clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisibility);
            removeNavigateListener();
        };
    }, [refresh]);

    const open = useCallback(
        async (notification: InboxNotification): Promise<void> => {
            if (!notification.read_at) {
                try {
                    setInbox(
                        await requestInbox(
                            route('notifications.read', notification.id),
                            'POST',
                        ),
                    );
                } catch {
                    // Visit the target even if marking as read fails.
                }
            }

            if (notification.conference_id) {
                router.visit(route('conferences.show', notification.conference_id));
            }
        },
        [],
    );

    const markAllRead = useCallback(async (): Promise<void> => {
        try {
            setInbox(await requestInbox(route('notifications.read-all'), 'POST'));
        } catch {
            // Keep the last known inbox if the request fails.
        }
    }, []);

    return {
        notifications: inbox.notifications,
        unreadCount: inbox.unread_count,
        open,
        markAllRead,
        refresh,
    };
}
