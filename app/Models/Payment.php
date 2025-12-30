<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Payment
 * 
 * @property int $paymentId
 * @property int $orderId
 * @property string $method
 * @property float $amount
 * @property string|null $status
 * @property string|null $transactionCode
 * @property Carbon|null $createdAt
 * 
 * @property Order $order
 *
 * @package App\Models
 */
class Payment extends Model
{
	protected $table = 'payments';
	protected $primaryKey = 'paymentId';
	public $timestamps = false;

	protected $casts = [
		'orderId' => 'int',
		'amount' => 'float',
		'createdAt' => 'datetime'
	];

	protected $fillable = [
		'orderId',
		'method',
		'amount',
		'status',
		'transactionCode',
		'createdAt'
	];

	public function order()
	{
		return $this->belongsTo(Order::class, 'orderId');
	}
}
