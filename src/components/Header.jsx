// src/components/Header.jsx
"use client";

// ──────────────────────────────────────────── Imports ──────
import { useState }                 from "react";
import { Menu }                     from "lucide-react";
import Link                         from "next/link";
import { usePathname }              from "next/navigation";
import clsx                         from "clsx";
// ──────────────────────────────────────────────────────────── Imports end ─

// ---------------------------------------------------------------------------
// Navigation routes
// ---------------------------------------------------------------------------
const lis_links                      = [
  { href: "/",         label: "home"    },
  { href: "/about",     label: "about"   },
  { href: "/careers",   label: "careers" },
  { href: "/contact",   label: "contact" },
]; // { href: "/privacy", label: "privacy" },
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Utility class fragments
// ---------------------------------------------------------------------------
// We place the *hover* utility LAST in the final className list so its rule is
// emitted after the base color, guaranteeing the highlight wins in the cascade
// when the element is hovered.
const str_linkBase                   = "uppercase text-sm tracking-wide transition-colors duration-200";
const str_linkInactive               = "text-zinc-300 dark:text-zinc-400";
const str_linkActive                 = "text-secondary-500 font-semibold";
const str_linkHover                  = "hover:text-gray-400 dark:hover:text-gray-300 focus-visible:text-gray-400 focus:outline-none";
// ---------------------------------------------------------------------------

/**
 * <Header />
 * ---------------------------------------------------------------------------
 * Fixed glass‑blurred top bar.
 *
 * – Desktop: horizontal nav with hover glow and active‑page accent.
 * – Mobile: hamburger toggles a collapsible drawer that overlays the content
 *   BELOW the header bar, ensuring the header height remains constant.
 */
export default function Header() {
  // ───────────────────────── State ──────
  const [boo_open, fun_setOpen]      = useState(false);
  // ───────────────────────── State end ─

  // Current pathname (first segment only)
  const str_raw                      = usePathname();
  const str_pathname                 = str_raw === "/" ? "/" : `/${str_raw.replace(/^\//, "").split("/")[0]}`;

  const fun_makeLinkClass            = (str_href) =>
    clsx(str_linkBase, str_pathname === str_href ? str_linkActive : str_linkInactive, str_linkHover);

  // ───────────────────────── Render ──────
  return (
    <>
      {/* Header Bar */}
      <header className="top-0 z-50 h-14 shadow backdrop-blur-lg bg-zinc-900/70">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 h-full">
          {/* Brand */}
          <Link href="/" className="font-bold tracking-widest text-xl">
            regeneratics
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6">
            {lis_links.map(({ href, label }) => (
              <Link key={href} href={href} className={fun_makeLinkClass(href)}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => fun_setOpen((boo_prev) => !boo_prev)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <nav
        className={clsx(
          "md:hidden fixed inset-x-0 top-14 z-40 origin-top transition-transform bg-zinc-900/90", // positioned directly below the 56px (14) header
          boo_open ? "scale-y-100" : "scale-y-0"
        )}
      >
        <div className="flex flex-col gap-4 py-4 px-6">
          {lis_links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => fun_setOpen(false)}
              className={fun_makeLinkClass(href)}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}//endfun Header
