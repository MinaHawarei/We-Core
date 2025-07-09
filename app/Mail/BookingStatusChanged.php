<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $booking;
    public $status; // accepted / rejected

    public function __construct($user, $booking, $status)
    {
        $this->user = $user;
        $this->booking = $booking;
        $this->status = $status;
    }

    public function build()
    {
        return $this->markdown('emails.booking.status_changed')
            ->subject('Your Booking Has Been ' . ucfirst($this->status));
    }
}


