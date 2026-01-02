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
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->bigIncrements('orderId');
                $table->unsignedBigInteger('userId')->nullable();
                $table->decimal('totalAmount', 12, 2);
                $table->enum('status', ['pending', 'processing', 'shipping', 'completed', 'cancelled'])->default('pending');
                $table->string('customerName', 100);
                $table->string('phone', 20);
                $table->string('shippingAddress', 255);
                $table->text('note')->nullable();
                $table->timestamp('createdAt')->useCurrent();

                $table->foreign('userId')->references('id')->on('users')->onDelete('set null');
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
        Schema::dropIfExists('orders');
    }
};
