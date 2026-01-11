@extends('admin.layouts.app')

@section('title', 'Chi tiết đơn hàng')

@section('content')
<div class="page-header">
    <h1 class="page-title">Chi tiết đơn hàng #<span id="orderIdTitle"></span></h1>
    <a href="/admin/orders" class="btn btn-outline">
        <i class="fas fa-arrow-left"></i> Quay lại
    </a>
</div>

<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
    <!-- Left Column - Order Items -->
    <div>
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Sản phẩm đã đặt</h3>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Tổng</th>
                            </tr>
                        </thead>
                        <tbody id="orderItemsTable">
                            <tr>
                                <td colspan="4" class="text-center">Đang tải...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: right;">
                    <h3>Tổng cộng: <span style="color: #4f46e5;" id="orderTotal">0đ</span></h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Right Column - Order Info -->
    <div>
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Thông tin đơn hàng</h3>
            </div>
            <div class="card-body">
                <div style="margin-bottom: 20px;">
                    <p style="margin-bottom: 8px;"><strong>Mã đơn hàng:</strong></p>
                    <p style="font-size: 18px; color: #4f46e5;">#<span id="orderId"></span></p>
                </div>

                <div style="margin-bottom: 20px;">
                    <p style="margin-bottom: 8px;"><strong>Trạng thái:</strong></p>
                    <div id="orderStatus"></div>
                </div>

                <div style="margin-bottom: 20px;">
                    <p style="margin-bottom: 8px;"><strong>Ngày đặt:</strong></p>
                    <p id="orderDate"></p>
                </div>

                <div style="margin-bottom: 20px;">
                    <p style="margin-bottom: 8px;"><strong>Phương thức thanh toán:</strong></p>
                    <p id="paymentMethod"></p>
                </div>

                <div id="updateStatusSection"></div>
            </div>
        </div>

        <div class="card" style="margin-top: 24px;">
            <div class="card-header">
                <h3 class="card-title">Thông tin khách hàng</h3>
            </div>
            <div class="card-body">
                <div style="margin-bottom: 15px;">
                    <p style="margin-bottom: 4px; color: #6b7280;">Họ tên:</p>
                    <p style="font-weight: 600;" id="customerName"></p>
                </div>

                <div style="margin-bottom: 15px;">
                    <p style="margin-bottom: 4px; color: #6b7280;">Số điện thoại:</p>
                    <p style="font-weight: 600;" id="customerPhone"></p>
                </div>

                <div style="margin-bottom: 15px;">
                    <p style="margin-bottom: 4px; color: #6b7280;">Địa chỉ giao hàng:</p>
                    <p style="font-weight: 600;" id="shippingAddress"></p>
                </div>

                <div id="noteSection"></div>
            </div>
        </div>
    </div>
</div>

@endsection

@section('scripts')
<script>
const API_URL = window.location.origin + '/api';
const orderId = window.location.pathname.split('/')[3];

async function loadOrderDetail() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const order = await response.json();

        // Update order info
        document.getElementById('orderIdTitle').textContent = order.orderId;
        document.getElementById('orderId').textContent = order.orderId;
        document.getElementById('orderStatus').innerHTML = getStatusBadge(order.status);
        document.getElementById('orderDate').textContent = formatDate(order.createdAt);
        document.getElementById('orderTotal').textContent = formatCurrency(order.totalAmount);

        // Customer info
        document.getElementById('customerName').textContent = order.customerName;
        document.getElementById('customerPhone').textContent = order.phone;
        document.getElementById('shippingAddress').textContent = order.shippingAddress;

        // Note
        if (order.note) {
            document.getElementById('noteSection').innerHTML = `
                <div style="margin-bottom: 15px;">
                    <p style="margin-bottom: 4px; color: #6b7280;">Ghi chú:</p>
                    <p style="font-weight: 600;">${order.note}</p>
                </div>
            `;
        }

        // Payment method
        if (order.payment) {
            const methodNames = {
                'cod': 'Thanh toán khi nhận hàng',
                'vnpay': 'VNPay',
                'stripe': 'Stripe'
            };
            document.getElementById('paymentMethod').textContent = methodNames[order.payment.method] || order.payment.method;
        }

        // Order items
        displayOrderItems(order.items);

        // Update status section
        if (order.status === 'pending' || order.status === 'processing') {
            document.getElementById('updateStatusSection').innerHTML = `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="margin-bottom: 10px; font-weight: 600;">Cập nhật trạng thái:</p>
                    <select id="newStatus" class="form-control" style="margin-bottom: 10px;">
                        <option value="">-- Chọn trạng thái --</option>
                        ${order.status === 'pending' ? '<option value="processing">Đang xử lý</option>' : ''}
                        ${order.status === 'processing' ? '<option value="shipping">Đang giao hàng</option>' : ''}
                        <option value="cancelled">Hủy đơn hàng</option>
                    </select>
                    <button onclick="updateStatus()" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-sync"></i> Cập nhật
                    </button>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading order:', error);
        alert('Không thể tải thông tin đơn hàng');
        window.location.href = '/admin/orders';
    }
}

function displayOrderItems(items) {
    const tbody = document.getElementById('orderItemsTable');
    
    if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Không có sản phẩm</td></tr>';
        return;
    }

    tbody.innerHTML = items.map(item => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${item.product && item.product.imageUrl ? 
                        `<img src="/storage/${item.product.imageUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" alt="${item.product.name}">` 
                        : ''
                    }
                    <span>${item.product ? item.product.name : 'N/A'}</span>
                </div>
            </td>
            <td>${formatCurrency(item.price)}</td>
            <td><strong>${item.quantity}</strong></td>
            <td><strong>${formatCurrency(item.price * item.quantity)}</strong></td>
        </tr>
    `).join('');
}

async function updateStatus() {
    const newStatus = document.getElementById('newStatus').value;
    if (!newStatus) {
        alert('Vui lòng chọn trạng thái mới');
        return;
    }

    if (!confirm('Bạn có chắc muốn cập nhật trạng thái đơn hàng?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cập nhật trạng thái thành công!');
            location.reload();
        } else {
            alert(data.message || 'Không thể cập nhật trạng thái');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-warning">Chờ xử lý</span>',
        'processing': '<span class="badge badge-primary">Đang xử lý</span>',
        'shipping': '<span class="badge badge-primary">Đang giao</span>',
        'completed': '<span class="badge badge-success">Hoàn thành</span>',
        'cancelled': '<span class="badge badge-danger">Đã hủy</span>'
    };
    return badges[status] || status;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
}

window.addEventListener('DOMContentLoaded', loadOrderDetail);
</script>
@endsection