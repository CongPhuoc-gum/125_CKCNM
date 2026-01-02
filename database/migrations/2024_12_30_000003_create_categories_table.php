<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id('categoryId');
                $table->string('name', 100);
                $table->string('imageUrl', 255)->nullable();
                $table->tinyInteger('status')->default(1);
                $table->timestamp('createdAt')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
