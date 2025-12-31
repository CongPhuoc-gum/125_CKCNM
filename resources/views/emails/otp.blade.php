<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
        }
        .logo {
            margin-bottom: 20px;
        }
        h1 {
            color: #e74c3c;
            margin-bottom: 20px;
        }
        .otp-code {
            background-color: #fff;
            border: 2px dashed #e74c3c;
            border-radius: 8px;
            padding: 20px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #e74c3c;
            margin: 30px 0;
        }
        .info {
            color: #666;
            font-size: 14px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h2>🍿 SNACK FOOD SHOP</h2>
        </div>
        
        <h1>Mã xác thực OTP</h1>
        
        <p>Xin chào,</p>
        <p>Đây là mã OTP để xác thực tài khoản của bạn:</p>
        
        <div class="otp-code">
            {{ $otpCode }}
        </div>
        
        <div class="info">
            <p><strong>Lưu ý:</strong></p>
            <ul style="text-align: left; display: inline-block;">
                <li>Mã OTP có hiệu lực trong 5 phút</li>
                <li>Không chia sẻ mã này với bất kỳ ai</li>
                <li>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            <p>&copy; 2024 Snack Food Shop. All rights reserved.</p>
        </div>
    </div>
</body>
</html>