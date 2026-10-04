import React from 'react';

export default function PaymentIcons({ settings = {}, className = "" }) {
  const showCards = settings?.show_cards_in_footer === true || settings?.show_cards_in_footer === '1' || settings?.show_cards_in_footer === 1;
  if (!showCards) return null;

  const codEnabled = settings?.pay_cod_enabled !== false && settings?.pay_cod_enabled !== '0';
  const bkashEnabled = settings?.pay_bkash_enabled === true || settings?.pay_bkash_enabled === '1' || !!settings?.bkash_number;
  const nagadEnabled = settings?.pay_nagad_enabled === true || settings?.pay_nagad_enabled === '1' || !!settings?.nagad_number;
  const rocketEnabled = settings?.pay_rocket_enabled === true || settings?.pay_rocket_enabled === '1' || !!settings?.rocket_number;

  const badgeClass = "inline-flex items-center justify-center px-3 py-1 rounded-lg bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm hover:border-gray-300 transition-all select-none h-8.5 min-h-[34px]";

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      {/* Cash on Delivery */}
      {codEnabled && (
        <div className={badgeClass} title="Cash on Delivery">
          <svg className="w-4 h-4 text-emerald-600 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="2.5" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
          <span className="text-[11px] font-extrabold tracking-wide text-emerald-700">Cash on Delivery</span>
        </div>
      )}

      {/* bKash */}
      {bkashEnabled && (
        <div className={badgeClass} title="bKash">
          <img 
            src="/images/payments/bkash.png" 
            alt="bKash" 
            className="h-5.5 max-h-[22px] w-auto object-contain max-w-[75px]" 
            loading="lazy" 
          />
        </div>
      )}

      {/* Nagad */}
      {nagadEnabled && (
        <div className={badgeClass} title="Nagad">
          <img 
            src="/images/payments/nagad.png" 
            alt="Nagad" 
            className="h-5.5 max-h-[22px] w-auto object-contain max-w-[75px]" 
            loading="lazy" 
          />
        </div>
      )}

      {/* Rocket */}
      {rocketEnabled && (
        <div className={badgeClass} title="Rocket">
          <img 
            src="/images/payments/rocket.png" 
            alt="Rocket" 
            className="h-5.5 max-h-[22px] w-auto object-contain max-w-[75px]" 
            loading="lazy" 
          />
        </div>
      )}

      {/* VISA Card */}
      <div className={badgeClass} title="Visa">
        <svg className="h-3.5 w-auto" viewBox="0 0 50 16" fill="none">
          <path d="M18.8 1.1L12.5 15.2H8.3L5.1 3.9C4.9 3.1 4.7 2.8 4 2.4C3 1.9 1.4 1.4 0 1.1L0.1 0.7H6.9C7.8 0.7 8.5 1.3 8.7 2.3L10.3 11L14.5 0.7H18.8ZM35.4 10.6C35.4 6.7 29.8 6.5 29.8 4.7C29.8 4.1 30.4 3.5 31.6 3.3C32.2 3.2 33.9 3.2 35.5 3.9L36.2 0.8C35.3 0.4 34.1 0.1 32.6 0.1C28.6 0.1 25.8 2.2 25.8 5.2C25.7 7.4 27.7 8.6 29.2 9.4C30.8 10.2 31.3 10.7 31.3 11.4C31.3 12.5 30 13 28.8 13C26.8 13 25.6 12.4 24.6 11.9L23.9 15.1C25 15.6 26.9 16 28.8 16C33 16 35.4 13.9 35.4 10.6ZM45.8 15.2H49.5L46.2 0.7H42.8C42 0.7 41.3 1.2 41 1.9L35 15.2H39.2L40.1 12.8H45.2L45.8 15.2ZM41.2 9.8L43.3 4.1L44.5 9.8H41.2ZM24.6 0.7L21.3 15.2H17.3L20.6 0.7H24.6Z" fill="#1A1F71"/>
        </svg>
      </div>

      {/* Mastercard */}
      <div className={badgeClass} title="Mastercard">
        <svg className="h-4 w-6 mr-1" viewBox="0 0 32 20" fill="none">
          <circle cx="11" cy="10" r="9" fill="#EB001B" />
          <circle cx="21" cy="10" r="9" fill="#F79E1B" fillOpacity="0.88" />
          <path d="M16 4.35A8.98 8.98 0 0 0 12.4 10c0 2.24.82 4.3 2.18 5.88A8.98 8.98 0 0 0 16 15.65 8.98 8.98 0 0 0 19.6 10a8.98 8.98 0 0 0-2.18-5.88A8.98 8.98 0 0 0 16 4.35z" fill="#FF5F00" />
        </svg>
        <span className="text-[11px] font-bold text-gray-700 tracking-tight hidden sm:inline">Mastercard</span>
      </div>
    </div>
  );
}
