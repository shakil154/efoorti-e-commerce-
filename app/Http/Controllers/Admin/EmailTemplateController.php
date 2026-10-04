<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\EmailTemplateService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailTemplateController extends Controller
{
    /**
     * Display the email templates manager.
     */
    public function index(Request $request): Response
    {
        $templates = EmailTemplateService::getTemplates();
        $keys = array_keys($templates);
        $activeKey = $request->query('template', $keys[0] ?? 'order_placed');

        if (! isset($templates[$activeKey])) {
            $activeKey = $keys[0] ?? 'order_placed';
        }

        return Inertia::render('Admin/EmailTemplates/Index', [
            'templates'       => $templates,
            'activeKey'       => $activeKey,
            'sampleVariables' => EmailTemplateService::getSampleVariables($activeKey),
            'adminEmail'      => (string) (setting('mail_admin_order_recipients') ?: setting('contact_email') ?: auth()->user()->email ?? ''),
            'adminOrderRecipients' => (string) setting('mail_admin_order_recipients', ''),
        ]);
    }

    /**
     * Update an email template configuration.
     */
    public function update(Request $request, string $key)
    {
        $validated = $request->validate([
            'is_enabled'              => ['nullable', 'boolean'],
            'admin_order_recipients'  => ['nullable', 'string', 'max:500'],
            'subject'                 => ['required', 'string', 'max:255'],
            'heading'      => ['required', 'string', 'max:255'],
            'greeting'     => ['nullable', 'string', 'max:255'],
            'body'         => ['required', 'string'],
            'accent_color' => ['nullable', 'string', 'max:30'],
            'button_text'  => ['nullable', 'string', 'max:100'],
            'button_url'   => ['nullable', 'string', 'max:500'],
            'footer_text'  => ['nullable', 'string', 'max:1000'],
        ]);

        EmailTemplateService::updateTemplate($key, $validated);

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'success'  => true,
                'message'  => 'Email template saved successfully.',
                'template' => EmailTemplateService::getTemplate($key),
            ]);
        }

        return back()->with('status', 'Email template updated successfully.');
    }

    /**
     * Reset an email template back to defaults.
     */
    public function reset(Request $request, string $key)
    {
        EmailTemplateService::resetTemplate($key);

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'success'  => true,
                'message'  => 'Email template reset to default values.',
                'template' => EmailTemplateService::getTemplate($key),
            ]);
        }

        return back()->with('status', 'Email template reset to factory default.');
    }

    /**
     * Render raw HTML preview of the email template for live iframe rendering.
     */
    public function preview(Request $request, string $key)
    {
        $overrides = $request->only([
            'subject', 'heading', 'greeting', 'body', 'accent_color',
            'button_text', 'button_url', 'footer_text'
        ]);

        // Clean out nulls
        $overrides = array_filter($overrides, fn ($v) => $v !== null);

        $variables = EmailTemplateService::getSampleVariables($key);
        $html = EmailTemplateService::renderHtml($key, $variables, $overrides ?: null);

        return response($html)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    /**
     * Send a test email of the specified template.
     */
    public function test(Request $request, string $key)
    {
        $to = $request->validate([
            'test_email' => ['required', 'email']
        ])['test_email'];

        $overrides = $request->input('overrides', []);
        if (! is_array($overrides)) {
            $overrides = [];
        }

        try {
            EmailTemplateService::sendTest($key, $to, $overrides ?: null);

            $msg = "Preview email of '{$key}' sent successfully to {$to}!";
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => $msg,
                ]);
            }

            return back()->with('status', $msg);
        } catch (\Throwable $e) {
            $err = 'Send test email failed: ' . $e->getMessage();
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => $err,
                ], 422);
            }

            return back()->withErrors(['test_email' => $err]);
        }
    }
}
