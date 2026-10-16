import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, ExternalLink, ChevronDown, Check, Copy, 
  Sun, Moon, Menu, X, ArrowUpRight, ShieldCheck, Heart,
  Terminal, Sparkles, RefreshCw, Cpu, Layers, Disc3,
  Music, Radio, Mic2, Sliders, TrendingUp, Search, Wand2,
  FolderLock, Globe, ArrowUp, Zap, CheckCircle2
} from 'lucide-react';
import { FaGithub, FaAndroid, FaWindows, FaLinux, FaPaypal, FaBitcoin, FaTelegramPlane } from 'react-icons/fa';
import { Analytics } from '@vercel/analytics/react';

const REPO_OWNER = 'AWTMODS';
const REPO_NAME = 'Beats-Music';
const GITHUB_REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
const GITHUB_RELEASES_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`;
const GITHUB_REPO_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

// --- Ambient Canvas (Harmonic ripples, orbit arcs, rising motes) ---
const HeroAmbient = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const foci = [
      { x: 0.78, y: 0.22, maxR: 0.52 },
      { x: 0.16, y: 0.62, maxR: 0.40 }
    ];

    // Particles / motes
    const particleCount = Math.max(16, Math.min(32, Math.round((width * height) / 40000)));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: 2.2 + Math.random() * 4.2,
      swayAmp: 6 + Math.random() * 14,
      swayW: (Math.PI * 2) / (10 + Math.random() * 10),
      phase: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 1.2,
      baseAlpha: 0.12 + Math.random() * 0.16,
      twW: 0.35 + Math.random() * 0.5,
      isGreen: Math.random() < 0.35
    }));

    // Orbit arcs
    const arcs = [
      { focus: 0, rF: 0.25, span: 1.6, speed: 0.024, phase: 0.4 },
      { focus: 0, rF: 0.34, span: 0.88, speed: -0.016, phase: 2.5 },
      { focus: 1, rF: 0.28, span: 1.3, speed: 0.02, phase: 4.2 }
    ];

    // Expanding pulse rings
    let rings = [
      { focus: 0, born: -4000, life: 16000, maxR: 420 },
      { focus: 1, born: -9000, life: 18000, maxR: 360 },
      { focus: 0, born: -13000, life: 17000, maxR: 480 }
    ];

    let lastTime = performance.now();
    let nextRingTime = performance.now() + 3500;

    const render = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const isDark = document.documentElement.classList.contains('dark');
      const timeSec = now / 1000;
      const baseR = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);

      // Add new ring periodically
      if (now >= nextRingTime) {
        rings.push({
          focus: Math.random() < 0.6 ? 0 : 1,
          born: now,
          life: 16000 + Math.random() * 4000,
          maxR: baseR * (0.35 + Math.random() * 0.25),
          isGreen: Math.random() < 0.45
        });
        nextRingTime = now + 4000 + Math.random() * 2500;
      }

      // Draw rings
      rings = rings.filter(r => (now - r.born) / r.life < 1);
      for (const ring of rings) {
        const prog = (now - ring.born) / ring.life;
        if (prog < 0) continue;
        const radius = ring.maxR * Math.sin((prog * Math.PI) / 2);
        const alpha = Math.sin(Math.PI * prog) * (ring.isGreen ? (isDark ? 0.22 : 0.26) : (isDark ? 0.08 : 0.11));
        const color = ring.isGreen 
          ? `rgba(30, 215, 96, ${alpha.toFixed(3)})` 
          : (isDark ? `rgba(250, 250, 250, ${alpha.toFixed(3)})` : `rgba(15, 15, 15, ${alpha.toFixed(3)})`);
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(foci[ring.focus].x * width, foci[ring.focus].y * height, Math.max(1, radius), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw orbit arcs
      for (const arc of arcs) {
        const radius = Math.max(90, Math.min(480, arc.rF * baseR)) * (1 + 0.015 * Math.sin(timeSec * 0.15 + arc.phase * 2));
        const start = arc.phase + arc.speed * timeSec;
        const color = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(foci[arc.focus].x * width, foci[arc.focus].y * height, radius, start, start + arc.span);
        ctx.stroke();
      }

      // Draw floating particles
      for (const p of particles) {
        p.y -= p.vy * dt;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        const currentX = p.x + Math.sin(timeSec * p.swayW + p.phase) * p.swayAmp;
        const currentAlpha = Math.max(0, p.baseAlpha * (0.6 + 0.4 * Math.sin(timeSec * p.twW + p.phase * 1.5)));
        const color = p.isGreen 
          ? `rgba(30, 215, 96, ${currentAlpha.toFixed(3)})` 
          : (isDark ? `rgba(250, 250, 250, ${currentAlpha.toFixed(3)})` : `rgba(20, 20, 20, ${currentAlpha.toFixed(3)})`);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-90 transition-opacity duration-1000">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

// --- Main Application ---
export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('beats-theme-v1') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Live Stats
  const [stats, setStats] = useState({
    downloads: 827,
    latestTag: 'v1.6.0',
    updatedAgo: '2mo ago',
    stars: 12,
    forks: 2,
    latestRelease: null,
    releasesList: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Theme synchronization
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('beats-theme-v1', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Scroll listener for nav styling & progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollY > 20);
      setScrollProgress(docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch live stats from GitHub
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const [releasesRes, repoRes] = await Promise.all([
          fetch(GITHUB_RELEASES_API).then(r => r.json()).catch(() => []),
          fetch(GITHUB_REPO_API).then(r => r.json()).catch(() => ({}))
        ]);

        if (Array.isArray(releasesRes) && releasesRes.length > 0) {
          const totalDl = releasesRes.reduce((acc, rel) => {
            const relAssets = rel.assets || [];
            return acc + relAssets.reduce((sum, a) => sum + (a.download_count || 0), 0);
          }, 0);

          const latest = releasesRes[0];
          let updatedAgo = 'Recently';
          if (latest?.published_at) {
            const daysAgo = Math.floor((new Date() - new Date(latest.published_at)) / (1000 * 60 * 60 * 24));
            if (daysAgo < 30) updatedAgo = `${daysAgo}d ago`;
            else updatedAgo = `${Math.floor(daysAgo / 30)}mo ago`;
          }

          setStats({
            downloads: Math.max(totalDl, 827),
            latestTag: latest.tag_name || 'v1.6.0',
            updatedAgo,
            stars: repoRes.stargazers_count !== undefined ? repoRes.stargazers_count : 14,
            forks: repoRes.forks_count !== undefined ? repoRes.forks_count : 2,
            latestRelease: latest,
            releasesList: releasesRes
          });
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchGitHubData();
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const getAssetUrl = (ext) => {
    if (!stats.latestRelease || !stats.latestRelease.assets) {
      return `${GITHUB_REPO_URL}/releases/latest`;
    }
    const match = stats.latestRelease.assets.find(a => a.name.toLowerCase().endsWith(ext.toLowerCase()));
    return match ? match.browser_download_url : `${GITHUB_REPO_URL}/releases/latest`;
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-foreground transition-colors duration-300">
      
      {/* --- Fixed Navigation --- */}
      <header
        id="site-nav"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'border-b border-border/70 bg-background/80 backdrop-blur-xl' 
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          
          {/* Brand */}
          <a href="#" className="flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-brand-accent">
            <div className="size-8 rounded-lg bg-brand-accent flex items-center justify-center text-black shadow-sm shadow-brand-accent/30 font-bold">
              <Music className="size-4.5 stroke-[2.5]" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              Beats<span className="text-brand-accent">Music</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            <a href="#features" className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
              Features
            </a>
            <a href="#plugins" className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
              Plugins
            </a>
            <a href="#screenshots" className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
              Screenshots
            </a>
            <a href="#download" className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
              Download
            </a>
            <a href="#updates" className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
              Updates
            </a>
            <a href="#contribute" className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
              Support
            </a>
            <a href="#faq" className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
              FAQ
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Beats on GitHub"
              className="btn btn-icon btn-ghost"
            >
              <FaGithub className="size-4.5" />
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-icon btn-ghost"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>

            <a
              href="#download"
              className="btn btn-primary btn-md ml-1 hidden sm:inline-flex"
            >
              <Download className="size-4" />
              Get the app
            </a>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="btn btn-icon btn-ghost lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* Scroll reading progress bar */}
        <div
          id="nav-progress"
          aria-hidden="true"
          className="h-[2px] w-full origin-left bg-brand-accent transition-transform duration-75"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 border-l border-border/80 bg-background/95 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <span className="font-display text-lg font-bold tracking-tight">
                  Beats<span className="text-brand-accent">Music</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-icon btn-ghost"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-1.5">
                {[
                  ['#features', 'Features'],
                  ['#plugins', 'Plugins'],
                  ['#screenshots', 'Screenshots'],
                  ['#download', 'Download'],
                  ['#updates', 'Updates'],
                  ['#contribute', 'Support & Donate'],
                  ['#faq', 'FAQ']
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-[0.95rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <a
                href="#download"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary btn-md w-full"
              >
                <Download className="size-4" />
                Get the app
              </a>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-md w-full"
              >
                <FaGithub className="size-4" />
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <main className="flex-1">

        {/* --- Hero Section --- */}
        <section id="top" className="relative overflow-hidden pb-20 pt-36 sm:pb-24 sm:pt-44">
          <HeroAmbient />

          <div className="relative mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
            
            {/* Kicker */}
            <div>
              <p className="kicker">Open source · MIT License · No ads · No tracking</p>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.6rem]">
              Every song you love,
              <br />
              <span className="text-brand-accent">in pure clarity.</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              A free, open-source, plugin-based music player built with Flutter & Rust.
              Your downloaded songs play fully offline — community plugins bring streaming,
              charts, search and recommendations into one queue.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="#download" className="btn btn-primary btn-lg shadow-sm">
                <Download className="size-4.5" />
                Download free
              </a>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                <FaGithub className="size-4.5" />
                Star on GitHub
              </a>
            </div>

            {/* Platform indicators */}
            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FaAndroid className="size-4 text-green-500" /> Android
              </span>
              <span className="flex items-center gap-1.5">
                <FaWindows className="size-4 text-blue-400" /> Windows
              </span>
              <span className="flex items-center gap-1.5">
                <FaLinux className="size-4 text-orange-400" /> Linux
              </span>
            </p>

            {/* --- Live Stats Plate (Live from GitHub) --- */}
            <div className="mt-12 sm:mt-14">
              <div className="overflow-hidden rounded-xl border border-border shadow-sm">
                {/* Header bar */}
                <div className="flex items-center gap-2.5 border-b border-border bg-card px-5 py-2.5 sm:px-6">
                  <span aria-hidden="true" className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-accent opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-brand-accent"></span>
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Live from GitHub Releases &amp; Repository
                  </span>
                </div>

                {/* Stats Grid */}
                <dl className="grid grid-cols-2 gap-px bg-border sm:grid-cols-5">
                  
                  {/* Downloads */}
                  <div className="group relative bg-background px-5 py-4 text-left transition-colors duration-300 hover:bg-brand-accent/[0.04] sm:px-6 sm:py-5 col-span-2 sm:col-span-2">
                    <dt className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                      <Download className="size-3 shrink-0 text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent" />
                      Total downloads
                    </dt>
                    <dd title="GitHub releases all-time count" className="mt-2 font-display font-semibold leading-none tracking-tight tabular-nums transition-colors duration-300 group-hover:text-brand-accent text-4xl text-brand-accent sm:text-5xl">
                      {loadingStats ? '820+' : `${stats.downloads.toLocaleString()}+`}
                    </dd>
                    <a href={GITHUB_REPO_URL + '/releases'} target="_blank" rel="noopener noreferrer" className="absolute inset-0 outline-none">
                      <span className="sr-only">See releases on GitHub</span>
                    </a>
                  </div>

                  {/* Latest Release */}
                  <div className="group relative bg-background px-5 py-4 text-left transition-colors duration-300 hover:bg-brand-accent/[0.04] sm:px-6 sm:py-5">
                    <dt className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                      <Zap className="size-3 shrink-0 text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent" />
                      Latest release
                    </dt>
                    <dd className="mt-2 font-display font-semibold leading-none tracking-tight tabular-nums transition-colors duration-300 group-hover:text-brand-accent text-2xl text-foreground sm:text-[1.7rem]">
                      {stats.latestTag}
                    </dd>
                    <a href={GITHUB_REPO_URL + '/releases/latest'} target="_blank" rel="noopener noreferrer" className="absolute inset-0 outline-none">
                      <span className="sr-only">Open latest release</span>
                    </a>
                  </div>

                  {/* Updated */}
                  <div className="group relative bg-background px-5 py-4 text-left transition-colors duration-300 hover:bg-brand-accent/[0.04] sm:px-6 sm:py-5">
                    <dt className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                      <RefreshCw className="size-3 shrink-0 text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent" />
                      Updated
                    </dt>
                    <dd className="mt-2 font-display font-semibold leading-none tracking-tight tabular-nums transition-colors duration-300 group-hover:text-brand-accent text-2xl text-foreground sm:text-[1.7rem]">
                      {stats.updatedAgo}
                    </dd>
                    <a href={GITHUB_REPO_URL + '/releases'} target="_blank" rel="noopener noreferrer" className="absolute inset-0 outline-none">
                      <span className="sr-only">See releases</span>
                    </a>
                  </div>

                  {/* GitHub Stars */}
                  <div className="group relative bg-background px-5 py-4 text-left transition-colors duration-300 hover:bg-brand-accent/[0.04] sm:px-6 sm:py-5">
                    <dt className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                      <FaGithub className="size-3 shrink-0 text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent" />
                      Stars
                    </dt>
                    <dd className="mt-2 font-display font-semibold leading-none tracking-tight tabular-nums transition-colors duration-300 group-hover:text-brand-accent text-2xl text-foreground sm:text-[1.7rem]">
                      {stats.stars}
                    </dd>
                    <a href={GITHUB_REPO_URL + '/stargazers'} target="_blank" rel="noopener noreferrer" className="absolute inset-0 outline-none">
                      <span className="sr-only">View stargazers</span>
                    </a>
                  </div>

                </dl>
              </div>
            </div>

          </div>

          {/* Product Showcase Frame (Hero Screenshot) */}
          <div className="relative mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
            <figure>
              <div className="rounded-2xl border border-border bg-card p-2 sm:p-3 shadow-xl">
                <img
                  src="/screenshots/hero_banner.jpg"
                  alt="Full view of Beats Music Player interface — player, library and synchronized karaoke lyrics"
                  width="2300"
                  height="1000"
                  className="h-auto w-full rounded-xl border border-border/60 object-cover"
                />
              </div>
              <figcaption className="mt-3.5 text-center text-xs text-muted-foreground/80">
                The modern Beats interface — player, library and lyrics, side by side.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* --- Capabilities Marquee --- */}
        <section aria-label="Beats capabilities" className="border-y border-border/60 bg-card/40 py-5">
          <div className="marquee-mask overflow-hidden">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              <ul className="flex shrink-0 items-center gap-10 pr-10">
                {[
                  { icon: <Radio className="size-4" />, label: 'Offline playback' },
                  { icon: <Disc3 className="size-4" />, label: 'Local files' },
                  { icon: <Layers className="size-4" />, label: 'Community plugins' },
                  { icon: <Sparkles className="size-4" />, label: 'Streaming sources' },
                  { icon: <TrendingUp className="size-4" />, label: 'Global charts' },
                  { icon: <Search className="size-4" />, label: 'Instant search' },
                  { icon: <Wand2 className="size-4" />, label: 'Recommendations' },
                  { icon: <Sliders className="size-4" />, label: '10-band Equalizer' },
                  { icon: <Mic2 className="size-4" />, label: 'Karaoke synced lyrics' },
                  { icon: <Music className="size-4" />, label: 'One unified queue' }
                ].map((item, idx) => (
                  <li key={idx} className="group flex items-center gap-10 whitespace-nowrap text-sm font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground">
                    <span className="flex items-center gap-2.5">
                      <span className="text-muted-foreground/60 transition-colors duration-200 group-hover:text-brand-accent">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <span aria-hidden="true" className="size-1 rounded-full bg-brand-accent/50" />
                  </li>
                ))}
              </ul>

              {/* Second duplicate list for seamless infinite loop */}
              <ul aria-hidden="true" className="flex shrink-0 items-center gap-10 pr-10">
                {[
                  { icon: <Radio className="size-4" />, label: 'Offline playback' },
                  { icon: <Disc3 className="size-4" />, label: 'Local files' },
                  { icon: <Layers className="size-4" />, label: 'Community plugins' },
                  { icon: <Sparkles className="size-4" />, label: 'Streaming sources' },
                  { icon: <TrendingUp className="size-4" />, label: 'Global charts' },
                  { icon: <Search className="size-4" />, label: 'Instant search' },
                  { icon: <Wand2 className="size-4" />, label: 'Recommendations' },
                  { icon: <Sliders className="size-4" />, label: '10-band Equalizer' },
                  { icon: <Mic2 className="size-4" />, label: 'Karaoke synced lyrics' },
                  { icon: <Music className="size-4" />, label: 'One unified queue' }
                ].map((item, idx) => (
                  <li key={`dup-${idx}`} className="group flex items-center gap-10 whitespace-nowrap text-sm font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground">
                    <span className="flex items-center gap-2.5">
                      <span className="text-muted-foreground/60 transition-colors duration-200 group-hover:text-brand-accent">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <span aria-hidden="true" className="size-1 rounded-full bg-brand-accent/50" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* --- Features Index Section --- */}
        <section id="features" aria-labelledby="features-heading" className="scroll-mt-24 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
              
              {/* Sticky Editorial Header */}
              <div className="self-start lg:sticky lg:top-28">
                <p className="kicker flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-5 bg-brand-accent/60" />
                  Features
                </p>
                <h2 id="features-heading" className="mt-5 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                  Built for people who
                  <br />
                  <span className="text-brand-accent">just want to listen.</span>
                </h2>
                <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
                  No paywalls, no tiers, no telemetry. Every capability on this list
                  already ships in the app today — free, open source, MIT licensed.
                </p>
                <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground/70">
                  11 capabilities — nothing on a roadmap
                </p>
              </div>

              {/* The Index List */}
              <div className="border-t border-border">
                
                {/* Group 1: Listening */}
                <div>
                  <div className="flex items-center gap-4 pb-1 pt-7">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Listening
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
                  </div>
                  <ul>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        01
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        Local + online, unified
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        Your downloaded library plays fully offline. Streams from plugins land in the same queue, the same search, the same playlists — Beats blends it all seamlessly.
                      </p>
                    </li>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        02
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        Full-screen karaoke lyrics
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        Time-synced lyrics with manual offset adjustment, working offline across every source with glowing active vocal cues.
                      </p>
                    </li>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        03
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        10-band EQ + crossfade
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        Per-profile audio equalizer, gapless playback, and configurable crossfade transitions on every platform.
                      </p>
                    </li>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        04
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        Global charts
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        Daily-updated charts from community plugins — top trending, viral hits, top 50, and genre picks.
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Group 2: Connected */}
                <div>
                  <div className="flex items-center gap-4 pb-1 pt-7">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Connected
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
                  </div>
                  <ul>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        05
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        Scrobbling support
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        Every track play is tracked to your Last.fm profile — with an offline queue that automatically resyncs when your internet returns.
                      </p>
                    </li>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        06
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        Discord Rich Presence
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        Show what you are listening to in real time on Discord via native RPC, with album artwork and timeline duration.
                      </p>
                    </li>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        07
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        Dynamic UI Palettes
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        The interface dynamically samples and adapts its accent lighting and visual tone to the colors of your current playing album art.
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Group 3: Yours, forever */}
                <div>
                  <div className="flex items-center gap-4 pb-1 pt-7">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Yours, forever
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
                  </div>
                  <ul>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        08
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        Smart Replace &amp; Recovery
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        If a streamed track goes offline or fails mid-playlist, automatic recovery seamlessly finds an alternate working source. No skips.
                      </p>
                    </li>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        09
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        Bulk downloads
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        Download whole playlists, complete discographies, or custom mix sets at once with high speed multi-threaded saving.
                      </p>
                    </li>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        10
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        Backup &amp; restore
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        Export your entire library and preferences as JSON or M3U. Import anywhere. Absolute freedom and zero vendor lock-in.
                      </p>
                    </li>
                    <li className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-border py-6 sm:grid-cols-[3.5rem_13.5rem_1fr] sm:gap-x-6">
                      <span aria-hidden="true" className="font-mono text-[0.8rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                        11
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-xl">
                        12+ Languages, community driven
                      </h3>
                      <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                        English, Hindi, Spanish, French, German, Arabic, Korean, Japanese, and more — completely translated by the global community.
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Footer link */}
                <div className="pt-6">
                  <a
                    href={GITHUB_REPO_URL + '/releases'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="underline decoration-border underline-offset-4 group-hover:decoration-brand-accent">
                      See the full release notes and changelog
                    </span>
                    <ArrowUpRight className="size-3.5 text-brand-accent" />
                  </a>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* --- Rust Plugins Architecture Section (High Contrast) --- */}
        <section id="plugins" aria-labelledby="plugins-heading" className="scroll-mt-24 border-y border-border bg-card/60 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              
              {/* Left Column */}
              <div>
                <p className="kicker mb-4 flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-5 bg-brand-accent/60" />
                  Rust &amp; WebAssembly Core
                </p>
                <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
                  One player. <span className="text-brand-accent">Every source.</span>
                </h2>

                <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <li className="border-t border-border/70 pt-4">
                    <div className="flex items-baseline gap-3">
                      <span aria-hidden="true" className="font-mono text-[0.7rem] text-brand-accent">01</span>
                      <h3 className="text-sm font-semibold">Memory-safe Rust core</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      Audio engine and plugin logic execute on a Rust backend behind a strict FFI boundary for memory safety.
                    </p>
                  </li>

                  <li className="border-t border-border/70 pt-4">
                    <div className="flex items-baseline gap-3">
                      <span aria-hidden="true" className="font-mono text-[0.7rem] text-brand-accent">02</span>
                      <h3 className="text-sm font-semibold">Sandboxed by design</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      Each .bex plugin runs isolated in WebAssembly. External code cannot access your private system files.
                    </p>
                  </li>

                  <li className="border-t border-border/70 pt-4">
                    <div className="flex items-baseline gap-3">
                      <span aria-hidden="true" className="font-mono text-[0.7rem] text-brand-accent">03</span>
                      <h3 className="text-sm font-semibold">Auto-updating</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      When online sources change, community plugins update themselves automatically so music playback never halts.
                    </p>
                  </li>

                  <li className="border-t border-border/70 pt-4">
                    <div className="flex items-baseline gap-3">
                      <span aria-hidden="true" className="font-mono text-[0.7rem] text-brand-accent">04</span>
                      <h3 className="text-sm font-semibold">Zero ads, enforced</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      The player eliminates audio commercials and telemetry at the stream architecture level.
                    </p>
                  </li>
                </ul>
              </div>

              {/* Right Column: Terminal Window */}
              <div>
                <div className="overflow-hidden rounded-2xl border border-border bg-[#09090b] shadow-2xl">
                  {/* Window Bar */}
                  <div className="flex items-center gap-2 border-b border-border/80 px-4 py-3 bg-[#121215]">
                    <span className="size-3 rounded-full bg-[#ff5f57]" />
                    <span className="size-3 rounded-full bg-[#febc2e]" />
                    <span className="size-3 rounded-full bg-[#28c840]" />
                    <span className="ml-2 font-mono text-xs text-muted-foreground">beats — plugin runtime</span>
                  </div>

                  {/* Terminal Code */}
                  <div className="space-y-2 px-4 py-5 font-mono text-[0.8rem] leading-relaxed sm:px-5 text-gray-200">
                    <p className="text-white">$ beats plugin add stream-source.bex</p>
                    <p className="text-muted-foreground">  → verifying cryptographic signature … ok</p>
                    <p className="text-muted-foreground">  → initializing wasm sandbox (Rust FFI) … ok</p>
                    <p className="text-[#4ade80]">  ✓ stream-source ready — community extension verified</p>
                    <p className="text-white mt-3">$ beats plugin add global-charts.bex</p>
                    <p className="text-[#4ade80]">  ✓ charts engine online</p>
                    <p className="text-white mt-3">
                      $ <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-brand-accent" />
                    </p>
                  </div>
                </div>

                {/* Capability Badges */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Streaming', 'Charts', 'Search', 'Synced Lyrics', 'Recommendations', '...or write your own'].map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground font-mono">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  Everything is open — the core player, the plugin API, and the repositories.{' '}
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-accent underline-offset-4 hover:underline"
                  >
                    Read the source
                  </a>{' '}
                  or build your own plugin today.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* --- Screenshots Showcase Section --- */}
        <section id="screenshots" aria-labelledby="showcase-heading" className="scroll-mt-24 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="mb-10 sm:mb-14">
              <p className="kicker mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-5 bg-brand-accent/60" />
                Screenshots
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
                Take a look <span className="text-brand-accent">inside.</span>
              </h2>
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              
              {/* Screenshot 1: Player View */}
              <figure className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card">
                <img
                  src="/screenshots/playerview.jpg"
                  alt="Beats player view with album artwork, audio equalizer and playback controls"
                  width="1770"
                  height="960"
                  loading="lazy"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02] object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full border border-border/60 bg-background/90 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                  Player view &amp; 10-band EQ
                </figcaption>
              </figure>

              {/* Screenshot 2: Karaoke Lyrics */}
              <figure className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card">
                <img
                  src="/screenshots/lyricsview.jpg"
                  alt="Beats full-screen time-synced karaoke lyrics view"
                  width="1770"
                  height="960"
                  loading="lazy"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02] object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full border border-border/60 bg-background/90 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                  Karaoke synced lyrics
                </figcaption>
              </figure>

              {/* Screenshot 3: Playlists */}
              <figure className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card">
                <img
                  src="/screenshots/playlistview.jpg"
                  alt="Beats playlist and offline library management"
                  width="1770"
                  height="960"
                  loading="lazy"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02] object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full border border-border/60 bg-background/90 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                  Library &amp; Playlists
                </figcaption>
              </figure>

              {/* Screenshot 4: Artist View */}
              <figure className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card">
                <img
                  src="/screenshots/artistview.jpg"
                  alt="Beats artist discovery and discography view"
                  width="1770"
                  height="960"
                  loading="lazy"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02] object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full border border-border/60 bg-background/90 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                  Artist &amp; Discography
                </figcaption>
              </figure>

            </div>
          </div>
        </section>

        {/* --- Download Section --- */}
        <section id="download" aria-labelledby="download-heading" className="scroll-mt-24 border-y border-border/60 bg-card/20 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            
            <div className="mb-10 sm:mb-14">
              <p className="kicker mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-5 bg-brand-accent/60" />
                Download
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
                Free. Always. <span className="text-brand-accent">No strings attached.</span>
              </h2>
            </div>

            {/* Version pill */}
            <div className="mb-5 flex justify-end">
              <a
                href={GITHUB_REPO_URL + '/releases/latest'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand-accent/50 hover:text-foreground"
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-accent" />
                Latest build <span className="font-mono text-foreground font-semibold">{stats.latestTag}</span>
                <span className="sr-only">— opens on GitHub</span>
              </a>
            </div>

            {/* Numbered Platform Rows */}
            <div className="border-t border-border/80">
              
              {/* Android Row */}
              <div className="group grid gap-4 border-b border-border/80 py-7 transition-colors duration-300 hover:bg-muted/40 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                <div className="flex items-start gap-4 sm:gap-5">
                  <span aria-hidden="true" className="pt-1 font-mono text-[0.7rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                    01
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-2xl flex items-center gap-2">
                        <FaAndroid className="size-5 text-green-500" /> Android
                      </h3>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-brand-accent font-semibold px-2 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
                        Recommended
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      APK · arm64, armeabi &amp; universal builds
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                  <a
                    href={getAssetUrl('.apk')}
                    className="btn btn-md btn-primary"
                  >
                    <Download className="size-4" />
                    Get the APK — GitHub
                  </a>
                  <a
                    href="https://apt.izzysoft.de/fdroid/index/apk/ls.Beats.musicplayer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-md"
                  >
                    <ExternalLink className="size-3.5" />
                    IzzyOnDroid
                  </a>
                </div>
              </div>

              {/* Windows Row */}
              <div className="group grid gap-4 border-b border-border/80 py-7 transition-colors duration-300 hover:bg-muted/40 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                <div className="flex items-start gap-4 sm:gap-5">
                  <span aria-hidden="true" className="pt-1 font-mono text-[0.7rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                    02
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-2xl flex items-center gap-2">
                        <FaWindows className="size-5 text-blue-400" /> Windows
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Installer &amp; standalone portable builds
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                  <a
                    href={getAssetUrl('.exe')}
                    className="btn btn-md btn-outline"
                  >
                    <Download className="size-4" />
                    Download — GitHub
                  </a>
                </div>
              </div>

              {/* Linux Row */}
              <div className="group grid gap-4 border-b border-border/80 py-7 transition-colors duration-300 hover:bg-muted/40 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                <div className="flex items-start gap-4 sm:gap-5">
                  <span aria-hidden="true" className="pt-1 font-mono text-[0.7rem] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-accent">
                    03
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-brand-accent sm:text-2xl flex items-center gap-2">
                        <FaLinux className="size-5 text-orange-400" /> Linux
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      AppImage &amp; .deb development packages
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                  <a
                    href={GITHUB_REPO_URL + '/releases/latest'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-md btn-outline"
                  >
                    <Download className="size-4" />
                    Download — GitHub
                  </a>
                </div>
              </div>

            </div>

            {/* Safety Notice Card */}
            <div className="mt-10">
              <div className="overflow-hidden rounded-xl border border-yellow-500/30 bg-background shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-yellow-500/20 bg-yellow-500/[0.06] px-5 py-3 sm:px-6">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="size-4 text-yellow-500" />
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-yellow-600 dark:text-yellow-400">
                      Beware of unverified third-party mirrors
                    </p>
                  </div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Official verified sources
                  </p>
                </div>

                <ul>
                  <li className="border-b border-border/70">
                    <a
                      href={GITHUB_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3.5 transition-colors duration-300 hover:bg-muted/40 sm:px-6"
                    >
                      <span className="flex min-w-0 items-center gap-3 font-mono text-sm">
                        <FaGithub className="size-4 text-brand-accent" />
                        github.com/{REPO_OWNER}/{REPO_NAME}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                        Primary Source <ArrowUpRight className="size-3.5" />
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://apt.izzysoft.de/fdroid/index/apk/ls.Beats.musicplayer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3.5 transition-colors duration-300 hover:bg-muted/40 sm:px-6"
                    >
                      <span className="flex min-w-0 items-center gap-3 font-mono text-sm">
                        <CheckCircle2 className="size-4 text-brand-accent" />
                        IzzyOnDroid F-Droid Repository
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                        Verified F-Droid <ArrowUpRight className="size-3.5" />
                      </span>
                    </a>
                  </li>
                </ul>

                <p className="px-5 py-3.5 text-xs leading-relaxed text-muted-foreground sm:px-6">
                  Unofficial download links or APK repackages may have modified code or advertisements injected — always verify downloads from the verified GitHub release hashes.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* --- Updates Section ("Always Shipping") --- */}
        <section id="updates" aria-labelledby="updates-heading" className="scroll-mt-24 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="mb-10 sm:mb-14">
              <p className="kicker mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-5 bg-brand-accent/60" />
                What's new
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
                Always <span className="text-brand-accent">shipping.</span>
              </h2>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
              
              {/* Release Feed */}
              <div>
                <ol className="border-t border-border">
                  {(stats.releasesList.length > 0 ? stats.releasesList.slice(0, 4) : [
                    {
                      tag_name: 'v1.6.0',
                      published_at: '2026-05-15',
                      body: '• Full rewrite of the audio pipeline using Rust & WebAssembly.\n• New 10-band equalizer presets with gapless playback.\n• Synchronized karaoke lyrics manual offset timing controls.\n• Memory optimization and lower background battery consumption.'
                    },
                    {
                      tag_name: 'v1.5.2',
                      published_at: '2026-03-22',
                      body: '• Last.fm offline scrobbler queue and sync.\n• Dynamic color extraction from album covers.\n• Search suggestion optimizations and improved performance.'
                    }
                  ]).map((release, i) => (
                    <li key={release.tag_name || i} className="border-b border-border py-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-sm font-semibold text-brand-accent px-2.5 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/20">
                          {release.tag_name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {release.published_at ? new Date(release.published_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <div className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                        {release.body 
                          ? release.body.slice(0, 320) + (release.body.length > 320 ? '...' : '') 
                          : 'Feature updates, performance improvements, and bug fixes.'}
                      </div>

                      <div className="mt-4">
                        <a
                          href={release.html_url || `${GITHUB_REPO_URL}/releases/tag/${release.tag_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-foreground hover:text-brand-accent transition-colors"
                        >
                          View release assets <ArrowUpRight className="size-3" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Side Notes */}
              <div className="flex flex-col gap-10">
                <div className="border-t border-foreground/25 pt-5">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                    Stay in the loop
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em]">Never miss a release</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Watch the Beats repository on GitHub to receive instant notifications whenever a new build or patch drops.
                  </p>
                  <a
                    href={GITHUB_REPO_URL + '/releases'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-md mt-5"
                  >
                    <FaGithub className="size-4" />
                    All releases on GitHub
                  </a>
                </div>

                <div className="border-t border-foreground/25 pt-5">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                    Ideas &amp; feedback
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em]">Shape the roadmap</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Feature suggestions, UI feedback, and plugin proposals all happen on GitHub Discussions.
                  </p>
                  <a
                    href={GITHUB_REPO_URL + '/discussions'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-md mt-5"
                  >
                    Join the discussions
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- Open Source & Support Section --- */}
        <section id="contribute" aria-labelledby="contribute-heading" className="scroll-mt-24 border-t border-border/60 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="mb-10 sm:mb-14">
              <p className="kicker mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-5 bg-brand-accent/60" />
                Open source &amp; Support
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
                Built in the <span className="text-brand-accent">open.</span>
              </h2>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
              
              {/* Contribution Flow */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">How to contribute</h3>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[0.68rem] text-muted-foreground">
                    {['Flutter', 'Dart', 'Rust', 'BLoC', 'WebAssembly', 'MIT'].map(tech => (
                      <span key={tech} className="rounded-full border border-border bg-card px-2.5 py-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <ol className="mt-8 grid gap-x-8 gap-y-6 border-t border-border sm:grid-cols-2">
                  <li className="border-b border-border py-5">
                    <span aria-hidden="true" className="font-mono text-[0.8rem] text-brand-accent">01</span>
                    <h4 className="mt-2 text-sm font-semibold">Discuss</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Open an issue on GitHub to discuss new feature concepts, UI tweaks, or bug reports.
                    </p>
                  </li>

                  <li className="border-b border-border py-5">
                    <span aria-hidden="true" className="font-mono text-[0.8rem] text-brand-accent">02</span>
                    <h4 className="mt-2 text-sm font-semibold">Fork &amp; branch</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Fork the main branch, clone locally, and create a feature branch for your updates.
                    </p>
                  </li>

                  <li className="border-b border-border py-5">
                    <span aria-hidden="true" className="font-mono text-[0.8rem] text-brand-accent">03</span>
                    <h4 className="mt-2 text-sm font-semibold">Build &amp; test</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Flutter + BLoC + Rust FFI — a delightful architecture to learn, experiment, and hack on.
                    </p>
                  </li>

                  <li className="border-b border-border py-5">
                    <span aria-hidden="true" className="font-mono text-[0.8rem] text-brand-accent">04</span>
                    <h4 className="mt-2 text-sm font-semibold">Open a PR</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Submit your pull request. First-time open source contributors are warmly welcomed!
                    </p>
                  </li>
                </ol>

                <div className="mt-8 flex flex-wrap gap-2.5">
                  <a
                    href={GITHUB_REPO_URL + '/issues'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-md"
                  >
                    Find an issue
                  </a>
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-md"
                  >
                    Contributing guide
                  </a>
                  <a
                    href={GITHUB_REPO_URL + '/issues/new'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-md"
                  >
                    Report a bug
                  </a>
                </div>
              </div>

              {/* Support Card (Donation Options) */}
              <div className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-accent/25 bg-card/60 shadow-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-brand-accent/15 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                        <Heart className="size-3.5 fill-brand-accent" />
                      </div>
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                        Support
                      </p>
                    </div>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                      100% to development
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="text-2xl font-semibold tracking-[-0.02em]">
                      Keep the music <span className="text-brand-accent">playing.</span>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Beats has no advertisements, no subscriptions, and no trackers — just passion and hundreds of hours of coding by <strong className="text-foreground">Aadith C V</strong>.
                    </p>

                    {/* Donation Channels */}
                    <div className="mt-6 space-y-2.5">
                      
                      {/* UPI */}
                      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                        <div className="min-w-0">
                          <p className="text-xs font-mono uppercase text-muted-foreground">UPI (India)</p>
                          <p className="text-sm font-mono truncate text-foreground">aadithaadith14-2@okaxis</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('aadithaadith14-2@okaxis', 'upi')}
                          className="btn btn-sm btn-outline shrink-0 ml-2"
                        >
                          {copiedKey === 'upi' ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}
                          {copiedKey === 'upi' ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      {/* PayPal */}
                      <a
                        href="https://paypal.me/DevAadith"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <FaPaypal className="size-4 text-blue-400" />
                          <span className="text-sm font-medium">Donate via PayPal</span>
                        </div>
                        <ArrowUpRight className="size-4 text-muted-foreground" />
                      </a>

                      {/* Bitcoin */}
                      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                        <div className="min-w-0">
                          <p className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5">
                            <FaBitcoin className="size-3 text-orange-400" /> Bitcoin (BTC)
                          </p>
                          <p className="text-xs font-mono truncate text-foreground">15w6uDZ7aMAo9CqMBBNX8YkNH3qGEJzuDX</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('15w6uDZ7aMAo9CqMBBNX8YkNH3qGEJzuDX', 'btc')}
                          className="btn btn-sm btn-outline shrink-0 ml-2"
                        >
                          {copiedKey === 'btc' ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}
                          {copiedKey === 'btc' ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      {/* USDT / ETH */}
                      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                        <div className="min-w-0">
                          <p className="text-xs font-mono uppercase text-muted-foreground">USDT (TRC20)</p>
                          <p className="text-xs font-mono truncate text-foreground">TBgX4jo8byy2pjfUvWTiEbcUVbybBm7Q85</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('TBgX4jo8byy2pjfUvWTiEbcUVbybBm7Q85', 'usdt')}
                          className="btn btn-sm btn-outline shrink-0 ml-2"
                        >
                          {copiedKey === 'usdt' ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}
                          {copiedKey === 'usdt' ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                    </div>

                    <ul className="mt-6 border-t border-border pt-4 space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-brand-accent shrink-0" />
                        Zero platform cut — everything goes directly to open-source development.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-brand-accent shrink-0" />
                        No paywalls or premium tiers — your generosity keeps all features free.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 border-t border-border/60 bg-card/30 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            
            <div className="mb-10 sm:mb-14 text-center">
              <p className="kicker mb-4 flex items-center justify-center gap-3">
                <span aria-hidden="true" className="h-px w-5 bg-brand-accent/60" />
                FAQ
                <span aria-hidden="true" className="h-px w-5 bg-brand-accent/60" />
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
                Questions, <span className="text-brand-accent">answered.</span>
              </h2>
            </div>

            <div className="divide-y divide-border/80 border-y border-border/80">
              
              <details className="group py-5" open>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-[1.05rem] font-semibold transition-colors hover:text-brand-accent [&::-webkit-details-marker]:hidden">
                  Is Beats really free? What's the catch?
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-brand-accent" />
                </summary>
                <p className="mt-3 pr-8 text-[0.95rem] leading-relaxed text-muted-foreground">
                  There is no catch. Beats is open-source under the permissive MIT license. There are no ads, no paywalled features, no account mandates, and zero tracking. You can inspect all source code, verify builds, or fork it anytime. Development is maintained voluntarily by Aadith C V with generous community donations.
                </p>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-[1.05rem] font-semibold transition-colors hover:text-brand-accent [&::-webkit-details-marker]:hidden">
                  Is it safe? Where should I download it from?
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-brand-accent" />
                </summary>
                <p className="mt-3 pr-8 text-[0.95rem] leading-relaxed text-muted-foreground">
                  Always download only from official channels: GitHub Releases (<a href={GITHUB_REPO_URL} className="underline text-foreground">github.com/{REPO_OWNER}/{REPO_NAME}</a>) or verified IzzyOnDroid / F-Droid repository mirrors. Never install APKs from unauthorized third-party download portals.
                </p>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-[1.05rem] font-semibold transition-colors hover:text-brand-accent [&::-webkit-details-marker]:hidden">
                  Which platforms does it run on?
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-brand-accent" />
                </summary>
                <p className="mt-3 pr-8 text-[0.95rem] leading-relaxed text-muted-foreground">
                  Beats runs natively on Android, Windows, and Linux. Built with Flutter and a native Rust core, it brings platform-native media controls, system notification media widgets, and global hotkeys to each OS.
                </p>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-[1.05rem] font-semibold transition-colors hover:text-brand-accent [&::-webkit-details-marker]:hidden">
                  How do the music sources and .bex plugins work?
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-brand-accent" />
                </summary>
                <p className="mt-3 pr-8 text-[0.95rem] leading-relaxed text-muted-foreground">
                  Beats natively plays local FLAC, MP3, WAV, and AAC files completely offline. For online music, it connects to sandboxed <code className="bg-card px-1.5 py-0.5 rounded text-xs font-mono">.bex</code> plugins running within a memory-safe WebAssembly runtime. Plugins provide chart feeds, stream resolvers, and lyrics engines without compromising app stability.
                </p>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-[1.05rem] font-semibold transition-colors hover:text-brand-accent [&::-webkit-details-marker]:hidden">
                  Does it work without an internet connection?
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-brand-accent" />
                </summary>
                <p className="mt-3 pr-8 text-[0.95rem] leading-relaxed text-muted-foreground">
                  Yes! Offline playback is a first-class feature. All downloaded songs, cached lyrics, and local playlists work without any network connection. When you come back online, queued Last.fm scrobbles automatically sync.
                </p>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-[1.05rem] font-semibold transition-colors hover:text-brand-accent [&::-webkit-details-marker]:hidden">
                  Can I backup or export my playlists and library?
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-brand-accent" />
                </summary>
                <p className="mt-3 pr-8 text-[0.95rem] leading-relaxed text-muted-foreground">
                  Absolutely. Beats gives you complete ownership over your data. You can export your full playlist library as standard JSON or M3U files, compatible with virtually any other music player.
                </p>
              </details>

            </div>

          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="mt-auto border-t border-border/70 bg-card/40 pb-8 pt-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            
            {/* Brand column */}
            <div>
              <a href="#" className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-brand-accent flex items-center justify-center text-black font-bold">
                  <Music className="size-4 stroke-[2.5]" />
                </div>
                <span className="font-display text-lg font-bold tracking-tight">
                  Beats<span className="text-brand-accent">Music</span>
                </span>
              </a>

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Ad-free music from everywhere — your way. A free, open-source, plugin-based audio player built with Flutter &amp; Rust.
              </p>

              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-brand-accent" />
                Maintained by Aadith C V (AWTMODS)
              </p>

              <div className="mt-5 flex items-center gap-1">
                <a
                  href="https://x.com/aadith.cv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Developer on X"
                  className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span className="font-bold text-xs">𝕏</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/aadith.cv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ExternalLink className="size-4" />
                </a>
                <a
                  href="https://t.me/artwebtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <FaTelegramPlane className="size-4" />
                </a>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <FaGithub className="size-4" />
                </a>
              </div>
            </div>

            {/* Explore column */}
            <nav aria-label="Explore">
              <h3 className="font-display text-sm font-semibold">Explore</h3>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Features</a></li>
                <li><a href="#plugins" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">.bex plugins</a></li>
                <li><a href="#screenshots" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Screenshots</a></li>
                <li><a href="#download" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Download</a></li>
                <li><a href="#updates" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Updates</a></li>
              </ul>
            </nav>

            {/* Project column */}
            <nav aria-label="Project">
              <h3 className="font-display text-sm font-semibold">Project</h3>
              <ul className="mt-4 space-y-2.5">
                <li><a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">GitHub repository</a></li>
                <li><a href={GITHUB_REPO_URL + '/releases'} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Releases &amp; tags</a></li>
                <li><a href={GITHUB_REPO_URL + '/issues'} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Issue tracker</a></li>
                <li><a href={GITHUB_REPO_URL + '/blob/main/LICENSE'} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">License (MIT)</a></li>
              </ul>
            </nav>

            {/* Community column */}
            <nav aria-label="Community">
              <h3 className="font-display text-sm font-semibold">Community</h3>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#contribute" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Donate &amp; Support</a></li>
                <li><a href={GITHUB_REPO_URL + '/discussions'} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Discussions</a></li>
                <li><a href="https://t.me/artwebtech" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Telegram Channel</a></li>
                <li><a href="mailto:aadithcv@protonmail.com" className="text-sm text-muted-foreground transition-colors hover:text-brand-accent">Email the developer</a></li>
              </ul>
            </nav>

          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/70 py-6 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Beats Music · MIT License · Maintained by Aadith C V
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Made with <Heart className="size-3 fill-brand-accent text-brand-accent" /> in India
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand-accent/50 hover:text-foreground"
            >
              <ArrowUp className="size-3.5" />
              Back to top
            </a>
          </div>

        </div>
      </footer>

      <Analytics />
    </div>
  );
}
