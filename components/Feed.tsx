
import React from 'react';
import { ContentPillar, Post, UserProfile } from '../types';
import { PILLAR_COLORS } from '../constants';
import PostCard from './PostCard';

interface FeedProps {
  activePillar: ContentPillar | 'ALL';
  onPillarChange: (pillar: ContentPillar | 'ALL') => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  posts: Post[];
  onOpenPost: () => void;
}

const Feed: React.FC<FeedProps> = ({ activePillar, onPillarChange, user, setUser, posts, onOpenPost }) => {
  const filteredPosts = activePillar === 'ALL' 
    ? posts 
    : posts.filter(p => p.pillar === activePillar);

  return (
    <div className="flex flex-col gap-4 animate-fadeIn relative">
      <div className="flex gap-2 px-6 pt-4 overflow-x-auto no-scrollbar sticky top-0 bg-white z-20 pb-2">
        <button
          onClick={() => onPillarChange('ALL')}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
            activePillar === 'ALL' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          All Focus
        </button>
        {Object.values(ContentPillar).map(pillar => (
          <button
            key={pillar}
            onClick={() => onPillarChange(pillar)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
              activePillar === pillar 
                ? PILLAR_COLORS[pillar] + ' border-current shadow-lg' 
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            {pillar}
          </button>
        ))}
      </div>

      <div className="px-6 flex flex-col gap-6 pb-12">
        <div 
          onClick={onOpenPost}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer group hover:border-blue-300 transition-all shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <i className="fa-solid fa-pen-nib text-sm"></i>
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Post a clinical insight...</span>
        </div>

        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              user={user}
              isSaved={user.savedPosts.includes(post.id)}
              onToggleSave={() => {
                setUser(prev => {
                  if (!prev) return null;
                  return {
                    ...prev,
                    savedPosts: prev.savedPosts.includes(post.id)
                      ? prev.savedPosts.filter(id => id !== post.id)
                      : [...prev.savedPosts, post.id]
                  };
                });
              }}
            />
          ))
        ) : (
          <div className="text-center py-24 text-slate-300">
            <i className="fa-solid fa-stethoscope text-4xl mb-4 opacity-10"></i>
            <p className="text-xs font-black uppercase tracking-widest">Archive is empty</p>
          </div>
        )}
        
        <div className="mt-8 border-t border-slate-50 pt-8 pb-12 text-center flex flex-col items-center gap-4">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Daily High-Yield Goal Reached
          </p>
          <button className="text-blue-600 font-black text-[9px] uppercase tracking-widest border border-blue-100 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
            Load More Case Files
          </button>
        </div>
      </div>

      <button 
        onClick={onOpenPost}
        className="fixed bottom-24 right-6 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-30"
      >
        <i className="fa-solid fa-plus text-xl"></i>
      </button>
    </div>
  );
};

export default Feed;
