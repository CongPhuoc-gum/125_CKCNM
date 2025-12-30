<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Orderitem
 * 
 * @property int $orderItemId
 * @property int $orderId
 * @property int $productId
 * @property int $quantity
 * @property float $price
 * @property Carbon|null $createdAt
 * 
 * @property Order $order
 * @property Product $product
 *
 * @package App\Models
 */
class Orderitem extends Model
{
	protected $table = 'orderitems';
	protected $primaryKey = 'orderItemId';
	public $timestamps = false;

	protected $casts = [
		'orderId' => 'int',
		'productId' => 'int',
		'quantity' => 'int',
		'price' => 'float',
		'createdAt' => 'datetime'
	];

	protected $fillable = [
		'orderId',
		'productId',
		'quantity',
		'price',
		'createdAt'
	];

	public function order()
	{
		return $this->belongsTo(Order::class, 'orderId');
	}

	public function product()
	{
		return $this->belongsTo(Product::class, 'productId');
	}
}
