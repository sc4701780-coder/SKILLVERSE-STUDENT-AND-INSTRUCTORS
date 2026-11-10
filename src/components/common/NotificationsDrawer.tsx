import React from 'react';
import { Bell, CheckCheck, X, Award, Video, DollarSign, MessageSquare, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, payload?: any) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'certificate': return <Award className="w-4 h-4 text-amber-500" />;
      case 'class': return <Video className="w-4 h-4 text-indigo-500" />;
      case 'purchase': return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-cyan-500" />;
      default: return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (id: string, action?: string) => {
    markNotificationRead(id);
    if (action) {
      if (action === 'certificates') onNavigate('student_dashboard');
      else if (action === 'live') onNavigate('live_classes');
      else if (action === 'learning') onNavigate('student_dashboard');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        <div>
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[80vh]">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.linkAction)}
                  className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${
                    !n.read ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 leading-snug">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.timestamp}</span>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications right now
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          SKILLVERSE Real-Time Notification Stream
        </div>

      </div>
    </div>
  );
};
