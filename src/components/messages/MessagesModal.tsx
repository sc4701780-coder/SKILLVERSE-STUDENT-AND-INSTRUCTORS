import React, { useState } from 'react';
import { MessageSquare, X, Send, User as UserIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId?: string;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({ isOpen, onClose, targetUserId }) => {
  const { currentUser, users, messages, sendDirectMessage } = useApp();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(() => {
    if (targetUserId) return targetUserId;
    const otherUser = users.find((u) => u.id !== currentUser?.id);
    return otherUser?.id || '';
  });

  const [inputMessage, setInputMessage] = useState('');

  if (!isOpen) return null;

  const partner = users.find((u) => u.id === selectedPartnerId);

  // Filter messages between currentUser and selected partner
  const threadMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser?.id && m.receiverId === selectedPartnerId) ||
      (m.senderId === selectedPartnerId && m.receiverId === currentUser?.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedPartnerId) return;
    sendDirectMessage(selectedPartnerId, inputMessage.trim());
    setInputMessage('');
  };

  const candidatePartners = users.filter((u) => u.id !== currentUser?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[580px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Direct Conversations</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Partner Roster */}
          <div className="w-60 border-r border-slate-100 bg-slate-50/50 p-2 overflow-y-auto space-y-1 shrink-0">
            {candidatePartners.map((cand) => {
              const isSelected = cand.id === selectedPartnerId;
              return (
                <button
                  key={cand.id}
                  onClick={() => setSelectedPartnerId(cand.id)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-colors ${
                    isSelected ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <img
                    src={cand.avatar}
                    alt={cand.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs truncate">{cand.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize truncate">{cand.role}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Message Stream */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
            
            {partner ? (
              <>
                {/* Active Partner Title */}
                <div className="p-3 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/30">
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{partner.name}</p>
                    <p className="text-[10px] text-slate-400">{partner.country} · {partner.role}</p>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {threadMessages.length > 0 ? (
                    threadMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-xs px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-xs'
                                : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">
                            {msg.timestamp}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-xs text-slate-400">
                      No prior messages. Send a message to start connecting!
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Message ${partner.name}...`}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-400">
                Select a user to begin messaging
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
