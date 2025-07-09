@component('mail::message')
# Hello {{ $user->name }},

Your Reservation request has been received and is currently pending approval from the administrator.

**Date:** {{ $data['date'] }}
**Time:** {{ $data['booking_time'] }} - {{ $data['booking_time_to'] }}
**Reason:** {{ $data['visit_reason'] }}

Thanks,<br>
{{ config('app.name') }}
@endcomponent
