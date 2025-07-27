<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class voc extends Model
{
    protected $fillable = [
        'cst_number',
        'sr_name',
        'sr_id',
        'type',
        'bras',
        'area',
    ];
}
