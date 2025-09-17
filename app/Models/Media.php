<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Media extends Model
{
    protected $fillable = ['mediable_id', 'mediable_type', 'path', 'type', 'order'];

     // relacion polimorfica 1 a muchos
    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }

}
