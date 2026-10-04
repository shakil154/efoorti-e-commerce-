<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Support\PublicUploader;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $query = Brand::withCount('products')->orderBy('name');

        if ($q = trim((string) $request->input('q'))) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('slug', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->input('status') === 'active');
        }

        $brands = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Brands/Index', [
            'brands'  => $brands,
            'filters' => [
                'q'      => $request->input('q', ''),
                'status' => $request->input('status', ''),
            ],
            'metrics' => [
                'total'    => Brand::count(),
                'active'   => Brand::where('is_active', true)->count(),
                'featured' => Brand::where('is_featured', true)->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:120'],
            'slug'        => ['nullable', 'string', 'max:140', 'unique:brands,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'website'     => ['nullable', 'url', 'max:255'],
            'is_active'   => ['boolean'],
            'is_featured' => ['boolean'],
            'logo'        => ['nullable', 'image', 'max:3072'],
        ]);

        $slug = ! empty($validated['slug'])
            ? Brand::generateUniqueSlug($validated['slug'])
            : Brand::generateUniqueSlug($validated['name']);

        $logoPath = null;
        if ($uploaded = PublicUploader::storeFromRequest($request, 'logo', 'brands')) {
            $logoPath = $uploaded;
        }

        $brand = Brand::create([
            'name'        => $validated['name'],
            'slug'        => $slug,
            'description' => $validated['description'] ?? null,
            'website'     => $validated['website'] ?? null,
            'is_active'   => $validated['is_active'] ?? true,
            'is_featured' => $validated['is_featured'] ?? false,
            'logo_path'   => $logoPath,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'brand'   => $brand,
                'message' => 'Brand created successfully.',
            ]);
        }

        return redirect()->route('admin.brands.index')->with('status', 'Brand created successfully.');
    }

    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:120'],
            'slug'        => ['nullable', 'string', 'max:140', Rule::unique('brands', 'slug')->ignore($brand->id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'website'     => ['nullable', 'url', 'max:255'],
            'is_active'   => ['boolean'],
            'is_featured' => ['boolean'],
            'logo'        => ['nullable', 'image', 'max:3072'],
            'remove_logo' => ['boolean'],
        ]);

        $slug = ! empty($validated['slug'])
            ? Brand::generateUniqueSlug($validated['slug'], $brand->id)
            : Brand::generateUniqueSlug($validated['name'], $brand->id);

        $logoPath = $brand->logo_path;

        if (! empty($validated['remove_logo'])) {
            if ($logoPath) {
                PublicUploader::delete($logoPath);
            }
            $logoPath = null;
        } elseif ($uploaded = PublicUploader::storeFromRequest($request, 'logo', 'brands')) {
            if ($logoPath) {
                PublicUploader::delete($logoPath);
            }
            $logoPath = $uploaded;
        }

        $brand->update([
            'name'        => $validated['name'],
            'slug'        => $slug,
            'description' => $validated['description'] ?? null,
            'website'     => $validated['website'] ?? null,
            'is_active'   => $validated['is_active'] ?? true,
            'is_featured' => $validated['is_featured'] ?? false,
            'logo_path'   => $logoPath,
        ]);

        return redirect()->route('admin.brands.index')->with('status', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand)
    {
        if ($brand->logo_path) {
            PublicUploader::delete($brand->logo_path);
        }

        $brand->delete();

        return redirect()->route('admin.brands.index')->with('status', 'Brand deleted successfully.');
    }

    public function toggleStatus(Brand $brand)
    {
        $brand->update(['is_active' => ! $brand->is_active]);

        return back()->with('status', 'Brand status updated.');
    }
}
