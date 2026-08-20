import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import {
  Instagram,
  Youtube,
  Facebook,
  Flower2,
  Moon,
  Activity,
  HeartPulse,
  Baby,
  PersonStanding,
  Leaf,
  MapPin,
  Award,
  BadgeCheck,
  Mail,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { translations, LANGS, type Lang } from "@/i18n";

import warriorPhoto from "@/assets/images/yoga-warrior.webp";
import lotusPhoto from "@/assets/images/yoga-lotus.webp";
import lungePhoto from "@/assets/images/yoga-lunge.webp";

const CONTACT_EMAIL = "ask.oliwia.from.poland@gmail.com";

const SOCIALS = [
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61586639252321", icon: Facebook },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/oliwia_from_poland/", icon: Instagram },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@OliwiafromPoland", icon: Youtube },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@oliwia.from.poland", icon: null },
] as const;

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 0h1.98c.144 2.58 1.53 4.26 3.9 4.29v2.52c-1.464 0-2.73-.42-3.9-1.26v5.82a5.52 5.52 0 0 1-5.52 5.52A5.52 5.52 0 0 1 0 11.37a5.52 5.52 0 0 1 5.04-5.46v2.58a3 3 0 0 0-.54 5.82A3 3 0 0 0 7.5 11.4V0H9z" transform="translate(4 1)" />
  </svg>
);

const FLAG_NAMES: Record<Lang, string> = { en: "English", de: "Deutsch", pl: "Polski", fr: "Français" };

function Flag({ code, className }: { code: Lang; className?: string }) {
  const cls = className ?? "w-full h-full";
  if (code === "de") {
    return (
      <svg viewBox="0 0 60 36" className={cls} preserveAspectRatio="none" aria-hidden="true">
        <rect width="60" height="12" y="0" fill="#000" />
        <rect width="60" height="12" y="12" fill="#DD0000" />
        <rect width="60" height="12" y="24" fill="#FFCE00" />
      </svg>
    );
  }
  if (code === "pl") {
    return (
      <svg viewBox="0 0 60 36" className={cls} preserveAspectRatio="none" aria-hidden="true">
        <rect width="60" height="18" y="0" fill="#fff" />
        <rect width="60" height="18" y="18" fill="#DC143C" />
      </svg>
    );
  }
  if (code === "fr") {
    return (
      <svg viewBox="0 0 60 36" className={cls} preserveAspectRatio="none" aria-hidden="true">
        <rect width="20" height="36" x="0" fill="#002395" />
        <rect width="20" height="36" x="20" fill="#fff" />
        <rect width="20" height="36" x="40" fill="#ED2939" />
      </svg>
    );
  }
  // en — Union Jack
  return (
    <svg viewBox="0 0 60 36" className={cls} preserveAspectRatio="none" aria-hidden="true">
      <rect width="60" height="36" fill="#012169" />
      <path d="M0,0 L60,36 M60,0 L0,36" stroke="#fff" strokeWidth="7" />
      <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V36 M0,18 H60" stroke="#fff" strokeWidth="12" />
      <path d="M30,0 V36 M0,18 H60" stroke="#C8102E" strokeWidth="7" />
    </svg>
  );
}

function SocialIcon({ social, className }: { social: (typeof SOCIALS)[number]; className?: string }) {
  if (social.key === "tiktok") return <TikTokIcon className={className ?? "w-[18px] h-[18px]"} />;
  const Icon = social.icon!;
  return <Icon size={18} className={className} />;
}

function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

const EVIDENCE_META = [
  { icon: HeartPulse, stat: 80, statSuffix: "%" },
  { icon: Baby, stat: 50, statSuffix: "%" },
  { icon: PersonStanding, stat: 25, statSuffix: "%" },
];

const CLASS_ICONS = [Flower2, Activity, Leaf, Moon, HeartPulse];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const HERO_LIGHT = true;

function initialLang(): Lang {
  const q = new URLSearchParams(window.location.search).get("lang");
  if (q === "de" || q === "pl" || q === "fr" || q === "en") return q;
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (nav === "de" || nav === "pl" || nav === "fr") return nav as Lang;
  return "en";
}

/* Contact form that forwards submissions to CONTACT_EMAIL via FormSubmit */
function ContactForm({ t }: { t: (typeof translations)["en"]["contact"]["form"] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          _subject: `[Yoga website] ${data.get("title")}`,
          message: data.get("message"),
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-cream text-forest p-10 text-center" data-testid="form-success">
        <Flower2 size={34} className="mx-auto mb-4 text-gold" />
        <h3 className="font-heading text-3xl mb-2">{t.successTitle}</h3>
        <p className="text-forest/70 font-light">{t.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-cream text-forest p-8 md:p-10 space-y-5" data-testid="form-contact">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className="eyebrow text-forest/60 block mb-2">{t.nameL}</label>
          <input id="cf-name" name="name" required maxLength={100} className="w-full bg-white border border-forest/15 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors" placeholder={t.namePh} data-testid="input-name" />
        </div>
        <div>
          <label htmlFor="cf-email" className="eyebrow text-forest/60 block mb-2">{t.emailL}</label>
          <input id="cf-email" name="email" type="email" required maxLength={150} className="w-full bg-white border border-forest/15 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors" placeholder={t.emailPh} data-testid="input-email" />
        </div>
      </div>
      <div>
        <label htmlFor="cf-title" className="eyebrow text-forest/60 block mb-2">{t.subjL}</label>
        <input id="cf-title" name="title" required maxLength={150} className="w-full bg-white border border-forest/15 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors" placeholder={t.subjPh} data-testid="input-title" />
      </div>
      <div>
        <label htmlFor="cf-message" className="eyebrow text-forest/60 block mb-2">{t.msgL}</label>
        <textarea id="cf-message" name="message" required maxLength={4000} rows={5} className="w-full bg-white border border-forest/15 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-y" placeholder={t.msgPh} data-testid="input-message"></textarea>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button type="submit" disabled={status === "sending"} size="lg" className="rounded-none px-9 py-6 bg-forest text-cream hover:bg-forest/90 tracking-wide font-medium disabled:opacity-60" data-testid="button-form-send">
          {status === "sending" ? t.sending : t.send}
          {status !== "sending" && <ArrowUpRight size={17} className="ml-1" />}
        </Button>
        {status === "error" && (
          <span className="text-sm text-red-700" data-testid="text-form-error">
            {t.errorText} <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </span>
        )}
      </div>
    </form>
  );
}

/* Slim ticker */
function Ticker({ items }: { items: readonly string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-accent/30 bg-background py-3" aria-hidden="true">
      <div className="flex whitespace-nowrap animate-ticker w-max">
        {[...row, ...row].map((item, i) => (
          <span key={i} className="flex items-center text-foreground/70 font-heading text-lg mx-5 tracking-wide">
            <span className="text-gold mr-5 text-sm">✦</span>
            <span className={i % 2 ? "font-heading-italic text-gold" : ""}>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const langButtons = (_dark: boolean) => (
    <div className="flex items-center gap-2" data-testid="lang-selector">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={FLAG_NAMES[l.code]}
          className={`relative w-7 h-[17px] overflow-hidden rounded-[3px] transition-all duration-200 shadow-sm ${
            lang === l.code
              ? "ring-2 ring-gold ring-offset-1 ring-offset-transparent scale-110"
              : "opacity-55 saturate-[0.7] hover:opacity-100 hover:saturate-100 hover:scale-110"
          }`}
          data-testid={`button-lang-${l.code}`}
          aria-label={`Switch language to ${FLAG_NAMES[l.code]}`}
          aria-pressed={lang === l.code}
        >
          <Flag code={l.code} />
        </button>
      ))}
    </div>
  );

  const navDark = !(HERO_LIGHT && !isScrolled);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative font-sans">

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]"
        style={{ scaleX: progress }}
      />

      {/* Sticky social rail */}
      <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4">
        <span className="eyebrow text-foreground/50 [writing-mode:vertical-lr] rotate-180 mb-2">{t.follow}</span>
        <div className="w-px h-10 bg-accent/50"></div>
        {SOCIALS.map((s) => (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-foreground/15 bg-white/60 backdrop-blur flex items-center justify-center text-foreground/70 hover:bg-forest hover:text-cream hover:border-transparent hover:scale-110 transition-all"
            data-testid={`link-rail-${s.key}`}
            aria-label={s.label}
          >
            <SocialIcon social={s} className="w-4 h-4" />
          </a>
        ))}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-forest/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className={`font-heading text-2xl cursor-pointer tracking-wide ${navDark ? 'text-cream' : 'text-forest'}`} onClick={() => scrollTo('hero')}>
            Oliwia <span className="font-heading-italic text-gold">Konieczna</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {(["why", "classes", "credentials", "about"] as const).map((key) => {
              const targets = { why: "why-yoga", classes: "classes", credentials: "credentials", about: "about" } as const;
              const longest = LANGS.map((l) => translations[l.code].nav[key]).reduce((a, b) => (b.length > a.length ? b : a));
              return (
                <button
                  key={key}
                  onClick={() => scrollTo(targets[key])}
                  className={`relative text-sm hover:text-gold transition-colors tracking-wide text-center ${navDark ? 'text-cream/80' : 'text-forest/80'}`}
                  data-testid={`link-nav-${key}`}
                >
                  {/* Invisible longest translation reserves a stable width */}
                  <span className="invisible whitespace-nowrap block" aria-hidden="true">{longest}</span>
                  <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap">{t.nav[key]}</span>
                </button>
              );
            })}
            {langButtons(navDark)}
            <Button onClick={() => scrollTo('contact')} className="rounded-none px-7 bg-accent text-forest hover:bg-accent/90 font-medium tracking-wide" data-testid="button-nav-contact">
              <span className="relative block">
                <span className="invisible whitespace-nowrap block" aria-hidden="true">
                  {LANGS.map((l) => translations[l.code].nav.cta).reduce((a, b) => (b.length > a.length ? b : a))}
                </span>
                <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap">{t.nav.cta}</span>
              </span>
            </Button>
          </div>

          <button className={`md:hidden ${navDark ? 'text-cream' : 'text-forest'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} data-testid="button-mobile-menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-forest text-cream pt-28 px-8 flex flex-col space-y-7 md:hidden">
          <button onClick={() => scrollTo('why-yoga')} className="text-2xl font-heading text-left" data-testid="link-mobile-why">{t.nav.why}</button>
          <button onClick={() => scrollTo('classes')} className="text-2xl font-heading text-left" data-testid="link-mobile-classes">{t.nav.classes}</button>
          <button onClick={() => scrollTo('credentials')} className="text-2xl font-heading text-left" data-testid="link-mobile-credentials">{t.nav.credentials}</button>
          <button onClick={() => scrollTo('about')} className="text-2xl font-heading text-left" data-testid="link-mobile-about">{t.nav.about}</button>
          {langButtons(true)}
          <Button onClick={() => scrollTo('contact')} className="rounded-none w-full py-6 text-lg mt-4 bg-accent text-forest" data-testid="button-mobile-contact">
            {t.nav.cta}
          </Button>
          <div className="flex gap-4 pt-6">
            {SOCIALS.map((s) => (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full border border-cream/20 flex items-center justify-center" aria-label={s.label}>
                <SocialIcon social={s} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 1. Hero — light & airy */}
      <section id="hero" className="relative bg-cream text-foreground overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28 min-h-[92vh] flex items-center">
        <div className="absolute top-[10%] right-[-8%] w-[26rem] h-[26rem] rounded-full bg-accent/15 blur-3xl animate-drift" aria-hidden="true"></div>
        <span className="absolute -top-10 left-[38%] font-heading-italic text-[16rem] text-forest/[0.045] select-none leading-none pointer-events-none hidden lg:block" aria-hidden="true">
          yoga
        </span>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="eyebrow text-gold mb-7 flex items-center gap-4">
                <span className="w-10 gold-rule inline-block"></span>
                {t.hero.eyebrow}
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[4.6rem] leading-[1.03] mb-7 font-medium text-forest">
                {t.hero.title1}
                <br />
                <span className="font-heading-italic text-gold">{t.hero.title2}</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-md leading-relaxed font-light">
                {t.hero.sub}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-11">
                <Button size="lg" onClick={() => scrollTo('contact')} className="rounded-none px-9 py-7 text-base bg-forest text-cream hover:bg-forest/90 tracking-wide font-medium w-full sm:w-auto group" data-testid="button-hero-contact">
                  {t.hero.ctaPrimary}
                  <ArrowUpRight className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={18} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollTo('why-yoga')}
                  className="rounded-none px-9 py-7 text-base bg-transparent border-forest/25 text-forest hover:bg-forest/5 tracking-wide"
                  data-testid="button-hero-why"
                >
                  {t.hero.ctaSecondary}
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-2"><Award size={15} className="text-gold" /> {t.hero.cred1}</span>
                <span className="flex items-center gap-2"><MapPin size={15} className="text-gold" /> {t.hero.cred2}</span>
                <span className="flex items-center gap-2"><BadgeCheck size={15} className="text-gold" /> {t.hero.cred3}</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 border-2 border-accent translate-x-5 translate-y-5 pointer-events-none" aria-hidden="true"></div>
              <div className="relative aspect-[4/5] max-h-[72vh] w-full overflow-hidden">
                <img
                  src={warriorPhoto}
                  alt="Oliwia in Warrior II pose"
                  className="w-full h-full object-cover object-[center_30%] animate-kenburns"
                  data-testid="img-hero"
                />
              </div>

              {/* Individual floating social chips */}
              {[
                { s: SOCIALS[0], cls: "-left-5 md:-left-10 top-10", delay: "0s", iconBg: "bg-[#1877F2]" },
                { s: SOCIALS[1], cls: "-right-3 md:-right-7 top-[30%]", delay: "1.1s", iconBg: "bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-500" },
                { s: SOCIALS[2], cls: "-left-4 md:-left-9 bottom-[26%]", delay: "2s", iconBg: "bg-[#FF0000]" },
                { s: SOCIALS[3], cls: "-right-2 md:-right-5 bottom-8", delay: "0.6s", iconBg: "bg-black" },
              ].map(({ s, cls, delay, iconBg }, i) => (
                <motion.a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.15, type: "spring", stiffness: 220, damping: 18 }}
                  className={`absolute ${cls} z-20 bg-white shadow-xl px-3.5 py-2.5 flex items-center gap-2.5 hover:shadow-2xl hover:-translate-y-1 transition-all animate-float group`}
                  style={{ animationDelay: delay }}
                  data-testid={`chip-hero-${s.key}`}
                  aria-label={s.label}
                >
                  <span className={`w-7 h-7 rounded-full ${iconBg} flex items-center justify-center text-white shrink-0`}>
                    <SocialIcon social={s} className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-medium text-forest tracking-wide pr-1 group-hover:text-gold transition-colors">{s.label}</span>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social band */}
      <section className="bg-forest text-cream relative overflow-hidden">
        <div className="absolute -top-20 right-[15%] w-72 h-72 rounded-full bg-accent/10 blur-3xl animate-drift" aria-hidden="true"></div>
        <div className="container mx-auto px-6 md:px-12 py-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex items-center gap-5 justify-center lg:justify-start">
              <div className="font-heading text-6xl md:text-7xl text-gold leading-none">
                <Counter to={40} suffix="k+" />
              </div>
              <div className="text-sm text-cream/70 leading-snug max-w-[200px]">
                <span className="text-cream font-medium">{t.band.line1}</span><br />
                {t.band.line2}
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { s: SOCIALS[0], iconBg: "bg-[#1877F2]", note: t.band.notes.facebook },
                { s: SOCIALS[1], iconBg: "bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-500", note: t.band.notes.instagram },
                { s: SOCIALS[2], iconBg: "bg-[#FF0000]", note: t.band.notes.youtube },
                { s: SOCIALS[3], iconBg: "bg-black border border-cream/20", note: t.band.notes.tiktok },
              ].map(({ s, iconBg, note }, i) => (
                <motion.a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 220, damping: 20 }}
                  className="group bg-cream/5 border border-cream/10 hover:border-accent/60 hover:bg-cream/10 p-4 transition-all hover:-translate-y-1"
                  data-testid={`link-band-${s.key}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <SocialIcon social={s} className="w-4 h-4" />
                    </span>
                    <ArrowUpRight size={15} className="text-cream/30 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <div className="text-sm font-medium tracking-wide">{s.label}</div>
                  <div className="text-[11px] text-cream/50 mt-0.5">{note}</div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Ticker items={t.ticker} />

      {/* 2. Why Yoga */}
      <section id="why-yoga" className="py-28 bg-background relative">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div {...reveal} className="max-w-3xl mb-20">
            <div className="eyebrow text-gold mb-5 flex items-center gap-4">
              <span className="w-10 gold-rule inline-block"></span>
              {t.why.eyebrow}
            </div>
            <h2 className="text-4xl md:text-6xl font-medium leading-tight mb-6">
              {t.why.title1}<br /><span className="font-heading-italic text-gold">{t.why.title2}</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl">
              {t.why.sub}
            </p>
          </motion.div>

          <div className="space-y-0">
            {t.why.items.map((item, index) => {
              const meta = EVIDENCE_META[index];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={index}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.1 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-14 border-t border-border items-start group"
                >
                  <div className="lg:col-span-3">
                    <div className="font-heading text-7xl md:text-8xl text-forest leading-none">
                      <Counter to={meta.stat} suffix={meta.statSuffix} duration={1.8} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 max-w-[220px] leading-snug">{item.statLabel}</p>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-11 h-11 rounded-full bg-forest text-gold flex items-center justify-center">
                        <Icon size={20} strokeWidth={1.5} />
                      </span>
                      <h3 className="text-2xl md:text-3xl font-medium">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-light mb-4">{item.body}</p>
                    <div className="text-xs text-muted-foreground/70 tracking-wide">{item.source}</div>
                  </div>

                  <div className="lg:col-span-2 lg:text-right">
                    <div className="text-xs text-muted-foreground mb-2">{item.link}</div>
                    <button onClick={() => scrollTo('contact')} className="inline-flex items-center gap-2 text-sm font-medium text-forest border-b border-accent pb-1 hover:gap-3 transition-all" data-testid={`link-evidence-${index}`}>
                      {t.why.ask} <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Classes */}
      <section id="classes" className="py-28 bg-forest text-cream relative overflow-hidden">
        <div className="absolute top-20 right-[-8%] w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl animate-drift" aria-hidden="true"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div {...reveal} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="eyebrow text-gold mb-5 flex items-center gap-4">
                <span className="w-10 gold-rule inline-block"></span>
                {t.classes.eyebrow}
              </div>
              <h2 className="text-4xl md:text-6xl font-medium leading-tight">
                {t.classes.title1}<br /><span className="font-heading-italic text-gold">{t.classes.title2}</span>
              </h2>
            </div>
            <p className="text-cream/60 font-light max-w-sm">
              {t.classes.side}
            </p>
          </motion.div>

          <div>
            {t.classes.items.map((cls, index) => {
              const Icon = CLASS_ICONS[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="group border-t border-cream/15 last:border-b py-8 md:py-9 grid grid-cols-12 gap-4 items-center hover:bg-cream/5 transition-colors px-2 md:px-6 cursor-default"
                  data-testid={`row-class-${index}`}
                >
                  <div className="col-span-2 md:col-span-1 font-heading-italic text-2xl text-gold/70">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-10 md:col-span-4 flex items-center gap-4">
                    <span className="hidden md:flex w-11 h-11 rounded-full border border-cream/20 text-gold items-center justify-center group-hover:bg-accent group-hover:text-forest group-hover:border-transparent transition-all">
                      <Icon size={19} strokeWidth={1.5} />
                    </span>
                    <h3 className="text-2xl md:text-3xl font-heading font-medium group-hover:translate-x-1.5 transition-transform">{cls.title}</h3>
                  </div>
                  <p className="col-span-12 md:col-span-6 md:col-start-7 text-cream/60 font-light text-sm md:text-base leading-relaxed">
                    {cls.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div {...reveal} className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Button size="lg" onClick={() => scrollTo('contact')} className="rounded-none px-9 py-7 bg-accent text-forest hover:bg-accent/90 tracking-wide font-medium" data-testid="button-classes-contact">
              {t.classes.button} <ArrowUpRight size={18} className="ml-1" />
            </Button>
            <span className="text-cream/50 text-sm font-light">{t.classes.audiences}</span>
          </motion.div>
        </div>
      </section>

      {/* 4. Credentials */}
      <section id="credentials" className="py-28 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow text-gold mb-5 flex items-center justify-center gap-4">
              <span className="w-10 gold-rule inline-block rotate-180"></span>
              {t.creds.eyebrow}
              <span className="w-10 gold-rule inline-block"></span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium mb-5">
              {t.creds.title1} <span className="font-heading-italic text-gold">{t.creds.title2}</span>
            </h2>
            <p className="text-muted-foreground font-light">
              {t.creds.sub}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto border border-border divide-y md:divide-y-0 md:divide-x divide-border bg-white">
            {t.creds.items.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="p-10 text-center hover:bg-cream transition-colors group"
              >
                <div className="font-heading-italic text-5xl text-gold mb-4 group-hover:scale-110 transition-transform inline-block">{cert.hours}</div>
                <h3 className="font-heading text-xl font-medium mb-2 leading-tight">{cert.title}</h3>
                <div className="text-sm text-muted-foreground font-light">{cert.org}</div>
              </motion.div>
            ))}
          </div>

          <motion.div {...reveal} className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
            <BadgeCheck size={17} className="text-gold" />
            {t.creds.foot}
          </motion.div>
        </div>
      </section>

      {/* 5. About */}
      <section id="about" className="py-28 bg-cream relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...reveal} className="relative h-[520px] md:h-[600px]">
              <div className="absolute left-0 top-0 w-[62%] h-[75%] overflow-hidden rounded-t-[8rem] shadow-2xl z-10">
                <img src={lotusPhoto} alt="Oliwia meditating in lotus pose" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" data-testid="img-about-lotus" />
              </div>
              <div className="absolute right-0 bottom-0 w-[55%] h-[65%] overflow-hidden rounded-b-[6rem] shadow-2xl border-8 border-cream">
                <img src={lungePhoto} alt="Oliwia in a low lunge side stretch" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" data-testid="img-about-lunge" />
              </div>
              <div className="absolute left-[48%] top-[12%] z-20 bg-forest text-cream px-5 py-3 shadow-xl rotate-3 animate-float">
                <div className="text-xs eyebrow text-gold mb-1">{t.about.practicedIn}</div>
                <div className="font-heading text-lg leading-none flex items-center gap-1.5"><MapPin size={15} className="text-gold" /> Tamil Nadu, India</div>
              </div>
            </motion.div>

            <motion.div {...reveal}>
              <div className="eyebrow text-gold mb-5 flex items-center gap-4">
                <span className="w-10 gold-rule inline-block"></span>
                {t.about.eyebrow}
              </div>
              <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-7">
                {t.about.title1}<br /><span className="font-heading-italic text-gold">{t.about.title2}</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light mb-5 text-lg">
                {t.about.p1}
              </p>
              <p className="text-muted-foreground leading-relaxed font-light mb-9 text-lg">
                {t.about.p2}
              </p>

              <div className="grid grid-cols-3 gap-px bg-border border border-border mb-9">
                {[
                  { v: 300, s: "h+" },
                  { v: 2, s: "+" },
                  { v: 40, s: "k+" },
                ].map((stat, i) => (
                  <div key={i} className="bg-cream p-5 text-center">
                    <div className="font-heading text-3xl md:text-4xl"><Counter to={stat.v} suffix={stat.s} /></div>
                    <div className="text-xs text-muted-foreground tracking-wide mt-1">{t.about.stats[i]}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border hover:border-forest hover:bg-forest hover:text-cream transition-all text-sm font-medium tracking-wide"
                    data-testid={`link-about-${s.key}`}
                  >
                    <SocialIcon social={s} className="w-4 h-4" /> {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Contact */}
      <section id="contact" className="bg-forest text-cream py-28 relative overflow-hidden">
        <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
          <div className="w-[30rem] h-[30rem] rounded-full border border-accent/20 animate-breathe"></div>
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div {...reveal}>
              <div className="eyebrow text-gold mb-6">{t.contact.eyebrow}</div>
              <h2 className="text-4xl md:text-6xl font-medium leading-tight mb-6">
                {t.contact.titleA} <span className="font-heading-italic text-gold">{t.contact.titleB}</span> {t.contact.titleC}
              </h2>
              <p className="text-cream/60 text-lg font-light mb-8 max-w-xl">
                {t.contact.sub}
              </p>
              <div className="flex items-center gap-3 text-cream/70">
                <span className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-gold"><Mail size={17} /></span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gold transition-colors text-sm tracking-wide" data-testid="link-cta-email">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </motion.div>

            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }}>
              <ContactForm t={t.contact.form} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-forest text-cream border-t border-cream/10 py-14 relative overflow-hidden">
        <span className="absolute -bottom-10 right-4 font-heading-italic text-[8rem] text-cream/[0.04] whitespace-nowrap select-none leading-none pointer-events-none" aria-hidden="true">
          om shanti
        </span>
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 relative">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="font-heading text-2xl">
              Oliwia <span className="font-heading-italic text-gold">Konieczna</span>
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-cream/50 hover:text-cream transition-colors text-sm" data-testid="link-footer-email">
              {CONTACT_EMAIL}
            </a>
            {langButtons(true)}
          </div>

          <div className="flex items-center gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-cream/15 flex items-center justify-center hover:bg-accent hover:text-forest hover:border-transparent hover:scale-110 transition-all"
                data-testid={`link-footer-${s.key}`}
                aria-label={s.label}
              >
                <SocialIcon social={s} className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="text-sm text-cream/40 text-center md:text-right">
            © {new Date().getFullYear()} Oliwia Konieczna · {t.footer.rights}
            <div className="text-xs mt-1 text-cream/30">{t.footer.tagline}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
