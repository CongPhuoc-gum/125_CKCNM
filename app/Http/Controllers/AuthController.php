<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

//đăng ký
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'fullName' => 'required|string|max:100',
                'email' => 'required|email|max:100|unique:users,email',
                'phone' => 'required|string|max:20',
                'password' => 'required|string|min:6',
            ], [
                'fullName.required' => 'Vui lòng nhập họ tên',
                'email.required' => 'Vui lòng nhập email',
                'email.email' => 'Email không hợp lệ',
                'email.unique' => 'Email đã được sử dụng',
                'phone.required' => 'Vui lòng nhập số điện thoại',
                'password.required' => 'Vui lòng nhập mật khẩu',
                'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Kiểm tra throttle gửi OTP
            if (!$this->otpService->canResendOtp($request->email)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vui lòng đợi 60 giây trước khi gửi lại OTP'
                ], 429);
            }

            $otp = $this->otpService->createOtp($request->email);

            $sent = $this->otpService->sendOtp($request->email, $otp->otpCode);

            if (!$sent) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể gửi email. Vui lòng thử lại sau'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email',
                'data' => [
                    'email' => $request->email,
                    'expiresIn' => 300 // 5 phút
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

//xac thực otp
    public function verifyOtp(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'fullName' => 'required|string|max:100',
                'email' => 'required|email',
                'phone' => 'required|string|max:20',
                'password' => 'required|string|min:6',
                'otpCode' => 'required|string|size:6',
            ], [
                'otpCode.required' => 'Vui lòng nhập mã OTP',
                'otpCode.size' => 'Mã OTP phải có 6 số',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Xác thực OTP
            $isValid = $this->otpService->verifyOtp($request->email, $request->otpCode);

            if (!$isValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã OTP không đúng hoặc đã hết hạn'
                ], 400);
            }

            // Tạo tài khoản
            $user = User::create([
                'fullName' => $request->fullName,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'isVerified' => true,
                'role' => 'user',
                'isActive' => true,
            ]);

            // Tạo token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công',
                'data' => [
                    'user' => [
                        'userId' => $user->userId,
                        'fullName' => $user->fullName,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->role,
                        'isVerified' => $user->isVerified,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer'
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GỬI LẠI OTP
     * POST /api/auth/resend-otp
     */
    public function resendOtp(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Kiểm tra throttle
            if (!$this->otpService->canResendOtp($request->email)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vui lòng đợi 60 giây trước khi gửi lại OTP'
                ], 429);
            }

            // Tạo OTP mới
            $otp = $this->otpService->createOtp($request->email);

            // Gửi email
            $sent = $this->otpService->sendOtp($request->email, $otp->otpCode);

            if (!$sent) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể gửi email'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Mã OTP mới đã được gửi đến email của bạn'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ĐĂNG NHẬP
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ], [
                'email.required' => 'Vui lòng nhập email',
                'password.required' => 'Vui lòng nhập mật khẩu',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Tìm user
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email hoặc mật khẩu không đúng'
                ], 401);
            }

            // Kiểm tra tài khoản có active không
            if (!$user->isActive) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản của bạn đã bị khóa'
                ], 403);
            }

            // Kiểm tra đã verify email chưa
            if (!$user->isVerified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vui lòng xác thực email trước khi đăng nhập'
                ], 403);
            }

            // Tạo token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Đăng nhập thành công',
                'data' => [
                    'user' => [
                        'userId' => $user->userId,
                        'fullName' => $user->fullName,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->role,
                        'isVerified' => $user->isVerified,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer'
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ĐĂNG XUẤT
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đăng xuất thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * LẤY THÔNG TIN USER HIỆN TẠI
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        try {
            $user = $request->user();

            return response()->json([
                'success' => true,
                'data' => [
                    'userId' => $user->userId,
                    'fullName' => $user->fullName,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'isVerified' => $user->isVerified,
                    'isActive' => $user->isActive,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}