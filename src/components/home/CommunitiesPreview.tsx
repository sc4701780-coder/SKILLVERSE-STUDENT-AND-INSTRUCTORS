import React from 'react';
import { Users, MessageSquare, ArrowRight, Sparkles, BrainCircuit, Code, Palette, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CommunitiesPreviewProps {
  onExploreCommunities: () => void;
  onJoinCommunity: (communityId: string) => void;
}

export const CommunitiesPreview: React.FC<CommunitiesPreviewProps> = ({
  onExploreCommunities,
  onJoinCommunity
}) => {
  const { communities, currentUser } = useApp();

  const getIcon = (name: string) => {
    switch (name) {
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5 text-indigo-600" />;
      case 'Code': return <Code className="w-5 h-5 text-cyan-600" />;
      case 'Palette': return <Palette className="w-5 h-5 text-purple-600" />;
      default: return <TrendingUp className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section className="py-20 bg-white border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Social Learning Experience
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Learning Communities
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              SKILLVERSE connects you with peers and mentors. Join collaborative study hubs to discuss code, ask questions, and share projects.
            </p>
          </div>

          <button
            onClick={onExploreCommunities}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
          >
            <span>Explore All Communities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Community Cards Grid or Clean Empty State */}
        {communities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communities.map((comm) => {
              const isMember = currentUser ? comm.memberIds.includes(currentUser.id) : false;

              return (
                <div
                  key={comm.id}
                  className="bg-[#F8FAFC] rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center">
                        {getIcon(comm.iconName)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Users className="w-3.5 h-3.5" />
                        <span className="tabular-nums">{comm.memberCount.toLocaleString()}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-1">
                      {comm.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                      {comm.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">{comm.category}</span>
                    <button
                      onClick={() => onJoinCommunity(comm.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        isMember
                          ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                      }`}
                    >
                      {isMember ? 'Joined' : 'Join Hub'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#F8FAFC] rounded-3xl p-10 text-center border border-slate-200/90 max-w-md mx-auto shadow-2xs">
            <div className="w-12 h-12 bg-white border border-slate-200 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No communities created yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Community hubs will appear here as educators and students create study groups in the network.
            </p>
            <button
              onClick={onExploreCommunities}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Open Community Hub
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
