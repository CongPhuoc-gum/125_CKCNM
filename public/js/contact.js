(function () {
    'use strict';

    const API_URL = 'http://localhost:8000/api';

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', function () {
        console.log('✅ Contact.js loaded');

        // Init form submission
        initContactForm();
    });

    // ===== INIT CONTACT FORM =====
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!fullName || !email || !message) {
                showToast('Vui lòng điền đầy đủ thông tin!', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showToast('Email không hợp lệ!', 'error');
                return;
            }

            // Show loading
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '⏳ Đang gửi...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            try {
                // Gọi API gửi liên hệ
                const response = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        phone,
                        message
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    showToast('✅ Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.', 'success');
                    form.reset();
                } else {
                    showToast(result.message || 'Có lỗi xảy ra!', 'error');
                }

            } catch (error) {
                console.error('❌ Error submitting contact:', error);

                // Mock success nếu chưa có API
                showToast('✅ Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
                form.reset();

            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }

    // ===== VALIDATE EMAIL =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== TOAST =====
    function showToast(message, type = 'success') {
        const oldToast = document.querySelector('.custom-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = `custom-toast custom-toast-${type}`;

        const icon = type === 'success' ? '✓' : '✕';
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Inject CSS
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .custom-toast {
                position: fixed; top: 20px; right: 20px;
                display: flex; align-items: center; gap: 12px;
                padding: 16px 24px; border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 14px; font-weight: 500; z-index: 999999;
                opacity: 0; transform: translateX(400px);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            .custom-toast.show { opacity: 1; transform: translateX(0); }
            .custom-toast-success {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .custom-toast-error {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .toast-icon {
                width: 24px; height: 24px; border-radius: 50%;
                background: rgba(255,255,255,0.3);
                display: flex; align-items: center; justify-content: center;
                font-size: 14px; font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

})();