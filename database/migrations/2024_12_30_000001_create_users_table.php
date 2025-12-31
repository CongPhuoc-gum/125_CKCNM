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
        Schema::create('users', function (Blueprint $table) {
            $table->id('userId');
            $table->string('username', 50)->nullable()->unique();
            $table->string('fullName', 100)->nullable();
            $table->string('email', 100)->unique();
            $table->string('phone', 20);
            $table->string('password');
            $table->string('googleId', 100)->nullable();
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->boolean('isActive')->default(true);
            $table->boolean('isVerified')->default(false);
            $table->timestamp('createdAt')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};