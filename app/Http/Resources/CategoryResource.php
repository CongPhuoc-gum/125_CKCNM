<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'categoryId' => $this->categoryId,
            'name' => $this->name,
            'imageUrl' => $this->imageUrl,
            'status' => $this->status,
            'createdAt' => $this->createdAt,
            'products_count' => $this->whenLoaded('products', function () {
                return $this->products->count();
            }),
        ];
    }

 
    public function withResponse($request, $response)
    {
        $response->setEncodingOptions(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
