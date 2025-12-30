<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtpCode extends Model
{
    use HasFactory;

    protected $table = 'otp_codes';
    protected $primaryKey = 'otpId';
    public $timestamps = false;

    protected $fillable = [
        'email',
        'otpCode',
        'expiresAt',
        'isUsed',
    ];

    protected $casts = [
        'expiresAt' => 'datetime',
        'isUsed' => 'boolean',
        'createdAt' => 'datetime',
    ];

    /**
     * Kiểm tra OTP có hết hạn không
     */
    public function isExpired(): bool
    {
        return now()->isAfter($this->expiresAt);
    }

    /**
     * Kiểm tra OTP có hợp lệ không (chưa sử dụng và chưa hết hạn)
     */
    public function isValid(): bool
    {
        return !$this->isUsed && !$this->isExpired();
    }

    /**
     * Đánh dấu OTP đã sử dụng
     */
    public function markAsUsed(): bool
    {
        $this->isUsed = true;
        return $this->save();
    }
}