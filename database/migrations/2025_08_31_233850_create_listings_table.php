<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->references('id')->on('listings')->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->string('currency')->default('USD');
            $table->foreignId('offer_type_id')->constrained('offer_types')->onDelete('restrict');
            $table->foreignId('property_type_id')->constrained('property_types')->onDelete('restrict');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('land_area', 10, 2)->nullable(); // In sqm or acres; required for terrain.
            $table->decimal('built_area', 10, 2)->nullable(); // In sqm; for habitable.
            $table->integer('bedrooms')->nullable(); // For residential.
            $table->integer('bathrooms')->nullable();
            $table->integer('floors')->nullable();
            $table->integer('parking_spaces')->nullable();
            $table->enum('status', ['active', 'inactive', 'end'])->default('active');
            $table->timestamps();
            // Indexes for filtering/scalability.
            $table->index('offer_type_id');
            $table->index('property_type_id');
            $table->index('price');
            $table->index('bedrooms');
            $table->index('bathrooms');
            $table->index('land_area');
            $table->index('built_area');
            $table->index('city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
