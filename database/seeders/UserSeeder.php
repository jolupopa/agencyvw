<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use App\Models\UserProfile;
use App\Models\AdminProfile;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'user@gmail.com',
        ]);

        UserProfile::factory()->create([
            'user_id' => $user->id,
            'title' => 'Corredor Inmobiliario'
        ]);


        $agent = User::factory()->create([
            'name' => 'Test User',
            'email' => 'agent@gmail.com',
            'type' => 'agente'
        ]);


        UserProfile::factory()->create([
            'user_id' => $agent->id,
            'title' => 'Agente Inmobiliario'
        ]);


        $empresa = User::factory()->create([
            'name' => 'Test User',
            'email' => 'empresa@gmail.com',
            'type' => 'empresa'
        ]);


        UserProfile::factory()->create([
                'user_id' => $empresa->id,
                'title' => 'Empresa Inmobiliario'
        ]);


        $admin = Admin::factory()->create([
            'name' => 'Test Admin',
            'email' => 'admin@gmail.com',
        ]);


        AdminProfile::factory()->create([
            'admin_id' => $admin->id,
            'title' => 'Super Administrador'
        ]);

    }
}
