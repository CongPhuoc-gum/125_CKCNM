<?php
try {
    $pdo = new PDO(
        'mysql:host=127.0.0.1;port=3306;dbname=dbsnackshop',
        'root',
        '' // Điền password nếu có
    );
    echo "✅ Kết nối database thành công!\n";
    echo "Database: dbsnackshop\n";
} catch (PDOException $e) {
    echo "❌ Lỗi kết nối: " . $e->getMessage() . "\n";
}