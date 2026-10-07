<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json($this->inbox($request->user()));
    }

    public function read(Request $request, DatabaseNotification $notification): JsonResponse
    {
        $this->authorizeNotification($request->user(), $notification);
        $notification->markAsRead();

        return response()->json($this->inbox($request->user()));
    }

    public function readAll(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json($this->inbox($request->user()));
    }

    private function authorizeNotification(User $user, DatabaseNotification $notification): void
    {
        abort_unless(
            (int) $notification->notifiable_id === (int) $user->id
                && $notification->notifiable_type === $user->getMorphClass(),
            403,
        );
    }

    /**
     * @return array{unread_count: int, notifications: list<array<string, mixed>>}
     */
    private function inbox(User $user): array
    {
        return [
            'unread_count' => $user->unreadNotifications()->count(),
            'notifications' => $user->notifications()
                ->limit(20)
                ->get()
                ->map(fn (DatabaseNotification $notification): array => [
                    'id' => $notification->id,
                    'title' => $notification->data['title'] ?? '',
                    'body' => $notification->data['body'] ?? '',
                    'conference_id' => $notification->data['conference_id'] ?? null,
                    'read_at' => $notification->read_at?->toISOString(),
                    'created_at' => $notification->created_at?->toISOString(),
                ])
                ->values()
                ->all(),
        ];
    }
}
