<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Str;

class CreditSecurityService
{
    /**
     * Get or initialize the current dynamic security seed for this store.
     */
    public static function getCurrentSeed(): string
    {
        $seed = Setting::get('footer_credit_seed');
        if (empty($seed)) {
            $seed = static::generateRandomSeed();
            Setting::put('footer_credit_seed', $seed);
        }
        return $seed;
    }

    /**
     * Generate a new random seed string (e.g. PJ-7K9A).
     */
    public static function generateRandomSeed(): string
    {
        return 'PJ-' . strtoupper(Str::random(4));
    }

    /**
     * Regenerate a new random security seed (burns the previous seed).
     */
    public static function burnAndRegenerateSeed(): string
    {
        $newSeed = static::generateRandomSeed();
        Setting::put('footer_credit_seed', $newSeed);
        return $newSeed;
    }

    /**
     * Calculate the one-time verification code for a specific seed.
     */
    public static function generateCodeForSeed(string $seed): string
    {
        $cleanSeed = strtoupper(trim($seed));
        $secret = config('app.key') . env('AGENCY_MASTER_KEY', 'PROJOSS_SECURITY_MASTER_2026');
        $hash = hash_hmac('sha256', $cleanSeed, $secret);

        // Take 6 uppercase alphanumeric characters
        return strtoupper(substr($hash, 0, 6));
    }

    /**
     * Pre-built official universal licenses (valid on unlimited domains).
     */
    public const UNIVERSAL_LICENSES = [
        'purchase-projoss-wl01-8842-a9f1',
        'purchase-projoss-wl02-3719-d4c6',
        'purchase-projoss-wl03-9150-b8e3',
        'purchase-projoss-wl04-6241-f7a2',
        'purchase-projoss-wl05-5083-c1d9',
        'purchase-projoss-wl06-7492-e3b5',
        'purchase-projoss-wl07-1834-a6f8',
        'purchase-projoss-wl08-4927-d9c1',
        'purchase-projoss-wl09-8305-b2e4',
        'purchase-projoss-wl10-2617-f5a7',
    ];

    /**
     * Verify if the provided code is valid for the current active seed or matches an official license.
     */
    public static function verifyCode(?string $providedCode): bool
    {
        if (empty($providedCode)) {
            return false;
        }

        $inputRaw = trim($providedCode);
        $cleanLower = strtolower($inputRaw);
        $cleanUpper = strtoupper($inputRaw);

        // 1. Check against Pre-built Universal Whitelabel Licenses (Case-insensitive)
        if (in_array($cleanLower, static::UNIVERSAL_LICENSES, true)) {
            return true;
        }

        // Also check if matches purchase-projoss- master prefix pattern
        if (str_starts_with($cleanLower, 'purchase-projoss-')) {
            // Check against custom licenses in .env (comma-separated list if configured)
            $customLicenses = array_map('trim', explode(',', strtolower((string) env('AGENCY_CUSTOM_LICENSES', ''))));
            if (in_array($cleanLower, $customLicenses, true)) {
                return true;
            }
        }

        // 2. Super Master Bypass Key (allows Projoss developers direct access without generating code)
        $masterKey = env('AGENCY_MASTER_KEY', 'PROJOSS_SECRET_2026');
        if ($cleanUpper === strtoupper($masterKey) || $cleanUpper === 'PROJOSS@2026') {
            return true;
        }

        // 3. Dynamic Challenge-Response Code verification
        $currentSeed = static::getCurrentSeed();
        $expectedCode = static::generateCodeForSeed($currentSeed);

        return hash_equals($expectedCode, $cleanUpper);
    }
}
