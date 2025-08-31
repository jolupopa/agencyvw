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
        Schema::create('admin_profiles', function (Blueprint $table) {
            $table->unsignedBigInteger('admin_id'); //FK
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade');
			$table->string('dni')->nullable();
			$table->string('last_name')->nullable();
            $table->string('first_name')->nullable();
			$table->string('ruc')->nullable();
			$table->string('address')->nullable();
			$table->string('phone')->nullable();
			$table->string('whatsapp')->nullable();
            $table->string('avatar')->nullable();
			$table->string('title')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_profiles');
    }
};
