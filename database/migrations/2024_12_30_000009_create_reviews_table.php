<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id('reviewId');
                $table->unsignedBigInteger('userId');
                $table->unsignedBigInteger('productId');
                $table->integer('rating');
                $table->text('comment')->nullable();
                $table->timestamp('createdAt')->useCurrent();
                $table->foreign('userId')->references('userId')->on('users')->onDelete('cascade');
                $table->foreign('productId')->references('productId')->on('products')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
