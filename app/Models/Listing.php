<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Listing extends Model
{
    /** @use HasFactory<\Database\Factories\ListingFactory> */
    use HasFactory;

        protected $fillable = [
        'user_id',
        'parent_id',
        'title',
        'description',
        'price',
        'currency',
        'offer_type_id',
        'property_type_id',
        'address',
        'city',
        'country',
        'latitude',
        'longitude',
        'land_area',
        'built-area',
        'bedrooms',
        'bathrooms',
        'floors',
        'parking_spaces',
        'attributes',
        'status',


    ];

    protected $casts = [
        'attributes' => 'array',
    ];

    // Relationships (same).
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Listing::class, 'parent_id');
    }

    public function subprojects(): HasMany
    {
        return $this->hasMany(Listing::class, 'parent_id');
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function offerType(): BelongsTo
    {
        return $this->belongsTo(OfferType::class);
    }

    public function propertyType(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class);
    }

    // Updated scopes.
    public function scopeByOfferType($query, $offerTypeId)
    {
        return $query->where('offer_type_id', $offerTypeId);
    }

    public function scopeByPropertyType($query, $propertyTypeId)
    {
        return $query->where('property_type_id', $propertyTypeId);
    }

    // New scopes for details, e.g., filter by bedrooms.
    public function scopeByMinBedrooms($query, $min)
    {
        return $query->where('bedrooms', '>=', $min);
    }

    // Similar for bathrooms, area, etc.
}
