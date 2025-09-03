<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PropertyType extends Model
{
    protected $fillable = ['name', 'category'];
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }
}
