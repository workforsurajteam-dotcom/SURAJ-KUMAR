
import React from 'react';
import { UserProfile, Post } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  posts: Post[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, posts }) => {
  const userPosts = posts.filter(p => p.author === user.name);
  const mcqsSolved = 8; // Simulated for this demo
  const conceptsMastered = user.savedPosts.length;

  const chartData = [
    { name: 'Learning', value: user.totalLearningMinutes + (conceptsMastered * 5), color: '#2563eb' },
    { name: 'Scrolling', value: user.totalScrollingMinutes, color: '#e2e8f0' }
  ];

  const weeklyProgress = [
    { day: 'Mon', mins: 45 },
    { day: 'Tue', mins: 52 },
    { day: 'Wed', mins: 38 },
    { day: 'Thu', mins: 65 },
    { day: 'Fri', mins: 48 },
    { day: 'Sat', mins: 20 },
    { day: 'Sun', mins: 15 }
  ];

  const totalTime = chartData[0].value + chartData[1].value;
  const learningPercentage = totalTime > 0 ? Math.round((chartData[0].value / totalTime) * 100) : 0;

  return (
    <div className="px-6 py-6 flex flex-col gap-6 animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-20 blur-3xl -mr-10 -mt-10"></div>
        <h2 className="text-lg font-bold mb-1">Time Well Spent</h2>
        <p className="text-slate-400 text-xs mb-6 font-medium">Your weekly focus reflection</p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-3xl font-black mb-1">{learningPercentage}%</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Efficiency Score</p>
          </div>
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 flex gap-6">
          <div>
            <p className="text-xl font-bold">{chartData[0].value}m</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Value Time</p>
          </div>
          <div className="w-px bg-slate-800 self-stretch"></div>
          <div>
            <p className="text-xl font-bold">{chartData[1].value}m</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Review Time</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-sm">Weekly High-Yield Activity</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyProgress}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px'}}
              />
              <Bar dataKey="mins" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
          <i className="fa-solid fa-brain text-blue-600 mb-2"></i>
          <p className="text-lg font-black text-blue-900">{conceptsMastered}</p>
          <p className="text-[10px] font-bold text-blue-700 uppercase tracking-tighter">Concepts Saved</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex flex-col items-center text-center">
          <i className="fa-solid fa-flask text-purple-600 mb-2"></i>
          <p className="text-lg font-black text-purple-900">{userPosts.length}</p>
          <p className="text-[10px] font-bold text-purple-700 uppercase tracking-tighter">Contributions</p>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <p className="text-xs italic text-slate-500 text-center leading-relaxed">
          "The good physician treats the disease; the great physician treats the patient who has the disease." - Sir William Osler
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
