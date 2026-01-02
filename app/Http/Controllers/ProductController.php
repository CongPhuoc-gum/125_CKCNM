<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->only(['categoryId', 'name', 'price', 'quantity', 'description']);
        $data['status'] = 1;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['imageUrl'] = $path;
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

        $validator = Validator::make($request->all(), [
            'categoryId' => 'exists:categories,categoryId',
            'name' => 'string|max:150',
            'price' => 'numeric|min:0',
            'quantity' => 'integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->except(['image']);

        if ($request->hasFile('image')) {

            if ($product->imageUrl && Storage::disk('public')->exists($product->imageUrl)) {
                Storage::disk('public')->delete($product->imageUrl);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['imageUrl'] = $path;
        }

        $product->update($data);

        return response()->json($product);
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

        if ($product->imageUrl && Storage::disk('public')->exists($product->imageUrl)) {
            Storage::disk('public')->delete($product->imageUrl);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
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
