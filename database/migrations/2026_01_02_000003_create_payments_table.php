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
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->bigIncrements('paymentId');
                $table->unsignedBigInteger('orderId');
                $table->enum('method', ['cod', 'stripe', 'vnpay']);
                $table->decimal('amount', 12, 2);
                $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
                $table->string('transactionCode', 100)->nullable();
                $table->timestamp('createdAt')->useCurrent();

                $table->foreign('orderId')->references('orderId')->on('orders')->onDelete('cascade');
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
        Schema::dropIfExists('payments');
    }
};
