
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { db } from '../services/api';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState('MBBS 1st Year');
  const [college, setCollege] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const users = db.getUsers();
    
    if (isLogin) {
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        alert('Credentials not recognized. This is a secure portal.');
      }
    } else {
      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password, 
        name,
        year,
        college,
        interest: 'General Medicine',
        savedPosts: [],
        joinedRooms: [],
        totalLearningMinutes: 0,
        totalScrollingMinutes: 0
      };
      db.saveUser(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-8 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100 rotate-3">
           <i className="fa-solid fa-hand-holding-medical text-white text-3xl"></i>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tighter">WhiteCoatOnly</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {isLogin ? 'Professional Login' : 'Create Academic Identity'}
        </p>
      </div>

      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Student Name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical College</label>
                <input 
                  type="text" required value={college} onChange={(e) => setCollege(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Institution Name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Year</label>
                <select 
                  value={year} onChange={(e) => setYear(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option>MBBS 1st Year</option>
                  <option>MBBS 2nd Year</option>
                  <option>MBBS 3rd Year (Part 1)</option>
                  <option>MBBS 3rd Year (Part 2)</option>
                  <option>Internship</option>
                  <option>PG Resident</option>
                </select>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="verified@med.edu"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98]"
          >
            {isLogin ? 'Authenticate' : 'Register Profile'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] text-blue-600 font-black uppercase tracking-widest hover:underline"
          >
            {isLogin ? "Join the collective" : "Back to login portal"}
          </button>
        </div>
      </div>

      <div className="mt-12 text-center text-slate-300 text-[9px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto">
        Professionals Only • Secure End-to-End
      </div>
    </div>
  );
};

export default Auth;