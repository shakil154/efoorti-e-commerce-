<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title inertia>{{ site_name() }}</title>
    <meta name="site-name" content="{{ site_name() }}" />
    <link rel="icon" href="{{ favicon_url() }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    @php
        $activeBrandColor = setting('admin_primary_color', '#f97316');
        $savedLinkColor = setting('admin_link_color', '');
        $activeLinkColor = $savedLinkColor ?: $activeBrandColor;
        $savedHeaderNavBg = setting('header_nav_bg', '');
        $savedHeaderNavText = setting('header_nav_text', '');
        $savedHeaderNavHover = setting('header_nav_hover', '');
    @endphp
    <style id="theme-root-variables">
        :root {
            --brand-primary: {{ $activeBrandColor }};
            --brand-primary-hover: color-mix(in srgb, {{ $activeBrandColor }} 85%, black);
            --brand-primary-light: color-mix(in srgb, {{ $activeBrandColor }} 12%, white);
            --brand-primary-border: color-mix(in srgb, {{ $activeBrandColor }} 30%, white);
            --brand-primary-shadow: color-mix(in srgb, {{ $activeBrandColor }} 25%, transparent);
            --brand-primary-subtle: color-mix(in srgb, {{ $activeBrandColor }} 10%, transparent);
            --admin-primary: {{ $activeBrandColor }};
            --admin-primary-hover: color-mix(in srgb, {{ $activeBrandColor }} 85%, black);
            --admin-primary-light: color-mix(in srgb, {{ $activeBrandColor }} 12%, white);
            --admin-primary-border: color-mix(in srgb, {{ $activeBrandColor }} 30%, white);
            --admin-primary-shadow: color-mix(in srgb, {{ $activeBrandColor }} 25%, transparent);
            --brand-link: {{ $activeLinkColor }};
            --brand-link-hover: color-mix(in srgb, {{ $activeLinkColor }} 80%, black);
            --header-nav-bg: {{ $savedHeaderNavBg ?: '#0A2A22' }};
            --header-nav-text: {{ $savedHeaderNavText ?: '#ffffff' }};
            --header-nav-hover: {{ $savedHeaderNavHover ?: '#fbbf24' }};
        }
    </style>
    @include('partials.tracking-head')
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="antialiased">
    @include('partials.tracking-body')
    @inertia
</body>
</html>
