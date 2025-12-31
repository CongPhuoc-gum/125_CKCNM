<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $primaryKey = 'productId';
    public $timestamps = false;

    protected $casts = [
        'categoryId' => 'int',
        'price' => 'float',
        'quantity' => 'int',
        'status' => 'bool',
        'createdAt' => 'datetime'
    ];

    protected $fillable = [
        'categoryId',
        'name',
        'price',
        'quantity',
        'imageUrl',
        'description',
        'status',
        'createdAt'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId', 'categoryId');
    }

    public function cartitems()
    {
        return $this->hasMany(Cartitem::class, 'productId');
    }

    public function orderitems()
    {
        return $this->hasMany(Orderitem::class, 'productId');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'productId');
    }
}
