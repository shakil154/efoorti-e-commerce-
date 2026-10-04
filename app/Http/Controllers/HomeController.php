<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Feature;
use App\Models\Product;
use App\Models\ReviewScreenshot;

class HomeController extends Controller
{
    public function index()
    {
        $withImages = fn ($q) => $q->published()->with('images', 'category')->withExists('variants');

        $categories = Category::where('is_active', true)
            ->withCount(['products' => fn ($q) => $q->published()])
            ->orderBy('position')
            ->get();

        $banners = fn (string $placement) => Banner::active()
            ->placement($placement)
            ->orderBy('position')
            ->orderBy('id');

        $getSectionProducts = function (string $flagColumn) use ($withImages) {
            $flagged = Product::query()->tap($withImages)->where($flagColumn, true)->latest()->take(10)->get();
            if ($flagged->count() < 5) {
                $needed = 5 - $flagged->count();
                $more = Product::query()
                    ->tap($withImages)
                    ->whereNotIn('id', $flagged->pluck('id'))
                    ->latest()
                    ->take($needed)
                    ->get();
                $flagged = $flagged->concat($more);
            }
            return $flagged;
        };

        $reviewScreenshots = [];
        $reviewsConfig = [
            'enabled'  => setting('review_screenshots_enabled', '1') === '1',
            'title'    => setting('review_screenshots_title', 'Customer Reviews & Feedback'),
            'subtitle' => setting('review_screenshots_subtitle', 'আমাদের সম্মানিত কাস্টমারদের বাস্তব অভিজ্ঞতা ও রিভিউ'),
            'autoplay' => setting('review_screenshots_autoplay', '1') === '1',
            'speed'    => setting('review_screenshots_speed', 'normal'),
        ];

        if ($reviewsConfig['enabled']) {
            $reviewScreenshots = ReviewScreenshot::active()
                ->orderBy('position')
                ->orderByDesc('id')
                ->get();
        }

        return Inertia::render('Storefront/Home', [
            'heroBanners'     => $banners('hero')->get(),
            'heroSideBanner'  => $banners('hero_side')->first(),
            'middleBanners'   => $banners('middle')->get(),
            'features'        => Feature::where('is_active', true)->orderBy('position')->get(),
            'featuredCategories' => $categories,
            'coupons'         => Coupon::query()
                ->where('is_active', true)
                ->orderByDesc('created_at')
                ->get()
                ->filter(fn (Coupon $c) => $c->isCurrentlyActive())
                ->values()
                ->take(4),
            'flashProducts'   => Product::query()->tap($withImages)->where('is_flash_sale', true)->orderBy('flash_sale_position')->orderBy('id')->get(),
            'trending'        => $getSectionProducts('is_featured'),
            'bestSellers'     => $getSectionProducts('is_best_seller'),
            'newArrivals'     => $getSectionProducts('is_new_arrival'),
            'reviewScreenshots' => $reviewScreenshots,
            'reviewScreenshotsConfig' => $reviewsConfig,
        ]);
    }
}
