<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    /** @use HasFactory<\Database\Factories\UserProfileFactory> */
    use HasFactory;

     protected $primaryKey = 'user_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'dni',
        'last_name',
        'first_name',
        'ruc',
        'address',
        'movil',
        'phone',
        'url_web_site',
        'whatsapp',
        'title',
        'avatar',
        'about_me'
    ];

     public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
