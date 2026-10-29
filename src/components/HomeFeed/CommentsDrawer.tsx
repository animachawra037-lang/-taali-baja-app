import React, { useState } from 'react';
import { Comment } from '../../types';
import { X, Send, Heart, Laugh } from 'lucide-react';
import { comedyAudio } from '../../utils/soundEffects';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  videoTitle,
  comments,
  onAddComment,
  onLikeComment,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(inputText.trim());
    setInputText('');
    comedyAudio.playTaali();
  };

  const handleQuickEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border-t border-neutral-800 rounded-t-3xl shadow-2xl flex flex-col max-h-[75vh] h-[540px] text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1.5 bg-neutral-700 rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-5 pb-3 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base">Comments</h3>
              <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                {comments.length}
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate max-w-xs">{videoTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-850 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 py-12">
              <Laugh className="w-12 h-12 mb-2 stroke-1 text-neutral-600" />
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs text-neutral-500">Be the first one to drop a punchline!</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3 items-start group">
                <img
                  src={c.userAvatar}
                  alt={c.userName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-neutral-700"
                  onError={(e) => {
                    // Fallback avatar
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-200">{c.userName}</span>
                    <span className="text-[10px] text-neutral-500">{c.timestamp}</span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed break-words">{c.text}</p>
                </div>
                <button
                  onClick={() => onLikeComment(c.id)}
                  className={`flex flex-col items-center gap-0.5 shrink-0 pt-1 transition-transform active:scale-125 ${
                    c.isLiked ? 'text-rose-500' : 'text-neutral-500 hover:text-neutral-400'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-rose-500' : ''}`} />
                  <span className="text-[10px] font-mono tabular-nums">{c.clapsCount}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Emoji bar */}
        <div className="px-4 py-1.5 border-t border-neutral-800/80 bg-neutral-900/90 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[11px] text-neutral-500 font-medium shrink-0">Quick React:</span>
          {['😂', '🤣', '👏', '💀', '🔥', '🙌', '💯', '🌶️'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleQuickEmoji(emoji)}
              className="text-base px-2 py-0.5 rounded-lg hover:bg-neutral-800 active:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-800 bg-neutral-950/80 shrink-0 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a funny comment... (Taali Baja!)"
            className="flex-1 bg-neutral-850 border border-neutral-750 focus:border-amber-500 text-xs text-white rounded-xl px-3.5 py-2.5 outline-none placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-neutral-950 font-bold flex items-center justify-center shrink-0 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
