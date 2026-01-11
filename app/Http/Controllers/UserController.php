<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Lấy thông tin profile hiện tại
     * GET /api/user/profile
     */
    public function getProfile(Request $request)
    {
        try {
            $user = auth()->user();

            return response()->json([
                'success' => true,
                'data' => [
                    'userId' => $user->userId,
                    'fullName' => $user->fullName,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'googleId' => $user->googleId, // Để check có phải Google login không
                    'role' => $user->role,
                    'isVerified' => $user->isVerified,
                    'isActive' => $user->isActive,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật thông tin cá nhân
     * PUT /api/user/profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'fullName' => 'required|string|max:100',
                'username' => 'nullable|string|max:100',
                'phone' => 'nullable|string|max:20'
            ], [
                'fullName.required' => 'Vui lòng nhập họ tên',
                'fullName.max' => 'Họ tên không quá 100 ký tự'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();
            
            $user->fullName = $request->fullName;
            $user->username = $request->username;
            $user->phone = $request->phone;
            
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thông tin thành công!',
                'data' => [
                    'userId' => $user->userId,
                    'fullName' => $user->fullName,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'googleId' => $user->googleId,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Đổi mật khẩu
     * PUT /api/user/change-password
     */
    public function changePassword(Request $request)
    {
        try {
            $user = auth()->user();

            // ✅ Không cho phép đổi mật khẩu nếu đăng nhập bằng Google
            if ($user->googleId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản Google không thể đổi mật khẩu!'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:6',
                'new_password_confirmation' => 'required|same:new_password'
            ], [
                'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại',
                'new_password.required' => 'Vui lòng nhập mật khẩu mới',
                'new_password.min' => 'Mật khẩu mới phải có ít nhất 6 ký tự',
                'new_password_confirmation.same' => 'Mật khẩu xác nhận không khớp'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Kiểm tra mật khẩu hiện tại
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mật khẩu hiện tại không đúng!'
                ], 400);
            }

            // Cập nhật mật khẩu mới
            $user->password = Hash::make($request->new_password);
            $user->save();

            // Xóa tất cả token cũ (logout khỏi tất cả thiết bị)
            $user->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}