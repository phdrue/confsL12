<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    protected $casts = [
        'payload' => 'array'
    ];
}
