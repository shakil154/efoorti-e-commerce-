<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $guarded = [];

    protected $casts = [
        'price_delta'   => 'decimal:2',
        'regular_price' => 'decimal:2',
        'sale_price'    => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function imageUrl(): ?string
    {
        return $this->image_path ? image_url($this->image_path, $this->value) : null;
    }

    public function isOnSale(): bool
    {
        return $this->sale_price !== null && $this->regular_price !== null && (float) $this->sale_price < (float) $this->regular_price && (float) $this->sale_price > 0;
    }

    public function effectiveSellingPrice(): ?float
    {
        if ($this->sale_price !== null && (float) $this->sale_price > 0) {
            return (float) $this->sale_price;
        }
        if ($this->regular_price !== null && (float) $this->regular_price > 0) {
            return (float) $this->regular_price;
        }
        return null;
    }

    public function effectiveRegularPrice(): ?float
    {
        if ($this->regular_price !== null && (float) $this->regular_price > 0) {
            return (float) $this->regular_price;
        }
        return null;
    }
}
