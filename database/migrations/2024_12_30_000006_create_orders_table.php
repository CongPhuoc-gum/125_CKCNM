<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id('orderId');
                $table->unsignedBigInteger('userId')->nullable();
                $table->decimal('totalAmount', 12, 2);
                $table->enum('status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])->default('pending');
                $table->string('customerName', 100);
                $table->string('phone', 20);
                $table->string('shippingAddress', 255);
                $table->text('note')->nullable();
                $table->timestamp('createdAt')->useCurrent();
                $table->foreign('userId')->references('userId')->on('users')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
