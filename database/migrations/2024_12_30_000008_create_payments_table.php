<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id('paymentId');
                $table->unsignedBigInteger('orderId');
                $table->enum('method', ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'])->default('credit_card');
                $table->decimal('amount', 12, 2);
                $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
                $table->string('transactionCode', 50)->nullable();
                $table->timestamp('createdAt')->useCurrent();
                $table->foreign('orderId')->references('orderId')->on('orders')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
