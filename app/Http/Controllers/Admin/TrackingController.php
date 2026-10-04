<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\MetaCapiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrackingController extends Controller
{
    /** Display the dedicated tracking management page. */
    public function index()
    {
        return Inertia::render('Admin/Tracking', [
            'settings' => Setting::pluck('value', 'key'),
        ]);
    }

    /** Update tracking settings. */
    public function update(Request $request)
    {
        // Auto-trim string inputs to prevent whitespace validation failures
        $input = $request->all();
        foreach ($input as $k => $v) {
            if (is_string($v)) {
                $input[$k] = trim($v);
            }
        }
        $request->replace($input);

        $data = $request->validate([
            'tracking_gtm_id'               => ['nullable', 'string', 'max:50', 'regex:/^(|GTM-[A-Z0-9]+)$/i'],
            'tracking_ga4_id'               => ['nullable', 'string', 'max:50', 'regex:/^(|G-[A-Z0-9]+)$/i'],
            'tracking_ga4_api_secret'       => ['nullable', 'string', 'max:120'],
            'tracking_meta_pixel_id'        => ['nullable', 'string', 'max:50', 'regex:/^(|[A-Za-z0-9_-]+)$/'],
            'tracking_meta_capi_enabled'    => ['nullable', 'boolean'],
            'tracking_meta_capi_token'      => ['nullable', 'string', 'max:2000'],
            'tracking_meta_test_event_code' => ['nullable', 'string', 'max:50'],
            'meta_domain_verification'      => ['nullable', 'string', 'max:500'],
            'tracking_google_ads_id'        => ['nullable', 'string', 'max:50'],
            'tracking_google_ads_label'     => ['nullable', 'string', 'max:100'],
            'tracking_tiktok_pixel_id'      => ['nullable', 'string', 'max:50'],
            'custom_header_scripts'         => ['nullable', 'string', 'max:50000'],
            'custom_body_scripts'           => ['nullable', 'string', 'max:50000'],
        ]);

        $keys = [
            'tracking_gtm_id',
            'tracking_ga4_id',
            'tracking_ga4_api_secret',
            'tracking_meta_pixel_id',
            'tracking_meta_capi_token',
            'tracking_meta_test_event_code',
            'meta_domain_verification',
            'tracking_google_ads_id',
            'tracking_google_ads_label',
            'tracking_tiktok_pixel_id',
            'custom_header_scripts',
            'custom_body_scripts',
        ];

        foreach ($keys as $key) {
            if (! array_key_exists($key, $data)) {
                continue;
            }
            $value = (string) ($data[$key] ?? '');
            if (in_array($key, ['tracking_gtm_id', 'tracking_ga4_id'], true) && $value !== '') {
                $value = strtoupper($value);
            }
            Setting::put($key, $value);
        }

        Setting::put('tracking_meta_capi_enabled', $request->boolean('tracking_meta_capi_enabled') ? '1' : '0');

        $message = 'Tracking settings updated successfully.';

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'message'         => $message,
                'tracking_active' => tracking_any_enabled(),
            ]);
        }

        return back()->with('status', $message);
    }

    /** Test Meta Conversions API (CAPI) connection. */
    public function testMetaCapi(Request $request)
    {
        $validated = $request->validate([
            'pixel_id'        => ['required', 'string'],
            'access_token'    => ['required', 'string'],
            'test_event_code' => ['nullable', 'string'],
        ]);

        $result = MetaCapiService::testConnection(
            $validated['pixel_id'],
            $validated['access_token'],
            $validated['test_event_code'] ?? null
        );

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json($result, $result['success'] ? 200 : 422);
        }

        if ($result['success']) {
            return back()->with('status', $result['message']);
        }

        return back()->withErrors(['meta_capi' => $result['message']]);
    }
}
