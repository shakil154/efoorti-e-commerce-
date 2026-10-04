export default function CategoryVectorIcon({ slug = '', name = '', className = "w-4 h-4" }) {
  const s = `${slug || ''} ${name || ''}`.toLowerCase();

  // Fashion / Apparel / Clothing
  if (s.includes('fashion') || s.includes('cloth') || s.includes('dress') || s.includes('shirt') || s.includes('wear')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    );
  }

  // Health & Beauty / Cosmetics
  if (s.includes('health') || s.includes('beauty') || s.includes('cosmetic') || s.includes('skin') || s.includes('care')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  }

  // Babies & Toys / Kids
  if (s.includes('babi') || s.includes('baby') || s.includes('toy') || s.includes('kid') || s.includes('child')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V4.5a2.5 2.5 0 10-5 0V8m5 0V4.5a2.5 2.5 0 115 0V8M3 8h18v4H3V8zm2 4v9h14v-9" />
      </svg>
    );
  }

  // Sports & Fitness
  if (s.includes('sport') || s.includes('fit') || s.includes('gym') || s.includes('outdoor')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-7-9a4 4 0 008 0V4H5v4zm0 0a3 3 0 11-3-3h3zm8 0a3 3 0 103-3h-3" />
      </svg>
    );
  }

  // Phones, Gadgets & Tech
  if (s.includes('phone') || s.includes('gadget') || s.includes('mobile') || s.includes('tech') || s.includes('electron')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="5" y="2" width="14" height="20" rx="3" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
      </svg>
    );
  }

  // Food / Groceries / Fodd
  if (s.includes('fodd') || s.includes('food') || s.includes('grocer') || s.includes('eat') || s.includes('snack') || s.includes('bazar')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    );
  }

  // Coffee / Kofi / Tea / Drinks
  if (s.includes('kofi') || s.includes('coffee') || s.includes('tea') || s.includes('drink') || s.includes('beverage')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zm4-5v2m4-2v2m4-2v2" />
      </svg>
    );
  }

  // Ghi / Oil / Dairy / Honey
  if (s.includes('ghi') || s.includes('ghee') || s.includes('oil') || s.includes('butter') || s.includes('honey')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    );
  }

  // Default clean grid / cube tag icon
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
