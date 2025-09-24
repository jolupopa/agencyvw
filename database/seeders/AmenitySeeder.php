<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Amenity;
use Illuminate\Support\Str;
class AmenitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amenities = [
            'Piscina',
            'Gimnasio',
            'Estacionamiento',
            'Jardín',
            'Área de juegos para niños',
            'Balcón',
        ];

        foreach ($amenities as $amenity) {
            Amenity::firstOrCreate(
                ['slug' => Str::slug($amenity)],
                ['name' => $amenity]
            );
        }
    }
}
