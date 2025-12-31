<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Cartitem
 * 
 * @property int $cartItemId
 * @property int $cartId
 * @property int $productId
 * @property int $quantity
 * @property float $price
 * @property Carbon|null $createdAt
 * 
 * @property Cart $cart
 * @property Product $product
 *
 * @package App\Models
 */
class Cartitem extends Model
{
	protected $table = 'cartitems';
	protected $primaryKey = 'cartItemId';
	public $timestamps = false;

	protected $casts = [
		'cartId' => 'int',
		'productId' => 'int',
		'quantity' => 'int',
		'price' => 'float',
		'createdAt' => 'datetime'
	];

	protected $fillable = [
		'cartId',
		'productId',
		'quantity',
		'price',
		'createdAt'
	];

	public function cart()
	{
		return $this->belongsTo(Cart::class, 'cartId');
	}

	public function product()
	{
		return $this->belongsTo(Product::class, 'productId');
	}
}
