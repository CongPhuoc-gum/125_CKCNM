<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index($userId)
    {
        $orders = Order::where('userId', $userId)
            ->withCount('items')
            ->orderBy('createdAt', 'desc')
            ->get();
        return response()->json($orders);
    }

    /**
     * Chi tiết đơn hàng - FIX: Load đầy đủ relationships
     * GET /api/orders/{id}
     */
    public function show($id)
    {
        $order = Order::with(['items.product', 'payment'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Transform data to ensure all fields are present
        $orderData = [
            'orderId' => $order->orderId,
            'userId' => $order->userId,
            'customerName' => $order->customerName ?? 'N/A',
            'phone' => $order->phone ?? 'N/A',
            'email' => $order->email ?? null,
            'shippingAddress' => $order->shippingAddress ?? 'N/A',
            'note' => $order->note ?? null,
            'totalAmount' => $order->totalAmount ?? 0,
            'status' => $order->status ?? 'pending',
            'createdAt' => $order->createdAt,
            'updatedAt' => $order->updatedAt,
            'items' => $order->items->map(function($item) {
                return [
                    'orderItemId' => $item->orderItemId,
                    'productId' => $item->productId,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'product' => $item->product ? [
                        'productId' => $item->product->productId,
                        'name' => $item->product->name,
                        'imageUrl' => $item->product->imageUrl,
                    ] : null
                ];
            }),
            'payment' => $order->payment ? [
                'paymentId' => $order->payment->paymentId,
                'method' => $order->payment->method,
                'amount' => $order->payment->amount,
                'status' => $order->payment->status,
                'transactionCode' => $order->payment->transactionCode,
            ] : null
        ];

        return response()->json($orderData);
    }

    /**
     * Khách hàng xác nhận đã nhận hàng
     * PUT /api/orders/{id}/complete
     */
    public function complete($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn hàng'], 404);
        }

        // Chỉ cho phép xác nhận khi đơn đang giao
        if ($order->status !== 'shipping') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ có thể xác nhận đơn hàng đang giao'
            ], 400);
        }

        $order->status = 'completed';
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Đã xác nhận nhận hàng thành công',
            'order' => $order
        ]);
    }

    public function cancel($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        // Chỉ cho phép hủy đơn hàng "pending" hoặc "processing"
        if (!in_array($order->status, ['pending', 'processing'])) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể hủy đơn hàng đang giao hoặc đã hoàn thành'
            ], 400);
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Hủy đơn hàng thành công',
            'order' => $order
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'userId' => 'nullable|exists:users,userId',
            'cartItems' => 'required|array',
            'totalAmount' => 'required|numeric',
            'paymentMethod' => 'required|in:cod,vnpay,stripe',
            'shippingAddress' => 'required|string',
            'phone' => 'required|string',
            'customerName' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            
            $order = Order::create([
                'userId' => $request->userId,
                'totalAmount' => $request->totalAmount,
                'status' => 'pending',
                'customerName' => $request->customerName,
                'phone' => $request->phone,
                'shippingAddress' => $request->shippingAddress,
                'note' => $request->note,
            ]);

            foreach ($request->cartItems as $item) {
                OrderItem::create([
                    'orderId' => $order->orderId,
                    'productId' => $item['productId'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            if ($request->paymentMethod === 'cod') {
                Payment::create([
                    'orderId' => $order->orderId,
                    'method' => 'cod',
                    'amount' => $order->totalAmount,
                    'status' => 'pending',
                ]);

                // Clear user's cart
                if ($request->userId) {
                    $cart = DB::table('carts')->where('userId', $request->userId)->first();
                    if ($cart) {
                        DB::table('cartitems')->where('cartId', $cart->cartId)->delete();
                    }
                }

                DB::commit();
                return response()->json(['success' => true, 'message' => 'Order created successfully', 'orderId' => $order->orderId], 201);
            } elseif ($request->paymentMethod === 'vnpay') {
                Payment::create([
                    'orderId' => $order->orderId,
                    'method' => 'vnpay',
                    'amount' => $order->totalAmount,
                    'status' => 'pending',
                ]);

                // Clear user's cart
                if ($request->userId) {
                    $cart = DB::table('carts')->where('userId', $request->userId)->first();
                    if ($cart) {
                        DB::table('cartitems')->where('cartId', $cart->cartId)->delete();
                    }
                }

                DB::commit();
                $vnpUrl = $this->createVnpayUrl($order);
                return response()->json(['success' => true, 'message' => 'Redirect to VNPAY', 'redirectUrl' => $vnpUrl], 200);
            } elseif ($request->paymentMethod === 'stripe') {
                Payment::create([
                    'orderId' => $order->orderId,
                    'method' => 'stripe',
                    'amount' => $order->totalAmount,
                    'status' => 'pending',
                ]);

                // Clear user's cart
                if ($request->userId) {
                    $cart = DB::table('carts')->where('userId', $request->userId)->first();
                    if ($cart) {
                        DB::table('cartitems')->where('cartId', $cart->cartId)->delete();
                    }
                }

                DB::commit();

                \Stripe\Stripe::setApiKey(config('stripe.sk'));
                
                $lineItems = [];
                foreach ($request->cartItems as $item) {
                     $lineItems[] = [
                        'price_data' => [
                            'currency' => 'vnd',
                            'product_data' => [
                                'name' => 'Product ID: ' . $item['productId'],
                            ],
                            'unit_amount' => $item['price'], 
                        ],
                        'quantity' => $item['quantity'],
                     ];
                }

                $session = \Stripe\Checkout\Session::create([
                    'payment_method_types' => ['card'],
                    'line_items' => $lineItems,
                    'mode' => 'payment',
                    'success_url' => url('/api/stripe-return?session_id={CHECKOUT_SESSION_ID}'),
                    'cancel_url' => url('/api/checkout-cancel'),
                ]);

                return response()->json(['success' => true, 'message' => 'Redirect to Stripe', 'redirectUrl' => $session->url], 200);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);
            return response()->json(['message' => 'Order creation failed', 'error' => $e->getMessage()], 500);
        }
    }

    private function createVnpayUrl($order)
    {
        $vnp_Url = config('vnpay.url');
        $vnp_Returnurl = url(config('vnpay.return_url'));
        $vnp_TmnCode = config('vnpay.tmn_code');
        $vnp_HashSecret = config('vnpay.hash_secret');

        $vnp_TxnRef = $order->orderId; 
        $vnp_OrderInfo = "Thanh toan don hang #" . $order->orderId;
        $vnp_OrderType = "billpayment";
        $vnp_Amount = $order->totalAmount * 100;
        $vnp_Locale = 'vn';
        $vnp_BankCode = 'NCB';
        $vnp_IpAddr = request()->ip();

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return $vnp_Url;
    }

    public function vnpayReturn(Request $request)
    {
        $vnp_SecureHash = $request->vnp_SecureHash;
        $inputData = array();
        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }
        
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $vnp_HashSecret = config('vnpay.hash_secret');
        $secureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);

        if ($secureHash == $vnp_SecureHash) {
            if ($request->vnp_ResponseCode == '00') {
                $orderId = $request->vnp_TxnRef;
                $payment = Payment::where('orderId', $orderId)->first();
                if ($payment) {
                    $payment->status = 'success';
                    $payment->transactionCode = $request->vnp_TransactionNo;
                    $payment->save();

                    $order = Order::find($orderId);
                    if ($order) {
                        $order->status = 'processing'; 
                        $order->save();
                    }
                }
                return redirect('/orders')->with('success', 'Thanh toán VNPay thành công! Đơn hàng của bạn đang được xử lý.');
            } else {
                $orderId = $request->vnp_TxnRef;
                Payment::where('orderId', $orderId)->update(['status' => 'failed']);
                return redirect('/orders')->with('error', 'Thanh toán VNPay thất bại. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.');
            }
        } else {
            return redirect('/orders')->with('error', 'Giao dịch không hợp lệ.');
        }
    }

    public function stripeReturn(Request $request)
    {
        $sessionId = $request->session_id;
        if (!$sessionId) {
            return response()->json(['message' => 'Missing session_id'], 400);
        }

        \Stripe\Stripe::setApiKey(config('stripe.sk'));
        
        try {
            $session = \Stripe\Checkout\Session::retrieve($sessionId);
            
            if ($session->payment_status == 'paid') {
                return redirect('/orders')->with('success', 'Thanh toán Stripe thành công! Cảm ơn bạn đã mua hàng.');
            } else {
                return redirect('/orders')->with('error', 'Thanh toán Stripe thất bại hoặc chưa hoàn tất.');
            }

        } catch (\Exception $e) {
            return redirect('/orders')->with('error', 'Lỗi xử lý thanh toán Stripe: ' . $e->getMessage());
        }
    }

    // ===== ADMIN FUNCTIONS =====
    
    public function adminIndex(Request $request)
    {
        $query = Order::with(['user:userId,fullName,email', 'items.product:productId,name,imageUrl']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('customerName', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('from_date')) {
            $query->whereDate('createdAt', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('createdAt', '<=', $request->to_date);
        }

        $orders = $query->orderBy('createdAt', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipping,completed,cancelled'
        ]);

        $order = Order::findOrFail($id);
        
        if (in_array($order->status, ['cancelled', 'completed'])) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể cập nhật đơn hàng đã ' . ($order->status === 'cancelled' ? 'hủy' : 'hoàn thành')
            ], 400);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công',
            'data' => $order->load('items.product')
        ]);
    }

    public function statistics(Request $request)
    {
        // Nếu có from_date và to_date thì filter, không thì lấy ALL
        $query = Order::query();
        
        if ($request->filled('from_date') && $request->filled('to_date')) {
            $fromDate = $request->input('from_date');
            $toDate = $request->input('to_date');
            
            $stats = [
                'total_orders' => Order::whereBetween('createdAt', [$fromDate, $toDate])->count(),
                'pending' => Order::where('status', 'pending')->whereBetween('createdAt', [$fromDate, $toDate])->count(),
                'processing' => Order::where('status', 'processing')->whereBetween('createdAt', [$fromDate, $toDate])->count(),
                'shipping' => Order::where('status', 'shipping')->whereBetween('createdAt', [$fromDate, $toDate])->count(),
                'completed' => Order::where('status', 'completed')->whereBetween('createdAt', [$fromDate, $toDate])->count(),
                'cancelled' => Order::where('status', 'cancelled')->whereBetween('createdAt', [$fromDate, $toDate])->count(),
                'total_revenue' => Order::whereIn('status', ['completed', 'processing', 'shipping'])
                    ->whereBetween('createdAt', [$fromDate, $toDate])
                    ->sum('totalAmount'),
            ];
        } else {
            // Mặc định lấy TẤT CẢ
            $stats = [
                'total_orders' => Order::count(),
                'pending' => Order::where('status', 'pending')->count(),
                'processing' => Order::where('status', 'processing')->count(),
                'shipping' => Order::where('status', 'shipping')->count(),
                'completed' => Order::where('status', 'completed')->count(),
                'cancelled' => Order::where('status', 'cancelled')->count(),
                'total_revenue' => Order::whereIn('status', ['completed', 'processing', 'shipping'])
                    ->sum('totalAmount'),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}