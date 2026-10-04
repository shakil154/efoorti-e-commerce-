<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    public const PLACEMENTS = [
        'hero'      => 'Hero Main Slider (হিরো মেইন স্লাইডার — সাইজ: 1200x500px)',
        'hero_side' => 'Hero Side Banner (হিরো সাইড ব্যানার — সাইজ: 480x500px)',
        'middle'    => 'Middle Promo Banner (মিডল প্রোমো ব্যানার — সাইজ: 1200x300px)',
    ];

    public const SIZE_GUIDES = [
        'hero' => [
            'name'        => 'Hero Main Slider (মেইন স্লাইডার)',
            'recommended' => '1200 × 500 px',
            'aspect'      => '2.4 : 1 (Wide)',
            'mobile'      => '800 × 450 px (16:9)',
            'description' => 'হোমপেজের মূল স্লাইডার হিসেবে প্রদর্শিত হবে। একাধিক ব্যানার দিলে স্বয়ংক্রিয়ভাবে স্লাইড হবে।',
            'tip'         => 'টেক্সট ও মূল পণ্য ছবির মাঝামাঝি রাখুন যাতে ছোট স্ক্রিন বা মোবাইলেও সম্পূর্ণ দেখা যায়।',
            'badge'       => '1200x500',
        ],
        'hero_side' => [
            'name'        => 'Hero Side Banner (সাইড ব্যানার)',
            'recommended' => '480 × 500 px',
            'aspect'      => '1 : 1 অথবা 4 : 5',
            'mobile'      => '600 × 300 px',
            'description' => 'ডেস্কটপে স্লাইডারের ডানপাশে এবং মোবাইলে স্লাইডারের নিচে আকর্ষণীয় অফার কার্ড হিসেবে দেখাবে।',
            'tip'         => 'হানি নাট, স্পেশাল অফার বা হট ডিল প্রদর্শনের জন্য উপযুক্ত।',
            'badge'       => '480x500',
        ],
        'middle' => [
            'name'        => 'Middle Promo Banner (মাঝের ব্যানার)',
            'recommended' => '1200 × 300 px',
            'aspect'      => '4 : 1 (Ultra Wide)',
            'mobile'      => '800 × 250 px',
            'description' => 'হোমপেজের মাঝখানে সম্পূর্ণ উইডথ জুড়ে কুপন বা বিশেষ প্রচারমূলক ব্যানার।',
            'tip'         => 'ফ্রি ডেলিভারি, মেগা ডিসকাউন্ট বা উৎসবের অফারের জন্য আদর্শ।',
            'badge'       => '1200x300',
        ],
    ];

    public const STYLES = [
        'brand'  => 'Blue (brand)',
        'amber'  => 'Amber / gold',
        'rose'   => 'Rose / pink',
        'accent' => 'Accent gradient',
    ];

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopePlacement(Builder $query, string $placement): Builder
    {
        return $query->where('placement', $placement);
    }

    public function placementLabel(): string
    {
        return explode(' — ', self::PLACEMENTS[$this->placement] ?? $this->placement)[0];
    }

    public function styleLabel(): string
    {
        return self::STYLES[$this->style] ?? $this->style;
    }

    public function linkHref(): string
    {
        if (! $this->link_url) {
            return route('shop');
        }

        return str_starts_with($this->link_url, 'http') ? $this->link_url : url($this->link_url);
    }

    public function imageUrl(): string
    {
        return image_url($this->image, $this->title ?? 'banner');
    }
}
