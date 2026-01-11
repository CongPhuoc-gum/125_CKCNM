<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Change the column to string first to avoid enum issues, or directly to new enum
        // Since we are adding values, we can just redefine the enum
        DB::statement("ALTER TABLE payments MODIFY COLUMN method ENUM('cod', 'stripe', 'vnpay', 'credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash') NOT NULL DEFAULT 'cod'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revert to original list if needed (optional)
        // For safety, we keep the expanded list or revert to string 
    }
};
