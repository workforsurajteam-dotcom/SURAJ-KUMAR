import React, { useState, useRef } from 'react';
import { ContentPillar, Post, UserProfile } from '../types';
import { PILLAR_COLORS } from '../constants';

interface CreatePostProps {
  onClose: () => void;
  onPost: (post: Post) => void;
  user: UserProfile;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose, onPost, user }) => {
  const [isMCQ, setIsMCQ] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pillar, setPillar] = useState<ContentPillar>(ContentPillar.LEARN);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // MCQ States
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleShareImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'clinical-preview.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Clinical Insight - WhiteCoatOnly',
          text: `Check out this clinical finding: ${title}`
        });
      } else {
        await navigator.share({
          title: 'WhiteCoatOnly Clinical Finding',
          text: title,
          url: window.location.href
        });
      }
    } catch (err) {
      alert('Your browser does not support direct image sharing. You can still publish the post.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please provide a title and content for your clinical contribution.');
      return;
    }

    if (isMCQ) {
      if (options.some(opt => !opt.trim())) {
        alert('Please fill in all MCQ options (A, B, C, D).');
        return;
      }
      if (!explanation.trim()) {
        alert('Please provide an explanation for the correct answer.');
        return;
      }
    }

    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      pillar,
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl || undefined,
      author: user.name,
      authorYear: user.year,
      timestamp: 'Just now',
      savedCount: 0,
      isMCQ,
      options: isMCQ ? options : undefined,
      correctOption: isMCQ ? correctOption : undefined,
      explanation: isMCQ ? explanation : undefined
    };

    onPost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl animate-slideUp overflow-y-auto max-h-[95vh] no-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Share Knowledge</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Medical Contribution</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-full transition-colors active:scale-90">
            <i className="fa-solid fa-xmark text-slate-500"></i>
          </button>
        </div>

        {/* Post Type Selector */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button 
            type="button"
            onClick={() => setIsMCQ(false)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isMCQ ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            Clinical Pearl
          </button>
          <button 
            type="button"
            onClick={() => setIsMCQ(true)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isMCQ ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            Interactive MCQ
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Pillar Selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {Object.values(ContentPillar).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPillar(p)}
                className={`px-5 py-2 rounded-full text-[10px] font-black whitespace-nowrap border transition-all ${
                  pillar === p ? PILLAR_COLORS[p] + ' border-current shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {isMCQ ? 'Topic / Subject' : 'High-Yield Title'}
              </label>
              <input 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isMCQ ? "e.g. Cardiology: Heart Failure" : "e.g. Signs of Tension Pneumothorax"}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {isMCQ ? 'Clinical Question' : 'Clinical Details'}
              </label>
              <textarea 
                required 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                rows={isMCQ ? 3 : 4}
                placeholder={isMCQ ? "A 65-year-old male presents with..." : "Share findings, mechanisms, or exam pearls..."}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all"
              />
            </div>

            {/* MCQ Options */}
            {isMCQ && (
              <div className="space-y-3 animate-fadeIn">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Options & Correct Answer</label>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectOption(idx)}
                      className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all ${
                        correctOption === idx 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </button>
                    <input 
                      required
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Explanation (High-Yield Rationale)</label>
                  <textarea 
                    required 
                    value={explanation} 
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={3}
                    placeholder="Explain why the selected option is correct..."
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Image Upload Area */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Evidence</label>
              
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                ref={cameraInputRef} 
                onChange={handleFileChange} 
              />
              
              {imageUrl ? (
                <div className="relative group rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
                  <img src={imageUrl} alt="Clinical findings preview" className="w-full h-48 object-contain" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      type="button"
                      onClick={handleShareImage}
                      className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                    >
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl py-8 flex flex-col items-center gap-2 hover:bg-blue-100 transition-all text-blue-600 active:scale-95"
                  >
                    <i className="fa-solid fa-camera text-2xl"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">Take Photo</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-8 flex flex-col items-center gap-2 hover:bg-slate-100 transition-all text-slate-400 active:scale-95"
                  >
                    <i className="fa-solid fa-images text-2xl"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">Gallery</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3 border border-amber-100 mt-2">
            <i className="fa-solid fa-user-shield text-amber-500 mt-0.5"></i>
            <p className="text-[9px] text-amber-800 leading-relaxed font-bold uppercase tracking-tight">
              HIPAA Reminder: Ensure no patient names, faces, or IDs are visible in clinical images.
            </p>
          </div>

          <button 
            type="submit"
            className="mt-2 bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span>{isMCQ ? 'Publish Medical Challenge' : 'Publish to WhiteCoatOnly'}</span>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;