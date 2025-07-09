<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingSubmitted extends Mailable
{
    public $user;
    public $data;

    public function __construct($user, $data)
    {
        $this->user = $user;
        $this->data = $data;
    }

    public function build()
    {
        return $this->markdown('emails.booking.submitted')
            ->subject('Technical Lab Reservation has been Submitted')
            ->with([
                'user' => $this->user,
                'data' => $this->data,
            ]);
    }
}

