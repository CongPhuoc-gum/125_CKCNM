<p align="center">
  <h1 align="center">Snack Food Shop</h1>
  <p align="center">
    Hệ Thống Thương Mại Điện Tử Đồ Khô<br/>
    Xây dựng trên nền tảng Laravel API Backend
  </p>
</p>

<hr/>

<h2>About Snack Food Shop</h2>

<p>
  Snack Food Shop là dự án xây dựng hệ thống bán lẻ thực phẩm khô,
  hạt dinh dưỡng và trái cây sấy trên nền tảng Laravel.
  Hệ thống cung cấp giải pháp quản lý kho chuyên nghiệp
  và trải nghiệm mua sắm trực tuyến an toàn.
</p>

<ul>
  <li><strong>Project name:</strong> Snack Food Shop</li>
  <li><strong>Goal:</strong> Nền tảng thương mại điện tử đồ khô với thanh toán và xác thực hiện đại</li>
  <li><strong>Highlights:</strong> Thanh toán đa phương thức, đăng nhập Google OAuth</li>
</ul>

<hr/>

<h2>Technologies</h2>

<ul>
  <li>Framework: Laravel 9.x</li>
  <li>Language: PHP 8.x</li>
  <li>Database: MySQL (dbsnackshop)</li>
  <li>Authentication: Laravel Sanctum, OTP Email</li>
  <li>Third-party Services: VNPay, Stripe, Google Console</li>
</ul>

<hr/>

<h2>Main Features</h2>

<h3>Product Management</h3>
<ul>
  <li>Product categories: Nuts, Dried fruits, Snacks</li>
  <li>Product details: Weight, expiration date, storage instructions</li>
  <li>Real-time inventory checking</li>
</ul>

<h3>Customer Features</h3>
<ul>
  <li>User registration with OTP email verification</li>
  <li>Login with Google account</li>
  <li>Shopping cart management</li>
  <li>Payment methods: COD, VNPay, Stripe</li>
  <li>Order tracking and order history</li>
</ul>

<h3>Admin Management</h3>
<ul>
  <li>Revenue and order statistics</li>
  <li>CRUD products and categories</li>
  <li>Inventory management</li>
  <li>Order processing</li>
</ul>

<hr/>

<h2>Project Structure</h2>

<pre>
app/Http/Controllers   Auth, Cart, Order
app/Models             User, Product, Order
app/Services           OTP, Payment
routes/api.php         API Endpoints
</pre>

<hr/>

<h2>Installation Guide</h2>

<p>Clone repository:</p>
<pre>
git clone https://github.com/CongPhuoc-gum/125_CKCNM.git
</pre>

<p>Install dependencies:</p>
<pre>
composer install
</pre>

<p>Environment setup (.env):</p>
<pre>
DB_PORT=3307
DB_DATABASE=dbsnackshop
DB_PASSWORD=Abc123456@
</pre>

<p>Initialize application:</p>
<pre>
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
</pre>

<p>Run application:</p>
<pre>
php artisan serve
</pre>

<hr/>

<h2>License</h2>

<p>
  This project is developed for learning and academic purposes.
</p>
