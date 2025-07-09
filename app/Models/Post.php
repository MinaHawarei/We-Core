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
    protected static function booted()
    {
        static::created(function ($model) {
            self::logActivity($model, 'created', null, $model->toArray());
        });

        static::updated(function ($model) {
            $changes = $model->getChanges();

            if (!empty($changes)) {
                self::logActivity($model, 'updated', $model->getOriginal(), $changes);
            }
        });

        static::deleted(function ($model) {
            self::logActivity($model, 'deleted', $model->toArray(), null);
        });
    }

    protected static function logActivity($model, $action, $oldData, $newData)
    {
        ActivityLog::create([
            'user_id' => optional(auth()->user())->id,
            'model_type' => get_class($model),
            'model_id'   => $model->getKey(),
            'action'     => $action,
            'old_data'   => $oldData ? json_encode($oldData) : null,
            'new_data'   => $newData ? json_encode($newData) : null,
            'created_at' => now(),
        ]);
    }
}

