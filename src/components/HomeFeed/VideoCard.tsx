import React, { useRef, useState, useEffect } from 'react';
import { VideoItem } from '../../types';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Disc, 
  Music, 
  Sparkles, 
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { comedyAudio } from '../../utils/soundEffects';

interface VideoCardProps {
  video: VideoItem;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleLike: (videoId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onOpenComments: (video: VideoItem) => void;
  onOpenWhatsAppShare: (video: VideoItem) => void;
  onSelectSound?: (soundTitle: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isActive,
  isMuted,
  onToggleMute,
  onToggleLike,
  onToggleFollow,
  onOpenComments,
  onOpenWhatsAppShare,
  onSelectSound,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showHeartAnim, setShowHeartAnim] = useState<boolean>(false);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Auto-play when active in viewport
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        setVideoError(false);
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Browser autoplay policy might block unmuted audio initially
              setIsPlaying(false);
            });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  // Keep muted state synced
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setProgress((current / total) * 100);
    }
  };

  const handleTogglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      // Double tap triggered! TAALI BAJA!
      triggerTaaliReaction(e);
      setLastTapTime(0);
      return;
    }
    setLastTapTime(now);

    // Single tap toggles play/pause
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const triggerTaaliReaction = (e?: React.MouseEvent) => {
    if (!video.isLiked) {
      onToggleLike(video.id);
    }
    // Play authentic clapping / cheer sound FX
    comedyAudio.playTaali();

    // Trigger visual heart/applause animation
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);

    // Launch comedy confetti burst (clapping hands and laughter)
    try {
      const rect = e?.currentTarget ? (e.currentTarget as HTMLElement).getBoundingClientRect() : null;
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

      confetti({
        particleCount: 25,
        spread: 60,
        origin: { x, y },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#ec4899', '#8b5cf6'],
        disableForReducedMotion: true,
      });
    } catch {
      // Fallback gracefully
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handlePlaySoundEffect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.soundEffectUsed) {
      comedyAudio.playSoundById(video.soundEffectUsed);
    } else {
      comedyAudio.playTaali();
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-black select-none overflow-hidden flex items-center justify-center snap-start"
      onClick={handleTogglePlayPause}
    >
      {/* Background Video Player */}
      {!videoError ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.posterUrl}
          playsInline
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Resilient Fallback Container with animated comedic ambiance */
        <div className="relative w-full h-full overflow-hidden bg-neutral-900 flex items-center justify-center">
          {video.posterUrl && (
            <img 
              src={video.posterUrl} 
              alt={video.title} 
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 flex flex-col items-center justify-center text-center p-6">
            <span className="text-4xl mb-2 animate-bounce">😂</span>
            <h3 className="text-lg font-bold text-white max-w-xs">{video.title}</h3>
            <p className="text-xs text-amber-400 mt-2">Tap to play comedy audio track</p>
          </div>
        </div>
      )}

      {/* Scrim Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

      {/* Floating Center Double-Tap Clapping / Heart Animation */}
      {showHeartAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-in duration-300">
          <div className="w-28 h-28 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 flex flex-col items-center justify-center shadow-2xl animate-pulse">
            <span className="text-4xl animate-bounce">👏</span>
            <span className="text-xs font-black tracking-wider text-amber-300 uppercase mt-1">Taali Baja!</span>
          </div>
        </div>
      )}

      {/* Center Paused Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-xl">
            <Play className="w-8 h-8 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Top Controls: Mute Toggle & Active Comedy Pill */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
            <span>{video.category}</span>
          </span>

          {video.soundEffectUsed && (
            <button
              onClick={handlePlaySoundEffect}
              className="text-[11px] font-semibold text-white bg-amber-600/80 hover:bg-amber-500 px-2.5 py-1 rounded-full backdrop-blur-md border border-amber-400/40 flex items-center gap-1 shadow-sm transition-transform active:scale-95"
              title="Click to play attached comedy sound FX!"
            >
              <Radio className="w-3 h-3 animate-pulse text-amber-200" />
              <span>SFX</span>
            </button>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* Right Side Social Interaction Bar */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 pointer-events-auto">
        {/* Creator Avatar with Follow (+) Button */}
        <div className="relative group">
          <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-yellow-400 shadow-lg">
            <img
              src={video.creator.avatar}
              alt={video.creator.name}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollow(video.creator.id);
            }}
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all ${
              video.isFollowing
                ? 'bg-neutral-800 text-neutral-300 border border-neutral-600'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold'
            }`}
            title={video.isFollowing ? 'Following' : 'Follow Creator'}
          >
            {video.isFollowing ? <Check className="w-3 h-3 stroke-3" /> : <Plus className="w-3.5 h-3.5 stroke-3" />}
          </button>
        </div>

        {/* Taali (Clap / Like) Action */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerTaaliReaction(e);
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-130 shadow-lg backdrop-blur-md ${
              video.isLiked
                ? 'bg-amber-500 text-neutral-950 shadow-amber-500/40 ring-2 ring-amber-400'
                : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'
            }`}
            title="Taali Baja! (Clap / Like)"
          >
            <span className="text-2xl leading-none">👏</span>
          </button>
          <span className="text-[11px] font-bold text-white mt-1 tabular-nums drop-shadow-md">
            {formatCount(video.clapsCount)}
          </span>
          <span className="text-[9px] font-medium text-amber-300 uppercase tracking-tighter">Taali</span>
        </div>

        {/* Comments Action */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments(video);
            }}
            className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 flex items-center justify-center transition-transform active:scale-120 shadow-lg backdrop-blur-md"
            title="Comments & Laughs"
          >
            <MessageCircle className="w-6 h-6 fill-white/20 text-white" />
          </button>
          <span className="text-[11px] font-bold text-white mt-1 tabular-nums drop-shadow-md">
            {formatCount(video.commentsCount)}
          </span>
        </div>

        {/* Direct WhatsApp Share Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenWhatsAppShare(video);
            }}
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all active:scale-125 shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-400/50 animate-pulse"
            title="Share with friends on WhatsApp!"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <span className="text-[11px] font-bold text-emerald-400 mt-1 tabular-nums drop-shadow-md">
            {formatCount(video.whatsappSharesCount)}
          </span>
          <span className="text-[9px] font-medium text-emerald-300 uppercase tracking-tighter">Share</span>
        </div>

        {/* Rotating Comedy Audio Disc */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectSound) onSelectSound(video.audioTitle);
          }}
          className="relative w-11 h-11 rounded-full bg-neutral-900 border-2 border-neutral-700 p-1 flex items-center justify-center text-amber-400 shadow-xl group"
          title={`Audio: ${video.audioTitle}`}
        >
          <div className={`w-full h-full rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-600 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
            <Disc className="w-5 h-5 text-amber-400" />
          </div>
          <Music className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-ping" />
        </button>
      </div>

      {/* Bottom Content Info Overlay */}
      <div className="absolute left-4 right-18 bottom-6 z-20 pointer-events-auto text-left">
        {/* Creator Name & Handle */}
        <div className="flex items-center gap-2 mb-1.5">
          <h4 className="font-bold text-sm text-white drop-shadow-md hover:underline cursor-pointer">
            @{video.creator.username}
          </h4>
          {video.creator.isVerified && (
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center text-[9px] font-black">
              ✓
            </span>
          )}
          {video.creator.badge && (
            <span className="text-[10px] text-amber-300/90 font-medium">
              · {video.creator.badge}
            </span>
          )}
        </div>

        {/* Video Title */}
        <h3 className="text-sm font-semibold text-neutral-100 line-clamp-2 drop-shadow-md leading-snug">
          {video.title}
        </h3>

        {/* Caption & Hashtags */}
        <p className="text-xs text-neutral-300 line-clamp-2 mt-1 drop-shadow leading-relaxed">
          {video.caption}
        </p>

        {/* Audio Track marquee */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectSound) onSelectSound(video.audioTitle);
          }}
          className="flex items-center gap-1.5 mt-2.5 text-xs text-neutral-300 cursor-pointer hover:text-amber-300 transition-colors"
        >
          <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate max-w-xs text-[11px] font-medium">
            {video.audioTitle} · {video.audioAuthor}
          </span>
        </div>
      </div>

      {/* Progress Bar at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
