<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = ['mediable_id', 'mediable_type', 'path', 'type', 'order'];

}
