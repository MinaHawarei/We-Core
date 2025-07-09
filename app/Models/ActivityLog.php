<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'model_type', 'model_id', 'action', 'old_data', 'new_data', 'created_at'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
