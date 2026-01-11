<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng nhập - Snack Shop</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>

<div class="container">
    <div class="logo">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoV0_K78ROk_yDSrCyKON-JkXA5uWF9gxe4A&s" alt="Logo">
    </div>

    <div class="form-box">
        <h2>Đăng nhập</h2>

        <form id="loginForm">
            <input type="text" id="email" placeholder="Email hoặc tên đăng nhập" required>
            <input type="password" id="password" placeholder="Mật khẩu" required>
            <button type="submit">Đăng nhập</button>
        </form>

        <div class="social-login">
            <p>Hoặc đăng nhập bằng</p>
            <button class="google-btn" type="button">Google</button>
            <button class="facebook-btn" type="button">Facebook</button>
        </div>

        <p class="link-text">
            Chưa có tài khoản?
            <a href="/register">Đăng ký ngay</a>
        </p>
    </div>
</div>

<script src="/js/auth.js"></script>
<script>

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        
        await handleLogin(email, password);
    });

    // Xử lý nút Google login
    document.querySelector('.google-btn').addEventListener('click', function() {
        window.location.href = 'http://localhost:8000/api/auth/google';
    });

    // Xử lý nút Facebook (chưa implement)
    document.querySelector('.facebook-btn').addEventListener('click', function() {
        alert('Tính năng đăng nhập Facebook đang được phát triển!');
    });
    
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        
        await handleLogin(email, password);
    });
</script>

</body>
</html>