<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Product
 * 
 * @property int $productId
 * @property int $categoryId
 * @property string $name
 * @property float $price
 * @property int|null $quantity
 * @property string|null $imageUrl
 * @property string|null $description
 * @property bool|null $status
 * @property Carbon|null $createdAt
 * 
 * @property Category $category
 * @property Collection|Cartitem[] $cartitems
 * @property Collection|Orderitem[] $orderitems
 * @property Collection|Review[] $reviews
 *
 * @package App\Models
 */
class Product extends Model
{
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
		return $this->belongsTo(Category::class, 'categoryId');
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
