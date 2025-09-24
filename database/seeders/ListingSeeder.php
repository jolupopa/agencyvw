<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\Media;
use App\Models\OfferType;
use App\Models\PropertyType;
use App\Models\Amenity;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ListingSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Fetch existing offer and property types
        $offerTypes = OfferType::pluck('id', 'name')->toArray();
        $propertyTypes = PropertyType::pluck('id', 'name')->toArray();

         $amenityIds = Amenity::pluck('id')->toArray();

        // Add new project types for terrains if not exist (to allow terrains in subprojects)
        $terrainProjectTypes = ['urban_land_project' => 'project', 'agricultural_land_project' => 'project'];
        foreach ($terrainProjectTypes as $name => $category) {
            if (!isset($propertyTypes[$name])) {
                $newType = PropertyType::create(['name' => $name, 'category' => $category]);
                $propertyTypes[$name] = $newType->id;
            }
        }

        // All property types for properties (non-project)
        $habitablePropertyTypes = ['house', 'apartment', 'office'];
        $terrainPropertyTypes = ['urban_land', 'agricultural_land'];
        $accommodationPropertyTypes = ['shared_bathroom_room', 'private_room', 'student_room'];
        $projectPropertyTypes = ['condo_project', 'commercial_project', 'residential_project', 'urban_land_project', 'agricultural_land_project'];

        // Sample cities and currencies
        $cities = ['Lima', 'Cusco', 'Arequipa', 'Trujillo', 'Chiclayo'];
        $currencies = ['USD', 'PEN'];

        // Create 20 properties (5 terrains, others habitable; random offer_type: sale or rent)
        for ($i = 0; $i < 20; $i++) {
            $isTerrain = ($i < 5); // First 5 are terrains
            $propertyTypeName = $isTerrain
                ? $faker->randomElement($terrainPropertyTypes)
                : $faker->randomElement($habitablePropertyTypes);
            $offerTypeName = $faker->randomElement(['sale', 'rent']);

            $data = [
                'user_id' => 1, // Assume user_id 1
                'offer_type_id' => $offerTypes[$offerTypeName],
                'property_type_id' => $propertyTypes[$propertyTypeName],
                'title' => $faker->sentence(4),
                'description' => $faker->paragraph(3),
                'price' => $faker->randomFloat(2, 1000, 500000),
                'currency' => $faker->randomElement($currencies),
                'city' => $faker->randomElement($cities),
                'address' => $faker->streetAddress,
                'latitude' => $faker->latitude,
                'longitude' => $faker->longitude,
            ];

            if ($isTerrain) {
                $data['land_area'] = $faker->randomFloat(2, 100, 10000);
            } else {
                $data['built_area'] = $faker->randomFloat(2, 50, 500);
                $data['bedrooms'] = rand(1, 5);
                $data['bathrooms'] = rand(1, 3);
                $data['floors'] = rand(1, 3);
                $data['parking_spaces'] = rand(0, 2);
            }

            $listing = Listing::create($data);

            $listing->amenities()->attach(
                $faker->randomElements($amenityIds, rand(1, min(3, count($amenityIds))))
            );

            // Add 1-5 random photos
            $numPhotos = rand(1, 5);
            for ($j = 0; $j < $numPhotos; $j++) {
                Media::create([
                    'mediable_id' => $listing->id,
                    'mediable_type' => Listing::class,
                    'path' => 'https://picsum.photos/640/480?random=' . rand(1, 1000),
                    'type' => 'image',
                    'order' => $j,
                ]);
            }
        }

        // Create 10 temporary accommodations
        for ($i = 0; $i < 10; $i++) {
            $propertyTypeName = $faker->randomElement($accommodationPropertyTypes);

            $data = [
                'user_id' => 1,
                'offer_type_id' => $offerTypes['temporary_accommodation'],
                'property_type_id' => $propertyTypes[$propertyTypeName],
                'title' => $faker->sentence(4),
                'description' => $faker->paragraph(3),
                'price' => $faker->randomFloat(2, 20, 100),
                'currency' => $faker->randomElement($currencies),
                'city' => $faker->randomElement($cities),
                'address' => $faker->streetAddress,
                'latitude' => $faker->latitude,
                'longitude' => $faker->longitude,
                'built_area' => $faker->randomFloat(2, 10, 30),
                'bedrooms' => 1,
                'bathrooms' => rand(0, 1),

            ];

            $listing = Listing::create($data);

            $listing->amenities()->attach(
                $faker->randomElements($amenityIds, rand(1, min(3, count($amenityIds))))
            );

            // Add 1-5 random photos
            $numPhotos = rand(1, 5);
            for ($j = 0; $j < $numPhotos; $j++) {
                Media::create([
                    'mediable_id' => $listing->id,
                    'mediable_type' => Listing::class,
                    'path' => 'https://picsum.photos/640/480?random=' . rand(1, 1000),
                    'type' => 'image',
                    'order' => $j,
                ]);
            }
        }

        // Create 20 top-level projects
        $projects = [];
        for ($i = 0; $i < 20; $i++) {
            $propertyTypeName = $faker->randomElement($projectPropertyTypes);

            $data = [
                'user_id' => 1,
                'offer_type_id' => $offerTypes['project'],
                'property_type_id' => $propertyTypes[$propertyTypeName],
                'title' => $faker->sentence(4) . ' Project',
                'description' => $faker->paragraph(3),
                'price' => $faker->optional(0.5)->randomFloat(2, 100000, 1000000), // Optional price
                'currency' => $faker->randomElement($currencies),
                'city' => $faker->randomElement($cities),
                'address' => $faker->streetAddress,
                'latitude' => $faker->latitude,
                'longitude' => $faker->longitude,
            ];

            $project = Listing::create($data);
            $projects[] = $project;
            $project->amenities()->attach(
                $faker->randomElements($amenityIds, rand(1, min(3, count($amenityIds))))
            );

            // Add 1-5 random photos to the project
            $numPhotos = rand(1, 5);
            for ($j = 0; $j < $numPhotos; $j++) {
                Media::create([
                    'mediable_id' => $project->id,
                    'mediable_type' => Listing::class,
                    'path' => 'https://picsum.photos/640/480?random=' . rand(1, 1000), // Placeholder URL
                    'type' => 'image',
                    'order' => $j,
                ]);
            }



            // Create 1-3 subprojects for each project
            $numSubprojects = rand(1, 3);
            for ($k = 0; $k < $numSubprojects; $k++) {
                $subPropertyTypeName = $faker->randomElement($projectPropertyTypes); // Includes terrain projects

                $subData = [
                    'user_id' => 1,
                    'offer_type_id' => $offerTypes['project'],
                    'property_type_id' => $propertyTypes[$subPropertyTypeName],
                    'parent_id' => $project->id,
                    'title' => $faker->sentence(3) . ' Subproject',
                    'description' => $faker->paragraph(2),
                    'price' => $faker->randomFloat(2, 50000, 300000),
                    'currency' => $faker->randomElement($currencies),
                    'city' => $project->city,
                    'address' => $project->address . ' - Sub ' . ($k + 1),
                    'latitude' => $project->latitude + $faker->randomFloat(2, -0.01, 0.01),
                    'longitude' => $project->longitude + $faker->randomFloat(2, -0.01, 0.01),
                ];

                if (in_array($subPropertyTypeName, ['urban_land_project', 'agricultural_land_project'])) {
                    $subData['land_area'] = $faker->randomFloat(2, 100, 5000);
                } else {
                    $subData['built_area'] = $faker->randomFloat(2, 50, 300);
                    $subData['bedrooms'] = rand(1, 4);
                    $subData['bathrooms'] = rand(1, 3);
                    $subData['floors'] = rand(1, 3);
                    $subData['parking_spaces'] = rand(0, 2);
                }

                $subproject = Listing::create($subData);
                $subproject->amenities()->attach(
                    $faker->randomElements($amenityIds, rand(1, min(3, count($amenityIds))))
                );


                // Add 1-5 random photos to the subproject
                $numPhotos = rand(1, 5);
                for ($j = 0; $j < $numPhotos; $j++) {
                    Media::create([
                        'mediable_id' => $subproject->id,
                        'mediable_type' => Listing::class,
                        'path' => 'https://picsum.photos/640/480?random=' . rand(1, 1000), // Placeholder URL
                        'type' => 'image',
                        'order' => $j,
                    ]);
                }
            }
        }
    }
}
