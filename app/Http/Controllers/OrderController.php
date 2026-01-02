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

    public function show($id)
    {
        $order = Order::with(['items.product', 'payment'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    public function cancel($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Cannot cancel order that is not pending'], 400);
        }

        $order->status = 'cancelled';
        $order->save();
        

        return response()->json(['message' => 'Order cancelled successfully', 'order' => $order]);
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
                'userId' => $request->userId, // Có thể lấy Auth::id() nếu đã login
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
                DB::commit();
                return response()->json(['message' => 'Order created successfully', 'orderId' => $order->orderId], 201);
            } elseif ($request->paymentMethod === 'vnpay') {
                Payment::create([
                    'orderId' => $order->orderId,
                    'method' => 'vnpay',
                    'amount' => $order->totalAmount,
                    'status' => 'pending',
                ]);
                DB::commit();

                
                $vnpUrl = $this->createVnpayUrl($order);
                return response()->json(['message' => 'Redirect to VNPAY', 'url' => $vnpUrl], 200);
            } elseif ($request->paymentMethod === 'stripe') {
                Payment::create([
                    'orderId' => $order->orderId,
                    'method' => 'stripe',
                    'amount' => $order->totalAmount,
                    'status' => 'pending',
                ]);
                DB::commit();

                // Stripe Checkout
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
                    'cancel_url' => url('/api/checkout-cancel'), // Tạm
                ]);

                return response()->json(['message' => 'Redirect to Stripe', 'url' => $session->url], 200);
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
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);
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
                // Thanh cong
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
                return response()->json(['message' => 'Payment successful', 'data' => $request->all()], 200);
            } else {
                // That bai
                 $orderId = $request->vnp_TxnRef;
                 Payment::where('orderId', $orderId)->update(['status' => 'failed']);
                return response()->json(['message' => 'Payment failed', 'data' => $request->all()], 400);
            }
        } else {
            return response()->json(['message' => 'Invalid signature'], 400);
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
                 
                 return response()->json(['message' => 'Stripe Payment successful', 'data' => $session]);
            } else {
                return response()->json(['message' => 'Stripe Payment failed or unpaid'], 400);
            }

        } catch (\Exception $e) {
            return response()->json(['message' => 'Stripe Error', 'error' => $e->getMessage()], 500);
        }
    }
}
