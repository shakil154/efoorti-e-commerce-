<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReviewScreenshot;
use App\Models\Setting;
use App\Support\PublicUploader;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewScreenshotController extends Controller
{
    public function index(Request $request)
    {
        $screenshots = ReviewScreenshot::orderBy('position')
            ->orderByDesc('id')
            ->get();

        $settings = [
            'enabled'  => setting('review_screenshots_enabled', '1') === '1',
            'title'    => setting('review_screenshots_title', 'Customer Reviews & Feedback'),
            'subtitle' => setting('review_screenshots_subtitle', 'আমাদের সম্মানিত কাস্টমারদের বাস্তব অভিজ্ঞতা ও রিভিউ'),
            'autoplay' => setting('review_screenshots_autoplay', '1') === '1',
            'speed'    => setting('review_screenshots_speed', 'normal'),
        ];

        return Inertia::render('Admin/ReviewScreenshots/Index', [
            'screenshots' => $screenshots,
            'platforms'   => ReviewScreenshot::PLATFORMS,
            'settings'    => $settings,
            'counts'      => [
                'total'    => $screenshots->count(),
                'active'   => $screenshots->where('is_active', true)->count(),
                'inactive' => $screenshots->where('is_active', false)->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request, isUpdate: false);

        $imagePath = $this->resolveImage($request);

        if (! $imagePath && ! $request->filled('image_url')) {
            return back()->withErrors(['image_file' => 'অনুগ্রহ করে রিভিউ স্ক্রিনশটের ছবি আপলোড করুন (Please upload screenshot image).']);
        }

        $reviewScreenshot = ReviewScreenshot::create([
            'title'         => $data['title'] ?? null,
            'customer_name' => $data['customer_name'] ?? null,
            'review_text'   => $data['review_text'] ?? null,
            'image'         => $imagePath ?: $request->input('image_url'),
            'platform'      => $data['platform'] ?? 'facebook',
            'rating'        => $data['rating'] ?? 5,
            'badge'         => $data['badge'] ?? null,
            'position'      => $data['position'] ?? 0,
            'is_active'     => $request->boolean('is_active', true),
        ]);

        return back()->with('status', 'Review screenshot uploaded successfully.');
    }

    public function update(Request $request, ReviewScreenshot $reviewScreenshot)
    {
        $data = $this->validateData($request, isUpdate: true);

        $updatePayload = [
            'title'         => $data['title'] ?? null,
            'customer_name' => $data['customer_name'] ?? null,
            'review_text'   => $data['review_text'] ?? null,
            'platform'      => $data['platform'] ?? 'facebook',
            'rating'        => $data['rating'] ?? 5,
            'badge'         => $data['badge'] ?? null,
            'position'      => $data['position'] ?? 0,
            'is_active'     => $request->boolean('is_active', true),
        ];

        $newImagePath = $this->resolveImage($request);
        if ($newImagePath) {
            $this->deleteStoredImage($reviewScreenshot->image);
            $updatePayload['image'] = $newImagePath;
        } elseif ($request->filled('image_url') && $request->input('image_url') !== $reviewScreenshot->image) {
            $updatePayload['image'] = $request->input('image_url');
        }

        $reviewScreenshot->update($updatePayload);

        return back()->with('status', 'Review screenshot updated successfully.');
    }

    public function toggle(ReviewScreenshot $reviewScreenshot)
    {
        $reviewScreenshot->update([
            'is_active' => ! $reviewScreenshot->is_active,
        ]);

        return back()->with('status', $reviewScreenshot->is_active ? 'Screenshot is now visible on storefront.' : 'Screenshot hidden from storefront.');
    }

    public function destroy(ReviewScreenshot $reviewScreenshot)
    {
        $this->deleteStoredImage($reviewScreenshot->image);
        $reviewScreenshot->delete();

        return back()->with('status', 'Review screenshot deleted.');
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'orders'   => ['required', 'array'],
            'orders.*.id' => ['required', 'integer', 'exists:review_screenshots,id'],
            'orders.*.position' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($data['orders'] as $item) {
            ReviewScreenshot::where('id', $item['id'])->update(['position' => $item['position']]);
        }

        return back()->with('status', 'Order positions saved.');
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'title'    => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            'speed'    => ['nullable', 'string', 'in:slow,normal,fast'],
        ]);

        if ($request->has('enabled')) {
            Setting::put('review_screenshots_enabled', $request->boolean('enabled') ? '1' : '0');
        }
        if ($request->has('title')) {
            Setting::put('review_screenshots_title', (string) $request->input('title', 'Customer Reviews & Feedback'));
        }
        if ($request->has('subtitle')) {
            Setting::put('review_screenshots_subtitle', (string) $request->input('subtitle', 'আমাদের সম্মানিত কাস্টমারদের বাস্তব অভিজ্ঞতা ও রিভিউ'));
        }
        if ($request->has('autoplay')) {
            Setting::put('review_screenshots_autoplay', $request->boolean('autoplay') ? '1' : '0');
        }
        if ($request->has('speed')) {
            Setting::put('review_screenshots_speed', (string) $request->input('speed', 'normal'));
        }

        Setting::forgetCache();

        if ($request->has('enabled') && ! $request->has('title') && ! $request->has('autoplay') && ! $request->has('speed')) {
            $statusText = $request->boolean('enabled') ? 'হোমপেজে চালু করা হয়েছে (ON)' : 'হোমপেজ থেকে বন্ধ করা হয়েছে (OFF)';
            return back()->with('status', "রিভিউ স্ক্রিনশট সেকশন {$statusText}");
        }

        $autoplayStatus = setting('review_screenshots_autoplay', '1') === '1' ? 'চালু (ON)' : 'বন্ধ (OFF)';
        return back()->with('status', "রিভিউ সেটিংস আপডেট হয়েছে।");
    }

    private function validateData(Request $request, bool $isUpdate = false): array
    {
        $request->merge([
            'title'         => filled($request->input('title')) ? trim((string) $request->input('title')) : null,
            'customer_name' => filled($request->input('customer_name')) ? trim((string) $request->input('customer_name')) : null,
            'review_text'   => filled($request->input('review_text')) ? trim((string) $request->input('review_text')) : null,
            'badge'         => filled($request->input('badge')) ? trim((string) $request->input('badge')) : null,
            'position'      => is_numeric($request->input('position')) ? (int) $request->input('position') : 0,
            'rating'        => is_numeric($request->input('rating')) ? max(1, min(5, (int) $request->input('rating'))) : 5,
        ]);

        return $request->validate([
            'title'         => ['nullable', 'string', 'max:255'],
            'customer_name' => ['nullable', 'string', 'max:120'],
            'review_text'   => ['nullable', 'string', 'max:1000'],
            'platform'      => ['required', 'string', 'in:' . implode(',', array_keys(ReviewScreenshot::PLATFORMS))],
            'rating'        => ['required', 'integer', 'min:1', 'max:5'],
            'badge'         => ['nullable', 'string', 'max:80'],
            'position'      => ['nullable', 'integer', 'min:0'],
            'image_file'    => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:10240'],
            'image_url'     => ['nullable', 'string', 'max:1000'],
        ]);
    }

    private function resolveImage(Request $request): ?string
    {
        if ($path = PublicUploader::storeFromRequest($request, 'image_file', 'review_screenshots', 'png')) {
            return $path;
        }

        return null;
    }

    private function deleteStoredImage(?string $path): void
    {
        if (! $path || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return;
        }

        $relative = ltrim($path, '/');
        PublicUploader::delete($relative);
    }
}
