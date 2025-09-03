<?php

namespace Database\Seeders;

use App\Models\PropertyType;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PropertyTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PropertyType::create(['name' => 'house', 'category' => 'property']);
        PropertyType::create(['name' => 'apartment', 'category' => 'property']);
        PropertyType::create(['name' => 'office', 'category' => 'property']);
        PropertyType::create(['name' => 'urban_land', 'category' => 'property']);
        PropertyType::create(['name' => 'agricultural_land', 'category' => 'property']);
        PropertyType::create(['name' => 'shared_bathroom_room', 'category' => 'property']);
        PropertyType::create(['name' => 'private_room', 'category' => 'property']);
        PropertyType::create(['name' => 'student_room', 'category' => 'property']);
        PropertyType::create(['name' => 'condo_project', 'category' => 'project']);
        PropertyType::create(['name' => 'commercial_project', 'category' => 'project']);
        PropertyType::create(['name' => 'residential_project', 'category' => 'project']);
    }
}
