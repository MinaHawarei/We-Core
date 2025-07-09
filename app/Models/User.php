<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\ActivityLog;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
       'name',
        'email',
        'password',
        'is_active',
        'department',
        'site',
        'manager_id',
        'out_id',
        'role',
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
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


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
