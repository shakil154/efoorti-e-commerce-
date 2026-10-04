<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images', 'variants'])->orderBy('stock_quantity', 'asc');

        $term = trim((string) $request->input('q'));
        if ($term !== '') {
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('sku', 'like', "%{$term}%")
                  ->orWhereHas('variants', fn($vq) => $vq->where('value', 'like', "%{$term}%"));
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        // Stock level filter: low (1-5), out (0), in (>5)
        $stockParam = $request->input('stock') ?? $request->input('stock_level');
        if (!empty($stockParam)) {
            match ($stockParam) {
                'out'  => $query->where('stock_quantity', 0),
                'low'  => $query->where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 5),
                'in'   => $query->where('stock_quantity', '>', 5),
                default => null,
            };
        }

        return Inertia::render('Admin/Inventory/Index', [
            'products'   => $query->paginate(20)->withQueryString()->through(fn($p) => [
                'id'             => $p->id,
                'name'           => $p->name,
                'sku'            => $p->sku,
                'regular_price'  => $p->regular_price,
                'stock_quantity' => $p->stock_quantity,
                'is_published'   => $p->is_published,
                'category'       => $p->category ? ['name' => $p->category->name] : null,
                'primary_image'  => $p->images->where('is_primary', true)->first()?->path,
                'variants'       => $p->variants->map(fn($v) => [
                    'id'          => $v->id,
                    'type'        => $v->type,
                    'value'       => $v->value,
                    'stock'         => $v->stock,
                    'regular_price' => $v->regular_price,
                    'sale_price'    => $v->sale_price,
                    'price_delta'   => $v->price_delta,
                    'color_code'    => $v->color_code,
                    'image_path'    => $v->image_path,
                ])->values(),
                'has_variants'   => $p->variants->isNotEmpty(),
            ]),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'q'          => $term,
            'category'   => $request->input('category'),
            'stock'      => $stockParam,
            'stock_level'=> $stockParam,
            'summary'    => [
                'total'     => Product::count(),
                'in_stock'  => Product::where('stock_quantity', '>', 5)->count(),
                'low_stock' => Product::where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 5)->count(),
                'out_stock' => Product::where('stock_quantity', 0)->count(),
            ],
        ]);
    }

    public function updateStock(Request $request, Product $product)
    {
        $request->validate(['stock_quantity' => 'required|integer|min:0']);
        $product->update(['stock_quantity' => $request->input('stock_quantity')]);
        return back()->with('status', "Stock updated to {$request->input('stock_quantity')} for \"{$product->name}\"");
    }

    public function updateVariantStock(Request $request, ProductVariant $variant)
    {
        $request->validate(['stock' => 'required|integer|min:0']);
        $variant->update(['stock' => $request->input('stock')]);

        // Auto calculate & sync parent product total stock if desired
        $parent = $variant->product;
        if ($parent && $parent->variants()->count() > 0) {
            $totalVariantStock = (int) $parent->variants()->sum('stock');
            $parent->update(['stock_quantity' => $totalVariantStock]);
        }

        return back()->with('status', "Variant \"{$variant->type}: {$variant->value}\" stock updated to {$variant->stock}");
    }
}
