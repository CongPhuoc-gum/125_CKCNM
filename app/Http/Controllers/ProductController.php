<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Tìm kiếm theo tên
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        //Lọc theo danh mục
        if ($request->has('categoryId') && $request->categoryId != '') {
            $query->where('categoryId', $request->categoryId);
        }

        // Lọc theo giá
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sắp xếp
        if ($request->has('sort_by')) {
            switch ($request->sort_by) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                default:
                    $query->orderBy('productId', 'desc'); 
                    break;
            }
        } else {
            $query->orderBy('productId', 'desc');
        }

        $products = $query->with('category:categoryId,name')->paginate(10);
        return response()->json($products);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'categoryId' => 'required|exists:categories,categoryId',
            'name' => 'required|string|max:150',
            'price' => 'required|numeric|min:0',
            'quantity' => 'integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->only(['categoryId', 'name', 'price', 'quantity', 'description']);
        $data['status'] = 1;

        if ($request->hasFile('image')) {
            try {
                $path = $request->file('image')->store('products', 'public');
                $data['imageUrl'] = $path;
                Log::info('Image uploaded successfully: ' . $path);
            } catch (\Exception $e) {
                Log::error('Image upload failed: ' . $e->getMessage());
                return response()->json(['message' => 'Failed to upload image', 'error' => $e->getMessage()], 500);
            }
        }

        $product = Product::create($data);

        return response()->json($product, 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Validation rules - tất cả đều optional cho update
        $validator = Validator::make($request->all(), [
            'categoryId' => 'nullable|exists:categories,categoryId',
            'name' => 'nullable|string|max:150',
            'price' => 'nullable|numeric|min:0',
            'quantity' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'nullable|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Lấy data trừ image
        $data = $request->except(['image', '_method']);

        // Xử lý upload ảnh mới
        if ($request->hasFile('image')) {
            try {
                // Xóa ảnh cũ nếu có
                if ($product->imageUrl) {
                    $oldImagePath = $product->imageUrl;
                    
                    if (Storage::disk('public')->exists($oldImagePath)) {
                        Storage::disk('public')->delete($oldImagePath);
                        Log::info('Old image deleted: ' . $oldImagePath);
                    }
                }

                // Upload ảnh mới
                $path = $request->file('image')->store('products', 'public');
                $data['imageUrl'] = $path;
                Log::info('New image uploaded: ' . $path);

            } catch (\Exception $e) {
                Log::error('Image update failed: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Failed to update image', 
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        // Update product
        try {
            $product->update($data);
            
            // Reload product with category
            $product = Product::with('category')->find($id);
            
            return response()->json([
                'message' => 'Product updated successfully',
                'product' => $product
            ], 200);

        } catch (\Exception $e) {
            Log::error('Product update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

/**
 * Remove the specified resource from storage.
 *
 * @param  int  $id
 * @return \Illuminate\Http\Response
 */
public function destroy($id)
{
    $product = Product::find($id);

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    try {
        // ✅ Kiểm tra xem sản phẩm đã có trong đơn hàng chưa
        if ($product->orderitems()->count() > 0) {
            return response()->json([
                'message' => 'Không thể xóa sản phẩm này vì đã có trong đơn hàng. Bạn có thể ẩn sản phẩm thay vì xóa.'
            ], 400);
        }

        // ✅ Xóa reviews của sản phẩm
        $product->reviews()->delete();
        
        // ✅ Xóa cart items chứa sản phẩm này
        $product->cartitems()->delete();

        // ✅ Xóa ảnh nếu có
        if ($product->imageUrl && Storage::disk('public')->exists($product->imageUrl)) {
            Storage::disk('public')->delete($product->imageUrl);
            Log::info('Image deleted: ' . $product->imageUrl);
        }

        // ✅ Xóa sản phẩm
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);

    } catch (\Exception $e) {
        Log::error('Product deletion failed: ' . $e->getMessage());
        Log::error('Stack trace: ' . $e->getTraceAsString()); // ✅ Thêm log chi tiết
        
        return response()->json([
            'message' => 'Có lỗi xảy ra khi xóa sản phẩm',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function bestSelling(Request $request)
    {
        $limit = $request->get('limit', 10);

        $products = Product::withSum('orderitems', 'quantity')
            ->orderBy('orderitems_sum_quantity', 'desc')
            ->take($limit)
            ->get();

        return response()->json($products);
    }
}