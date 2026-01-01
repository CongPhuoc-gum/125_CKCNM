<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng ký - Snack Shop</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

<div class="container">
    <div class="logo">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoV0_K78ROk_yDSrCyKON-JkXA5uWF9gxe4A&s" alt="Logo">
    </div>

    <div class="form-box">
        <h2>Đăng ký</h2>

        <form id="registerForm">
            <input type="text" id="username" placeholder="Tên đăng nhập" required>
            <input type="text" id="fullName" placeholder="Họ và tên" required>
            <input type="email" id="email" placeholder="Email" required>
            <input type="tel" id="phone" placeholder="Số điện thoại" required>
            <input type="password" id="password" placeholder="Mật khẩu" required>
            <input type="password" id="confirmPassword" placeholder="Nhập lại mật khẩu" required>
            <button type="submit">Đăng ký</button>
        </form>

        <div class="social-login">
            <p>Hoặc đăng ký bằng</p>
            <button class="google-btn" type="button">Google</button>
            <button class="facebook-btn" type="button">Facebook</button>
        </div>

        <p class="link-text">
            Đã có tài khoản?
            <a href="/login">Đăng nhập</a>
        </p>
    </div>
</div>

<script src="/js/auth.js"></script>
<script>
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!username || !fullName || !email || !phone || !password) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }
        
        await handleRegister({
            username,
            fullName,
            email,
            phone,
            password
        });
    });
</script>

</body>
</html>