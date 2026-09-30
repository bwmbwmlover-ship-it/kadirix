import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";

/* ───────── constants ───────── */
const BLUE = "#7A8CFF";
const DARK = "#080B12";
const SURFACE = "#111623";
const BORDER = "#1C2235";
const MUTED = "#6B7490";

/* ───────── reduced-motion hook ───────── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

/* ───────── intersection-observer hook ───────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ───────── K monogram SVG ───────── */
function KMonogram({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="7" fill={BLUE} />
      <path d="M9.5 8h3.5v9.2L20.8 8h4L16.2 17 25.5 28h-4.2l-8.3-9.5V28H9.5V8z" fill={DARK} />
    </svg>
  );
}

/* ───────── section wrapper with reveal ───────── */
function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  const reduced = useReducedMotion();
  return (
    <section
      id={id}
      ref={ref}
      className={`${className} ${!reduced && inView ? "animate-fade-in-up" : !reduced ? "opacity-0" : ""}`}
    >
      {children}
    </section>
  );
}

/* ───────── project data ───────── */
interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "video" | "web" | "brend";
  tag: string;
  image?: string;
  description: string;
  details: string[];
  link?: string;
  linkLabel?: string;
  cardType: "cinematic" | "typographic" | "plum";
}

const PROJECTS: Project[] = [
  {
    id: "oxirgi60",
    title: "OXIRGI 60 SONIYA",
    subtitle: "AI film konsept",
    category: "video",
    tag: "Konsept",
    image: "/images/oxirgi60.jpg",
    description:
      "Sun'iy intellekt yordamida yaratilgan kinematografik film konsept. Har bir kadrlar inson hissiyotlarini aks ettiradi — tong otishi, oʻylar, soʻnggi qaror.",
    details: [
      "Janr: AI kinematografiya, drama",
      "Texnologiyalar: Stable Video Diffusion, ComfyUI, DaVinci Resolve",
      "Holat: Konsept bosqichida",
      "Maqsad: Oʻzbek tilidagi ilk AI film konseptini yaratish",
    ],
    cardType: "cinematic",
  },
  {
    id: "gamehub",
    title: "GAME HUB",
    subtitle: "Gaming e-commerce",
    category: "web",
    tag: "Demo",
    image: undefined,
    description:
      "Gamerlar uchun yaratilgan zamonaviy e-commerce platforma. Tezkor navigatsiya, jonli animatsiyalar va qulay foydalanuvchi tajriba.",
    details: [
      "Turi: E-commerce veb-sayt",
      "Texnologiyalar: Next.js, Tailwind CSS, Framer Motion",
      "Holat: Ishlaydigan demo",
      "Link: gamehub-g7c.vercel.app",
    ],
    link: "https://gamehub-g7c.vercel.app/",
    linkLabel: "Game Hub saytini ochish",
    cardType: "typographic",
  },
  {
    id: "plumora",
    title: "PLUMORA",
    subtitle: "Vizual hikoyat",
    category: "brend",
    tag: "Konsept",
    image: "/images/plumora.jpg",
    description:
      "Qora olcha yetishtirish loyihasi uchun vizual hikoyat konsepti. Tabiat va zamonaviy brend tilini uygʻunlashtirgan dizayn yoʻnalishi.",
    details: [
      "Turi: Vizual hikoyat, brend konsept",
      "Yoʻnalish: Qora olcha, qishloq xoʻjaligi",
      "Holat: Konsept bosqichida",
      "Gʻoya: Qishloq xoʻjaligi brendini yangicha koʻrinishda taqdim etish",
    ],
    cardType: "plum",
  },
];

const FILTERS = [
  { key: "all", label: "Barchasi" },
  { key: "video", label: "Video" },
  { key: "web", label: "Web" },
  { key: "brend", label: "Brend" },
];

/* ───────── modal ───────── */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handle); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} loyiha tafsilotlari`}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      {/* content */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[--color-kborder] bg-[--color-ksurface] p-6 sm:p-10 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full border border-[--color-kborder] text-white/60 hover:text-white hover:border-[--color-kblue] transition-colors"
          aria-label="Yopish"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>

        {/* image or typographic card */}
        {project.image ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
            <span
              className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full"
              style={{ backgroundColor: project.tag === "Demo" ? BLUE : SURFACE, color: project.tag === "Demo" ? DARK : "#fff", border: project.tag !== "Demo" ? `1px solid ${BORDER}` : "none" }}
            >
              {project.tag}
            </span>
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${SURFACE} 100%)` }}>
            <span className="gh-typography text-white/10 text-[120px] sm:text-[160px] select-none" aria-hidden="true">G/H</span>
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full" style={{ backgroundColor: BLUE, color: DARK }}>Demo</span>
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{project.title}</h2>
        <p className="text-sm uppercase tracking-widest mb-6" style={{ color: MUTED }}>{project.subtitle}</p>
        <p className="text-base leading-relaxed text-white/80 mb-6">{project.description}</p>

        <ul className="space-y-2 mb-8">
          {project.details.map((d, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/70">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: BLUE }} />
              {d}
            </li>
          ))}
        </ul>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105"
            style={{ backgroundColor: BLUE, color: DARK }}
          >
            {project.linkLabel}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H5M13 1v8" stroke="currentColor" strokeWidth="1.5" /></svg>
          </a>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [formName, setFormName] = useState("");
  const [formService, setFormService] = useState("");
  const [formBrief, setFormBrief] = useState("");

  const reduced = useReducedMotion();

  /* lock body scroll on mobile menu */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* close mobile menu on resize */
  useEffect(() => {
    const handle = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  /* smooth scroll helper */
  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  /* clipboard copy */
  const copyBrief = useCallback(async () => {
    const text = `Loyiha brief\n\nIsm: ${formName}\nXizmat: ${formService}\nLoyiha haqida: ${formBrief}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback */
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [formName, formService, formBrief]);

  /* filtered projects */
  const filtered = activeFilter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

  const navItems = [
    { id: "portfolio", label: "Ishlar" },
    { id: "services", label: "Xizmatlar" },
    { id: "process", label: "Jarayon" },
    { id: "contact", label: "Aloqa" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: DARK }}>
      {/* ──────── HEADER ──────── */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-[--color-kborder]/60" style={{ backgroundColor: `${DARK}ee`, backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })} className="flex items-center gap-3 group" aria-label="Bosh sahifa">
            <KMonogram size={32} />
            <span className="text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-white group-hover:text-[--color-kblue] transition-colors">
              Kadrix Studio
            </span>
          </button>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Asosiy navigatsiya">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="text-sm font-medium tracking-wide uppercase text-white/60 hover:text-white transition-colors"
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="ml-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: BLUE, color: DARK }}
            >
              Loyiha boshlash
            </button>
          </nav>

          {/* mobile toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-[--color-kborder] text-white/70"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" /></svg>
            )}
          </button>
        </div>

        {/* mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[--color-kborder] animate-slide-down" style={{ backgroundColor: DARK }}>
            <nav className="flex flex-col px-5 py-6 gap-1" aria-label="Mobil navigatsiya">
              {navItems.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className="text-left py-3 text-base font-medium text-white/70 hover:text-white border-b border-[--color-kborder]/40 transition-colors"
                >
                  {n.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("contact")}
                className="mt-4 w-full py-3 rounded-lg text-base font-semibold transition-all"
                style={{ backgroundColor: BLUE, color: DARK }}
              >
                Loyiha boshlash
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ──────── HERO ──────── */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20" style={{ backgroundColor: DARK }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* text */}
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-fade-in-up">
              Gʻoyaga{" "}
              <span style={{ color: BLUE }}>shakl</span>{" "}
              beramiz.
            </h1>
            <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-10 animate-fade-in-up delay-200">
              AI video, brend identikasi va veb tajribalar. Har bir gʻoya oʻziga xos koʻrinishga loyiq.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => scrollTo("portfolio")}
                className="px-7 py-3.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: BLUE, color: DARK }}
              >
                Ishlarni koʻrish
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="px-7 py-3.5 rounded-lg text-sm font-semibold border border-[--color-kborder] text-white/80 hover:text-white hover:border-[--color-kblue] transition-all"
              >
                Loyiha haqida gaplashamiz
              </button>
            </div>
          </div>

          {/* hero image */}
          <div className="relative animate-fade-in-up delay-400">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[520px] border border-[--color-kborder]/40">
              <img
                src="/images/hero.jpg"
                alt="KADRIX Studio kreativ vizual"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${DARK}66 0%, transparent 60%)` }} />
            </div>
            {/* decorative accent */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-xl border border-[--color-kblue]/30 -z-10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-lg border border-[--color-kborder]/40 -z-10" />
          </div>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to top, ${DARK}, transparent)` }} />
      </section>

      {/* ──────── PORTFOLIO ──────── */}
      <Section id="portfolio" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tanlangan <span style={{ color: BLUE }}>ishlar</span>
          </h2>
          <p className="text-base text-white/50 mb-10 max-w-lg">
            Har bir loyiha — yangi gʻoyaning amalga oshishi. Konseptlardan tortib, tayyor mahsulotlargacha.
          </p>

          {/* filters */}
          <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Ishlar filtrlari">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={activeFilter === f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === f.key
                    ? "text-[--color-kdark]"
                    : "border border-[--color-kborder] text-white/60 hover:text-white hover:border-[--color-kblue]"
                }`}
                style={activeFilter === f.key ? { backgroundColor: BLUE } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* asymmetric grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((p, idx) => {
              /* OXIRGI 60 SONIYA gets col-span on md+ */
              const isLarge = p.cardType === "cinematic" && idx === 0;
              return (
                <button
                  key={p.id}
                  onClick={() => setModalProject(p)}
                  className={`group relative text-left rounded-2xl overflow-hidden border border-[--color-kborder]/50 hover:border-[--color-kblue]/60 transition-all duration-300 ${
                    isLarge ? "md:col-span-2" : ""
                  } ${!reduced ? "hover:scale-[1.01]" : ""}`}
                  aria-label={`${p.title} — ${p.subtitle}`}
                >
                  {/* card inner */}
                  {p.image ? (
                    <div className={`relative ${isLarge ? "aspect-[2/1]" : "aspect-[4/3]"} overflow-hidden`}>
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${DARK}cc 0%, ${DARK}44 40%, transparent 70%)` }} />
                      {/* tag */}
                      <span
                        className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full"
                        style={{ backgroundColor: p.tag === "Demo" ? BLUE : SURFACE, color: p.tag === "Demo" ? DARK : "#fff", border: p.tag !== "Demo" ? `1px solid ${BORDER}` : "none" }}
                      >
                        {p.tag}
                      </span>
                      {/* text overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">{p.title}</h3>
                        <p className="text-sm text-white/50 uppercase tracking-widest">{p.subtitle}</p>
                      </div>
                    </div>
                  ) : p.cardType === "typographic" ? (
                    /* GAME HUB typographic card */
                    <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${SURFACE} 100%)` }}>
                      <span className="gh-typography text-white/[0.07] text-[140px] sm:text-[200px] select-none group-hover:text-white/[0.12] transition-colors duration-500" aria-hidden="true">
                        G/H
                      </span>
                      <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full" style={{ backgroundColor: BLUE, color: DARK }}>
                        {p.tag}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">{p.title}</h3>
                        <p className="text-sm text-white/50 uppercase tracking-widest">{p.subtitle}</p>
                      </div>
                      {/* hover ring */}
                      <div className="absolute inset-4 sm:inset-8 rounded-full border border-[--color-kblue]/0 group-hover:border-[--color-kblue]/20 transition-all duration-500" />
                    </div>
                  ) : (
                    /* PLUMORA plum card */
                    <div className="relative aspect-[4/3] overflow-hidden" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a0a2e 40%, #2d1040 70%, ${DARK} 100%)` }}>
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-50 mix-blend-luminosity transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${DARK}dd 0%, #2d104066 50%, transparent 80%)` }} />
                      <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full border border-[--color-kborder]" style={{ backgroundColor: SURFACE, color: "#fff" }}>
                        {p.tag}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1" style={{ color: "#c8a2e0" }}>{p.title}</h3>
                        <p className="text-sm text-white/50 uppercase tracking-widest">{p.subtitle}</p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-white/40 py-20 text-lg">Bu toifada hali ishlar yoʻq.</p>
          )}
        </div>
      </Section>

      {/* ──────── EDITORIAL STATEMENT ──────── */}
      <Section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug tracking-tight">
              Biz <span style={{ color: BLUE }}>eslanadigan</span> tajribalar yaratamiz —<br className="hidden sm:block" /> kodni hissiyot bilan uygʻunlashtirib.
            </p>
          </div>
        </div>
      </Section>

      {/* ──────── SERVICES ──────── */}
      <Section id="services" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-16">
            <span style={{ color: BLUE }}>Xizmatlar</span>
          </h2>

          <div className="space-y-0 divide-y divide-[--color-kborder]">
            {[
              {
                num: "01",
                title: "AI video & motion",
                desc: "Sun'iy intellekt vositalari yordamida kinematografik videolar, animatsiyalar va vizual effektlar yaratamiz. Gʻoyangizni harakatga keltiramiz.",
              },
              {
                num: "02",
                title: "Brend identikasi",
                desc: "Logotip, rang palitrasi, tipografika va brend tili — yaxlit va eslanadigan brend identikasini shakllantiramiz.",
              },
              {
                num: "03",
                title: "Web tajriba",
                desc: "Zamonaviy, tezkor va qulay veb-saytlar va ilovalar. Foydalanuvchi tajribasini eng yuqori darajada taʼminlaymiz.",
              },
            ].map((s) => (
              <div key={s.num} className="group py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-3 sm:gap-10 items-start hover:bg-white/[0.02] transition-colors -mx-5 sm:-mx-8 px-5 sm:px-8 rounded-xl">
                <span className="text-sm font-mono" style={{ color: BLUE }}>{s.num}</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 group-hover:text-[--color-kblue] transition-colors">{s.title}</h3>
                  <p className="text-base text-white/50 leading-relaxed max-w-2xl">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ──────── PROCESS ──────── */}
      <Section id="process" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-16">
            <span style={{ color: BLUE }}>Jarayon</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {[
              {
                step: "01",
                title: "Vazifani aniqlaymiz",
                desc: "Sizning maqsad va kutishlaringizni tushunamiz. Loyihaning asosiy yoʻnalishini belgilaymiz.",
              },
              {
                step: "02",
                title: "Yoʻnalish beramiz",
                desc: "Gʻoyalar, moodboard va konseptlar orqali vizual va mazmaviy yoʻnalishni shakllantiramiz.",
              },
              {
                step: "03",
                title: "Natijani sayqallaymiz",
                desc: "Har bir detalni soʻnggi mukammallikka yetkazamiz. Tayyor natijani topshiramiz.",
              },
            ].map((s, i) => (
              <div key={s.step} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl text-sm font-bold" style={{ backgroundColor: `${BLUE}22`, color: BLUE }}>
                    {s.step}
                  </span>
                  {/* connector line */}
                  {i < 2 && (
                    <div className="hidden sm:block absolute top-6 left-[calc(100%_-_0px)] w-full h-px border-t border-dashed border-[--color-kborder]" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ──────── CONTACT ──────── */}
      <Section id="contact" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
                Yaxshi ish <span style={{ color: BLUE }}>suhbatdan</span> boshlanadi.
              </h2>
              <p className="text-base text-white/50 leading-relaxed max-w-md mb-6">
                Loyihangiz haqida qisqacha maʼlumot bering — biz siz bilan bogʻlanamiz va keyingi qadamlarni muhokama qilamiz.
              </p>
              <p className="text-sm text-white/30 leading-relaxed max-w-md">
                Ushbu forma xabarni avtomatik yubormaydi. Toʻldirilgan briefni nusxalab, biz bilan maqul koʻringan kanal orqali ulashing.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="form-name" className="block text-sm font-medium text-white/70 mb-2">
                  Ismingiz
                </label>
                <input
                  id="form-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ism Familiya"
                  className="w-full px-4 py-3 rounded-lg border border-[--color-kborder] bg-transparent text-white placeholder-white/20 focus:outline-none focus:border-[--color-kblue] transition-colors"
                />
              </div>
              <div>
                <label htmlFor="form-service" className="block text-sm font-medium text-white/70 mb-2">
                  Xizmat turi
                </label>
                <div className="relative">
                  <select
                    id="form-service"
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-[--color-kborder] text-white focus:outline-none focus:border-[--color-kblue] transition-colors appearance-none cursor-pointer"
                    style={{ backgroundColor: SURFACE }}
                  >
                    <option value="" className="bg-[#111623]">Tanlang...</option>
                    <option value="AI video & motion" className="bg-[#111623]">AI video &amp; motion</option>
                    <option value="Brend identikasi" className="bg-[#111623]">Brend identikasi</option>
                    <option value="Web tajriba" className="bg-[#111623]">Web tajriba</option>
                    <option value="Boshqa" className="bg-[#111623]">Boshqa</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" /></svg>
                </div>
              </div>
              <div>
                <label htmlFor="form-brief" className="block text-sm font-medium text-white/70 mb-2">
                  Loyiha haqida
                </label>
                <textarea
                  id="form-brief"
                  rows={5}
                  value={formBrief}
                  onChange={(e) => setFormBrief(e.target.value)}
                  placeholder="Loyihangiz haqida qisqacha yozing..."
                  className="w-full px-4 py-3 rounded-lg border border-[--color-kborder] bg-transparent text-white placeholder-white/20 focus:outline-none focus:border-[--color-kblue] transition-colors resize-none"
                />
              </div>

              <button
                onClick={copyBrief}
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{ backgroundColor: BLUE, color: DARK }}
              >
                {copied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" /></svg>
                    Nusxalandi!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M3 11V3a1.5 1.5 0 011.5-1.5H11" stroke="currentColor" strokeWidth="1.5" /></svg>
                    Briefni nusxalash
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ──────── FOOTER ──────── */}
      <footer className="border-t border-[--color-kborder] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <KMonogram size={24} />
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-white/40">Kadrix Studio</span>
          </div>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} KADRIX Studio. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

      {/* ──────── MODAL ──────── */}
      {modalProject && <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />}
    </div>
  );
}
