<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Category
 * 
 * @property int $categoryId
 * @property string $name
 * @property string|null $imageUrl
 * @property bool|null $status
 * @property Carbon|null $createdAt
 * 
 * @property Collection|Product[] $products
 *
 * @package App\Models
 */
class Category extends Model
{
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
