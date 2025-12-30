<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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