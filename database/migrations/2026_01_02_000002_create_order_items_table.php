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
        if (!Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->bigIncrements('orderItemId');
                $table->unsignedBigInteger('orderId');
                $table->unsignedBigInteger('productId');
                $table->integer('quantity');
                $table->decimal('price', 10, 2);
                $table->timestamp('createdAt')->useCurrent();

                $table->foreign('orderId')->references('orderId')->on('orders')->onDelete('cascade');
                $table->foreign('productId')->references('productId')->on('products')->onDelete('cascade');
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
        Schema::dropIfExists('order_items');
    }
};
