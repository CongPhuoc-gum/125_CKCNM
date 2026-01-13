<p align="center">
  <h1 align="center">🍿 Snack Food Shop</h1>
  <p align="center">
    Hệ Thống Thương Mại Điện Tử Đồ Khô<br/>
    Xây dựng trên nền tảng <strong>Laravel API Backend</strong>
  </p>
</p>

<hr/>

<h2>📌 Giới thiệu</h2>

<p>
  <strong>Snack Food Shop</strong> là dự án xây dựng hệ thống bán lẻ
  <strong>thực phẩm khô, hạt dinh dưỡng và trái cây sấy</strong>.
  Hệ thống cung cấp giải pháp quản lý kho chuyên nghiệp và trải nghiệm
  mua sắm trực tuyến an toàn, hiện đại.
</p>

<ul>
  <li><strong>Tên dự án:</strong> Snack Food Shop</li>
  <li><strong>Mục tiêu:</strong> Nền tảng bán lẻ đồ khô với thanh toán và xác thực hiện đại</li>
  <li><strong>Điểm nổi bật:</strong> Thanh toán đa phương thức & Đăng nhập Google OAuth</li>
</ul>

<hr/>

<h2>⚙️ Công nghệ sử dụng</h2>

<ul>
  <li><strong>Framework:</strong> Laravel 9.x</li>
  <li><strong>Ngôn ngữ:</strong> PHP 8.x</li>
  <li><strong>Cơ sở dữ liệu:</strong> MySQL (dbsnackshop)</li>
  <li><strong>Xác thực:</strong> Laravel Sanctum, OTP Email</li>
  <li><strong>Dịch vụ tích hợp:</strong> VNPay, Stripe, Google Console</li>
</ul>

<hr/>

<h2>🚀 Các chức năng chính</h2>

<h3>1. Quản lý Sản phẩm Snack & Đồ khô</h3>
<ul>
  <li>Danh mục: Hạt dinh dưỡng, Trái cây sấy, Snack ăn liền</li>
  <li>Chi tiết sản phẩm: Khối lượng, hạn sử dụng, bảo quản</li>
  <li>Kho hàng: Kiểm tra tồn kho thời gian thực</li>
</ul>

<h3>2. Chức năng Khách hàng</h3>
<ul>
  <li>Đăng ký tài khoản & xác thực OTP qua Email</li>
  <li>Đăng nhập Google OAuth</li>
  <li>Giỏ hàng: Quản lý sản phẩm & tính tổng tiền tự động</li>
  <li>Thanh toán: COD, VNPay, Stripe</li>
  <li>Theo dõi đơn hàng & lịch sử mua</li>
</ul>

<h3>3. Quản trị hệ thống (Admin)</h3>
<ul>
  <li>Thống kê doanh thu & đơn hàng</li>
  <li>Quản lý sản phẩm, danh mục, kho hàng</li>
  <li>Xử lý và cập nhật trạng thái đơn hàng</li>
</ul>

<hr/>

<h2>🗂️ Cấu trúc dự án</h2>

<pre>
app/Http/Controllers   - Auth, Cart, Order
app/Models             - User, Product, Order
app/Services           - OTP, Payment
routes/api.php         - API Endpoints
</pre>

<hr/>

<h2>🛠️ Hướng dẫn cài đặt</h2>

<p><strong>Clone dự án:</strong></p>
<pre>
git clone https://github.com/CongPhuoc-gum/125_CKCNM.git
</pre>

<p><strong>Cài đặt thư viện:</strong></p>
<pre>
composer install
</pre>

<p><strong>Thiết lập môi trường:</strong></p>
<pre>
DB_PORT=3307
DB_DATABASE=dbsnackshop
DB_PASSWORD=Abc123456@
</pre>

<p><strong>Khởi tạo hệ thống:</strong></p>
<pre>
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
</pre>

<p><strong>Chạy ứng dụng:</strong></p>
<pre>
php artisan serve
</pre>

<hr/>

<h2>📄 License</h2>
<p>
  Dự án được phát triển phục vụ mục đích học tập và nghiên cứu với Laravel.
</p>
