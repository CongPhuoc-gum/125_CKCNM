<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $primaryKey = 'paymentId';
    public $timestamps = false;

    protected $fillable = [
        'orderId',
        'method',
        'amount',
        'status',
        'transactionCode',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }
}
