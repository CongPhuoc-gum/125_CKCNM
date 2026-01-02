<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'orderId';
    public $timestamps = false;

    protected $fillable = [
        'userId',
        'totalAmount',
        'status',
        'customerName',
        'phone',
        'shippingAddress',
        'note',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'orderId');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'orderId');
    }
}
