<?php

namespace App\Http\Controllers;

use App\Models\OfferType;
use Illuminate\Http\Request;

class PropertyTypeController extends Controller
{
    public function index(Request $request)
    {
        $query = PropertyType::query(['id', 'name', 'category']);

        if ($offerTypeId = $request->query('offer_type_id')) {
            $offerType = OfferType::find($offerTypeId);
            if ($offerType) {
                if ($offerType->name === 'project') {
                    $query->where('category', 'project');
                } elseif ($offerType->name === 'temporary_accommodation') {
                    $query->whereIn('name', ['shared_bathroom_room', 'private_room', 'student_room']);
                } else {
                    $query->where('category', 'property');
                }
            }
        }

        return $query->get();
    }
}
