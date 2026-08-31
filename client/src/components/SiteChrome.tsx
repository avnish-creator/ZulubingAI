/* Technical Editorial direction: shared chrome uses deep Zulubing Ink, paper-white reading surfaces, Signal Teal rules, and authored wayfinding. */
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, ChevronDown, Menu, X, Mail, Linkedin, ArrowRight } from "lucide-react";
import { caseStudies, coachingPrograms, industries, primaryNav, resources, services, solutions, technologyGroups } from "@/lib/siteData";

export const LOGO_URL = "/logo.png";
export const MARK_URL = "/logo.png";

export function PageMeta({ title, description, path }: { title: string; description: string; path?: string }) {
  useEffect(() => {
    document.title = `${title} | Zulubing`;
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", description);
    document.head.appendChild(meta);
    const pageUrl = `${window.location.origin}${path ?? window.location.pathname}`;
    const setProperty = (property: string, content: string) => {
      const tag = document.querySelector(`meta[property="${property}"]`) ?? document.createElement("meta");
      tag.setAttribute("property", property);
      tag.setAttribute("content", content);
      document.head.appendChild(tag);
    };
    setProperty("og:title", `${title} | Zulubing`);
    setProperty("og:description", description);
    setProperty("og:url", pageUrl);
    const canonical = document.querySelector('link[rel="canonical"]') ?? document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", pageUrl);
    document.head.appendChild(canonical);
    const schema = document.querySelector('script[data-zulubing-schema]') ?? document.createElement("script");
    schema.setAttribute("type", "application/ld+json");
    schema.setAttribute("data-zulubing-schema", "true");
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Zulubing", email: "development.zulubing@gmail.com", description });
    document.head.appendChild(schema);
  }, [title, description, path]);
  return null;
}

function NavMenu({ label, href, items, activeMenu, setActiveMenu, dark = false }: { label: string; href: string; items: { slug: string; title: string; summary: string }[]; activeMenu: string | null; setActiveMenu: Dispatch<SetStateAction<string | null>>; dark?: boolean }) {
  const open = activeMenu === label;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const closeMenu = () => setActiveMenu((current) => current === label ? null : current);
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      closeMenu();
      closeTimer.current = null;
    }, 180);
  };
  return (
    <div className="nav-menu group relative" onMouseEnter={() => { cancelClose(); setActiveMenu(label); }} onMouseLeave={scheduleClose} onFocusCapture={() => { cancelClose(); setActiveMenu(label); }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenu(); }}>
      <Link href={href} aria-haspopup="true" aria-expanded={open} onClick={closeMenu} className={`nav-link inline-flex items-center gap-1.5 ${dark ? "text-white hover:text-teal" : "text-ink hover:text-cobalt"}`}>
        {label}<ChevronDown size={13} strokeWidth={1.7} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </Link>
      <div onMouseEnter={cancelClose} className={`mega-panel pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-50 w-[min(680px,calc(100vw-32px))] -translate-x-1/2 transition duration-200 ${open ? "pointer-events-auto translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
        <div className={`grid grid-cols-2 gap-x-8 gap-y-1 border p-5 shadow-[0_20px_50px_rgba(0,0,0,.15)] ${dark ? "border-teal/25 bg-[#06111d] text-white" : "border-slate-200 bg-white text-ink shadow-[0_20px_50px_rgba(8,19,31,0.08)]"}`}>
          <div className={`col-span-2 mb-2 flex items-center justify-between border-b pb-3 ${dark ? "border-white/10" : "border-slate-200"}`}>
            <span className={`mono-label ${dark ? "text-teal" : "text-cobalt"}`}>{label} / CAPABILITIES</span>
            <Link href={href} onClick={closeMenu} className={`micro-link ${dark ? "text-white/70 hover:text-teal" : "text-slate-500 hover:text-cobalt"}`}>View overview <ArrowRight size={13} /></Link>
          </div>
          {items.slice(0, 8).map((item) => (
            <Link key={item.slug} href={`${href}/${item.slug}`} onClick={closeMenu} className={`group/item flex gap-3 border-b py-3 transition-colors ${dark ? "border-white/10 hover:bg-white/[0.08] focus-visible:bg-white/[0.08]" : "border-slate-100 hover:bg-slate-50 focus-visible:bg-slate-50"}`}>
              <span className="mt-0.5 h-1.5 w-1.5 flex-none bg-teal transition-transform duration-200 group-hover/item:translate-x-1" />
              <span>
                <span className={`block text-[13px] font-semibold ${dark ? "text-white" : "text-ink"}`}>{item.title}</span>
                <span className={`mt-1 block text-[11px] leading-relaxed ${dark ? "text-white/45" : "text-slate-500"}`}>{item.summary}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); setActiveMenu(null); }, [location]);

  const isHome = location === "/";
  const isDarkHeader = isHome && !scrolled;

  return (
    <header className={`site-header fixed inset-x-0 top-0 z-40 transition duration-300 ${isDarkHeader ? "bg-ink text-white" : "border-b border-slate-200/90 bg-paper/95 text-ink shadow-xs backdrop-blur-xl"}`}>
      <div className="container flex h-[76px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Zulubing home">
          <img src={LOGO_URL} alt="Zulubing AI" className={`h-12 w-[86px] object-contain object-center transition duration-300 ${isDarkHeader ? "brightness-0 invert" : "brightness-[0.28]"}`} />
          <span className={`hidden border-l pl-3 text-[10px] font-semibold uppercase tracking-[0.16em] md:block ${isDarkHeader ? "border-white/20 text-white/50" : "border-slate-300 text-slate-500"}`}>Data technology partner</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {primaryNav.map((item) => <NavMenu key={item.label} label={item.label} href={item.href} items={item.menu} activeMenu={activeMenu} setActiveMenu={setActiveMenu} dark={isDarkHeader} />)}
          <Link href="/about" onMouseEnter={() => setActiveMenu(null)} onFocus={() => setActiveMenu(null)} className={`nav-link ${isDarkHeader ? "text-white hover:text-teal" : "text-ink hover:text-cobalt"}`}>About</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/talk-to-an-expert" className={`hidden items-center gap-2 border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition duration-200 sm:inline-flex ${isDarkHeader ? "border-teal bg-teal text-ink hover:bg-white hover:border-white" : "border-ink bg-ink text-white hover:bg-teal hover:text-ink hover:border-teal"}`}>
            Talk to an Expert <ArrowUpRight size={14} />
          </Link>
          <button type="button" onClick={() => setOpen((value) => !value)} className={`inline-flex h-10 w-10 items-center justify-center border lg:hidden ${isDarkHeader ? "border-white/20 text-white" : "border-slate-300 text-ink"}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {open && <div className={`mobile-nav border-t px-4 pb-6 pt-4 lg:hidden ${isDarkHeader ? "border-white/10 bg-ink text-white" : "border-slate-200 bg-paper text-ink shadow-lg"}`}>
        <div className="container grid gap-1">
          {primaryNav.map((item) => <Link key={item.label} href={item.href} className={`border-b py-3 text-sm font-semibold ${isDarkHeader ? "border-white/10 text-white" : "border-slate-200 text-ink"}`}>{item.label}<span className="float-right text-teal">↗</span></Link>)}
          <Link href="/about" className={`border-b py-3 text-sm font-semibold ${isDarkHeader ? "border-white/10 text-white" : "border-slate-200 text-ink"}`}>About<span className="float-right text-teal">↗</span></Link>
          <Link href="/talk-to-an-expert" className="mt-4 inline-flex items-center justify-center gap-2 bg-teal px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink">Talk to an Expert <ArrowUpRight size={15} /></Link>
        </div>
      </div>}
    </header>
  );
}

export function Breadcrumbs({ items, dark = false }: { items: { label: string; href?: string }[]; dark?: boolean }) {
  return <div className={`flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-white/45" : "text-slate-500"}`}>
    <Link href="/" className="hover:text-teal">Home</Link><span>/</span>
    {items.map((item, index) => <span key={item.label} className="flex items-center gap-2">{item.href ? <Link href={item.href} className="hover:text-teal">{item.label}</Link> : <span className={index === items.length - 1 ? (dark ? "text-white" : "text-ink") : ""}>{item.label}</span>}{index < items.length - 1 && <span>/</span>}</span>)}
  </div>;
}

export function ConnectPanel({ compact = false }: { compact?: boolean }) {
  return <section className={`connect-panel relative overflow-hidden border-t border-slate-300/80 bg-[#eef4f2] text-ink ${compact ? "py-14" : "py-24 md:py-28"}`}>
    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(17,196,194,0.07),rgba(31,94,216,0.04))]" />
    <div className="connect-brand-watermark pointer-events-none absolute right-[5%] top-[55%] hidden -translate-y-1/2 lg:block" aria-hidden="true">
      <span className="mono-label text-teal">ZULUBING / SIGNAL</span>
      <img src={MARK_URL} alt="" className="mt-4 ml-auto h-auto w-[150px] object-contain opacity-15 brightness-0 grayscale" />
      <span className="mt-4 block text-right font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">DATA / 00</span>
    </div>
    <div className="container relative">
      <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
        <div className="max-w-3xl">
          <SectionLabel index="00">CONNECT WITH US</SectionLabel>
          <h2 className={`mt-5 max-w-2xl font-display font-semibold tracking-[-0.045em] text-ink ${compact ? "text-4xl md:text-5xl" : "text-5xl md:text-7xl"}`}>Bring the hard part into view.</h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">{compact ? "Share the context you have and we will use the first exchange to clarify the system, the decision, and the next useful move." : "Share the context you have. We will use the first exchange to clarify the system, the decision, and the next useful move."}</p>
        </div>
        <div className="border-t border-slate-300/80 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div className="flex items-center gap-2 text-slate-500"><Mail size={16} className="text-teal" /><span className="mono-label text-slate-500">EMAIL / DIRECT LINE</span></div>
          <a href="mailto:development.zulubing@gmail.com" className="mt-3 block break-all font-display text-lg font-semibold text-ink underline decoration-teal underline-offset-4 transition hover:text-cobalt">development.zulubing@gmail.com</a>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/contact" className="button-primary">{compact ? "Email the team" : "Start a working session"} <ArrowUpRight size={15} /></Link>
            <Link href="/talk-to-an-expert" className="button-ghost-dark">Talk to an Expert <ArrowRight size={15} /></Link>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

export function Footer() {
  const techItems = technologyGroups.flatMap((group) => group.items.map((item) => ({ item, group: group.title })));
  return <footer className="bg-[#050d16] text-white">
    <div className="container py-16 md:py-20">
      <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[0.9fr_2.1fr]">
        <div>
          <Link href="/" className="inline-block"><img src={LOGO_URL} alt="Zulubing AI" className="h-20 w-[142px] object-contain brightness-0 invert" /></Link>
          <p className="mt-6 max-w-xs text-sm leading-7 text-white/50">Engineering trusted data foundations for clearer decisions, scalable analytics, and responsible intelligence.</p>
          <a href="mailto:development.zulubing@gmail.com" className="mt-6 inline-flex items-center gap-2 text-sm text-teal hover:text-white"><Mail size={15} /> development.zulubing@gmail.com</a>
          <a href="https://www.linkedin.com/company/zulubing" target="_blank" rel="noreferrer noopener" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-white/60 hover:text-teal"><Linkedin size={15} /> Company LinkedIn <span className="text-[10px]">↗</span></a>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div><span className="mono-label text-teal">COMPANY</span><div className="mt-5 grid gap-3 text-sm text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/about/founder" className="hover:text-white">Founder / CEO</Link><Link href="/about/leadership" className="hover:text-white">Leadership</Link><Link href="/careers" className="hover:text-white">Careers</Link><Link href="/about/partners" className="hover:text-white">Partners</Link><Link href="/approach" className="hover:text-white">Our approach</Link><Link href="/contact" className="hover:text-white">Contact</Link></div></div>
          <div><span className="mono-label text-teal">CONNECT</span><div className="mt-5 grid gap-3 text-sm text-white/55"><Link href="/talk-to-an-expert" className="hover:text-white">Talk to an Expert</Link><Link href="/engagement-models" className="hover:text-white">Engagement Models</Link><Link href="/learning-mentorship" className="hover:text-white">Learning & Mentorship</Link><Link href="/contact" className="hover:text-white">Request a Consultation</Link><a href="mailto:development.zulubing@gmail.com" className="hover:text-white">Email Us</a></div></div>
          <div><span className="mono-label text-teal">COACHING</span><div className="mt-5 grid gap-3 text-sm text-white/55"><Link href="/coaching" className="hover:text-white">All Programs</Link>{coachingPrograms.map((program) => <Link key={program.slug} href={`/coaching/${program.slug}`} className="hover:text-white">{program.title}</Link>)}</div></div>
          <div><span className="mono-label text-teal">SERVICES</span><div className="mt-5 grid gap-3 text-sm text-white/55">{services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`} className="hover:text-white">{service.title}</Link>)}</div></div>
          <div><span className="mono-label text-teal">EXPLORE</span><div className="mt-5 grid gap-3 text-sm text-white/55"><Link href="/solutions" className="hover:text-white">All Solutions</Link><Link href="/industries" className="hover:text-white">All Industries</Link><Link href="/technology" className="hover:text-white">All Technology</Link><Link href="/case-studies" className="hover:text-white">Case Studies</Link><Link href="/resources" className="hover:text-white">Resources</Link></div></div>
        </div>
      </div>
      <div className="grid gap-10 border-b border-white/10 py-12 md:grid-cols-2 xl:grid-cols-5">
        <div><span className="mono-label text-teal">SOLUTIONS / 08</span><div className="mt-5 grid gap-3 text-sm text-white/55">{solutions.map((solution) => <Link key={solution.slug} href={`/solutions/${solution.slug}`} className="hover:text-white">{solution.title}</Link>)}</div></div>
        <div><span className="mono-label text-teal">INDUSTRIES / 10</span><div className="mt-5 grid gap-3 text-sm text-white/55">{industries.map((industry) => <Link key={industry.slug} href={`/industries/${industry.slug}`} className="hover:text-white">{industry.title}</Link>)}</div></div>
        <div><span className="mono-label text-teal">TECHNOLOGY / 19</span><div className="mt-5 grid gap-3 text-sm text-white/55">{techItems.map(({ item, group }) => <Link key={item} href={`/technology/${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="hover:text-white" title={group}>{item}</Link>)}</div></div>
        <div><span className="mono-label text-teal">RESOURCES / 06</span><div className="mt-5 grid gap-3 text-sm text-white/55">{resources.map((resource) => <Link key={resource.slug} href={`/resources/${resource.slug}`} className="hover:text-white">{resource.title}</Link>)}</div></div>
        <div><span className="mono-label text-teal">CASE STUDIES / 04</span><div className="mt-5 grid gap-3 text-sm text-white/55">{caseStudies.map((study) => <Link key={study.slug} href={`/case-studies/${study.slug}`} className="hover:text-white">{study.title}</Link>)}</div></div>
      </div>
      <div className="mt-12 flex flex-col gap-4 text-[11px] uppercase tracking-[0.1em] text-white/35 md:flex-row md:items-center md:justify-between"><span>© {new Date().getFullYear()} Zulubing. Content subject to verification.</span><div className="flex flex-wrap gap-5"><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link><Link href="/terms-of-use" className="hover:text-white">Terms of Use</Link><Link href="/cookie-policy" className="hover:text-white">Cookie Policy</Link></div></div>
    </div>
  </footer>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper text-ink"><Header />{children}<Footer /></div>;
}

export function SectionLabel({ index, children, dark = false }: { index: string; children: React.ReactNode; dark?: boolean }) {
  return <div className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-white/50" : "text-slate-500"}`}><span className={dark ? "text-teal" : "text-cobalt"}>{index}</span><span className={`section-rail relative h-px w-10 ${dark ? "bg-teal/50" : "bg-cobalt/40"}`}><span className={`absolute -left-1 -top-[3px] h-2 w-2 ${dark ? "bg-teal" : "bg-cobalt"}`} /></span><span>{children}</span></div>;
}

export function PageHero({ eyebrow, title, description, children, dark = false }: { eyebrow: string; title: string; description: string; children?: React.ReactNode; dark?: boolean }) {
  return <section className={`page-hero relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24 ${dark ? "bg-ink text-white" : "bg-paper text-ink"}`}>
    {dark && <div className="hero-grid absolute inset-0 opacity-50" />}
    <div className="page-signal-rail absolute right-[7%] top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden="true"><span className="signal-rail-line" /><span className="signal-node node-a" /><span className="signal-node node-b" /><span className="signal-node node-c" /><span className="signal-rail-label">FLOW / 0{dark ? "1" : "2"}</span></div><div className="container relative"><Breadcrumbs items={[{ label: title }]} dark={dark} /><div className="mt-12 grid gap-10 lg:grid-cols-[1fr_390px] lg:items-end"><div><SectionLabel index={eyebrow.split("/")[0]?.trim() || "00"} dark={dark}>{eyebrow.split("/").slice(1).join("/").trim() || "PAGE"}</SectionLabel><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-7xl">{title}</h1></div><div><p className={`max-w-md text-base leading-8 ${dark ? "text-white/65" : "text-slate-600"}`}>{description}</p>{children}</div></div></div>
  </section>;
}
