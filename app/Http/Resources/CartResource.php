<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'cartId' => $this->cartId,
            'userId' => $this->userId,
            'createdAt' => $this->createdAt,
            'cartitems' => $this->whenLoaded('cartitems', function () {
                return $this->cartitems->map(function ($item) {
                    $data = [
                        'cartItemId' => $item->cartItemId,
                        'productId' => $item->productId,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                    ];
                    
                    // Thêm product info nếu relationship được load
                    if ($item->relationLoaded('product')) {
                        $data['product'] = [
                            'productId' => $item->product->productId,
                            'name' => $item->product->name,
                            'price' => $item->product->price,
                            'imageUrl' => $item->product->imageUrl,
                        ];
                    }
                    
                    return $data;
                });
            }),
        ];
    }
}