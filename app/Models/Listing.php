<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    /** @use HasFactory<\Database\Factories\ListingFactory> */
    use HasFactory;

    protected $casts = [
        'attributes' => 'array',
    ];

    // Relationships (same).
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(Listing::class, 'parent_id');
    }

    public function subprojects()
    {
        return $this->hasMany(Listing::class, 'parent_id');
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function offerType()
    {
        return $this->belongsTo(OfferType::class);
    }

    public function propertyType()
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
