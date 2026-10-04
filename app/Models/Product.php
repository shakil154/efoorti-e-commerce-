<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'slug',
        'sku',
        'brand',
        'brand_image',
        'short_description',
        'description',
        'regular_price',
        'sale_price',
        'stock_quantity',
        'unit',
        'is_published',
        'is_featured',
        'is_new_arrival',
        'is_best_seller',
        'is_flash_sale',
        'flash_sale_position',
        'is_free_shipping',
        'rating',
        'reviews_count',
        'specifications',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'regular_price'    => 'decimal:2',
        'sale_price'       => 'decimal:2',
        'rating'           => 'decimal:2',
        'is_published'     => 'boolean',
        'is_featured'      => 'boolean',
        'is_new_arrival'   => 'boolean',
        'is_best_seller'   => 'boolean',
        'is_flash_sale'    => 'boolean',
        'is_free_shipping' => 'boolean',
        'specifications'   => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brandRel(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderByDesc('is_primary')->orderBy('position');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class)->latest();
    }

    public function approvedReviews(): HasMany
    {
        return $this->reviews()->approved();
    }

    /** Recompute rating + reviews_count from approved customer reviews. */
    public function recalculateRatingFromReviews(): void
    {
        $approved = $this->reviews()->approved();
        $count = (clone $approved)->count();
        $avg = $count > 0 ? round((float) (clone $approved)->avg('rating'), 2) : 0;

        $this->forceFill([
            'rating'         => $avg,
            'reviews_count'  => $count,
        ])->saveQuietly();
    }

    /* --------- scopes --------- */
    public function scopePublished(Builder $q): Builder
    {
        return $q->where('is_published', true);
    }

    /* --------- pricing helpers --------- */
    public function getPriceAttribute(): float
    {
        return (float) ($this->sale_price ?? $this->regular_price);
    }

    public function getOnSaleAttribute(): bool
    {
        return $this->sale_price !== null && (float) $this->sale_price < (float) $this->regular_price;
    }

    public function getDiscountPercentAttribute(): int
    {
        if (! $this->on_sale || (float) $this->regular_price <= 0) {
            return 0;
        }
        return (int) round(100 - ($this->price / (float) $this->regular_price * 100));
    }


    /**
     * Parse a cart/storefront variant label ("Size: M, Color: Black" or "Red, XL") into type => value or indexed values.
     *
     * @return array<string, string>
     */
    public static function parseVariantSelection(?string $label): array
    {
        if ($label === null || trim($label) === '') {
            return [];
        }

        $pairs = [];
        foreach (preg_split('/\s*,\s*/', $label) ?: [] as $part) {
            if (str_contains($part, ':')) {
                [$type, $value] = array_map('trim', explode(':', $part, 2));
                if ($type !== '' && $value !== '') {
                    $pairs[$type] = $value;
                }
            } else {
                $trimmed = trim($part);
                if ($trimmed !== '') {
                    $pairs['__val_' . count($pairs)] = $trimmed;
                }
            }
        }

        return $pairs;
    }

    /** Sum of price_delta for selected options (server-authoritative). */
    public function variantPriceAdjustment(?string $variantLabel): float
    {
        if ($variantLabel === null || trim($variantLabel) === '') {
            return 0.0;
        }

        $pairs = self::parseVariantSelection($variantLabel);
        if ($pairs === []) {
            return 0.0;
        }

        $variants = $this->relationLoaded('variants')
            ? $this->variants
            : $this->variants()->get();

        if ($variants->isEmpty()) {
            return 0.0;
        }

        $delta = 0.0;
        foreach ($pairs as $type => $value) {
            if (str_starts_with($type, '__val_')) {
                $match = $variants->first(
                    fn (ProductVariant $v) => strcasecmp((string) $v->value, $value) === 0
                );
            } else {
                $match = $variants->first(
                    fn (ProductVariant $v) => strcasecmp((string) $v->type, $type) === 0
                        && strcasecmp((string) $v->value, $value) === 0
                );
                if (! $match) {
                    // Fallback to match just by value
                    $match = $variants->first(
                        fn (ProductVariant $v) => strcasecmp((string) $v->value, $value) === 0
                    );
                }
            }
            if ($match) {
                $delta += (float) $match->price_delta;
            }
        }

        return $delta;
    }

    /**
     * Get all matched ProductVariant models for a given variant label string.
     *
     * @return \Illuminate\Support\Collection<int, ProductVariant>
     */
    public function getMatchedVariants(?string $variantLabel): \Illuminate\Support\Collection
    {
        if ($variantLabel === null || trim($variantLabel) === '') {
            return collect();
        }

        $pairs = self::parseVariantSelection($variantLabel);
        if ($pairs === []) {
            return collect();
        }

        $variants = $this->relationLoaded('variants')
            ? $this->variants
            : $this->variants()->get();

        if ($variants->isEmpty()) {
            return collect();
        }

        $matched = collect();
        foreach ($pairs as $type => $value) {
            if (str_starts_with($type, '__val_')) {
                $match = $variants->first(
                    fn (ProductVariant $v) => strcasecmp((string) $v->value, $value) === 0
                );
            } else {
                $match = $variants->first(
                    fn (ProductVariant $v) => strcasecmp((string) $v->type, $type) === 0
                        && strcasecmp((string) $v->value, $value) === 0
                );
                if (! $match) {
                    $match = $variants->first(
                        fn (ProductVariant $v) => strcasecmp((string) $v->value, $value) === 0
                    );
                }
            }
            if ($match && ! $matched->contains('id', $match->id)) {
                $matched->push($match);
            }
        }

        return $matched;
    }

    /**
     * Resolve minimum available stock for a variant selection.
     * Returns null if product has no variants or variantLabel is empty (use base stock_quantity).
     */
    public function resolveVariantStock(?string $variantLabel): ?int
    {
        $matched = $this->getMatchedVariants($variantLabel);
        if ($matched->isEmpty()) {
            return null;
        }

        return (int) $matched->min('stock');
    }

    /** Selling unit price for a selected variant combination. */
    public function unitPriceForVariant(?string $variantLabel = null): float
    {
        $matched = $this->getMatchedVariants($variantLabel);
        if ($matched->isNotEmpty()) {
            $explicitVariants = $matched->filter(fn(ProductVariant $v) => $v->effectiveSellingPrice() !== null);
            if ($explicitVariants->isNotEmpty()) {
                $primaryExplicit = $explicitVariants->first(fn(ProductVariant $v) => $v->sale_price !== null && (float) $v->sale_price > 0)
                    ?? $explicitVariants->last();

                $baseVariantPrice = (float) $primaryExplicit->effectiveSellingPrice();
                // Add any delta ONLY from other matched variants that DO NOT have an explicit price
                $otherDelta = (float) $matched
                    ->filter(fn(ProductVariant $v) => $v->id !== $primaryExplicit->id && $v->effectiveSellingPrice() === null)
                    ->sum('price_delta');

                return max(0, $baseVariantPrice + $otherDelta);
            }
        }

        return max(0, (float) $this->price + $this->variantPriceAdjustment($variantLabel));
    }

    /** Compare-at (regular) price with the same variant adjustments, when on sale. */
    public function compareAtPriceForVariant(?string $variantLabel = null): ?float
    {
        $matched = $this->getMatchedVariants($variantLabel);
        if ($matched->isNotEmpty()) {
            $explicitVariants = $matched->filter(fn(ProductVariant $v) => $v->effectiveRegularPrice() !== null);
            if ($explicitVariants->isNotEmpty()) {
                $primaryExplicit = $explicitVariants->last();
                $regularPrice = (float) $primaryExplicit->effectiveRegularPrice();
                $sellingPrice = $this->unitPriceForVariant($variantLabel);

                // Only return compareAt if on sale (regular > selling)
                if ($regularPrice > $sellingPrice) {
                    $otherDelta = (float) $matched
                        ->filter(fn(ProductVariant $v) => $v->id !== $primaryExplicit->id && $v->effectiveRegularPrice() === null)
                        ->sum('price_delta');

                    return max(0, $regularPrice + $otherDelta);
                }

                return null;
            }
        }

        if (! $this->on_sale) {
            return null;
        }

        return max(0, (float) $this->regular_price + $this->variantPriceAdjustment($variantLabel));
    }

    /* --------- image helpers --------- */
    public function primaryImage(): ?ProductImage
    {
        return $this->images->firstWhere('is_primary', true) ?? $this->images->first();
    }

    public function imageUrl(): string
    {
        return image_url($this->primaryImage()?->path, $this->slug);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Resolve route binding accepting both slug (storefront) and numeric ID (admin).
     */
    public function resolveRouteBinding($value, $field = null)
    {
        if ($field !== null) {
            return $this->where($field, $value)->first();
        }

        return $this->where('slug', $value)->first()
            ?? (is_numeric($value) ? $this->where('id', $value)->first() : null);
    }

    /**
     * Normalized specification rows: [['label' => '...', 'value' => '...'], ...]
     */
    public function specificationRows(): array
    {
        $rows = collect($this->specifications ?? [])
            ->map(function ($row) {
                if (is_string($row)) {
                    $row = trim($row);
                    if ($row === '') {
                        return null;
                    }
                    if (str_contains($row, ':')) {
                        [$label, $value] = array_map('trim', explode(':', $row, 2));

                        return ['label' => $label, 'value' => $value];
                    }

                    return ['label' => '', 'value' => $row];
                }

                $label = trim((string) ($row['label'] ?? ''));
                $value = trim((string) ($row['value'] ?? ''));
                if ($label === '' && $value === '') {
                    return null;
                }

                return ['label' => $label, 'value' => $value];
            })
            ->filter()
            ->values()
            ->all();

        return $rows;
    }

    /** Bullet lines for cards / PDP sidebar (e.g. "Model: Ryzen 5"). */
    public function specificationBullets(int $limit = 6): array
    {
        return collect($this->specificationRows())
            ->map(function (array $row) {
                if ($row['label'] !== '' && $row['value'] !== '') {
                    return $row['label'] . ': ' . $row['value'];
                }

                return $row['label'] !== '' ? $row['label'] : $row['value'];
            })
            ->filter()
            ->take($limit)
            ->values()
            ->all();
    }

    /** Whether this product has any variants (used in admin index / storefront card). */
    public function getHasVariantsAttribute(): bool
    {
        if ($this->relationLoaded('variants')) {
            return $this->variants->isNotEmpty();
        }
        return $this->variants()->exists();
    }

    /** Alias for storefront ProductCard (variants_exists). */
    public function getVariantsExistsAttribute(): bool
    {
        return $this->has_variants;
    }
}
