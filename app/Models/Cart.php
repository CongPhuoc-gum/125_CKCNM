<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Cart
 * 
 * @property int $cartId
 * @property int $userId
 * @property Carbon|null $createdAt
 * 
 * @property User $user
 * @property Collection|Cartitem[] $cartitems
 *
 * @package App\Models
 */
class Cart extends Model
{
	protected $table = 'carts';
	protected $primaryKey = 'cartId';
	public $timestamps = false;

	protected $casts = [
		'userId' => 'int',
		'createdAt' => 'datetime'
	];

	protected $fillable = [
		'userId',
		'createdAt'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'userId');
	}

	public function cartitems()
	{
		return $this->hasMany(Cartitem::class, 'cartId');
	}
}
