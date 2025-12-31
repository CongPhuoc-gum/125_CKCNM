<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $primaryKey = 'categoryId';
    public $timestamps = false;

    protected $casts = [
        'status' => 'bool',
        'createdAt' => 'datetime'
    ];

    protected $fillable = [
        'name',
        'imageUrl',
        'status',
        'createdAt'
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'categoryId');
    }
}
