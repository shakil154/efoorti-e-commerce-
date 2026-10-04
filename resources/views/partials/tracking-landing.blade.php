@php
  $trackCurrency  = setting('currency_code', 'BDT');
  $trackProdId    = (string) ($product->id ?? $page->id ?? 'landing');
  $trackProdName  = (string) ($product->name ?? $page->title ?? 'Product');
  $trackPrice     = (float) ($price ?? $offer ?? $offerPrice ?? ($product->price ?? 0));
  $trackCategory  = (string) ($product->category->name ?? 'Landing Page');
@endphp

<script>
(function() {
  const itemData = {
    id:       @json($trackProdId),
    name:     @json($trackProdName),
    price:    {{ $trackPrice }},
    currency: @json($trackCurrency),
    category: @json($trackCategory)
  };

  // ─── 1. ViewContent (Meta / TikTok / GA4) on landing page load ───────────
  function fireViewContent() {
    // Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_ids:  [itemData.id],
        content_name: itemData.name,
        content_type: 'product',
        value:        itemData.price,
        currency:     itemData.currency,
      });
    }

    // TikTok Pixel
    if (typeof window.ttq === 'object' && typeof window.ttq.track === 'function') {
      window.ttq.track('ViewContent', {
        content_id:   itemData.id,
        content_name: itemData.name,
        content_type: 'product',
        value:        itemData.price,
        currency:     itemData.currency,
      });
    }

    // GA4 / GTM
    if (window.dataLayer) {
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: itemData.currency,
          value:    itemData.price,
          items: [{
            item_id:       itemData.id,
            item_name:     itemData.name,
            price:         itemData.price,
            item_category: itemData.category,
            quantity:      1
          }]
        }
      });
    }

    if (typeof window.gtag === 'function' && !(window.__tracking && window.__tracking.gtm)) {
      window.gtag('event', 'view_item', {
        currency: itemData.currency,
        value:    itemData.price,
        items: [{
          item_id:       itemData.id,
          item_name:     itemData.name,
          price:         itemData.price,
          item_category: itemData.category,
          quantity:      1
        }]
      });
    }
  }

  // ─── 2. InitiateCheckout (Meta / TikTok / GA4) on order submit ─────────────
  let checkoutFired = false;
  window.trackLandingInitiateCheckout = function(customValue, customQty) {
    if (checkoutFired) return;
    checkoutFired = true;

    const qty = parseInt(customQty) || 1;
    const val = parseFloat(customValue) || (itemData.price * qty);

    // Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_ids:  [itemData.id],
        content_type: 'product',
        value:        val,
        currency:     itemData.currency,
        num_items:    qty,
      });
    }

    // TikTok Pixel
    if (typeof window.ttq === 'object' && typeof window.ttq.track === 'function') {
      window.ttq.track('InitiateCheckout', {
        contents: [{
          content_id:   itemData.id,
          content_name: itemData.name,
          quantity:     qty,
          price:        itemData.price,
        }],
        value:    val,
        currency: itemData.currency,
      });
    }

    // GA4 / GTM
    if (window.dataLayer) {
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: itemData.currency,
          value:    val,
          items: [{
            item_id:       itemData.id,
            item_name:     itemData.name,
            price:         itemData.price,
            item_category: itemData.category,
            quantity:      qty
          }]
        }
      });
    }

    if (typeof window.gtag === 'function' && !(window.__tracking && window.__tracking.gtm)) {
      window.gtag('event', 'begin_checkout', {
        currency: itemData.currency,
        value:    val,
        items: [{
          item_id:       itemData.id,
          item_name:     itemData.name,
          price:         itemData.price,
          item_category: itemData.category,
          quantity:      qty
        }]
      });
    }
  };

  // Run ViewContent when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fireViewContent);
  } else {
    fireViewContent();
  }

  // Auto-attach to forms with action or id for seamless InitiateCheckout tracking
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form && (form.id === 'order-form' || form.id === 'landing-order-form' || (form.action && form.action.includes('/order')))) {
      const qtyInput = form.querySelector('input[name="qty"], #nuraya-qty, #qty-input, input[name="package"]:checked');
      let qty = 1;
      if (qtyInput) {
        qty = parseInt(qtyInput.value) || parseInt(qtyInput.dataset.qty) || 1;
      }
      window.trackLandingInitiateCheckout(null, qty);
    }
  }, true);
})();
</script>
