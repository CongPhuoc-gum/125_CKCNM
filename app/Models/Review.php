<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Review
 * 
 * @property int $reviewId
 * @property int $userId
 * @property int $productId
 * @property int|null $rating
 * @property string|null $comment
 * @property Carbon|null $createdAt
 * 
 * @property Product $product
 * @property User $user
 *
 * @package App\Models
 */
class Review extends Model
{
	protected $table = 'reviews';
	protected $primaryKey = 'reviewId';
	public $timestamps = false;

	protected $casts = [
		'userId' => 'int',
		'productId' => 'int',
		'rating' => 'int',
		'createdAt' => 'datetime'
	];

	protected $fillable = [
		'userId',
		'productId',
		'rating',
		'comment',
		'createdAt'
	];

	public function product()
	{
		return $this->belongsTo(Product::class, 'productId');
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'userId');
	}
}
