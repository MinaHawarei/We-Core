<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'content',
        'post_type',
        'audience_type',
        'audience_value',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

