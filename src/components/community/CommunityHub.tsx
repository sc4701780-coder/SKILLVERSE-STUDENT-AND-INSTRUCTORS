import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Send,
  Sparkles,
  Plus,
  Filter,
  Check,
  BrainCircuit,
  Code,
  Palette,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CommunityHubProps {
  initialCommunityId?: string;
  onDirectMessageUser: (userId: string) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ initialCommunityId, onDirectMessageUser }) => {
  const {
    communities,
    posts,
    currentUser,
    toggleCommunityMembership,
    createPost,
    likePost,
    addComment
  } = useApp();

  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(initialCommunityId || 'all');
  const [showPostComposer, setShowPostComposer] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('MachineLearning, Architecture');
  const [targetCommunity, setTargetCommunity] = useState(communities[0]?.id || '');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const filteredPosts = posts.filter((p) => {
    if (selectedCommunityId === 'all') return true;
    return p.communityId === selectedCommunityId;
  });

  const activeCommunity = communities.find((c) => c.id === selectedCommunityId);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const tagsArray = postTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    createPost(targetCommunity, postTitle.trim(), postContent.trim(), tagsArray);
    setPostTitle('');
    setPostContent('');
    setShowPostComposer(false);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addComment(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="py-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/80 mb-2">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Global Knowledge Exchange</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Learning Communities &amp; Discussions
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Connect with fellow learners, researchers, and instructors worldwide. Share technical discoveries, troubleshoot projects, and exchange constructive feedback.
            </p>
          </div>

          <button
            onClick={() => setShowPostComposer(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discussion Post</span>
          </button>
        </div>

        {/* Communities Hub Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 text-xs font-semibold">
          <button
            onClick={() => setSelectedCommunityId('all')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
              selectedCommunityId === 'all'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            All Communities Feed
          </button>

          {communities.map((c) => {
            const isSelected = selectedCommunityId === c.id;
            const isMember = currentUser ? c.memberIds.includes(currentUser.id) : false;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCommunityId(c.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                <span>{c.name}</span>
                {isMember && <span className="text-[10px] text-emerald-500 font-bold">●</span>}
              </button>
            );
          })}
          {communities.length === 0 && (
            <span className="text-xs text-slate-400 italic px-2 py-1">
              No community groups created yet
            </span>
          )}
        </div>

        {/* Community Info Banner if specific community selected */}
        {activeCommunity && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{activeCommunity.name}</h2>
              <p className="text-xs text-slate-600 mt-0.5">{activeCommunity.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-medium">
                <span>{activeCommunity.memberCount.toLocaleString()} Members</span>
                <span>·</span>
                <span>Topic: {activeCommunity.category}</span>
              </div>
            </div>

            <button
              onClick={() => toggleCommunityMembership(activeCommunity.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                currentUser && activeCommunity.memberIds.includes(currentUser.id)
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {currentUser && activeCommunity.memberIds.includes(currentUser.id)
                ? 'Member (Joined)'
                : 'Join Community'}
            </button>
          </div>
        )}

        {/* Create Post Modal / Expandable Box */}
        {showPostComposer && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900">Publish Discussion Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Hub or Topic</label>
                  {communities.length > 0 ? (
                    <select
                      value={targetCommunity}
                      onChange={(e) => setTargetCommunity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                    >
                      {communities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={targetCommunity}
                      onChange={(e) => setTargetCommunity(e.target.value)}
                      placeholder="e.g. AI & Machine Learning, Cloud Architecture"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    placeholder="e.g. PyTorch, Architecture, React"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discussion Title</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="What question or educational finding would you like to share?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Body Content</label>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Explain the background, code snippets, or methodology..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostComposer(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Stream */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-2xs max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No discussions posted yet</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Be the first to ask a question, share insights, or start a collaborative thread in this community.
                </p>
              </div>
              <button
                onClick={() => setShowPostComposer(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors inline-flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Start First Discussion</span>
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const hasLiked = currentUser ? post.likedByUserIds.includes(currentUser.id) : false;

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4"
                >
                  {/* Author row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{post.authorName}</h4>
                          <span className="text-[11px] text-slate-400">({post.authorCountry})</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{post.authorRole} · {post.createdAt}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {post.communityName}
                    </span>
                  </div>

                  {/* Post Title & Content */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Actions & Reactions Row */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                          hasLiked ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span className="tabular-nums">{post.likes}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <MessageSquare className="w-4 h-4" />
                        <span className="tabular-nums">{post.comments.length} Comments</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDirectMessageUser(post.authorId)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Direct Message
                    </button>
                  </div>

                  {/* Threaded Comments */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    {post.comments.map((c) => (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{c.authorName}</span>
                          <span className="text-slate-400">{c.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-700">{c.content}</p>
                      </div>
                    ))}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="Add to the discussion..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shrink-0"
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
