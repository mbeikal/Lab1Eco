"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-[1100] w-full backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/">Головна</NavLink>
            <NavLink href="/monitoring">Моніторинг</NavLink>
            <NavLink href="/pollutants">Забруднювачі</NavLink>
            <NavLink href="/about">Про проєкт</NavLink>
          </div>

          {/* Mobile Menu Button  */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors focus:outline-none"
              aria-label="Меню навігації"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/50 absolute left-0 w-full shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col space-y-2">
              <MobileNavLink href="/">Головна</MobileNavLink>
              <MobileNavLink href="/monitoring">Моніторинг</MobileNavLink>
              <MobileNavLink href="/pollutants">Забруднювачі</MobileNavLink>
              <MobileNavLink href="/about">Про проєкт</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
        isActive
          ? "text-emerald-600 bg-emerald-50/80"
          : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
        isActive
          ? "text-emerald-600 bg-emerald-50/80"
          : "text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/80"
      }`}
    >
      {children}
    </Link>
  );
}
