<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $primaryKey = 'productId';
    public $timestamps = false;

    protected $fillable = [
        'categoryId',
        'name',
        'price',
        'quantity',
        'imageUrl',
        'description',
        'status'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId', 'categoryId');
    }
}
