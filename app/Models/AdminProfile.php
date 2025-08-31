<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class AdminProfile extends Model
{
    /** @use HasFactory<\Database\Factories\AdminProfileFactory> */
    use HasFactory;

     protected $primaryKey = 'admin_id';
    public $timestamps = false;

    protected $fillable = [
        'admin_id',
        'dni',
        'last_name',
        'first_name',
        'ruc',
        'address',
        'phone',
        'whatsapp',
        'avatar',
        'title',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }
}
