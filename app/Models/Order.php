<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Order
 * 
 * @property int $orderId
 * @property int|null $userId
 * @property float $totalAmount
 * @property string|null $status
 * @property string $customerName
 * @property string $phone
 * @property string $shippingAddress
 * @property string|null $note
 * @property Carbon|null $createdAt
 * 
 * @property User|null $user
 * @property Collection|Orderitem[] $orderitems
 * @property Collection|Payment[] $payments
 *
 * @package App\Models
 */
class Order extends Model
{
	protected $table = 'orders';
	protected $primaryKey = 'orderId';
	public $timestamps = false;

	protected $casts = [
		'userId' => 'int',
		'totalAmount' => 'float',
		'createdAt' => 'datetime'
	];

	protected $fillable = [
		'userId',
		'totalAmount',
		'status',
		'customerName',
		'phone',
		'shippingAddress',
		'note',
		'createdAt'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'userId');
	}

	public function orderitems()
	{
		return $this->hasMany(Orderitem::class, 'orderId');
	}

	public function payments()
	{
		return $this->hasMany(Payment::class, 'orderId');
	}
}
