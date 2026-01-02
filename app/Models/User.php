<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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
 * @property \Carbon\Carbon|null $createdAt
 * 
 * @property \Illuminate\Support\Collection|Cart[] $carts
 * @property \Illuminate\Support\Collection|Order[] $orders
 * @property \Illuminate\Support\Collection|Review[] $reviews
 *
 * @package App\Models
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'userId';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'fullName',
        'email',
        'phone',
        'password',
        'googleId',
        'role',
        'isActive',
        'isVerified',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'isActive' => 'boolean',
        'isVerified' => 'boolean',
        'createdAt' => 'datetime',
    ];

    // Relationships
    public function carts()
    {
        return $this->hasMany(Cart::class, 'userId', 'userId');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'userId', 'userId');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'userId', 'userId');
    }

    public function cart()
    {
        return $this->hasOne(Cart::class, 'userId', 'userId');
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isVerifiedUser(): bool
    {
        return $this->isVerified;
    }
}
