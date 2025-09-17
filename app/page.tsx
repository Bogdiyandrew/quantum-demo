"use client";

import { motion, Variants, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* =========================
   Variants
   ========================= */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* =========================
   Helpers & Hooks
   ========================= */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

// Magnetic hover for buttons
function useMagnetic(strength = 18) {
  const ref = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0)";
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

// 3D Tilt wrapper
function Tilt3D({
  children,
  intensity = 10,
  className,
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  return (
    <motion.div ref={ref} onMouseMove={onMouseMove} style={{ perspective: 1000 }} className={className}>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>{children}</motion.div>
    </motion.div>
  );
}

// Scroll progress bar
function ScrollProgress() {
  const progress = useMotionValue(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      progress.set(scrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [progress]);
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-[var(--primary-accent)] to-emerald-400"
      style={{ scaleX }}
    />
  );
}

/* =========================
   Transitions (tipate corect)
   ========================= */
const SPRING: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 0.7,
};

/* =========================
   Price utils
   ========================= */
const MONTHLY_PRICE = 29;
const YEARLY_PER_USER = Math.round(MONTHLY_PRICE * 12 * 0.8); // 20% off

/* =========================
   Page
   ========================= */
export default function Home() {
  const reduced = usePrefersReducedMotion();
  const [isYearly, setIsYearly] = useState(false);

  // hero interacțiune
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!heroRef.current) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - left) / width - 0.5);
    mouseY.set((event.clientY - top) / height - 0.5);
  };

  const primaryBtnRef = useMagnetic(14);
  const secondaryBtnRef = useMagnetic(20);

  return (
    <main className="relative overflow-x-clip">
      <ScrollProgress />

      {/* Backgrounds */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#050607]" />
        <div className="absolute inset-0 bg-noise opacity-[0.045]" />
        <div className="absolute inset-0">
          <div className="aurora blur-3xl" />
        </div>
        <div className="absolute inset-0 hero-grid-background opacity-40" />
      </div>

      {/* === HERO === */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative container mx-auto grid grid-cols-1 items-center gap-12 px-6 pt-28 pb-16 md:pt-36 lg:grid-cols-2"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--primary-accent)]/20 blur-[80px]" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.h1 variants={itemVariants} className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            Organize projects at the
            <br />
            <span className="bg-gradient-to-r from-[var(--primary-accent)] to-emerald-400 bg-clip-text text-transparent">
              speed of thought.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 max-w-xl text-lg text-gray-400">
            Quantum este o platformă de project management cu AI care automatizează
            workflow-ul, estimează realist termenele și îți ține echipa sincronizată fără zgomot.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link
              href="https://digitura.ro"
              className="group relative inline-flex items-center justify-center rounded-xl px-7 py-3 font-semibold text-black transition-transform"
            >
              <span
                className="absolute inset-0 rounded-xl bg-[var(--primary-accent)] transition-transform duration-300 group-hover:scale-[1.03]"
                aria-hidden
              />
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-white/20 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100" />
              <button ref={primaryBtnRef} className="relative z-10">
                Get Started for Free
              </button>
            </Link>

            <Link
              href="https://digitura.ro"
              className="group relative inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              <button ref={secondaryBtnRef} className="relative z-10 inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Request a Demo
              </button>
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
            </Link>
          </motion.div>

          {/* Logo row placeholder */}
          <motion.div variants={itemVariants} className="mt-10 grid w-full max-w-xl grid-cols-4 items-center justify-items-center gap-6 opacity-80">
            {["bolt", "nova", "lumen", "atlas"].map((brand) => (
              <div key={brand} className="text-sm text-gray-500">• {brand}</div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: 3D Cards cluster */}
        <motion.div
          className="relative z-10 hidden lg:block"
          style={reduced ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="relative grid w-[560px] grid-cols-2 grid-rows-2 gap-4">
            <motion.div
              variants={itemVariants}
              style={{ transform: "translateZ(40px)" }}
              className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl shadow-2xl"
            >
              <p className="mb-3 text-sm text-gray-300">Project Velocity</p>
              <div className="relative flex h-28 items-end gap-1 rounded-lg bg-black/30 p-2">
                {[40, 62, 33, 82].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ ...SPRING, delay: 0.15 * i }}
                    className={`w-1/4 rounded-md ${i === 3
                      ? "bg-gradient-to-t from-[var(--primary-accent)]/50 to-[var(--primary-accent)]"
                      : "bg-gradient-to-t from-blue-500/50 to-blue-500"}`}
                  />
                ))}
                <div className="pointer-events-none absolute right-2 top-2 rounded-md bg-emerald-500/20 px-2 py-1 text-[11px] text-emerald-200">
                  +18% this sprint
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{ transform: "translateZ(20px)" }}
              className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl"
            >
              <p className="mb-3 text-sm text-gray-300">Upcoming Tasks</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border-2 border-violet-400" />
                  Design new dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border-2 border-gray-600" />
                  Develop API integration
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{ transform: "translateZ(15px)" }}
              className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl"
            >
              <p className="mb-3 text-sm text-gray-300">Team</p>
              <div className="flex -space-x-2">
                <div className="h-9 w-9 rounded-full border-2 border-black/40 bg-gradient-to-br from-pink-500 to-rose-500" />
                <div className="h-9 w-9 rounded-full border-2 border-black/40 bg-gradient-to-br from-orange-500 to-yellow-400" />
                <div className="h-9 w-9 rounded-full border-2 border-black/40 bg-gradient-to-br from-cyan-500 to-blue-500" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* === BENEFITS === */}
      <section className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { t: "Predictive, nu intuitiv", d: "Estimări bazate pe date reale. Mai puține surprize, mai multe livrări." },
            { t: "Automations pragmatice", d: "Creezi reguli în 30s. Restul se întâmplă singur." },
            { t: "Clarity by default", d: "Inbox curat, statuse clare, un singur adevăr al proiectului." },
          ].map((b, i) => (
            <Tilt3D key={i} intensity={6} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <div className="mb-3 text-sm text-emerald-300/90">0{i + 1}</div>
                <h3 className="text-lg font-semibold">{b.t}</h3>
                <p className="mt-2 text-gray-400">{b.d}</p>
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
              </motion.div>
            </Tilt3D>
          ))}
        </div>
      </section>

      {/* === PRICING === */}
      <section id="pricing" className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">Simple, transparent pricing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Alege ce are sens acum. Poți schimba oricând.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`font-medium ${!isYearly ? "text-white" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly((v) => !v)}
              className={`relative flex h-8 w-16 items-center rounded-full transition-colors ${isYearly ? "bg-[var(--primary-accent)]" : "bg-gray-700"}`}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className={`h-7 w-7 rounded-full bg-white ${isYearly ? "ml-8" : "ml-1"}`}
              />
            </button>
            <span className={`font-medium ${isYearly ? "text-white" : "text-gray-500"}`}>
              Annually <span className="text-xs text-emerald-400">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          className="mt-14 grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Starter */}
          <motion.div variants={itemVariants} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-lg font-semibold">Starter</h3>
            <p className="mt-4 text-4xl font-bold">$0</p>
            <p className="mt-2 text-sm text-gray-400">Pentru freelanceri / micro-echipe.</p>
            <ul className="mt-8 flex-grow space-y-3 text-gray-300">
              <li className="flex items-center gap-3">✔️ Până la 3 proiecte</li>
              <li className="flex items-center gap-3">✔️ Analytics de bază</li>
            </ul>
            <Link
              href="https://digitura.ro"
              className="mt-8 block w-full rounded-lg bg-white/10 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white/20"
            >
              Start for Free
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            variants={itemVariants}
            className="relative flex flex-col rounded-2xl border border-[var(--primary-accent)] bg-emerald-950/30 p-8 ring-2 ring-[var(--primary-accent)]"
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <span className="rounded-full bg-[var(--primary-accent)] px-4 py-1 text-sm font-semibold text-black">
                Most Popular
              </span>
            </div>
            <h3 className="text-lg font-semibold">Pro</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {isYearly ? (
                  <motion.p
                    key="yearly"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-4xl font-bold"
                  >
                    ${YEARLY_PER_USER}
                    <span className="text-lg font-medium text-gray-400"> / user / year</span>
                  </motion.p>
                ) : (
                  <motion.p
                    key="monthly"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-4xl font-bold"
                  >
                    ${MONTHLY_PRICE}
                    <span className="text-lg font-medium text-gray-400"> / user / month</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-2 text-sm text-gray-400">Pentru echipe care vor viteză și control.</p>
            <ul className="mt-8 flex-grow space-y-3 text-gray-300">
              <li className="flex items-center gap-3">✔️ Unlimited projects</li>
              <li className="flex items-center gap-3">✔️ AI predictive analysis</li>
              <li className="flex items-center gap-3">✔️ Priority support</li>
            </ul>
            <Link
              href="https://digitura.ro"
              className="mt-8 block w-full rounded-lg bg-[var(--primary-accent)] px-6 py-3 text-center font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              Choose Pro
            </Link>
          </motion.div>

          {/* Enterprise */}
          <motion.div variants={itemVariants} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-lg font-semibold">Enterprise</h3>
            <p className="mt-4 text-4xl font-bold">Custom</p>
            <p className="mt-2 text-sm text-gray-400">Pentru organizații mari.</p>
            <ul className="mt-8 flex-grow space-y-3 text-gray-300">
              <li className="flex items-center gap-3">✔️ Dedicated account manager</li>
              <li className="flex items-center gap-3">✔️ Advanced security &amp; SSO</li>
            </ul>
            <Link
              href="/contact"
              className="mt-8 block w-full rounded-lg bg-white/10 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white/20"
            >
              Contact Sales
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* === TESTIMONIALS === */}
      <section id="testimonials" className="container mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">
            Trusted by teams at the world&apos;s best companies
          </h2>
        </motion.div>

        <div className="relative mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
          <motion.div
            aria-hidden
            initial={{ x: 0 }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            className="flex min-w-max gap-6 p-6"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-[520px] shrink-0 rounded-xl border border-white/10 bg-black/30 p-6">
                <p className="text-lg text-gray-200">
                  “Quantum ne-a tăiat noise-ul, a păstrat esențialul și ne-a dat timp
                  înapoi. Predictive-ul chiar funcționează.”
                </p>
                <div className="mt-4 text-sm text-gray-400">— {i % 2 ? "Mark T., CEO" : "Sarah J., PM"}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="container mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--primary-accent)] to-emerald-400 px-8 py-16 text-center"
        >
          <h2 className="text-4xl font-bold text-black">Ready to streamline your projects?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-black/70">
            Alătură-te echipelor care ship-uiesc constant. Fără circ.
          </p>
          <Link
            href="https://digitura.ro"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-black transition-transform hover:scale-[1.02]"
          >
            Start Your Free Trial
          </Link>
        </motion.div>
      </section>
    </main>
  );
}