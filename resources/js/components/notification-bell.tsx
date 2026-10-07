import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotificationInbox } from '@/hooks/use-notification-inbox';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';

function formatRelativeTime(value: string | null): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
    const abs = Math.abs(diffSeconds);
    const rtf = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' });

    if (abs < 45) {
        return rtf.format(0, 'second');
    }

    if (abs < 3600) {
        return rtf.format(Math.round(diffSeconds / 60), 'minute');
    }

    if (abs < 86400) {
        return rtf.format(Math.round(diffSeconds / 3600), 'hour');
    }

    if (abs < 86400 * 7) {
        return rtf.format(Math.round(diffSeconds / 86400), 'day');
    }

    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
    });
}

function formatAbsoluteTime(value: string | null): string {
    if (!value) {
        return '';
    }

    return new Date(value).toLocaleString('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
}

function keepMenuOpen(event: { preventDefault: () => void }): void {
    event.preventDefault();
}

export function NotificationBell() {
    const { notifications, unreadCount, open, markAllRead, refresh } = useNotificationInbox();

    return (
        <DropdownMenu
            onOpenChange={(isOpen) => {
                if (isOpen) {
                    void refresh();
                }
            }}
        >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Уведомления">
                    <Bell />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center px-1 py-0 leading-none tabular-nums">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[min(24rem,calc(100vw-1.5rem))] p-0">
                <div className="flex items-center gap-2 px-3 py-2.5">
                    <Bell className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Уведомления</span>
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="font-normal">
                            {unreadCount} непрочит.
                        </Badge>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-auto px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                        disabled={unreadCount === 0}
                        onPointerDown={keepMenuOpen}
                        onClick={() => void markAllRead()}
                    >
                        Прочитать все
                    </Button>
                </div>
                <div className="max-h-96 divide-y overflow-y-auto">
                    {notifications.length === 0 ? (
                        <p className="px-3 py-8 text-center text-sm text-muted-foreground">Нет уведомлений</p>
                    ) : (
                        notifications.map((notification) => {
                            const isUnread = !notification.read_at;

                            return (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        'cursor-pointer items-start gap-2.5 rounded-none px-3 py-2.5 whitespace-normal',
                                        !isUnread && 'opacity-60',
                                    )}
                                    onSelect={() => void open(notification)}
                                >
                                    <span
                                        className={cn(
                                            'mt-1.5 size-1.5 shrink-0 rounded-full',
                                            isUnread ? 'bg-blue-500' : 'bg-transparent',
                                        )}
                                        aria-hidden
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <span
                                                className={cn(
                                                    'text-sm leading-5',
                                                    isUnread
                                                        ? 'font-semibold text-foreground'
                                                        : 'font-medium text-muted-foreground',
                                                )}
                                            >
                                                {notification.title}
                                            </span>
                                            {notification.created_at && (
                                                <time
                                                    className="shrink-0 text-xs leading-5 text-muted-foreground"
                                                    dateTime={notification.created_at}
                                                    title={formatAbsoluteTime(notification.created_at)}
                                                >
                                                    {formatRelativeTime(notification.created_at)}
                                                </time>
                                            )}
                                        </div>
                                        {notification.body && (
                                            <p className="mt-0.5 text-xs leading-4 text-muted-foreground">
                                                {notification.body}
                                            </p>
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            );
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
