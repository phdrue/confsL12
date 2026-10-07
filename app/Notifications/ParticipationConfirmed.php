<?php

namespace App\Notifications;

use App\Models\Conference;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ParticipationConfirmed extends Notification
{
    use Queueable;

    public function __construct(public Conference $conference) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array{title: string, body: string, conference_id: int}
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Подтверждение регистрации на конференцию',
            'body' => "Вы успешно зарегистрировались в качестве участника (слушателя) конференции «{$this->conference->name}». В случае явки на конференцию / онлайн-подключения к секции, Вы получите именной сертификат участника.",
            'conference_id' => $this->conference->id,
        ];
    }
}
