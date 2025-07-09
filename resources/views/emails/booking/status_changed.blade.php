@component('mail::message')
# Hello {{ $user->name }}

@php
    // تحديد الألوان حسب الحالة
    $backgroundColor = match($status) {
        'accepted' => '#d4edda',  // أخضر فاتح
        'rejected' => '#f8d7da',  // أحمر فاتح
        'pending'  => '#fff3cd',  // أصفر فاتح
    };

    $textColor = match($status) {
        'accepted' => '#155724',  // أخضر غامق
        'rejected' => '#721c24',  // أحمر غامق
        'pending'  => '#856404',  // أصفر غامق
    };
@endphp

Your Reservation on **{{ $booking->date }}** at **{{ $booking->time }}** has been
<span style="background-color: {{ $backgroundColor }}; color: {{ $textColor }}; padding: 4px 8px; border-radius: 4px; display: inline-block;">
    <strong>{{ ucfirst($status) }}</strong>
</span>.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
