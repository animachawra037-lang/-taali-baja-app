import React, { useState } from 'react';
import { SOUND_EFFECTS } from '../../data/seedData';
import { VideoItem } from '../../types';
import { comedyAudio } from '../../utils/soundEffects';
import { Search, Flame, Music, Sparkles, TrendingUp, Play, Users, MessageCircle } from 'lucide-react';

interface DiscoverViewProps {
  onSelectVideo: (videoId: string) => void;
  onUseSound: (soundName: string) => void;
  onFollowCreator: (creatorId: string) => void;
  videos: VideoItem[];
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onSelectVideo,
  onUseSound,
  onFollowCreator,
  videos,
}) => {
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const comedyTags = [
    'All',
    '#DesiComedy',
    '#MemeQueen',
    '#StandupBuzz',
    '#JugaadFail',
    '#OfficeHumor',
    '#Relatable',
  ];

  const featuredCreators = [
    {
      id: 'creator-kapil',
      name: 'Kapil Sharma Fanclub',
      username: 'kapil_laughs',
      avatar: '/src/assets/images/avatar_kapil_standup_1793237927655.jpg',
      followers: '482K',
      badge: 'Standup Star',
    },
    {
      id: 'creator-priya',
      name: 'Priya Sharma (Meme Rani)',
      username: 'priya_memerani',
      avatar: '/src/assets/images/avatar_priya_memes_1793237927938.jpg',
      followers: '310K',
      badge: 'Meme Royalty',
    },
  ];

  return (
    <div className="w-full h-full bg-neutral-950 text-neutral-100 overflow-y-auto no-scrollbar p-4 pb-24 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={activeSearch}
          onChange={(e) => setActiveSearch(e.target.value)}
          placeholder="Search comedy creators, memes, sounds..."
          className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none placeholder:text-neutral-500"
        />
      </div>

      {/* Comedy Tags Carousel */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {comedyTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTag === tag
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Trending Comedy Sounds */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Trending Comedy Sounds</h3>
          </div>
          <span className="text-[11px] text-neutral-400">Tap to test & remix</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SOUND_EFFECTS.map((sound) => (
            <div
              key={sound.id}
              className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between hover:border-neutral-700 transition-colors"
            >
              <div
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                onClick={() => comedyAudio.playSoundById(sound.id)}
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-xl shrink-0 group">
                  <span>{sound.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{sound.name}</h4>
                  <p className="text-[10px] text-neutral-400 truncate">{sound.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 ml-2 shrink-0">
                <button
                  onClick={() => comedyAudio.playSoundById(sound.id)}
                  className="p-1.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded-lg text-xs"
                  title="Play Preview"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={() => onUseSound(sound.name)}
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-[10px] shadow-sm"
                >
                  Use Sound
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Comedy Creators */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-rose-400" />
          <h3 className="font-bold text-sm text-white">Top Laugh Masters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featuredCreators.map((creator) => (
            <div
              key={creator.id}
              className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-700 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{creator.name}</h4>
                  <p className="text-[10px] text-neutral-400">@{creator.username}</p>
                  <span className="text-[10px] text-amber-400 font-medium">{creator.followers} followers</span>
                </div>
              </div>

              <button
                onClick={() => onFollowCreator(creator.id)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors shrink-0"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Comedy Clips Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <h3 className="font-bold text-sm text-white">Trending Desi Laughs</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid.id)}
              className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 cursor-pointer shadow-md transition-all hover:scale-[1.02]"
            >
              {vid.posterUrl ? (
                <img src={vid.posterUrl} alt={vid.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-2xl">
                  🎬
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                <h5 className="text-[10px] font-semibold text-white line-clamp-2 leading-tight">
                  {vid.title}
                </h5>
                <div className="flex items-center justify-between text-[9px] text-neutral-300 mt-1">
                  <span className="text-amber-400">👏 {vid.clapsCount}</span>
                  <span className="text-emerald-400">💬 {vid.whatsappSharesCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
