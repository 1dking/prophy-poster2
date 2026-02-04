import React, { useState, useEffect } from 'react';
import { Sparkles, Share2, Download, Instagram, Smartphone, Loader2, Type, CheckCircle2, AlertCircle } from 'lucide-react';

const App = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('portrait'); // 'portrait' (4:5) or 'story' (9:16)

  // Sizes Configuration
  const sizes = {
    portrait: { name: 'Feed Portrait', desc: '1080 x 1350', ratio: 'aspect-[4/5]', prompt: '4:5 vertical aspect ratio' },
    story: { name: 'Story', desc: '1080 x 1920', ratio: 'aspect-[9/16]', prompt: '9:16 vertical mobile story aspect ratio' }
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600&family=Montserrat:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const generatePoster = async () => {
    setLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Runtime provided
    
    const sizeConfig = sizes[aspectRatio];
    
    // HEAVILY WEIGHTED TYPOGRAPHY PROMPT
    // We prioritize the font instructions at the start and provide descriptive identifiers
    const prompt = `TYPOGRAPHY MANDATE: Strictly use the 'Montserrat' font (bold, geometric sans-serif) for the main text. 
    The word 'DEVALUING' must be in 'Cormorant Garamond' (italicized, elegant high-contrast serif). 
    Text Content: "IS YOUR BRAND DEVALUING YOUR EDUCATION?". 
    Visual Style: Professional luxury social media asset for 'Prophy' in ${sizeConfig.prompt}. 
    Colors: Prophy Gold (#C5A059) for emphasized text and Clinical White for primary text. 
    Background: Deep Midnight Onyx black (#0A0A0A) with extremely subtle, cinematic dental technology silhouettes in high-contrast shadows. 
    Quality: 8k resolution, minimalist high-fashion layout, perfectly centered for ${sizeConfig.name}. 
    DO NOT use any other fonts, scripts, or handwritten styles.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt }],
            parameters: { sampleCount: 1 }
          }),
        }
      );

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setImageUrl(`data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePoster();
  }, [aspectRatio]);

  return (
    <div className="min-h-screen bg-[#060606] text-white p-4 md:p-12" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter text-[#c5a059]">PROPHY<span className="text-white">.</span></h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Social Asset Generator</p>
          </div>

          {/* Size Selector */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Select Dimensions</p>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(sizes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setAspectRatio(key)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    aspectRatio === key 
                    ? 'border-[#c5a059] bg-[#c5a059]/10' 
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {key === 'portrait' ? <Instagram className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                    <div className="text-left">
                      <p className="text-sm font-bold">{value.name}</p>
                      <p className="text-[10px] text-zinc-500">{value.desc}</p>
                    </div>
                  </div>
                  {aspectRatio === key && <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Spec Card */}
          <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#c5a059]">
                 <Type className="w-4 h-4" />
                 <p className="text-[10px] uppercase tracking-widest font-bold">Typography Protocol</p>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <AlertCircle className="w-3 h-3" />
                <span className="text-[8px] uppercase tracking-widest">Forced Consistency</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Primary Sans</span>
                <span className="text-lg font-bold">Montserrat</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Emphasis Serif</span>
                <span className="text-2xl italic text-[#c5a059]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Cormorant</span>
              </div>
            </div>

            <button 
              onClick={generatePoster}
              disabled={loading}
              className="w-full py-5 bg-[#c5a059] hover:bg-[#b38f4d] text-black font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#c5a059]/10"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span className="uppercase tracking-widest text-xs">Regenerate Proof</span>
            </button>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
             <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-widest">
                The generator is now locked to the <span className="text-white">Montserrat/Cormorant</span> pairing. AI prompts are weighted to prioritize font consistency.
             </p>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className={`relative ${sizes[aspectRatio].ratio} w-full max-w-[450px] group transition-all duration-700 ease-in-out`}>
            
            {/* The Frame */}
            <div className="absolute inset-0 bg-zinc-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,1)] flex items-center justify-center">
              {loading ? (
                <div className="text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-[#c5a059] animate-spin mx-auto" />
                    <div className="absolute inset-0 bg-[#c5a059]/20 blur-xl animate-pulse rounded-full"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[#c5a059] animate-pulse">Enforcing Typography</p>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-zinc-600 italic">Montserrat + Cormorant Italic</p>
                  </div>
                </div>
              ) : imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Prophy Mockup" 
                  className="w-full h-full object-cover animate-in fade-in duration-1000"
                />
              ) : null}
            </div>

            {/* Float Controls */}
            {!loading && imageUrl && (
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all shadow-2xl group">
                  <Download className="w-5 h-5 text-[#c5a059] group-hover:scale-110 transition-transform" />
                </button>
                <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all shadow-2xl group">
                  <Share2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center opacity-20">
            <p className="text-[10px] uppercase tracking-[1.2em] text-white">Brand Sovereignty Protocol</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
