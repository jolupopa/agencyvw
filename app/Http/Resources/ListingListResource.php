<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingListResource extends JsonResource
{
     public static $wrap = false;


    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         $defaultImagePath = '/images/default-listing.jpg'; // definir la imagen por defecto
        return [
            'id' => $this->id,
            'title' => $this->title,
            'decription' => $this->description,
            'price' => $this->price,
            'currency' => $this->currency,
            'city' => $this->city,
            'first_image' => [
                'path' => $this->firstImage?->path ?? $defaultImagePath,
            ],
            'offer_type' => $this->whenLoaded('offerType', [
                'id' => $this->offerType->id,
                'name' => $this->offerType->name,
            ]),
            'property_type' => $this->whenLoaded('propertyType', [
                'id' => $this->propertyType->id,
                'name' => $this->propertyType->name,
                'category' => $this->propertyType->category,
            ]),
            'user' => $this->whenLoaded('user', $this->user->name),
        ];
    }
}
