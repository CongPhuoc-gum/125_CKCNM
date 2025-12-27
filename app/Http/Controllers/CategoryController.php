<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\Category\CreateRequest;
use App\Http\Requests\Category\UpdateRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(Request $request)
    {
        $categories = Category::with('products')->orderBy('categoryId', 'desc')->get();
        
        return CategoryResource::collection($categories);
    }

    /**
     * Store a newly created category.
     */
    public function store(CreateRequest $request)
    {
        $validated = $request->validated();
        
        $category = Category::create([
            'name' => $validated['name'],
            'imageUrl' => $validated['imageUrl'] ?? null,
            'status' => $validated['status'] ?? true,
            'createdAt' => now()
        ]);

        return new CategoryResource($category);
    }

    /**
     * Display the specified category.
     */
    public function show($id)
    {
        $category = Category::with('products')->find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        return new CategoryResource($category);
    }

    /**
     * Update the specified category.
     */
    public function update(UpdateRequest $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        $validated = $request->validated();
        $category->update($validated);

        return new CategoryResource($category);
    }

    /**
     * Remove the specified category.
     */
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ], 200);
    }
}
