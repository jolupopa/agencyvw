<?php

namespace Database\Seeders;

use App\Models\OfferType;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OfferTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OfferType::create(['name' => 'sale']);
        OfferType::create(['name' => 'rent']);
        OfferType::create(['name' => 'project']);
        OfferType::create(['name' => 'temporary_accommodation']);
    }
}
