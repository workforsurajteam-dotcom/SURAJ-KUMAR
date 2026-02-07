
import React, { useState } from 'react';
import { UserProfile, Post, ContentPillar } from '../types';
import PostCard from './PostCard';

interface RevisionFoldersProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  posts: Post[];
}

const RevisionFolders: React.FC<RevisionFoldersProps> = ({ user, setUser, posts }) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isDrillActive, setIsDrillActive] = useState(false);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [drillComplete, setDrillComplete] = useState(false);

  // Helper to get only the posts the user has saved
  const savedPosts = posts.filter(p => user.savedPosts.includes(p.id));

  const FOLDER_CONFIGS = [
    { 
      name: 'Pharmacology', 
      icon: 'fa-capsules',
      filter: (p: Post) => p.content.toLowerCase().includes('drug') || p.title.toLowerCase().includes('pharm') || p.content.toLowerCase().includes('diuretic')
    },
    { 
      name: 'Case Challenges', 
      icon: 'fa-microscope',
      filter: (p: Post) => !!p.isMCQ 
    },
    { 
      name: 'Clinical Pearls', 
      icon: 'fa-gem',
      filter: (p: Post) => !p.isMCQ && (p.pillar === ContentPillar.LEARN || p.pillar === ContentPillar.THINK)
    },
    { 
      name: 'Mental Wellbeing', 
      icon: 'fa-heart-pulse',
      filter: (p: Post) => p.pillar === ContentPillar.FEEL 
    }
  ];

  const handleStartDrill = () => {
    if (savedPosts.length === 0) {
      alert("Save some high-yield posts first to start a revision drill!");
      return;
    }
    setCurrentDrillIndex(0);
    setDrillComplete(false);
    setIsDrillActive(true);
  };

  const handleNextDrillItem = () => {
    if (currentDrillIndex < savedPosts.length - 1) {
      setCurrentDrillIndex(prev => prev + 1);
    } else {
      // Completion Logic: Add 15 minutes of learning value to the dashboard
      setDrillComplete(true);
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          totalLearningMinutes: prev.totalLearningMinutes + 15
        };
      });
    }
  };

  const closeDrill = () => {
    setIsDrillActive(false);
    setDrillComplete(false);
    setCurrentDrillIndex(0);
  };

  // Drill Session View
  if (isDrillActive) {
    if (drillComplete) {
      return (
        <div className="px-6 py-12 flex flex-col items-center justify-center text-center gap-6 animate-fadeIn min-h-[60vh]">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-sm border border-green-100">
            <i className="fa-solid fa-check-double text-4xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Drill Complete!</h2>
            <p className="text-sm text-slate-500 mt-2">
              You've reviewed <strong>{savedPosts.length}</strong> high-yield concepts today. 
              Consistency is the key to medical mastery.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl w-full border border-blue-100">
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Impact</p>
             <p className="text-xs text-blue-700 font-bold">+15 Learning Minutes Added to Dashboard</p>
          </div>
          <button 
            onClick={closeDrill}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold active:scale-95 transition-all shadow-lg"
          >
            Back to Revision Deck
          </button>
        </div>
      );
    }

    const currentPost = savedPosts[currentDrillIndex];
    const progress = ((currentDrillIndex + 1) / savedPosts.length) * 100;

    return (
      <div className="px-6 py-6 flex flex-col gap-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <button onClick={closeDrill} className="text-slate-400 hover:text-slate-900 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Recall</span>
             <span className="text-xs font-bold text-slate-800">{currentDrillIndex + 1} of {savedPosts.length}</span>
          </div>
          <div className="w-6"></div> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="animate-slideUp">
            {/* Fix: Added required user prop to PostCard component for drill session */}
            <PostCard 
              key={currentPost.id} 
              post={currentPost} 
              isSaved={true} 
              onToggleSave={() => {}} // Disabled during drill
              user={user}
            />
          </div>

          <button 
            onClick={handleNextDrillItem}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>{currentDrillIndex === savedPosts.length - 1 ? 'Finish Session' : 'Next Concept'}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>

          <p className="text-center text-[10px] text-slate-400 font-medium px-8 italic">
            "Don't just read. Try to explain this concept to yourself before moving to the next one."
          </p>
        </div>
      </div>
    );
  }

  const handleNewDeck = () => {
    alert("Custom decks functionality coming in v1.2. Currently, please use the system folders.");
  };

  // If a folder is clicked, we filter the saved posts by that folder's specific criteria
  if (selectedFolder) {
    const activeConfig = FOLDER_CONFIGS.find(f => f.name === selectedFolder);
    const displayedPosts = activeConfig ? savedPosts.filter(activeConfig.filter) : [];

    return (
      <div className="px-6 py-6 flex flex-col gap-6 animate-fadeIn">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedFolder(null)} 
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Back to decks"
          >
            <i className="fa-solid fa-arrow-left text-slate-600"></i>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{selectedFolder}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{displayedPosts.length} saved items</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {displayedPosts.length > 0 ? (
            displayedPosts.map(post => (
              /* Fix: Added required user prop to PostCard component for folder view */
              <PostCard 
                key={post.id} 
                post={post} 
                isSaved={true} 
                onToggleSave={() => {
                  setUser(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      savedPosts: prev.savedPosts.filter(id => id !== post.id)
                    };
                  });
                }} 
                user={user}
              />
            ))
          ) : (
            <div className="text-center py-24 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <i className="fa-solid fa-folder-open text-3xl"></i>
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm">Folder is empty</p>
                <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-1">
                  Save high-yield posts from your feed to see them here for revision.
                </p>
              </div>
              <button 
                onClick={() => setSelectedFolder(null)}
                className="mt-2 text-blue-600 font-bold text-xs"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-slate-900">Revision Deck</h2>
        <p className="text-xs text-slate-500">Master the concepts you've saved</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FOLDER_CONFIGS.map(folder => {
          const count = savedPosts.filter(folder.filter).length;
          return (
            <button 
              key={folder.name}
              onClick={() => setSelectedFolder(folder.name)}
              className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col items-start gap-4 transition-all hover:border-blue-400 hover:bg-blue-50 group shadow-sm active:scale-95"
            >
              <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <i className={`fa-solid ${folder.icon}`}></i>
              </div>
              <div className="text-left">
                <h3 className="text-xs font-bold text-slate-800">{folder.name}</h3>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{count} Items</p>
              </div>
            </button>
          );
        })}
        
        <button 
          onClick={handleNewDeck}
          className="border-2 border-dashed border-slate-200 p-5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-slate-400 active:scale-95"
        >
          <i className="fa-solid fa-plus text-xl"></i>
          <span className="text-[10px] font-bold">New Deck</span>
        </button>
      </div>

      <div className="mt-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-3 shadow-inner">
        <i className="fa-solid fa-graduation-cap text-3xl text-slate-300"></i>
        <h4 className="text-sm font-bold text-slate-800">Ready for a Quiz?</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed px-4">
          Start a 5-minute active recall session based on all your saved high-yield content.
        </p>
        <button 
          onClick={handleStartDrill}
          className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98]"
        >
          Start Flashcard Drill
        </button>
      </div>
    </div>
  );
};

export default RevisionFolders;
