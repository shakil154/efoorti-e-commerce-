<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewScreenshot extends Model
{
    use HasFactory;

    public const PLATFORMS = [
        'facebook'  => 'Facebook / Messenger',
        'whatsapp'  => 'WhatsApp',
        'instagram' => 'Instagram',
        'other'     => 'Other / Direct',
    ];

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'rating'    => 'integer',
        'position'  => 'integer',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function platformLabel(): string
    {
        return self::PLATFORMS[$this->platform] ?? ucfirst($this->platform);
    }

    public function getImageUrlAttribute(): string
    {
        if (! $this->image) {
            return '';
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        $trimmed = ltrim($this->image, '/');

        return asset($trimmed);
    }
}
