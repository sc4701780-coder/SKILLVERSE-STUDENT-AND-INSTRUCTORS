import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  Users,
  Hand,
  Settings,
  Smile,
  Send,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LiveClassRoomProps {
  classId: string;
  onLeave: () => void;
}

export const LiveClassRoom: React.FC<LiveClassRoomProps> = ({ classId, onLeave }) => {
  const { liveClasses, currentUser } = useApp();

  const activeClass = liveClasses.find(c => c.id === classId) || {
    id: classId,
    title: 'Live Interactive Session',
    description: 'Real-time cohort workshop with audio, video, and screen sharing.',
    instructor: {
      name: 'Dr. Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      title: 'Senior AI Fellow'
    }
  };

  // Conference room controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'chat' | 'participants'>('chat');

  // Chat messages
  const [messages, setMessages] = useState<Array<{ id: string; sender: string; text: string; time: string; isInstructor?: boolean }>>([
    {
      id: 'm1',
      sender: activeClass.instructor.name,
      text: 'Welcome everyone to today’s live workshop! Please feel free to post your questions in this chat as we code.',
      time: '14:02',
      isInstructor: true
    },
    {
      id: 'm2',
      sender: 'Tariq Al-Mansoor',
      text: 'Audio and screen are crystal clear!',
      time: '14:03'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Participants
  const participants = [
    { name: activeClass.instructor.name, role: 'Host / Instructor', avatar: activeClass.instructor.avatar, isSpeaking: true },
    { name: currentUser?.name || 'You', role: 'Student', avatar: currentUser?.avatar || '', isSpeaking: false },
    { name: 'Tariq Al-Mansoor', role: 'Student', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', isSpeaking: false },
    { name: 'Chioma Adebayo', role: 'Student', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80', isSpeaking: false },
    { name: 'Lucas Weber', role: 'Student', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80', isSpeaking: false }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        sender: currentUser?.name || 'You',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0D14] text-white flex flex-col overflow-hidden">
      
      {/* Top Video Header */}
      <header className="h-14 bg-[#111622] border-b border-slate-800 px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
              {activeClass.title}
            </h2>
            <p className="text-[10px] text-slate-400">
              Host: {activeClass.instructor.name} · Encrypted Live Stream
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarTab(sidebarTab === 'participants' ? 'chat' : 'participants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              sidebarTab === 'participants' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="tabular-nums">{participants.length}</span>
          </button>

          <button
            onClick={() => setSidebarTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              sidebarTab === 'chat' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        </div>
      </header>

      {/* Main Video Stage Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Stage Grid */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Primary Speaker (Instructor Stage or Screen Share) */}
            <div className="md:col-span-2 relative aspect-16/9 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
              {isScreenSharing ? (
                <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-center items-center text-center">
                  <Monitor className="w-16 h-16 text-indigo-400 mb-3 animate-pulse" />
                  <p className="text-sm font-bold text-white">Live Code &amp; Architectural Screen Share</p>
                  <p className="text-xs text-slate-400 mt-1">Dr. Elena Rostova is presenting custom PyTorch Transformer scripts</p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                    alt={activeClass.instructor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600/90 backdrop-blur-xs text-xs font-bold text-white">
                      Host: {activeClass.instructor.name}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/80 text-[10px] font-bold text-white uppercase">
                      Speaking
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Student Video Tiles Grid */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              
              {/* My Camera Tile */}
              <div className="relative aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md flex items-center justify-center">
                {isVideoOn ? (
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="You"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-3">
                    <VideoOff className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                    <p className="text-[11px] text-slate-400">Camera Off</p>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] text-white">
                    You {!isMicOn && '(Muted)'}
                  </span>
                  {isHandRaised && (
                    <span className="text-amber-400 text-xs">✋</span>
                  )}
                </div>
              </div>

              {/* Other Student Tile */}
              <div className="relative aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
                  alt="Student"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white">
                  Tariq Al-Mansoor
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Dock Control Bar */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-3">
            
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-2xl transition-colors ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-2xl transition-colors ${
                isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
              title={isVideoOn ? 'Stop Camera' : 'Start Camera'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-2xl transition-colors ${
                isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title="Share Screen"
            >
              <Monitor className="w-5 h-5" />
            </button>

            {/* Raise Hand */}
            <button
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={`p-3 rounded-2xl transition-colors ${
                isHandRaised ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title="Raise Hand"
            >
              <Hand className="w-5 h-5" />
            </button>

            {/* Leave Room CTA */}
            <button
              onClick={onLeave}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-lg"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Room</span>
            </button>

          </div>

        </div>

        {/* Right Sidebar: In-Class Chat or Participants */}
        <aside className="w-80 bg-[#111622] border-l border-slate-800 flex flex-col justify-between shrink-0">
          
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {sidebarTab === 'chat' ? 'Live Class Chat' : 'Participants'}
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">Stream Active</span>
          </div>

          {sidebarTab === 'chat' ? (
            <>
              {/* Chat Messages Log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((m) => (
                  <div key={m.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-bold ${m.isInstructor ? 'text-indigo-400' : 'text-slate-300'}`}>
                        {m.sender} {m.isInstructor && '(Instructor)'}
                      </span>
                      <span className="text-[10px] text-slate-500">{m.time}</span>
                    </div>
                    <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-[#0E131F]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type in-class question..."
                    className="flex-1 bg-slate-900 px-3 py-2 rounded-xl text-xs text-white border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {participants.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.role}</p>
                    </div>
                  </div>
                  {p.isSpeaking && (
                    <span className="text-[10px] text-emerald-400 font-mono">Mic On</span>
                  )}
                </div>
              ))}
            </div>
          )}

        </aside>

      </div>

    </div>
  );
};
