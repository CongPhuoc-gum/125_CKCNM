<?php

return [
    'tmn_code' => env('VNPAY_TMN_CODE'),
    'hash_secret' => env('VNPAY_HASH_SECRET'),
    'url' => env('VNPAY_URL'),
    'return_url' => env('VNPAY_RETURN_URL', '/api/vnpay-return'),
];
