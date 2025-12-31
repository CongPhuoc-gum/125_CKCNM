<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->bigIncrements('productId');
                $table->unsignedBigInteger('categoryId');
                $table->string('name', 150);
                $table->decimal('price', 10, 2);
                $table->integer('quantity')->default(0);
                $table->string('imageUrl', 255)->nullable();
                $table->text('description')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->timestamp('createdAt')->useCurrent();

                // FK
                $table->foreign('categoryId')->references('categoryId')->on('categories')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
