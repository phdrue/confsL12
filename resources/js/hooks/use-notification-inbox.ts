import { router } from '@inertiajs/react';
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

function xsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

async function requestInbox(
    url: string,
    method: 'GET' | 'POST' = 'GET',
): Promise<NotificationInbox> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (method !== 'GET') {
        headers['Content-Type'] = 'application/json';
        headers['X-XSRF-TOKEN'] = xsrfToken();
    }

    const response = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to load notifications (${response.status})`);
    }

    return (await response.json()) as NotificationInbox;
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
