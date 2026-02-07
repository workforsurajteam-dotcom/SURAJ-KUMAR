
import React, { useState, useEffect, useRef } from 'react';
import { COMMUNITY_ROOMS } from '../constants';
import { UserProfile } from '../types';

interface CommunityRoomsProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

interface Message {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
  isModerator?: boolean;
}

const CommunityRooms: React.FC<CommunityRoomsProps> = ({ user, setUser }) => {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: 'm1', author: 'Dr. Anita', role: 'PGY-1', text: 'Does anyone have a mnemonic for the branches of the internal iliac artery?', timestamp: '10:05 AM' },
      { id: 'm2', author: 'Saurav', role: 'Final Year', text: 'I use "I Love Going Places In My Very Own Underwear" but it is a bit long haha.', timestamp: '10:12 AM' }
    ],
    '2': [
      { id: 'm3', author: 'Rahul', role: 'Intern', text: 'Pro-tip for the surgical ward: always carry extra surgical tape in your coat.', timestamp: '9:45 AM' }
    ],
    '3': [
      { id: 'm4', author: 'Prof. Gupta', role: 'Moderator', text: 'Today\'s case: 45F, chronic cough, hilar lymphadenopathy on CXR. Thoughts?', timestamp: '8:30 AM', isModerator: true },
      { id: 'm5', author: 'Ananya', role: '3rd Year', text: 'Sarcoidosis seems high on the differential. Should we check ACE levels?', timestamp: '8:45 AM' }
    ],
    '4': [
      { id: 'm6', author: 'Wellness Bot', role: 'Assistant', text: 'Welcome to the lounge. This is a safe space to discuss burnout or just vent about the long shifts.', timestamp: 'Yesterday' }
    ]
  });
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeRoomId]);

  const toggleJoin = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    const isJoining = !user.joinedRooms?.includes(roomId);
    
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        joinedRooms: isJoining 
          ? [...(prev.joinedRooms || []), roomId]
          : prev.joinedRooms.filter(id => id !== roomId)
      };
    });

    if (isJoining) {
      setActiveRoomId(roomId);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeRoomId) return;

    const roomId = activeRoomId;
    const userMsg = inputText.trim();

    const newMessage: Message = {
      id: Date.now().toString(),
      author: user.name,
      role: user.year,
      text: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newMessage]
    }));
    setInputText('');
  };

  const activeRoom = COMMUNITY_ROOMS.find(r => r.id === activeRoomId);

  if (activeRoomId && activeRoom) {
    const roomMessages = messages[activeRoomId] || [];
    return (
      <div className="flex flex-col h-full animate-fadeIn bg-slate-50">
        <div className="px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveRoomId(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-slate-900 leading-tight">{activeRoom.name}</h3>
                <p className="text-[9px] text-green-500 font-bold uppercase tracking-tighter">Live Session</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <i className={`fa-solid ${activeRoom.icon} text-sm`}></i>
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-400 shrink-0">
              +12
            </div>
            {['Sarah', 'Arjun', 'Megha', 'Kevin', 'Dr. J'].map((peer, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-2 py-1 shrink-0">
                <div className={`w-4 h-4 rounded-full ${i % 2 === 0 ? 'bg-blue-400' : 'bg-purple-400'} flex items-center justify-center text-[6px] text-white font-bold`}>
                  {peer[0]}
                </div>
                <span className="text-[8px] font-bold text-slate-500">{peer}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-[10px] text-blue-400"></i>
            <p className="text-[9px] font-bold uppercase tracking-widest">Medical Peer Review Active</p>
          </div>
          <span className="text-[8px] font-medium text-slate-500 italic">Moderated by Dr. Miller</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {roomMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} animate-slideUp`}>
              {!msg.isMe && (
                <div className="flex items-center gap-2 mb-1.5 ml-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {msg.author}
                  </span>
                  <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase border ${
                    msg.isModerator ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {msg.role}
                  </span>
                </div>
              )}
              <div className={`max-w-[85%] p-4 rounded-[1.5rem] shadow-sm border ${
                msg.isMe 
                  ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                  : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
              }`}>
                <p className="text-xs leading-relaxed font-medium">{msg.text}</p>
              </div>
              <span className="text-[8px] text-slate-300 font-medium mt-1 uppercase px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a verified peer..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xs text-slate-900 font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane-up"></i>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Community Rooms</h2>
          <p className="text-xs text-slate-500">Professional spaces for verified peers</p>
        </div>
        <button 
          onClick={() => alert("Creating custom study rooms is restricted to verified interns and above.")}
          className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {COMMUNITY_ROOMS.map(room => {
          const isJoined = user.joinedRooms?.includes(room.id);
          return (
            <div 
              key={room.id} 
              onClick={() => isJoined ? setActiveRoomId(room.id) : null}
              className={`group border p-5 rounded-[2rem] flex items-center gap-4 transition-all shadow-sm cursor-pointer ${
                isJoined ? 'bg-white border-blue-600 ring-4 ring-blue-50' : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                isJoined ? 'bg-blue-600 text-white rotate-3 shadow-lg' : 'bg-slate-50 text-slate-400'
              }`}>
                <i className={`fa-solid ${room.icon} text-xl`}></i>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-900">{room.name}</h3>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">{room.description}</p>
                {isJoined && (
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1 block flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-blue-600 animate-pulse"></span>
                    Enter Discussion
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  {room.activeUsers}
                </span>
                <button 
                  onClick={(e) => toggleJoin(e, room.id)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                    isJoined 
                      ? 'bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 border border-transparent' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                  }`}
                >
                  {isJoined ? 'Leave' : 'Join'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        <div className="flex flex-col gap-4 relative z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <i className="fa-solid fa-graduation-cap text-white"></i>
          </div>
          <h4 className="font-black text-lg tracking-tight leading-tight">Peer-Verified Networks</h4>
          <p className="text-xs text-white/80 leading-relaxed font-medium">
            Join thousands of peers in moderated spaces. Whether it is Step 1 strategy or post-shift debriefs, WhiteCoatOnly keeps it focused.
          </p>
          <div className="flex gap-4 mt-2">
            <button className="text-[10px] font-black text-white uppercase tracking-widest border-b border-white/40 pb-1">
              Safety Guidelines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityRooms;