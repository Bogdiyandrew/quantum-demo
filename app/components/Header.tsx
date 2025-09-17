"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { Orbitron } from "next/font/google";

/* Font pentru logo (tech vibe) */
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "800"],
});

/* =========================
   Magnetic (CSS vars, nu calcă transform)
   ========================= */
function useMagneticVars(strength = 16) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.setProperty("--mx", `${x / strength}px`);
      el.style.setProperty("--my", `${y / strength}px`);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", `0px`);
      el.style.setProperty("--my", `0px`);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);
  return ref;
}

/* =========================
   Hide on scroll + bg opacity
   ========================= */
function useScrollUI() {
  const [hidden, setHidden] = useState(false);
  const [opaque, setOpaque] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setOpaque(y > 8);
      const goingDown = y > last.current && y > 120;
      const goingUp = y < last.current;
      setHidden(goingDown && y > 120 && !goingUp);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { hidden, opaque };
}

/* =========================
   Nav items
   ========================= */
type NavItem = { label: string; href: string };
const NAV: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

/* =========================
   Variants (typed)
   ========================= */
const containerVariants: Variants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 40 },
  },
  hidden: {
    y: -72,
    opacity: 0.98,
    transition: { duration: 0.35 },
  },
};

const Header = () => {
  const prefersReducedMotion = useReducedMotion();
  const { hidden, opaque } = useScrollUI();
  const [open, setOpen] = useState(false);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const ctaRef = useMagneticVars(14);

  return (
    <motion.header
      variants={containerVariants}
      animate={hidden ? "hidden" : "visible"}
      transition={prefersReducedMotion ? { duration: 0 } : undefined}
      className={[
        "sticky top-0 z-50",
        "border-b border-white/10",
        "backdrop-blur-lg",
        "transition-colors",
        opaque ? "bg-black/60" : "bg-transparent",
      ].join(" ")}
      role="banner"
    >
      <nav className="container mx-auto flex items-center justify-between px-6 py-3" aria-label="Primary">
        {/* Logo text – vizibil mereu (gradient Tailwind) */}
        <Link
          href="/"
          aria-label="Quantum Home"
          className={[
            orbitron.className,
            "inline-block select-none",
            "text-3xl md:text-4xl font-extrabold leading-none tracking-tight",
            "bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400",
            "bg-clip-text text-transparent",
          ].join(" ")}
        >
          Quantum
        </Link>

        {/* Desktop nav */}
        <div className="relative hidden items-center md:flex">
          <ul className="flex items-center gap-8 text-sm text-gray-300">
            {NAV.map(({ label, href }) => (
              <li key={label} className="relative">
                <Link
                  href={href}
                  className="transition-colors hover:text-white"
                  onMouseEnter={() => setHoverKey(label)}
                  onMouseLeave={() => setHoverKey((k) => (k === label ? null : k))}
                >
                  {label}
                </Link>
                <AnimatePresence>
                  {hoverKey === label && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link href="https://digitura.ro" className="group relative hidden rounded-lg md:inline-flex" aria-label="Get Started">
          <span
            ref={ctaRef}
            className="magnetic relative z-10 inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold text-black"
          >
            Get Started
          </span>
          <span
            aria-hidden
            className="absolute inset-0 rounded-lg bg-emerald-400 transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-white/20 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center gap-2 rounded-md p-2 text-gray-200 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden"
          >
            <div className="container mx-auto px-6 pb-4">
              <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-gray-200 backdrop-blur">
                {NAV.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="block px-4 py-3 hover:bg-white/10" onClick={() => setOpen(false)}>
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="https://digitura.ro"
                    className="block px-4 py-3 font-semibold text-black hover:opacity-90"
                    onClick={() => setOpen(false)}
                  >
                    <span className="relative inline-block">
                      <span className="absolute inset-0 -z-10 rounded-md bg-emerald-400" />
                      <span className="relative">Get Started</span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style pentru magnetic */}
      <style jsx>{`
        .magnetic {
          --mx: 0px;
          --my: 0px;
          transform: translate(var(--mx), var(--my));
          will-change: transform;
        }
      `}</style>
    </motion.header>
  );
};

export default Header;