<?php

namespace App\Services;

use App\Models\EmailOtp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OtpService
{
    private const TTL_MINUTES = 10;

    /**
     * Generate a fresh 6-digit code, store it (hashed) and email it.
     * Returns the plain code (used only to reveal it on screen in the local dev env).
     */
    public function send(string $email, string $purpose = 'register', ?string $name = null): string
    {
        $code = (string) random_int(100000, 999999);

        // Invalidate any outstanding codes for this email + purpose, then store the new one.
        EmailOtp::where('email', $email)->where('purpose', $purpose)->whereNull('consumed_at')->delete();
        EmailOtp::create([
            'email'      => $email,
            'code'       => Hash::make($code),
            'purpose'    => $purpose,
            'expires_at' => now()->addMinutes(self::TTL_MINUTES),
        ]);

        $this->mail($email, $code, $name, $purpose);

        return $code;
    }

    /** Verify a submitted code for the given email + purpose. Consumes it on success. */
    public function verify(string $email, string $code, string $purpose = 'register'): bool
    {
        $otp = EmailOtp::where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->latest()
            ->first();

        if (! $otp || ! $otp->isValid() || ! Hash::check($code, $otp->code)) {
            return false;
        }

        $otp->update(['consumed_at' => now()]);

        return true;
    }

    private function mail(string $email, string $code, ?string $name, string $purpose = 'register'): void
    {
        $siteName = site_name();
        $isReset = ($purpose === 'reset');
        $tplKey = $isReset ? 'password_reset' : 'otp';

        try {
            configure_mail_from_settings();
            $tpl = \App\Services\EmailTemplateService::getTemplate($tplKey);

            if (! empty($tpl['is_enabled'])) {
                $variables = [
                    '{site_name}'              => $siteName,
                    '{otp_code}'               => $code,
                    '{otp_minutes}'            => (string) self::TTL_MINUTES,
                    '{customer_name}'          => $name ?: 'Valued Customer',
                    '{customer_name_greeting}' => $name ? ' ' . $name : '',
                    '{contact_email}'          => (string) setting('contact_email', ''),
                    '{year}'                   => date('Y'),
                ];

                $defaultSubject = $isReset ? "Password Reset Code: {$code} — {$siteName}" : "Your {$siteName} verification code";
                $subject = \App\Services\EmailTemplateService::renderSubject($tplKey, $variables) ?: $defaultSubject;
                $html = \App\Services\EmailTemplateService::renderHtml($tplKey, $variables);

                Mail::html($html, function ($message) use ($email, $subject) {
                    $message->to($email)->subject($subject);
                });
            }
        } catch (\Throwable $e) {
            // Never let a mail transport failure break the user flow; log it so the admin can fix SMTP.
            Log::warning("{$tplKey} email failed to send: " . $e->getMessage());
        }
    }
}
