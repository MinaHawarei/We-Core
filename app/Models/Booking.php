<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
       'user_id',
        'date',
        'time',
        'time_to',
        'reason',
        'number_of_visitors',
        'notes',
    ];
    public function user()
    {
    return $this->belongsTo(User::class);
    }


}
