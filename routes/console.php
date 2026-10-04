<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('credit:code {seed? : The dynamic seed shown in admin (e.g. PJ-XXXX)}', function (?string $seed = null) {
    if (empty($seed)) {
        $seed = \App\Services\CreditSecurityService::getCurrentSeed();
        $this->info("No seed specified. Using current store seed: [{$seed}]");
    } else {
        $seed = strtoupper(trim($seed));
        $this->info("Calculating verification code for seed: [{$seed}]");
    }

    $code = \App\Services\CreditSecurityService::generateCodeForSeed($seed);

    $this->newLine();
    $this->line(" =========================================");
    $this->line("  Projoss Single-Use Authorization Code   ");
    $this->line(" =========================================");
    $this->info("  Request Seed : {$seed}");
    $this->warn("  Security Code: {$code}");
    $this->line(" =========================================");
    $this->comment("  Note: This code can ONLY be used once.");
    $this->comment("  Once saved, this code is permanently burned.");
    $this->newLine();
})->purpose('Generate a single-use verification code for footer credit customization');

Artisan::command('credit:licenses', function () {
    $licenses = \App\Services\CreditSecurityService::UNIVERSAL_LICENSES;

    $this->newLine();
    $this->line(" ==========================================================================");
    $this->info("   PROJOSS UNIVERSAL WHITELABEL LICENSES (VALID ON UNLIMITED DOMAINS)      ");
    $this->line(" ==========================================================================");
    foreach ($licenses as $idx => $lic) {
        $num = str_pad((string) ($idx + 1), 2, '0', STR_PAD_LEFT);
        $this->line("  [#{$num}]  <fg=yellow>{$lic}</>");
    }
    $this->line(" ==========================================================================");
    $this->comment("  Any of these 10 licenses will work on ANY domain to authorize whitelabeling.");
    $this->newLine();
})->purpose('List official pre-built Projoss universal whitelabel license keys');

