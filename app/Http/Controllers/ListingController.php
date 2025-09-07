<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Listing;
use App\Models\OfferType;
use App\Models\PropertyType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ListingController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $listings = Listing::query()
        ->with(['offerType', 'propertyType'])
        ->where('status', 'active')
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('listings/index', [
            'listings' => $listings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('listings/create-update', [
            'offerTypes' => OfferType::all(['id', 'name']),
            'propertyTypes' => PropertyType::all(['id', 'name', 'category']),
            'projects' => Listing::whereHas('offerType', fn($q) => $q->where('name', 'project'))->get(['id', 'title']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'nullable|numeric|min:0',
        'currency' => 'required|string|in:USD,PEN', // Adjust currencies as needed
        'offer_type_id' => 'required|exists:offer_types,id',
        'property_type_id' => 'required|exists:property_types,id',
        'city' => 'nullable|string|max:255',
        'address' => 'nullable|string|max:255',
        'latitude' => 'nullable|numeric|between:-90,90',
        'longitude' => 'nullable|numeric|between:-180,180',
        'land_area' => 'nullable|numeric|min:0',
        'built_area' => 'nullable|numeric|min:0',
        'bedrooms' => 'nullable|integer|min:0',
        'bathrooms' => 'nullable|integer|min:0',
        'floors' => 'nullable|integer|min:0',
        'parking_spaces' => 'nullable|integer|min:0',
        'attributes' => 'nullable|json',
        'parent_id' => 'nullable|exists:listings,id',
        'subprojects' => 'nullable|array',
        'subprojects.*.title' => 'required|string|max:255',
        'subprojects.*.description' => 'nullable|string',
        'subprojects.*.price' => 'nullable|numeric|min:0',
        'subprojects.*.property_type_id' => 'required|exists:property_types,id',
        'subprojects.*.built_area' => 'nullable|numeric|min:0',
        'subprojects.*.land_area' => 'nullable|numeric|min:0',
        'subprojects.*.bedrooms' => 'nullable|integer|min:0',
        'subprojects.*.bathrooms' => 'nullable|integer|min:0',
        'subprojects.*.floors' => 'nullable|integer|min:0',
        'subprojects.*.parking_spaces' => 'nullable|integer|min:0',
        'subprojects.*.attributes' => 'nullable|json',
    ]);

       $listing = Listing::create($validated);
        if ($request->has('subprojects')) {
            foreach ($validated['subprojects'] as $subprojectData) {
                $subprojectData['user_id'] = $request->user()->id;
                $subprojectData['offer_type_id'] = OfferType::where('name', 'project')->first()->id;
                $subprojectData['parent_id'] = $listing->id;
                $subprojectData['currency'] = $listing->currency;
                $subprojectData['city'] = $listing->city;
                $subprojectData['address'] = $listing->address;
                $subprojectData['latitude'] = $listing->latitude;
                $subprojectData['longitude'] = $listing->longitude;
                Listing::create($subprojectData);
            }
        }

        return Inertia::render('listings/create-update', ['listing' => $listing]);

        return redirect()->route('listings.index')->with('success', 'Listing created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing)
    {
        // if (!is_numeric($listing)) {
        //     abort(404, 'ID inválido');
        // }

        // $listing = Listing::with([
        //     'offerType' => fn($q) => $q->select(['id', 'name']),
        //     'propertyType' => fn($q) => $q->select(['id', 'name', 'category']),
        //     'media' => fn($q) => $q->where('type', 'image')->orderBy('order')->first()
        // ])
        // ->where('status', 'active')
        // ->findOrFail($listing);

        // return Inertia::render('listings/show', [
        //     'listing' => $listing,
        // ]);


        $listing->load([
        'offerType',
        'propertyType',
        'media' => fn($query) => $query->orderBy('order'),
        'subprojects' => fn($query) => $query->with(['offerType', 'propertyType']),
        'parent' => fn($query) => $query->with(['offerType', 'propertyType']),
        ]);

        return Inertia::render('listings/show', [
            'listing' => $listing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Listing $listing)
    {
        $listing->load(['offerType', 'propertyType']);
        return Inertia::render('listings/create-update', [
            'listing' => $listing,
            'offerTypes' => OfferType::all(['id', 'name']),
            'propertyTypes' => PropertyType::all(['id', 'name', 'category']),
            'projects' => Listing::whereHas('offerType', fn($q) => $q->where('name', 'project'))->get(['id', 'title']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Listing $listing)
    {
        $validated = $request->validate([
        // Same validation as store
        ]);

        // Same validation logic as store
        $offerType = OfferType::find($validated['offer_type_id']);
        $propertyType = PropertyType::find($validated['property_type_id']);
        $roomTypes = ['shared_bathroom_room', 'private_room', 'student_room'];

        if ($offerType->name === 'project' && $propertyType->category !== 'project') {
            throw new \Exception('Property type must be for projects.');
        } elseif (in_array($offerType->name, ['sale', 'rent']) && $propertyType->category !== 'property') {
            throw new \Exception('Property type must be for sale/rent.');
        } elseif ($offerType->name === 'temporary_accommodation' && !in_array($propertyType->name, $roomTypes)) {
            throw new \Exception('Property type must be a room type for temporary accommodation.');
        }

        if ($offerType->name !== 'project') {
            $validated['parent_id'] = null;
        }

        if (in_array($propertyType->name, ['urban_land', 'agricultural_land'])) {
            if (empty($validated['land_area'])) {
                throw new \Exception('Land area is required for terrain types.');
            }
            $validated['built_area'] = null;
            $validated['bedrooms'] = null;
            $validated['bathrooms'] = null;
            $validated['floors'] = null;
            $validated['parking_spaces'] = null;
        } elseif ($offerType->name !== 'temporary_accommodation' && $propertyType->category === 'property') {
            if (empty($validated['built_area'])) {
                throw new \Exception('Built area is required for non-terrain properties.');
            }
        }

        $listing->update($validated);

        return redirect()->route('listings.index')->with('success', 'Listing updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listing $listing)
    {
        //
    }

    public function search(Request $request)
    {
        $query = Listing::query()
            ->with([
                'offerType' => fn($q) => $q->select(['id', 'name']),
                'propertyType' => fn($q) => $q->select(['id', 'name', 'category']),
                'media' => fn($q) => $q->where('type', 'image')->orderBy('order')->first()
            ])->where('status', 'active');


        if ($offerTypeId = $request->query('offer_type_id')) {
            $query->where('offer_type_id', $offerTypeId);
        }

        if ($propertyTypeId = $request->query('property_type_id')) {
            $query->where('property_type_id', $propertyTypeId);
        }

        if ($keyword = $request->query('keyword')) {
            $query->where('city', 'LIKE', "%{$keyword}%");
        }

        $listings = $query->paginate(10)->withQueryString();

        // Depura los datos
        \Log::debug('Listings IDs:', $listings->pluck('id')->toArray());

        return Inertia::render('listings/search', [
            'listings' => $listings,
            'filters' => $request->only(['offer_type_id', 'property_type_id', 'keyword']),
            'offerTypes' => OfferType::all(['id', 'name']),
            'propertyTypes' => PropertyType::all(['id', 'name', 'category']),
        ]);
    }

    public function storeMedia(Request $request, Listing $listing)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max per image
        ]);

        $media = [];
        foreach ($request->file('images', []) as $index => $image) {
            $path = $image->store('listings', 'public'); // Store in storage/app/public/listings
            $media[] = $listing->media()->create([
                'path' => '/storage/' . $path,
                'type' => 'image',
                'order' => $index,
            ]);
        }

        return response()->json(['media' => $media]);
    }
}
