/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VideoItem, Comment } from './types';
import { INITIAL_VIDEOS, INITIAL_COMMENTS, SOUND_EFFECTS } from './data/seedData';
import { VideoFeed } from './components/HomeFeed/VideoFeed';
import { VideoEditor } from './components/VideoEditor/VideoEditor';
import { ProfileHub } from './components/Profile/ProfileHub';
import { DiscoverView } from './components/Discover/DiscoverView';
import { NotificationsView } from './components/Notifications/NotificationsView';
import { BottomTabBar, MainTab } from './components/Navigation/BottomTabBar';
import { comedyAudio } from './utils/soundEffects';
import { 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Volume2, 
  Share2, 
  Plus, 
  Flame, 
  Music, 
  Award,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [currentTab, setCurrentTab] = useState<MainTab>('feed');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorInitialSound, setEditorInitialSound] = useState<string | undefined>(undefined);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false); // desktop frame vs full
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle Like / Taali (Clap)
  const handleToggleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            clapsCount: isLiked ? v.clapsCount + 1 : v.clapsCount - 1,
          };
        }
        return v;
      })
    );
  };

  // Toggle Follow
  const handleToggleFollow = (creatorId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.creator.id === creatorId) {
          const isFollowing = !v.isFollowing;
          return {
            ...v,
            isFollowing,
            creator: {
              ...v.creator,
              followersCount: isFollowing ? v.creator.followersCount + 1 : v.creator.followersCount - 1,
            },
          };
        }
        return v;
      })
    );
    showToast('Updated creator follow status! 👏');
  };

  // Add Comment
  const handleAddComment = (videoId: string, text: string) => {
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      userId: 'current-user',
      userName: 'Aman Sharma',
      userAvatar: '/src/assets/images/avatar_kapil_standup_1793237927655.jpg',
      text,
      timestamp: 'Just now',
      clapsCount: 0,
      isLiked: false,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [videoId]: [newComment, ...(prev[videoId] || [])],
    }));

    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, commentsCount: v.commentsCount + 1 } : v))
    );

    showToast('Punchline comment posted! 😂');
  };

  // Like Comment
  const handleLikeComment = (videoId: string, commentId: string) => {
    setCommentsMap((prev) => {
      const list = prev[videoId] || [];
      const updated = list.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            clapsCount: isLiked ? c.clapsCount + 1 : c.clapsCount - 1,
          };
        }
        return c;
      });
      return { ...prev, [videoId]: updated };
    });
  };

  // Increment WhatsApp Share
  const handleShareIncrement = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, whatsappSharesCount: v.whatsappSharesCount + 1 } : v))
    );
    showToast('Forwarding to WhatsApp! Laughter spread! 💬');
  };

  // Handle Publish from Video Editor
  const handlePublishVideo = (newVideoPartial: Partial<VideoItem>) => {
    const newVideo: VideoItem = {
      id: `vid-${Date.now()}`,
      videoUrl: newVideoPartial.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-young-man-laughing-and-recording-himself-42861-large.mp4',
      posterUrl: '/src/assets/images/sketch_desijugaad_thumb_1793237928582.jpg',
      title: newVideoPartial.title || 'Untitled Comedy Short',
      caption: newVideoPartial.caption || 'Watch this hilarious comedy take! #TaaliBaja',
      tags: ['#TaaliBaja', '#DesiComedy', '#MemeCentral'],
      category: newVideoPartial.category || 'Desi Skits',
      creator: {
        id: 'current-user',
        name: 'Aman Sharma',
        username: 'aman_taalibaaz',
        avatar: '/src/assets/images/avatar_kapil_standup_1793237927655.jpg',
        isVerified: true,
        followersCount: 18400,
        badge: 'Top Taali Creator',
      },
      audioTitle: newVideoPartial.audioTitle || 'Taali Baja Sound Studio Remix',
      audioAuthor: 'aman_taalibaaz',
      durationSeconds: newVideoPartial.durationSeconds || 15,
      clapsCount: 1,
      commentsCount: 0,
      whatsappSharesCount: 0,
      viewsCount: 1,
      createdAt: 'Just now',
      isLiked: true,
      soundEffectUsed: newVideoPartial.soundEffectUsed,
      aspectRatio: newVideoPartial.aspectRatio || '9:16',
    };

    setVideos([newVideo, ...videos]);
    setCurrentTab('feed');
    showToast('🎉 Video published successfully to feed & profile!');
  };

  // Open editor with preselected sound
  const handleOpenEditorWithSound = (soundName: string) => {
    setEditorInitialSound(soundName);
    setIsEditorOpen(true);
  };

  // Filter user's own videos & liked videos for profile
  const myVideos = videos.filter((v) => v.creator.id === 'current-user');
  const likedVideos = videos.filter((v) => v.isLiked);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center relative font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 z-50 bg-neutral-900 border border-amber-500/50 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Responsive Wrapper */}
      <div className="w-full h-screen max-w-7xl flex flex-row overflow-hidden justify-center relative">
        {/* Left Desktop Sidebar (visible on larger screens) */}
        <aside className="hidden lg:flex w-72 h-full border-r border-neutral-800/80 p-5 flex-col justify-between shrink-0 bg-neutral-950/60 backdrop-blur-md">
          <div className="space-y-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentTab('feed')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
                👏
              </div>
              <div>
                <h1 className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  Taali Baja
                </h1>
                <p className="text-[10px] text-neutral-400 font-medium">Comedy & Short Video Platform</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="space-y-1.5">
              {[
                { id: 'feed' as const, label: 'Home Feed', icon: '🏠', desc: 'Watch reels & memes' },
                { id: 'discover' as const, label: 'Discover Laughs', icon: '🧭', desc: 'Trending comedy sounds' },
                { id: 'notifications' as const, label: 'Laugh Alerts', icon: '🔔', desc: 'Claps & forwards' },
                { id: 'profile' as const, label: 'Creator Profile', icon: '👤', desc: 'Dashboard & analytics' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 border ${
                    currentTab === item.id
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold shadow-sm'
                      : 'bg-neutral-900/40 border-transparent hover:bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <h3 className="text-xs font-bold leading-tight">{item.label}</h3>
                    <p className="text-[10px] text-neutral-500 font-normal">{item.desc}</p>
                  </div>
                </button>
              ))}
            </nav>

            {/* Primary CTA: Upload & Edit Video */}
            <button
              onClick={() => {
                setEditorInitialSound(undefined);
                setIsEditorOpen(true);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 active:scale-[0.98] transition-all text-neutral-950 font-bold text-xs shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Comedy Video</span>
            </button>

            {/* Soundboard Laugh Box */}
            <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Live Comedy FX</span>
                </span>
                <span className="text-[10px] text-neutral-500">Instant</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'taali', icon: '👏', label: 'Taali' },
                  { id: 'badum_tss', icon: '🥁', label: 'Rimshot' },
                  { id: 'dramatic', icon: '⚡', label: 'Drama' },
                  { id: 'laughter', icon: '😂', label: 'Laugh' },
                  { id: 'boing', icon: '🌀', label: 'Boing' },
                  { id: 'airhorn', icon: '📢', label: 'Horn' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => comedyAudio.playSoundById(s.id)}
                    className="p-2 bg-neutral-950 hover:bg-neutral-800 rounded-xl flex flex-col items-center justify-center text-center transition-transform active:scale-90 border border-neutral-800"
                    title={`Play ${s.label}`}
                  >
                    <span className="text-sm">{s.icon}</span>
                    <span className="text-[9px] font-medium text-neutral-400 mt-0.5">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Footer */}
          <div className="pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>© 2026 Taali Baja</span>
            <button
              onClick={() => setDeviceFrameMode(!deviceFrameMode)}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
              title="Toggle mobile device frame"
            >
              {deviceFrameMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>{deviceFrameMode ? 'Full View' : 'Phone Frame'}</span>
            </button>
          </div>
        </aside>

        {/* Central Mobile App Container */}
        <main
          className={`h-full flex flex-col relative transition-all duration-300 ${
            deviceFrameMode
              ? 'w-full max-w-[430px] my-auto h-[95vh] rounded-[44px] border-[10px] border-neutral-850 shadow-2xl overflow-hidden ring-1 ring-white/10'
              : 'w-full max-w-lg lg:max-w-md xl:max-w-lg overflow-hidden'
          }`}
        >
          {/* Virtual Phone Speaker Notch in Frame Mode */}
          {deviceFrameMode && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-900 rounded-full z-40 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-1 bg-neutral-700 rounded-full" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 ml-2" />
            </div>
          )}

          {/* Screen Body */}
          <div className="flex-1 relative w-full h-full overflow-hidden">
            {currentTab === 'feed' && (
              <VideoFeed
                videos={videos}
                commentsMap={commentsMap}
                onToggleLike={handleToggleLike}
                onToggleFollow={handleToggleFollow}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onShareIncrement={handleShareIncrement}
                onOpenEditorWithSound={handleOpenEditorWithSound}
              />
            )}

            {currentTab === 'discover' && (
              <DiscoverView
                videos={videos}
                onSelectVideo={(id) => {
                  setCurrentTab('feed');
                  showToast(`Selected comedy video! 🎬`);
                }}
                onUseSound={handleOpenEditorWithSound}
                onFollowCreator={handleToggleFollow}
              />
            )}

            {currentTab === 'notifications' && <NotificationsView />}

            {currentTab === 'profile' && (
              <ProfileHub
                myVideos={myVideos}
                likedVideos={likedVideos}
                onSelectVideo={(id) => {
                  setCurrentTab('feed');
                  showToast(`Viewing video! 🎬`);
                }}
                onOpenCreate={() => setIsEditorOpen(true)}
              />
            )}
          </div>

          {/* Mobile Bottom Tab Bar */}
          <BottomTabBar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            onOpenCreate={() => {
              setEditorInitialSound(undefined);
              setIsEditorOpen(true);
            }}
          />
        </main>

        {/* Right Desktop Companion Panel (visible on XL screens) */}
        <aside className="hidden xl:flex w-80 h-full border-l border-neutral-800/80 p-5 flex-col justify-between shrink-0 bg-neutral-950/60 backdrop-blur-md">
          <div className="space-y-5">
            {/* WhatsApp Viral Highlights */}
            <div className="p-4 bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Share2 className="w-4 h-4" />
                <h3 className="font-bold text-xs uppercase tracking-wider">WhatsApp Viral Radar</h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Taali Baja clips get shared across <strong>120K+ Indian WhatsApp groups</strong> daily. Tap the WhatsApp icon on any video to share instant laughs!
              </p>
              <div className="mt-3 pt-3 border-t border-emerald-900/50 flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Total Shares Today</span>
                <span className="text-emerald-400 font-bold">142,890 forwards</span>
              </div>
            </div>

            {/* Trending Comedy Sounds List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-400" />
                  <span>Trending Sounds</span>
                </h4>
                <button
                  onClick={() => setCurrentTab('discover')}
                  className="text-[10px] text-amber-400 hover:text-amber-300"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-2">
                {SOUND_EFFECTS.slice(0, 4).map((sfx) => (
                  <div
                    key={sfx.id}
                    onClick={() => comedyAudio.playSoundById(sfx.id)}
                    className="p-2.5 bg-neutral-900/80 hover:bg-neutral-850 rounded-xl border border-neutral-800 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg">{sfx.icon}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white block truncate">{sfx.name}</span>
                        <span className="text-[10px] text-neutral-400 block truncate">{sfx.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditorWithSound(sfx.name);
                      }}
                      className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 font-bold text-[10px] rounded-lg transition-colors"
                    >
                      Remix
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comedy Creator Leaderboard */}
            <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
              <h4 className="text-xs font-bold text-white mb-2.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Today's Top Laughs</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="truncate">1. @kapil_laughs</span>
                  <span className="font-mono text-amber-400">45.2K 👏</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="truncate">2. @priya_memerani</span>
                  <span className="font-mono text-amber-400">89.4K 👏</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="truncate">3. @corporate_laugh</span>
                  <span className="font-mono text-amber-400">112K 👏</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-900/40 rounded-xl text-[11px] text-neutral-400 border border-neutral-850">
            Keyboard Shortcuts: <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-200">↓ / ↑</kbd> Next/Prev clip, <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-200">M</kbd> Mute/Unmute
          </div>
        </aside>
      </div>

      {/* Built-in Video Upload & Editing Modal */}
      {isEditorOpen && (
        <VideoEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onPublish={handlePublishVideo}
          initialSound={editorInitialSound}
        />
      )}
    </div>
  );
}
