<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Xác thực OTP - Snack Shop</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

<div class="container">
    <div class="logo">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoV0_K78ROk_yDSrCyKON-JkXA5uWF9gxe4A&s" alt="Logo">
    </div>

    <div class="form-box">
        <h2>Xác thực OTP</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">
            Mã OTP đã được gửi đến email của bạn
        </p>

        <form id="otpForm">
            <input type="text" id="otp" placeholder="Nhập mã OTP (6 số)" required maxlength="6" pattern="[0-9]{6}">
            <button type="submit">Xác thực</button>
        </form>

        <p class="link-text">
            Không nhận được mã?
            <a href="#" id="resendOTP">Gửi lại</a>
        </p>
    </div>
</div>

<script src="{{ asset('js/auth.js') }}"></script>
<script>
    // Kiểm tra xem có thông tin đăng ký không
    const registerData = localStorage.getItem('register_data');
    
    if (!registerData) {
        alert('Phiên đăng ký đã hết hạn!');
        window.location.href = '/register';
    }
    
    // Xử lý submit OTP
    document.getElementById('otpForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const otp = document.getElementById('otp').value.trim();
        
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            alert('Mã OTP phải có 6 chữ số!');
            return;
        }
        
        await handleVerifyOTP(otp);
    });
    
    // Xử lý gửi lại OTP
    document.getElementById('resendOTP').addEventListener('click', async function(e) {
        e.preventDefault();
        await handleResendOTP();
    });
</script>

</body>
</html>