
import React, { useState, useEffect } from 'react';
import { medAI } from '../services/api';

const VideoLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setVideoUrl(null);
    try {
      const url = await medAI.generateMedicalVideo(prompt, aspectRatio, setStatusMessage);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        alert("API Key session expired. Please select your key again.");
      } else {
        alert("Simulation failed: " + err.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="px-8 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 animate-fadeIn">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
          <i className="fa-solid fa-key text-3xl"></i>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Access Simulation Lab</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Generating medical simulations requires a high-performance API key. Please select a key from a paid GCP project.
          </p>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 font-bold uppercase hover:underline">
            Learn about Billing & Keys
          </a>
        </div>
        <button 
          onClick={handleOpenKeySelector}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          Select Simulation Key
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 flex flex-col gap-6 animate-fadeIn pb-24">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <i className="fa-solid fa-flask-vial text-blue-600"></i>
          Visual Lab
        </h2>
        <p className="text-xs text-slate-500 font-medium">Generate high-yield medical simulations</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visualization Prompt</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. A cross-section of a beating heart showing mitral valve prolapse..."
            className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none h-28"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aspect Ratio</label>
          <div className="flex gap-2">
            {(['16:9', '9:16'] as const).map(ratio => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                disabled={isGenerating}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${
                  aspectRatio === ratio 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
              >
                {ratio === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <i className="fa-solid fa-spinner animate-spin"></i>
          ) : (
            <i className="fa-solid fa-sparkles"></i>
          )}
          {isGenerating ? 'Simulating...' : 'Generate Simulation'}
        </button>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center gap-4 py-12 animate-pulse text-center">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{statusMessage}</p>
            <p className="text-[9px] text-slate-400 font-medium max-w-[200px]">Generating medical visuals takes a few minutes. Stay focused, doctor.</p>
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="flex flex-col gap-4 animate-slideUp">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resulting Simulation</h3>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = videoUrl;
                link.download = 'medical-simulation.mp4';
                link.click();
              }}
              className="text-blue-600 font-bold text-[10px] uppercase hover:underline"
            >
              Download MP4
            </button>
          </div>
          <div className={`w-full overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl bg-black ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-w-[280px] mx-auto'}`}>
            <video src={videoUrl} controls className="w-full h-full object-contain" autoPlay loop muted playsInline />
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
             <p className="text-[9px] text-amber-800 leading-relaxed font-bold uppercase">
               Notice: Generated simulations are for educational visualization purposes only and should be cross-referenced with verified textbooks.
             </p>
          </div>
        </div>
      )}

      <div className="mt-4 p-8 bg-gradient-to-br from-slate-900 to-blue-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        <div className="flex flex-col gap-4 relative z-10">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <i className="fa-solid fa-video text-white"></i>
          </div>
          <h4 className="font-black text-lg tracking-tight leading-tight">Prompt-to-Simulation</h4>
          <p className="text-xs text-white/70 leading-relaxed font-medium">
            Powered by Veo 3. Visualize complex surgeries, microscopic dynamics, or patient scenarios simply by describing them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoLab;
