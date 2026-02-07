
import React, { useState } from 'react';
import { Post, UserProfile } from '../types';
import { PILLAR_COLORS } from '../constants';
import { medAI } from '../services/api';

interface PostCardProps {
  post: Post;
  isSaved: boolean;
  onToggleSave: () => void;
  user: UserProfile;
}

interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, isSaved, onToggleSave, user }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [localComments, setLocalComments] = useState<Comment[]>([
    {
      id: 'initial-1',
      author: 'Dr. Rahul K.',
      role: 'Intern @ AIIMS',
      text: post.isMCQ 
        ? 'Great case! The presentation of RV strain on ECG is often overlooked in early PE.' 
        : 'High-yield summary. This will definitely help in the upcoming professional exams.',
      timestamp: '2h ago'
    }
  ]);

  const handleAiDeepDive = async () => {
    if (aiInsight) {
      setAiInsight(null);
      return;
    }
    setIsAiLoading(true);
    const insight = await medAI.getClinicalInsight(post, user);
    setAiInsight(insight);
    setIsAiLoading(false);
  };

  const handleShare = async () => {
    const shareMessage = `*WhiteCoatOnly | Clinical Insight*\n\n*${post.title}*\n\n${post.content}\n\n_Shared from the Medical Collective_`;
    const shareUrl = 'https://whitecoatonly.app';

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'WhiteCoatOnly Pearl',
          text: shareMessage,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareMessage}\n\nView more on WhiteCoatOnly.`);
        alert('Pearl formatted for your Batch Group! 🩺');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: user.name,
      role: user.year,
      text: commentText.trim(),
      timestamp: 'Just now'
    };

    setLocalComments([newComment, ...localComments]);
    setCommentText('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 shadow-sm uppercase">
            {post.author[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">{post.author}</span>
            <span className="text-[10px] text-slate-500 font-medium">{post.authorYear}</span>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${PILLAR_COLORS[post.pillar]}`}>
          {post.pillar}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-4">
        <h3 className="font-bold text-slate-900 mb-2 leading-tight text-base">{post.title}</h3>
        <p className="text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
          {post.content}
        </p>

        {post.imageUrl && (
          <div className="relative group cursor-zoom-in rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 mb-4">
            <img src={post.imageUrl} alt={post.title} className="w-full h-52 object-contain" />
          </div>
        )}

        {/* AI Resident Pearl Button */}
        <button 
          onClick={handleAiDeepDive}
          disabled={isAiLoading}
          className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all mb-4 ${
            aiInsight 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-blue-600 border-blue-100 hover:bg-blue-50'
          }`}
        >
          {isAiLoading ? (
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-stethoscope animate-pulse"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">Consulting Resident AI...</span>
            </div>
          ) : (
            <>
              <i className="fa-solid fa-sparkles text-[10px]"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {aiInsight ? 'Hide Senior Insight' : 'AI Deep Dive (Senior Resident)'}
              </span>
            </>
          )}
        </button>

        {aiInsight && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-inner animate-slideUp">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-doctor text-[8px] text-white"></i>
              </div>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Senior Resident's Perspective</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              {aiInsight}
            </p>
          </div>
        )}

        {/* MCQ Section */}
        {post.isMCQ && post.options && (
          <div className="flex flex-col gap-2.5 mb-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 mt-2">
            {post.options.map((option, idx) => (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => {
                  setSelectedOption(idx);
                  // The explanation is triggered only upon answer selection
                  setShowExplanation(true);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border shadow-sm ${
                  selectedOption === idx
                    ? idx === post.correctOption
                      ? 'bg-green-50 border-green-200 text-green-700 font-bold'
                      : 'bg-red-50 border-red-200 text-red-700 font-bold'
                    : selectedOption !== null && idx === post.correctOption
                      ? 'bg-green-50 border-green-200 text-green-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border ${
                    selectedOption === idx 
                      ? (idx === post.correctOption ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600')
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
            
            {/* 
                Ethical Interaction Check: 
                The explanation block is rendered conditionally based on answer selection.
                This ensures users engage with the clinical challenge before receiving the rationale.
            */}
            {selectedOption !== null && showExplanation && (
              <div className="mt-3 p-4 bg-slate-900 rounded-2xl text-white animate-slideUp">
                <div className="flex items-center gap-2 mb-2">
                  <i className={`fa-solid ${selectedOption === post.correctOption ? 'fa-circle-check text-green-400' : 'fa-circle-xmark text-red-400'} text-xs`}></i>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Clinical Rationale</p>
                </div>
                <p className="text-xs leading-relaxed opacity-95">
                  {post.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Peer Discussion */}
      {showComments && (
        <div className="px-4 py-5 bg-slate-50 border-t border-slate-100 animate-fadeIn space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              Verified Peer Discussion ({localComments.length})
            </h4>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar pr-1">
            {localComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white shadow-sm uppercase">
                  {comment.author[0]}
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex-1">
                  <p className="text-[11px] text-slate-800 leading-relaxed">{comment.text}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[8px] text-slate-400 font-bold uppercase">{comment.role}</span>
                    <span className="text-[8px] text-slate-300 font-medium italic">{comment.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your clinical doubt..." 
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 bg-white flex items-center justify-between border-t border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 ${showComments ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${showComments ? 'bg-blue-50' : 'bg-slate-50'}`}>
              <i className={`${showComments ? 'fa-solid' : 'fa-regular'} fa-comment-dots text-sm`}></i>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider hidden xs:inline">Discuss</span>
          </button>
          
          <button onClick={handleShare} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 group">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <i className="fa-regular fa-paper-plane text-sm"></i>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider hidden xs:inline">Share</span>
          </button>
        </div>
        
        <button 
          onClick={onToggleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isSaved ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 bg-slate-50'
          }`}
        >
          <i className={`${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark text-sm`}></i>
          <span className="text-[10px] font-black uppercase tracking-wider">{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
