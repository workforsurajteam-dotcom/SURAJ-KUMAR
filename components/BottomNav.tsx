
import React from 'react';

// Shared tab type for navigation consistency
type TabType = 'feed' | 'revision' | 'lab' | 'rooms' | 'dashboard' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'feed', icon: 'fa-house', label: 'Feed' },
    { id: 'revision', icon: 'fa-book-open', label: 'Revise' },
    { id: 'lab', icon: 'fa-flask-vial', label: 'Lab' }, // Added Lab navigation
    { id: 'rooms', icon: 'fa-comments', label: 'Rooms' },
    { id: 'dashboard', icon: 'fa-chart-simple', label: 'Focus' },
    { id: 'profile', icon: 'fa-user', label: 'Me' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-between z-40 pb-6 md:pb-3 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as TabType)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id ? 'text-blue-600 scale-110' : 'text-slate-400'
          }`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
            activeTab === tab.id ? 'bg-blue-50' : ''
          }`}>
            <i className={`fa-solid ${tab.icon} text-lg`}></i>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-wider">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
