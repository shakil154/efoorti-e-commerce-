import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Head, Link } from '@inertiajs/react';

const BLOG_POSTS = [
  {
    id: 1,
    title: '10 Essential Smart Gadgets to Upgrade Your Everyday Productivity',
    category: 'Technology & Gadgets',
    readTime: '4 min read',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    summary: 'From true wireless audio with active noise cancellation to smart workspace hubs, explore the curated tech picks that make daily routines seamless and fast.',
    author: 'Tech Desk',
  },
  {
    id: 2,
    title: 'Top Fashion Essentials & Trend Forecast for the Upcoming Season',
    category: 'Fashion & Style',
    readTime: '5 min read',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=60',
    summary: 'Discover timeless breathable fabrics, contemporary minimalist palettes, and versatile streetwear combinations tailored for effortless comfort.',
    author: 'Style Editor',
  },
  {
    id: 3,
    title: 'Pure Organics & Whole Wellness: The Secret to Mindful Nutrition',
    category: 'Health & Wellness',
    readTime: '6 min read',
    date: 'August 2026',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60',
    summary: 'Learn why unrefined natural honey, organic dry fruits, and cold-pressed cold oils are transforming everyday kitchens into holistic healing spaces.',
    author: 'Wellness Corner',
  },
  {
    id: 4,
    title: 'How to Choose the Right Baby Care & Safe Educational Toys',
    category: 'Babies & Parenting',
    readTime: '4 min read',
    date: 'August 2026',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=60',
    summary: 'A pediatrician-backed guide on safe, non-toxic materials, tactile early development toys, and nursery essentials every parent should know about.',
    author: 'Parenting Guide',
  },
];

export default function Blog() {
  return (
    <StorefrontLayout title="Stories, Trends & Buying Guides">
      <Head title="Blog & Stories — Projoss Marketplace" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-50 text-[var(--brand-primary,#f97316)] border border-orange-200/50">
            Marketplace Magazine
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 tracking-tight">
            Latest Stories, Tips & Buying Guides
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Stay inspired with fresh product deep-dives, styling secrets, and smart lifestyle advice.
          </p>
        </div>

        {/* Featured Post */}
        {BLOG_POSTS[0] && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12 grid grid-cols-1 lg:grid-cols-2 group hover:shadow-xl transition-all duration-300">
            <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-gray-100">
              <img
                src={BLOG_POSTS[0].image}
                alt={BLOG_POSTS[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                Featured Story
              </span>
            </div>
            <div className="p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold mb-3">
                  <span className="text-[var(--brand-primary,#f97316)]">{BLOG_POSTS[0].category}</span>
                  <span>•</span>
                  <span>{BLOG_POSTS[0].readTime}</span>
                  <span>•</span>
                  <span>{BLOG_POSTS[0].date}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[var(--brand-primary,#f97316)] transition-colors leading-snug">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                  {BLOG_POSTS[0].summary}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">By {BLOG_POSTS[0].author}</span>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-primary,#f97316)] hover:underline"
                >
                  Shop Related Gear →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BLOG_POSTS.slice(1).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {post.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-2">
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-[var(--brand-primary,#f97316)] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">{post.author}</span>
                  <Link
                    href="/shop"
                    className="text-xs font-bold text-[var(--brand-primary,#f97316)] hover:underline"
                  >
                    View Products →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </StorefrontLayout>
  );
}
