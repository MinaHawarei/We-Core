<?php

namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TestNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['broadcast']; // نخليها تبث فقط
    }

    public function toArray($notifiable)
    {
        return [
            'title' => ' Test Notification!',
            'body' => 'This is a broadcast from Laravel Reverb.',
        ];
    }
}
