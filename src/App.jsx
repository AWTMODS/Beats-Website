import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Music, Download, ChevronRight, 
  WifiOff, Mic2, Cloud, History,
  Gamepad2, Languages, Palette, Smartphone, Monitor,
  TerminalSquare, Blocks, Zap, Heart, Disc3, Radio, AudioWaveform, CheckCircle2,
  Copy, Check, ExternalLink
} from 'lucide-react';
import { FaGithub, FaBitcoin, FaPaypal, FaAndroid, FaWindows, FaLinux } from 'react-icons/fa';
import { Analytics } from '@vercel/analytics/react';

const GITHUB_RELEASES_API = 'https://api.github.com/repos/AWTMODS/Beats-Music/releases';
const CHANGELOG_URL = 'https://raw.githubusercontent.com/AWTMODS/Beats-Music/main/CHANGELOG.md';

const fadeUp = {
  hidden: { opacity: 0, y: 50, rotateX: 15, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1, 
    transition: { type: 'spring', stiffness: 80, damping: 20 } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Navbar = ({ onDownloadClick }) => (
  <nav className="fixed top-0 left-0 right-0 z-40 glass border-b-0 border-white/10">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center glow-green">
          <Music className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Beats</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#changelog" className="hover:text-white transition-colors">Changelog</a>
        <a href="https://github.com/AWTMODS/Beats-Music" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
          <FaGithub className="w-4 h-4" /> GitHub
        </a>
      </div>
      <button 
        onClick={onDownloadClick}
        className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-sm font-semibold transition-all glow-green text-white"
      >
        <Download className="w-4 h-4" />
        Download Free
      </button>
    </div>
  </nav>
);

const DownloadModal = ({ isOpen, onClose }) => {
  const [data, setData] = React.useState({ stable: null, beta: null });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isOpen) return;
    const fetchReleases = async () => {
      try {
        const response = await fetch(GITHUB_RELEASES_API);
        const releases = await response.json();
        
        const stable = releases.find(r => !r.prerelease);
        const beta = releases.find(r => r.prerelease);
        
        setData({ stable, beta });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, [isOpen]);

  if (!isOpen) return null;

  const DownloadCard = ({ release, title, type, color }) => {
    if (!release) return null;
    
    const assets = {
      apk: release.assets.find(a => a.name.endsWith('.apk')),
      exe: release.assets.find(a => a.name.endsWith('.exe')),
      linux: release.assets.find(a => a.name.endsWith('.AppImage') || a.name.endsWith('.deb'))
    };

    return (
      <div className="glass-card p-6 flex flex-col items-start text-left border-white/10 hover:border-white/20 transition-colors relative overflow-hidden group">
        {type === 'beta' && <div className="beta-badge absolute top-4 right-4 z-10">Beta</div>}
        <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${color === 'green' ? 'bg-accent1/20 text-accent1' : 'bg-blue-500/20 text-blue-400'}`}>
          {type === 'beta' ? <Zap className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
        </div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
          {release.tag_name} • {new Date(release.published_at).toLocaleDateString()}
        </p>
        
        <div className="space-y-3 w-full">
          {assets.apk && (
            <a href={assets.apk.browser_download_url} className="flex items-center justify-between w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <div className="flex items-center gap-3">
                <FaAndroid className="text-green-500" />
                <span className="text-sm font-medium">Android APK</span>
              </div>
              <Download className="w-4 h-4 opacity-50" />
            </a>
          )}
          {assets.exe && (
            <a href={assets.exe.browser_download_url} className="flex items-center justify-between w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <div className="flex items-center gap-3">
                <FaWindows className="text-blue-400" />
                <span className="text-sm font-medium">Windows Setup</span>
              </div>
              <Download className="w-4 h-4 opacity-50" />
            </a>
          )}
          {assets.linux && (
            <a href={assets.linux.browser_download_url} className="flex items-center justify-between w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <div className="flex items-center gap-3">
                <FaLinux className="text-orange-400" />
                <span className="text-sm font-medium">Linux Package</span>
              </div>
              <Download className="w-4 h-4 opacity-50" />
            </a>
          )}
          <a href={release.html_url} className="block text-center text-xs text-gray-500 hover:text-white transition-colors pt-2">View Full Release Notes</a>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-4xl glass-modal p-8 sm:p-12 overflow-hidden animate-modal-in"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2">
          <Zap className="w-6 h-6 rotate-45" />
        </button>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Version</h2>
          <p className="text-gray-400 max-w-lg mx-auto">Select the build that fits your needs. Stable for everyday use, or Beta to test the latest features.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent1/20 border-t-accent1 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DownloadCard release={data.stable} title="Stable Build" type="stable" color="green" />
            <DownloadCard release={data.beta} title="Beta Channel" type="beta" color="blue" />
          </div>
        )}

        <div className="mt-12 text-center text-xs text-gray-500">
          By downloading, you agree to our <a href="#" className="underline">Terms of Service</a>. Beats is open-source and respects your privacy.
        </div>
      </motion.div>
    </div>
  );
};

const Hero = ({ onDownloadClick }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Waves */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="flex gap-2 isolate">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 bg-accent-gradient rounded-full sound-wave" 
              style={{
                height: `${Math.random() * 200 + 50}px`,
                animationDelay: `${Math.random()}s`,
                animationDuration: `${Math.random() * 1 + 1}s`
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent1/30 bg-accent1/10 text-accent2 text-sm font-medium mb-8"
        >
          <Zap className="w-4 h-4" /> v1.5.1 is out now
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Your Music.<br />
          <span className="text-gradient">Your Rules.</span><br />
          Zero Ads.
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          A unified local & plugin-first streaming music player built with Flutter & Rust. 
          <strong className="text-white font-medium ml-2 relative">
             Open-source, forever free.
             <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-accent-gradient rounded-full opacity-50"></span>
          </strong>
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button 
            onClick={onDownloadClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform glow-green"
          >
            <Download className="w-5 h-5" /> Download Now
          </button>
          <a 
            href="#features"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-surface border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-accent2" /> Explore Features
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-500"
        >
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-white/5"><TerminalSquare className="w-4 h-4 text-green-400"/> Android</span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-white/5"><Monitor className="w-4 h-4 text-blue-400"/> Windows</span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-white/5"><TerminalSquare className="w-4 h-4 text-orange-400"/> Linux</span>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <a href="https://apt.izzysoft.de/fdroid/index/apk/ls.Beats.musicplayer" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
            <img src="https://gitlab.com/IzzyOnDroid/repo/-/raw/master/assets/IzzyOnDroid.png" alt="IzzyOnDroid" className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, size = "small", className="" }) => (
  <motion.div 
    variants={fadeUp}
    className={`glass-card p-8 flex flex-col group hover:border-accent1/50 transition-colors ${size === 'large' ? 'md:col-span-2' : 'col-span-1'} ${className}`}
  >
    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-accent1/20 group-hover:text-accent1 transition-colors text-2xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed max-w-sm">{description}</p>
  </motion.div>
);

const Features = () => {
  return (
    <section id="features" className="py-32 relative z-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Everything You Need.</h2>
          <p className="text-xl text-gray-400 max-w-2xl">A beautifully crafted experience tailored for audiophiles. Packed with powerful features yet simple to use.</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ perspective: 1000 }}
        >
          <FeatureCard 
            size="large"
            icon="🚫"
            title="100% Ad-Free" 
            description="Zero interruptions. Zero compromise. Just pure music flowing continuously."
            className="md:row-span-2 justify-center items-center text-center !p-12 relative overflow-hidden"
          />
          <FeatureCard 
            icon="🦀"
            title="Rust Plugins" 
            description="Secure .bex plugin system for infinite global music sources — auto-updating & sandboxed." 
          />
          <FeatureCard 
            icon="📂"
            title="Hybrid Library" 
            description="Seamlessly mix local offline music and online streams in one unified queue." 
          />
          <FeatureCard 
            icon="🎛️"
            title="Audio Perfection" 
            description="Built-in Equalizer, Crossfade, Gapless playback, pitch/speed control." 
          />
          <FeatureCard 
            icon="🎙️"
            title="Karaoke Lyrics" 
            description="Dynamic, time-synced lyrics with one-tap manual offset adjustment." 
          />
          
          <FeatureCard 
            icon="📶"
            title="Offline Mode" 
            description="Download any stream or playlist. Listen anywhere, anytime." 
          />
          <FeatureCard 
            icon="📈"
            title="Global Charts" 
            description="Top songs, top artists, and curated mixes — personalized to your taste." 
          />
          <FeatureCard 
            icon="💅"
            title="Dynamic Palettes" 
            description="UI automatically extracts and adapts to the color palette of your album artwork." 
          />
          <FeatureCard 
            icon="☁️"
            title="Cloud Sync" 
            description="Backup & sync playlists, liked songs, downloads, and stats to Google Cloud." 
          />
          <FeatureCard 
            icon="📊"
            title="Last.fm Scrobbling" 
            description="Full listening history tracking with offline fallback caching." 
          />
          <FeatureCard 
            icon="🎮"
            title="Discord RPC" 
            description="Show your current track on Discord in real time via native RPC." 
          />
          <FeatureCard 
            icon="🌍"
            title="12+ Languages" 
            description="English, Hindi, Spanish, French, Arabic, Russian, Korean, Japanese & more." 
          />
        </motion.div>
      </div>
    </section>
  );
};

const PluginEcosystem = () => (
  <section className="py-32 relative z-10 px-6 bg-surface/30 border-y border-white/5">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
      <div className="flex-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold mb-6 border border-blue-500/20">
          <Blocks className="w-4 h-4" /> WebAssembly Architecture
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Infinite Music Sources via Plugins</h2>
        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
          Install <code className="bg-white/10 px-2 py-1 rounded text-accent2">.bex</code> plugins from our built-in repository to unlock streaming from any source. 
          Plugins are written in WebAssembly, tightly sandboxed by Rust, and auto-update perfectly in the background.
        </p>
        <ul className="space-y-4">
          {['contentResolver', 'chartProvider', 'lyricsProvider', 'searchSuggestionProvider'].map((type) => (
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              key={type} 
              className="flex items-center gap-3 text-gray-300 font-mono text-sm bg-surface p-4 rounded-xl border border-white/5"
            >
              <CheckCircle2 className="w-5 h-5 text-green-400" /> {type}
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full" style={{ perspective: 1000 }}>
        <motion.div 
          initial={{ opacity: 0, rotateY: -15, scale: 0.95 }}
          whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-2 border-accent1/30 relative"
          style={{ boxShadow: '0 20px 40px -10px rgba(29, 185, 84, 0.15)' }}
        >
          <div className="bg-[#0b0f19] rounded-xl p-6 font-mono text-sm overflow-hidden">
            <div className="flex gap-2 mb-4 border-b border-white/10 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <pre className="text-gray-300">
              <span className="text-purple-400">fn</span> <span className="text-blue-400">resolve_stream</span>(query: String) -{'>'} Result{'<'}Stream{'>'} {'{\n'}
              {'  '}let source = Source::new(query);{'\n'}
              {'  '}let secure_ctx = WasmRuntime::init();{'\n'}
              {'  '}<span className="text-accent2">// Sandboxed execution</span>{'\n'}
              {'  '}secure_ctx.execute(source.bex_plugin){'\n'}
              {'}'}
            </pre>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex gap-4">
               <div className="flex-1 bg-surface rounded p-3 flex flex-col items-center">
                 <Radio className="w-6 h-6 text-accent2 mb-2"/>
                 <span className="text-xs text-gray-400">Streams</span>
               </div>
               <div className="flex-1 bg-surface rounded p-3 flex flex-col items-center">
                 <AudioWaveform className="w-6 h-6 text-accent1 mb-2"/>
                 <span className="text-xs text-gray-400">Hi-Res Audio</span>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const PlatformSection = () => (
  <section className="py-32 relative z-10 px-6">
    <div className="max-w-7xl mx-auto text-center">
      <div className="mb-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">One App. Every Platform.</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Seamless native experience, whether you're on the go or at your desk.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {[
          { icon: <Smartphone className="w-8 h-8"/>, title: "Android", features: ["Material You Support", "Android Auto", "Background Playback"] },
          { icon: <Monitor className="w-8 h-8"/>, title: "Windows", features: ["Native Window Frame", "System Media Controls", "Global Hotkeys"] },
          { icon: <TerminalSquare className="w-8 h-8"/>, title: "Linux", features: ["AppImage / Flatpak", "MPRIS Support", "Wayland Native"] },
        ].map((p, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            key={p.title} 
            className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              {p.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
            <ul className="space-y-3">
              {p.features.map(f => (
                <li key={f} className="text-gray-400 flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-accent2"/> {f}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Changelog = () => {
  const [changelog, setChangelog] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [changelogRes, releasesRes] = await Promise.all([
          fetch(CHANGELOG_URL),
          fetch(GITHUB_RELEASES_API)
        ]);
        
        const text = await changelogRes.text();
        const releases = await releasesRes.json();
        
        // Advanced parser: splits by release separators (---)
        const sections = text.split('---').filter(s => s.trim().length > 0);
        
        const parsed = sections.map((section, idx) => {
          const lines = section.trim().split('\n');
          
          // Try to find a matching release by index or version mention
          const release = releases[idx] || null;
          const version = release ? release.tag_name : (lines.find(l => l.includes('v')) || "Update");
          
          const categories = {
            features: [],
            improvements: [],
            fixes: []
          };

          let currentCategory = null;
          lines.forEach(line => {
            const l = line.trim();
            if (l.toLowerCase().includes('features')) currentCategory = 'features';
            else if (l.toLowerCase().includes('improvements')) currentCategory = 'improvements';
            else if (l.toLowerCase().includes('fixed') || l.toLowerCase().includes('fixes')) currentCategory = 'fixes';
            
            if (l.startsWith('-') && currentCategory) {
              categories[currentCategory].push(l.replace(/^- /g, '').trim());
            }
          });

          return { 
            version, 
            date: release ? new Date(release.published_at).toLocaleDateString() : null,
            categories,
            raw: section 
          };
        });

        setChangelog(parsed);
      } catch (error) {
        console.error("Failed to fetch changelog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedLogs = showAll ? changelog : changelog.slice(0, 5);

  return (
    <section id="changelog" className="py-32 relative z-10 px-6 bg-surface/30 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">Always Improving.</h2>
            <p className="text-gray-400">Track every update, optimization, and bug fix we've made.</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 rounded bg-accent1/20 text-accent2 text-sm font-bold border border-accent1/30">Total Releases: {changelog.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent1/20 border-t-accent1 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-white/10">
            {displayedLogs.map((log, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="relative pl-12"
              >
                <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center ${i === 0 ? 'bg-accent1' : 'bg-surface'}`}>
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-gray-500'}`}></div>
                </div>
                
                <div className="glass-card p-8 border-l-4 border-l-accent2 hover:border-l-white transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h4 className="text-2xl font-black text-white">{log.version}</h4>
                    {log.date && <span className="text-sm font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full">{log.date}</span>}
                  </div>

                  <div className="space-y-8">
                    {Object.entries(log.categories).map(([cat, items]) => items.length > 0 && (
                      <div key={cat}>
                        <h5 className="text-xs uppercase tracking-widest font-black text-gray-500 mb-4 flex items-center gap-2">
                          {cat === 'features' && <Zap className="w-3 h-3 text-accent1" />}
                          {cat === 'improvements' && <Zap className="w-3 h-3 text-blue-400" />}
                          {cat === 'fixes' && <Zap className="w-3 h-3 text-orange-400" />}
                          {cat}
                        </h5>
                        <ul className="space-y-3">
                          {items.map((item, idx) => (
                            <li key={idx} className="text-gray-300 text-sm md:text-base flex items-start gap-3 leading-relaxed">
                              <span className="text-accent2 mt-1.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {!log.categories.features.length && !log.categories.improvements.length && !log.categories.fixes.length && (
                       <div className="text-gray-400 text-sm whitespace-pre-line leading-relaxed italic">
                         {log.raw.split('\n').filter(l => l.trim().startsWith('-')).join('\n') || "Major internal refactoring and stability improvements."}
                       </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {!showAll && changelog.length > 5 && (
              <div className="pl-12 pt-8 text-center sm:text-left">
                <button 
                  onClick={() => setShowAll(true)}
                  className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold flex items-center gap-2 mx-auto sm:mx-0"
                >
                  Show All {changelog.length} Releases <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const DownloadSection = ({ onDownloadClick }) => (
  <section id="download" className="py-32 relative z-10 px-6 text-center">
    <div className="max-w-4xl mx-auto">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-accent-gradient flex items-center justify-center glow-green mb-10 animate-bounce">
        <Download className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">Get Beats. <span className="text-gray-500">It's Free.</span></h2>
      <p className="text-xl text-gray-400 mb-12">Join thousands of users enjoying pure, ad-free music.</p>
      
      <button 
        onClick={onDownloadClick}
        className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-white text-black font-black text-xl hover:scale-105 transition-all flex items-center justify-center gap-3 glow-green mx-auto"
      >
        <Smartphone className="w-6 h-6"/> Download Beats Now
      </button>
      
      <p className="mt-8 text-sm text-gray-500">Available for Android, Windows, and Linux.</p>
    </div>
  </section>
);

const SupportSection = () => {
  const [copied, setCopied] = React.useState(null);

  const donationMethods = [
    { name: 'UPI', value: 'aadithaadith14-2@okaxis', icon: <Smartphone className="w-4 h-4" /> },
    { name: 'PayPal', value: 'https://paypal.me/DevAadith', icon: <FaPaypal className="w-4 h-4" />, isLink: true },
    { name: 'Bitcoin', value: '15w6uDZ7aMAo9CqMBBNX8YkNH3qGEJzuDX', icon: <FaBitcoin className="w-4 h-4 text-orange-400" /> },
    { name: 'ETH / USDT', value: 'TBgX4jo8byy2pjfUvWTiEbcUVbybBm7Q85', icon: <Zap className="w-4 h-4 text-blue-400" /> },
  ];

  const handleCopy = (value, name) => {
    navigator.clipboard.writeText(value);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-24 relative z-10 px-6 bg-surface/50 border-t border-white/5">
      <div className="max-w-5xl mx-auto text-center">
        <Heart className="w-12 h-12 text-accent2 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl font-bold mb-4">Support the Developer</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">Beats is a passion project by <span className="text-white font-medium text-gradient">Aadith C V</span>. Consider donating to keep it ad-free, open-source, and constantly evolving.</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {donationMethods.map(method => (
            method.isLink ? (
              <a 
                key={method.name}
                href={method.value}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-lg border border-white/10 bg-surface/50 font-medium text-sm hover:border-accent2/50 transition-all hover:-translate-y-1 flex items-center gap-2 group"
              >
                {method.icon}
                {method.name}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ) : (
              <button 
                key={method.name} 
                onClick={() => handleCopy(method.value, method.name)}
                className="px-6 py-3 rounded-lg border border-white/10 bg-surface/50 font-medium text-sm hover:border-accent2/50 transition-all hover:-translate-y-1 flex items-center gap-2 relative group"
              >
                {method.icon}
                {method.name}
                {copied === method.name ? (
                  <Check className="w-4 h-4 text-green-400 animate-in zoom-in duration-300" />
                ) : (
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                
                {copied === method.name && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap"
                  >
                    Copied!
                  </motion.span>
                )}
              </button>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-white/10 bg-black pt-16 pb-8 px-6 relative z-10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent-gradient flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Beats</span>
        </div>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          The ultimate open-source music player, designed to put you in pure control of your audio experience.
        </p>
        <div className="text-sm font-medium text-white/80 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10">
          Made with ❤️ in India
        </div>
      </div>
      
      <div>
        <h4 className="font-bold mb-6 text-lg">Links</h4>
        <ul className="space-y-4 text-sm text-gray-400">
          <li><a href="https://github.com/AWTMODS/Beats-Music" className="hover:text-white transition-colors">GitHub Repository</a></li>
          <li><a href="https://github.com/AWTMODS/Beats-Music/releases" className="hover:text-white transition-colors">Releases</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Discord Server</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-6 text-lg">Connect</h4>
        <ul className="space-y-4 text-sm text-gray-400">
          <li><a href="https://www.linkedin.com/in/aadith.cv/" className="hover:text-white transition-colors">LinkedIn</a></li>
          <li><a href="https://x.com/aadith.cv/" className="hover:text-white transition-colors">X (Twitter)</a></li>
          <li><a href="https://instagram.com/aadith.cv/" className="hover:text-white transition-colors">Instagram</a></li>
          <li><a href="https://t.me/artwebtech" className="hover:text-white transition-colors">Telegram</a></li>
          <li><a href="mailto:aadithcv@protonmail.com" className="hover:text-white transition-colors">aadithcv@protonmail.com</a></li>
        </ul>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
      <p>© {new Date().getFullYear()} Beats Music. All rights reserved.</p>
      <p>Released under the MIT License.</p>
    </div>
  </footer>
);

export default function App() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background selection:bg-accent1/30 selection:text-white">
      <div className="grain"></div>
      <Navbar onDownloadClick={() => setIsDownloadModalOpen(true)} />
      <main>
        <Hero onDownloadClick={() => setIsDownloadModalOpen(true)} />
        <Features />
        <PluginEcosystem />
        <PlatformSection />
        <Changelog />
        <DownloadSection onDownloadClick={() => setIsDownloadModalOpen(true)} />
        <SupportSection />
      </main>
      <Footer />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
      <Analytics />
    </div>
  );
}
