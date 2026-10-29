import React, { useState, useRef, useEffect } from 'react';
import { VideoItem, ComedyCategory, Comment } from '../../types';
import { VideoCard } from './VideoCard';
import { CommentsDrawer } from './CommentsDrawer';
import { WhatsAppShareModal } from './WhatsAppShareModal';
import { Flame, Sparkles, UserCheck, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { comedyAudio } from '../../utils/soundEffects';

interface VideoFeedProps {
  videos: VideoItem[];
  commentsMap: Record<string, Comment[]>;
  onToggleLike: (videoId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onAddComment: (videoId: string, text: string) => void;
  onLikeComment: (videoId: string, commentId: string) => void;
  onShareIncrement: (videoId: string) => void;
  onOpenEditorWithSound?: (soundTitle: string) => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  videos,
  commentsMap,
  onToggleLike,
  onToggleFollow,
  onAddComment,
  onLikeComment,
  onShareIncrement,
  onOpenEditorWithSound,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [feedTab, setFeedTab] = useState<'forYou' | 'trending' | 'following'>('forYou');
  const [selectedCategory, setSelectedCategory] = useState<ComedyCategory>('All');
  const [isMuted, setIsMuted] = useState<boolean>(true); // browser policy default
  const [selectedVideoForComments, setSelectedVideoForComments] = useState<VideoItem | null>(null);
  const [selectedVideoForShare, setSelectedVideoForShare] = useState<VideoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const categories: ComedyCategory[] = [
    'All',
    'Standup',
    'Desi Skits',
    'Memes',
    'Relatable',
    'Bloopers',
    'Office Humor',
  ];

  // Filter videos based on category and tab
  const filteredVideos = videos.filter((v) => {
    if (selectedCategory !== 'All' && v.category !== selectedCategory) {
      return false;
    }
    if (feedTab === 'following') {
      return v.isFollowing;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.caption.toLowerCase().includes(q) ||
        v.creator.username.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Keep index within bounds if filtered list changes
  useEffect(() => {
    if (currentIndex >= filteredVideos.length && filteredVideos.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredVideos.length, currentIndex]);

  // Keyboard navigation (Arrow Up / Down / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedVideoForComments || selectedVideoForShare || isSearchOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextVideo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevVideo();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredVideos.length, selectedVideoForComments, selectedVideoForShare, isSearchOpen]);

  const goToNextVideo = () => {
    if (currentIndex < filteredVideos.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const goToPrevVideo = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    if (containerRef.current) {
      const child = containerRef.current.children[index] as HTMLElement;
      if (child) {
        child.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const newIndex = Math.round(scrollTop / clientHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < filteredVideos.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-950 flex flex-col overflow-hidden">
      {/* Top Header Floating Navigation */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-3 pb-2 px-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setSelectedCategory('All')}>
            <span className="text-2xl animate-pulse">👏</span>
            <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Taali Baja
            </span>
          </div>

          {/* Feed Switcher Tabs */}
          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              onClick={() => setFeedTab('following')}
              className={`transition-colors relative pb-1 ${
                feedTab === 'following' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Following
              {feedTab === 'following' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setFeedTab('forYou')}
              className={`transition-colors relative pb-1 flex items-center gap-1 ${
                feedTab === 'forYou' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>Taali Hits</span>
              {feedTab === 'forYou' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setFeedTab('trending')}
              className={`transition-colors relative pb-1 flex items-center gap-1 ${
                feedTab === 'trending' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending</span>
              {feedTab === 'trending' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            title="Search comedy tags & clips"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Search input dropdown when opened */}
        {isSearchOpen && (
          <div className="pointer-events-auto bg-neutral-900/95 backdrop-blur-md p-2 rounded-xl border border-neutral-700/80 shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
            <Search className="w-4 h-4 text-neutral-400 ml-1.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jokes, creators, #DesiComedy..."
              autoFocus
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-neutral-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded hover:bg-neutral-700"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Comedy Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-black/50 text-neutral-300 hover:bg-black/70 hover:text-white backdrop-blur-md border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Snap-Scroll Video Viewport */}
      {filteredVideos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-neutral-400">
          <span className="text-5xl mb-3">🎭</span>
          <h3 className="text-base font-bold text-white">No funny videos found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs">
            {feedTab === 'following'
              ? "You haven't followed any creators yet. Switch to Taali Hits to explore!"
              : "Try switching category filters or clear your search to find more comedy clips."}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setFeedTab('forYou');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg"
          >
            Show All Laughs
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-scroll snap-y-mandatory no-scrollbar"
        >
          {filteredVideos.map((video, index) => (
            <div key={video.id} className="w-full h-full snap-start relative">
              <VideoCard
                video={video}
                isActive={index === currentIndex}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted((prev) => !prev)}
                onToggleLike={onToggleLike}
                onToggleFollow={onToggleFollow}
                onOpenComments={(v) => setSelectedVideoForComments(v)}
                onOpenWhatsAppShare={(v) => setSelectedVideoForShare(v)}
                onSelectSound={onOpenEditorWithSound}
              />
            </div>
          ))}
        </div>
      )}

      {/* Desktop Helper Navigation Floater */}
      <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 pointer-events-auto">
        <button
          onClick={goToPrevVideo}
          disabled={currentIndex === 0}
          className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 disabled:opacity-30 text-white flex items-center justify-center transition-all shadow-lg"
          title="Previous comedy clip (Up Arrow)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={goToNextVideo}
          disabled={currentIndex >= filteredVideos.length - 1}
          className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 disabled:opacity-30 text-white flex items-center justify-center transition-all shadow-lg"
          title="Next comedy clip (Down Arrow)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Slide-Up Comments Drawer */}
      {selectedVideoForComments && (
        <CommentsDrawer
          isOpen={true}
          videoTitle={selectedVideoForComments.title}
          comments={commentsMap[selectedVideoForComments.id] || []}
          onClose={() => setSelectedVideoForComments(null)}
          onAddComment={(text) => onAddComment(selectedVideoForComments.id, text)}
          onLikeComment={(commentId) => onLikeComment(selectedVideoForComments.id, commentId)}
        />
      )}

      {/* Direct WhatsApp Share Modal */}
      {selectedVideoForShare && (
        <WhatsAppShareModal
          isOpen={true}
          video={selectedVideoForShare}
          onClose={() => setSelectedVideoForShare(null)}
          onShareSuccess={() => onShareIncrement(selectedVideoForShare.id)}
        />
      )}
    </div>
  );
};
