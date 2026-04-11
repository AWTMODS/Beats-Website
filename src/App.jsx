import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Music, Download, ChevronRight, 
  WifiOff, Mic2, Cloud, History,
  Gamepad2, Languages, Palette, Smartphone, Monitor,
  TerminalSquare, Blocks, Zap, Heart, Disc3, Radio, AudioWaveform, CheckCircle2
} from 'lucide-react';
import { FaGithub, FaBitcoin } from 'react-icons/fa';

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

const Navbar = () => (
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
      <a 
        href="#download"
        className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-sm font-semibold transition-all glow-green text-white"
      >
        <Download className="w-4 h-4" />
        Download Free
      </a>
    </div>
  </nav>
);

const Hero = () => {
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
          <a 
            href="https://github.com/AWTMODS/Beats-Music/releases/latest"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform glow-green"
          >
            <Smartphone className="w-5 h-5" /> Download for Android
          </a>
          <a 
            href="https://github.com/AWTMODS/Beats-Music/releases/latest"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-surface border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
          >
            <Monitor className="w-5 h-5" /> Download for Windows
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

const Changelog = () => (
  <section id="changelog" className="py-32 relative z-10 px-6 bg-surface/30 border-y border-white/5">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-end justify-between mb-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Always Improving.</h2>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-accent1/20 text-accent2 text-sm font-bold border border-accent1/30">Latest: v1.5.1</span>
            <a href="https://github.com/AWTMODS/Beats-Music/releases" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-white/20 underline-offset-4">View full changelog</a>
          </div>
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-white/10">
        {[
          { version: "v1.5.1", notes: "Smart Re-engagement Notifications, Magic Link auth, WASM crash fixes" },
          { version: "v1.5.0", notes: "Visual overhaul, playlist grid thumbnails, auth improvements" },
          { version: "v1.4.0", notes: "Local music, Rust plugin runtime, Equalizer, Karaoke lyrics, Crossfade" },
        ].map((log, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            key={log.version} 
            className="relative pl-12"
          >
            <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center ${i === 0 ? 'bg-accent1' : 'bg-surface'}`}>
              <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-gray-500'}`}></div>
            </div>
            <div className="glass-card p-6 border-l-4 border-l-accent2">
              <h4 className="text-xl font-bold mb-2">{log.version}</h4>
              <p className="text-gray-400">{log.notes}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const DownloadSection = () => (
  <section id="download" className="py-32 relative z-10 px-6 text-center">
    <div className="max-w-4xl mx-auto">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-accent-gradient flex items-center justify-center glow-green mb-10 animate-bounce">
        <Download className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">Get Beats. <span className="text-gray-500">It's Free.</span></h2>
      <p className="text-xl text-gray-400 mb-12">Join thousands of users enjoying pure, ad-free music.</p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a 
          href="https://github.com/AWTMODS/Beats-Music/releases/latest"
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-3 glow-green"
        >
          <FaGithub className="w-5 h-5"/> GitHub Releases
        </a>
        <a 
          href="https://apt.izzysoft.de/fdroid/index/apk/ls.Beats.musicplayer"
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface border border-white/10 text-white font-bold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-3"
        >
          <img src="https://gitlab.com/IzzyOnDroid/repo/-/raw/master/assets/IzzyOnDroid.png" alt="IzzyOnDroid" className="h-5" /> IzzyOnDroid
        </a>
      </div>
    </div>
  </section>
);

const SupportSection = () => (
  <section className="py-24 relative z-10 px-6 bg-surface/50 border-t border-white/5">
    <div className="max-w-5xl mx-auto text-center">
      <Heart className="w-12 h-12 text-accent2 mx-auto mb-6 opacity-80" />
      <h2 className="text-3xl font-bold mb-4">Support the Developer</h2>
      <p className="text-gray-400 mb-12 max-w-2xl mx-auto">Beats is a passion project by <span className="text-white font-medium">Aadith C V</span>. Consider donating to keep it ad-free, open-source, and constantly evolving.</p>
      
      <div className="flex flex-wrap justify-center gap-4">
        {['UPI', 'PayPal', 'Bitcoin', 'ETH / USDT'].map(method => (
          <div key={method} className="px-6 py-3 rounded-lg border border-white/10 bg-surface/50 font-medium text-sm hover:border-accent2/50 transition-colors cursor-pointer flex items-center gap-2">
            {method === 'Bitcoin' && <FaBitcoin className="w-4 h-4 text-orange-400" />}
            {method}
          </div>
        ))}
      </div>
    </div>
  </section>
);

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
  return (
    <div className="min-h-screen bg-background selection:bg-accent1/30 selection:text-white">
      <div className="grain"></div>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <PluginEcosystem />
        <PlatformSection />
        <Changelog />
        <DownloadSection />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
}
