import Link from "next/link";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-inner flex items-center justify-center text-white font-black text-sm group-hover:rotate-12 transition-transform">
              Е
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-slate-800">
              Eco<span className="text-emerald-500">Mon</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/">Головна</NavLink>
            <NavLink href="/monitoring">Моніторинг</NavLink>
            <NavLink href="/pollutants">Забруднювачі</NavLink>
            <NavLink href="/about">Про проєкт</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200"
    >
      {children}
    </Link>
  );
}
