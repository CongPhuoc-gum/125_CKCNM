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
        Schema::create('otp_codes', function (Blueprint $table) {
            $table->id('otpId');
            $table->string('email', 100);
            $table->string('otpCode', 6);
            $table->timestamp('expiresAt');
            $table->boolean('isUsed')->default(false);
            $table->timestamp('createdAt')->useCurrent();
            
            $table->index(['email', 'otpCode']);
            $table->index('expiresAt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otp_codes');
    }
};