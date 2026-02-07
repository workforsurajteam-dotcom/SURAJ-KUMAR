
import React, { useState, useEffect } from 'react';
import { ContentPillar, UserProfile, Post } from './types';
import { MOCK_POSTS } from './constants';
import { db } from './services/api';
import Feed from './components/Feed';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import CommunityRooms from './components/CommunityRooms';
import RevisionFolders from './components/RevisionFolders';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Auth from './components/Auth';
import CreatePost from './components/CreatePost';
import VideoLab from './components/VideoLab';

// Updated active tab type to include the Lab feature
type TabType = 'feed' | 'revision' | 'lab' | 'rooms' | 'dashboard' | 'profile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  
  const [user, setUser] = useState<UserProfile | null>(() => db.getSession());

  const [posts, setPosts] = useState<Post[]>(() => db.getPosts(MOCK_POSTS));

  const [activePillar, setActivePillar] = useState<ContentPillar | 'ALL'>('ALL');
  const [isPosting, setIsPosting] = useState(false);

  // Synchronize state with "Database" layer
  useEffect(() => {
    if (user) {
      db.setSession(user);
      db.saveUser(user);
    }
  }, [user]);

  useEffect(() => {
    db.savePosts(posts);
  }, [posts]);

  const handleLogin = (loggedUser: UserProfile) => {
    setUser(loggedUser);
  };

  const handleNewPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleLogout = () => {
    setUser(null);
    db.setSession(null);
    setActiveTab('feed');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <Feed 
            activePillar={activePillar} 
            onPillarChange={setActivePillar} 
            user={user} 
            setUser={setUser} 
            posts={posts} 
            onOpenPost={() => setIsPosting(true)}
          />
        );
      case 'revision':
        return <RevisionFolders user={user} setUser={setUser} posts={posts} />;
      case 'lab':
        // Integration point for the VideoLab medical simulation tool
        return <VideoLab />;
      case 'rooms':
        return <CommunityRooms user={user} setUser={setUser} />;
      case 'dashboard':
        return <Dashboard user={user} posts={posts} />;
      case 'profile':
        return <Profile user={user} onLogout={handleLogout} posts={posts} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white border-x border-slate-200 shadow-xl overflow-hidden relative">
      <Header />
      
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {isPosting && (
        <CreatePost 
          user={user} 
          onClose={() => setIsPosting(false)} 
          onPost={handleNewPost} 
        />
      )}

      {/* Ethical Ad Segment */}
      <div className="absolute bottom-20 left-4 right-4 bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] text-slate-400 flex items-center justify-between shadow-sm z-30 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="bg-slate-200 px-1 rounded uppercase font-bold text-[8px]">Ad</span>
          <span className="truncate">StatPearls Review - Professional Edition</span>
        </div>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
      </div>
    </div>
  );
};

export default App;
