import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Head, Link } from '@inertiajs/react';

export default function Brands({ brands = [] }) {
  return (
    <StorefrontLayout title="All Brands — Official Store Partners">
      <Head title="Featured Brands — Projoss Marketplace" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-50 text-[var(--brand-primary,#f97316)] border border-orange-200/50">
            Verified Partners
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 tracking-tight">
            Explore All Brands
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Shop directly from world-class manufacturers and authentic trusted brand collections.
          </p>
        </div>

        {brands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {brands.map((b) => {
              const brandName = typeof b === 'string' ? b : (b.brand || b.name);
              const count = typeof b === 'object' ? (b.count || b.products_count) : null;
              const initial = brandName.charAt(0).toUpperCase();

              return (
                <Link
                  key={brandName}
                  href={`/shop?brand=${encodeURIComponent(brandName)}`}
                  className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 border border-gray-200/80 flex items-center justify-center text-2xl font-black text-gray-700 group-hover:scale-110 group-hover:border-[var(--brand-primary,#f97316)] group-hover:text-[var(--brand-primary,#f97316)] transition-all shadow-xs mb-3">
                    {initial}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-[var(--brand-primary,#f97316)] transition-colors truncate max-w-full">
                    {brandName}
                  </h3>
                  {count !== null && (
                    <span className="text-xs text-gray-400 font-medium mt-1">
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </span>
                  )}
                  <span className="mt-3 text-[11px] font-bold text-[var(--brand-primary,#f97316)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Shop Collection →
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto">
            <p className="text-gray-500 text-sm">No brands found at this moment.</p>
            <Link href="/shop" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-[var(--brand-primary,#f97316)] text-white text-xs font-bold">
              Browse All Products
            </Link>
          </div>
        )}
      </main>
    </StorefrontLayout>
  );
}
