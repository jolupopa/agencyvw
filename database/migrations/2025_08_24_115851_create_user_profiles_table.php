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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id'); //FK
			$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
			$table->string('dni')->nullable();
			$table->string('last_name')->nullable();
			$table->string('first_name')->nullable();
			$table->string('ruc')->nullable();
			$table->string('address')->nullable();
			$table->string('movil')->nullable();
			$table->string('phone')->nullable();
			$table->string('url_web_site')->nullable();
			$table->string('whatsapp')->nullable();
			$table->string('title')->nullable();
            $table->string('avatar')->nullable();
			$table->text('about_me')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
