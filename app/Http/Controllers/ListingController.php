<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Listing;
use App\Models\OfferType;
use App\Models\PropertyType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class ListingController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Listing::query()
            ->with([
                'offerType' => fn($q) => $q->select(['id', 'name']),
                'propertyType' => fn($q) => $q->select(['id', 'name', 'category']),
                'firstImage'
            ])
            ->where('status', 'active')
            ->whereNull('parent_id') // Only include listings with no parent_id (not subprojects)
            ->latest();

        // Filter by user_id if authenticated
        if (Auth::check('web')) {
            $query->where('user_id', Auth::guard('web')->id());
        }

        $listings = $query->paginate(10)->withQueryString();

        //dd($listings);

        return Inertia::render('user/listings/index', [
            'listings' => $listings,
            'offerTypes' => OfferType::all(['id', 'name']),
            'propertyTypes' => PropertyType::all(['id', 'name', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('user/listings/create', [
            'offerTypes' => OfferType::all(['id', 'name']),
            'propertyTypes' => PropertyType::all(['id', 'name', 'category']),
            'projects' => Listing::whereHas('offerType', fn($q) => $q->where('name', 'project'))->get(['id', 'title']),
            'auth' => Auth::guard('web')->check() ? ['user' => Auth::user('web')->only(['id', 'name'])] : ['user' => null],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        //dd($request);
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
        'amenities' => 'nullable|array',
        'amenities.*' => 'integer|exists:amenities,id',
        'parent_id' => 'nullable|exists:listings,id',
        'user_id' => 'required|integer|exists:users,id',
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
        'subprojects.*.amenities' => 'nullable|array',
        'subprojects.*.amenities.*' => 'integer|exists:amenities,id',
        'subprojects.*.user_id' => 'required|integer|exists:users,id',
    ]);

    $user1 = $request['user_id'];
    $user2 =  Auth::guard('web')->user()->id;
        // // Ensure user_id matches the authenticated user
        // if ($request['user_id'] !==  Auth::guard('web')->user()->id ) {
        //     dd( $user1 . 'error de usuario no autorizado' . $user2);
        //     //return response()->json(['error' => 'Unauthorized user_id'], 403);
        // }

        $listingData = $request->except('subprojects');
        $listingData['user_id'] =  Auth::guard('web')->user()->id ; // Force user_id to authenticated user

      return DB::transaction(function () use ($request, $validated) {
            $listingData = $request->except(['subprojects', 'images']);
            $listingData['user_id'] = auth('web')->user()->id;
            $listingData['status'] = 'active';
            $listing = Listing::create($listingData);

            if ($request->has('subprojects')) {
                $subprojects = json_decode($request->input('subprojects'), true);
                foreach ($subprojects as $subprojectData) {
                    if ($subprojectData['user_id'] !== Auth::guard('web')->user()->id ) {
                        throw new \Exception('Unauthorized user_id in subproject');
                    }
                    $subprojectData['user_id'] = Auth::guard('web')->user()->id ;
                    $subprojectData['offer_type_id'] = OfferType::where('name', 'project')->first()->id;
                    $subprojectData['parent_id'] = $listing->id;
                    $subprojectData['currency'] = $listing->currency;
                    $subprojectData['city'] = $listing->city;
                    $subprojectData['address'] = $listing->address;
                    $subprojectData['latitude'] = $listing->latitude;
                    $subprojectData['longitude'] = $listing->longitude;
                    $subprojectData['status'] = 'active';
                    Listing::create($subprojectData);
                }
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images', []) as $index => $image) {
                    $path = $image->store('listings', 'public');
                    $listing->media()->create([
                        'path' => '/storage/' . $path,
                        'type' => 'image',
                        'order' => $index,
                    ]);
                }
            }

            return redirect()->route('user.listings.index');
        });

    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        $listing = Listing::findOrFail($id);

        $listing->load([
        'offerType',
        'propertyType',
        'media' => fn($query) => $query->orderBy('order'),
        'subprojects' => fn($query) => $query->with(['offerType', 'propertyType']),
        'parent' => fn($query) => $query->with(['offerType', 'propertyType']),
        ]);

        return Inertia::render('user/listings/show', [
            'listing' => $listing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $listing = Listing::findOrFail($id);

        $listing->load([
            'offerType' => fn($q) => $q->select(['id', 'name']),
            'propertyType' => fn($q) => $q->select(['id', 'name', 'category']),
            'media' => fn($q) => $q->where('type', 'image')
        ]);
        return Inertia::render('user/listings/edit', [
            'listing' => $listing,
            'offerTypes' => OfferType::all(['id', 'name']),
            'propertyTypes' => PropertyType::all(['id', 'name', 'category']),
            'projects' => Listing::whereHas('offerType', fn($q) => $q->where('name', 'project'))->get(['id', 'title']),
            'auth' => Auth::check('web') ? ['user' => Auth::guard('web')->user()->only(['id', 'name'])] : ['user' => null],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'currency' => 'required|string|in:USD,PEN',
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
            'amenities' => 'nullable|array',
            'amenities.*' => 'integer|exists:amenities,id',
            'parent_id' => 'nullable|exists:listings,id',
            'user_id' => 'required|integer|exists:users,id', // Validate user_id
        ]);

         return DB::transaction(function () use ($request, $listing, $validated) {
            $listingData = $request->except('images');
            $listingData['user_id'] = auth()->id();
            $listing->update($listingData);

            if ($request->hasFile('images')) {
                // Optionally delete existing media if replacing
                $listing->media()->delete();
                foreach ($request->file('images', []) as $index => $image) {
                    $path = $image->store('listings', 'public');
                    $listing->media()->create([
                        'path' => '/storage/' . $path,
                        'type' => 'image',
                        'order' => $index,
                    ]);
                }
            }

            return redirect()->route('user.listings.index');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $listing = Listing::findOrFail($id);
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

        if ($attribute = $request->query('attribute')) {
            $query->whereJsonContains('attributes->amenities', $attribute); // Adjust 'amenities' to your JSON key
        }

        if ($attributes = $request->query('attributes', [])) {
            foreach ($attributes as $attr) {
                $query->whereJsonContains('attributes->amenities', $attr);
            }
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
