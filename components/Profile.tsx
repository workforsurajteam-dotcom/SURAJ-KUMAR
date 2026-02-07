
import React from 'react';
import { UserProfile, Post } from '../types';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  posts: Post[];
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, posts }) => {
  const userPosts = posts.filter(p => p.author === user.name);
  
  return (
    <div className="px-6 py-6 flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-xl flex items-center justify-center text-blue-600 font-black text-3xl">
            {user.name[0]}
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-xs text-slate-500 font-medium">{user.year}</p>
          <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600">
            <i className="fa-solid fa-building-columns"></i>
            {user.college}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
          <span className="text-lg font-black text-slate-800">{userPosts.length}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Your Posts</span>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
          <span className="text-lg font-black text-slate-800">{user.joinedRooms?.length || 0}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Rooms Joined</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Academic Interest</h3>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between">
          <span className="text-sm font-bold text-blue-900">{user.interest}</span>
          <button className="text-[10px] font-bold text-blue-600 hover:underline">Edit</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {[
          { label: 'Verified Identity', icon: 'fa-id-card', color: 'text-green-600' },
          { label: 'Professional Portfolio', icon: 'fa-briefcase', color: 'text-slate-600' },
          { label: 'Privacy & Data Control', icon: 'fa-shield-halved', color: 'text-slate-600' },
          { label: 'App Settings', icon: 'fa-gear', color: 'text-slate-600' }
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => alert(`${item.label} coming soon in v1.2`)}
            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <i className={`fa-solid ${item.icon} ${item.color} w-5 text-center`}></i>
              <span className="text-sm font-semibold text-slate-700">{item.label}</span>
            </div>
            <i className="fa-solid fa-chevron-right text-xs text-slate-300"></i>
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-slate-100 pt-8 flex flex-col items-center gap-4 pb-12">
        <button 
          onClick={onLogout}
          className="w-full bg-red-50 text-red-500 text-xs font-bold flex items-center justify-center gap-2 py-4 rounded-2xl transition-all hover:bg-red-100 active:scale-[0.98]"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          Sign Out of WhiteCoatOnly
        </button>
        <p className="text-[10px] text-slate-300 font-medium">WhiteCoatOnly v1.1.0 Beta</p>
      </div>
    </div>
  );
};

export default Profile;
