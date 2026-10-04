@php
  $gtmId            = tracking_gtm_id();
  $ga4Id            = tracking_ga4_id();
  $pixelId          = tracking_meta_pixel_id();
  $googleAdsId      = tracking_google_ads_id();
  $googleAdsLabel   = tracking_google_ads_label();
  $tiktokId         = tracking_tiktok_pixel_id();
  $domainVerification = trim((string) setting('meta_domain_verification', ''));
  $customHead       = setting('custom_header_scripts');
@endphp

{{-- Facebook Domain Verification --}}
@if(!empty($domainVerification))
  @if(str_starts_with($domainVerification, '<meta'))
    {!! $domainVerification !!}
  @else
    <meta name="facebook-domain-verification" content="{{ $domainVerification }}" />
  @endif
@endif

{{-- Inject tracking config for JS (tracking.js reads window.__tracking) --}}
@if($gtmId || $ga4Id || $pixelId || $googleAdsId || $tiktokId)
<script>
window.__tracking = {
  gtm:            @json($gtmId),
  ga4:            @json($ga4Id),
  pixel:          @json($pixelId),
  googleAdsId:    @json($googleAdsId),
  googleAdsLabel: @json($googleAdsLabel),
  tiktok:         @json($tiktokId),
  currency:       @json(setting('currency_code', 'BDT')),
};
</script>
@endif

@if($gtmId)
<!-- Google Tag Manager -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{{ $gtmId }}');
</script>
@endif

@if($ga4Id)
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id={{ $ga4Id }}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
@unless($gtmId)
gtag('config', '{{ $ga4Id }}');
@endunless
</script>
@endif

@if($googleAdsId && ! $ga4Id)
<!-- Google Ads Conversion Tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id={{ $googleAdsId }}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '{{ $googleAdsId }}');
</script>
@elseif($googleAdsId && $ga4Id)
<!-- Google Ads Config via existing gtag -->
<script>
if (typeof gtag === 'function') {
  gtag('config', '{{ $googleAdsId }}');
}
</script>
@endif

@if($pixelId)
<!-- Meta (Facebook) Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{ $pixelId }}');
fbq('track', 'PageView');
</script>
@endif

@if($tiktokId)
<!-- TikTok Pixel -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
  ttq.load('{{ $tiktokId }}');
  ttq.page();
}(window, document, 'ttq');
</script>
@endif

{{-- Custom Header / Tracking Scripts --}}
@if(!empty($customHead))
{!! $customHead !!}
@endif

@stack('tracking-head')
