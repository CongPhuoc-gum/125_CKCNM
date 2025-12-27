<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class User
 * 
 * @property int $userId
 * @property string|null $username
 * @property string|null $password
 * @property string|null $email
 * @property string|null $googleId
 * @property string|null $role
 * @property bool|null $isActive
 * @property Carbon|null $createdAt
 * 
 * @property Collection|Cart[] $carts
 * @property Collection|Order[] $orders
 * @property Collection|Review[] $reviews
 *
 * @package App\Models
 */
class User extends Model
{
	protected $table = 'users';
	protected $primaryKey = 'userId';
	public $timestamps = false;

	protected $casts = [
		'isActive' => 'bool',
		'createdAt' => 'datetime'
	];

	protected $hidden = [
		'password'
	];

	protected $fillable = [
		'username',
		'password',
		'email',
		'googleId',
		'role',
		'isActive',
		'createdAt'
	];

	public function carts()
	{
		return $this->hasMany(Cart::class, 'userId');
	}

	public function orders()
	{
		return $this->hasMany(Order::class, 'userId');
	}

	public function reviews()
	{
		return $this->hasMany(Review::class, 'userId');
	}
}
