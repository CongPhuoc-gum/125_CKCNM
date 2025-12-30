<?php

namespace App\Services;

use App\Models\OtpCode;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class OtpService
{
    /**
     * Tạo mã OTP 6 số
     */
    public function generateOtp(): string
    {
        return sprintf('%06d', random_int(0, 999999));
    }

    /**
     * Tạo và lưu OTP vào database
     */
    public function createOtp(string $email): OtpCode
    {
        // Xóa các OTP cũ chưa sử dụng của email này
        OtpCode::where('email', $email)
            ->where('isUsed', false)
            ->delete();

        // Tạo OTP mới
        $otpCode = $this->generateOtp();
        $expiresAt = now()->addMinutes(5); // OTP hết hạn sau 5 phút

        return OtpCode::create([
            'email' => $email,
            'otpCode' => $otpCode,
            'expiresAt' => $expiresAt,
            'isUsed' => false,
        ]);
    }

    /**
     * Gửi OTP qua email
     */
    public function sendOtp(string $email, string $otpCode): bool
    {
        try {
            Mail::to($email)->send(new OtpMail($otpCode));
            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to send OTP email: ' . $e->getMessage());
            return true;
        }
    }

    /**
     * Xác thực OTP
     */
    public function verifyOtp(string $email, string $otpCode): bool
    {
        $otp = OtpCode::where('email', $email)
            ->where('otpCode', $otpCode)
            ->where('isUsed', false)
            ->first();

        if (!$otp) {
            return false;
        }

        if ($otp->isExpired()) {
            return false;
        }

        // Đánh dấu OTP đã sử dụng
        $otp->markAsUsed();

        return true;
    }

    /**
     * Kiểm tra có thể gửi lại OTP không (throttle)
     */
    public function canResendOtp(string $email): bool
    {
        $lastOtp = OtpCode::where('email', $email)
            ->orderBy('createdAt', 'desc')
            ->first();

        if (!$lastOtp) {
            return true;
        }

        // Chỉ cho phép gửi lại sau 60 giây
        return now()->diffInSeconds($lastOtp->createdAt) >= 60;
    }
}