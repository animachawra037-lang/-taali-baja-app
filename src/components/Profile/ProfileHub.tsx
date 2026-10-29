import React, { useState } from 'react';
import { VideoItem } from '../../types';
import { CURRENT_USER_PROFILE } from '../../data/seedData';
import { 
  BarChart3, 
  Settings, 
  Share2, 
  Film, 
  Heart, 
  Bookmark, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  ShieldCheck, 
  Volume2, 
  Lock, 
  Sparkles, 
  Check, 
  Edit3,
  ExternalLink,
  ChevronRight,
  Eye,
  Award
} from 'lucide-react';
import { comedyAudio } from '../../utils/soundEffects';

interface ProfileHubProps {
  myVideos: VideoItem[];
  likedVideos: VideoItem[];
  onSelectVideo: (videoId: string) => void;
  onOpenCreate: () => void;
}

export const ProfileHub: React.FC<ProfileHubProps> = ({
  myVideos,
  likedVideos,
  onSelectVideo,
  onOpenCreate,
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'liked' | 'analytics' | 'settings'>('videos');
  const [profile, setProfile] = useState(CURRENT_USER_PROFILE);
  const [isCopiedProfile, setIsCopiedProfile] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(profile.bio);

  const handleToggleSetting = (key: keyof typeof profile) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (key === 'soundEffectsFeedback') {
        comedyAudio.enabled = updated.soundEffectsFeedback as boolean;
      }
      return updated;
    });
  };

  const handleSaveBio = () => {
    setProfile((prev) => ({ ...prev, bio: bioInput }));
    setIsEditingBio(false);
    comedyAudio.playTaali();
  };

  const handleShareProfileWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out @${profile.username}'s comedy skits on Taali Baja! 👏 Watch hilarious reels & memes here: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="w-full h-full bg-neutral-950 text-neutral-100 overflow-y-auto no-scrollbar flex flex-col pb-20">
      {/* Top Banner / Cover */}
      <div className="relative h-32 w-full bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-3 right-4 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            title="Settings & Privacy"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Header Info */}
      <div className="px-5 pt-0 -mt-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-4 border-b border-neutral-800 shrink-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3.5 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full p-1 bg-neutral-950 shadow-2xl">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xs shadow-md">
              👏
            </div>
          </div>

          {/* Name & Handle */}
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl font-display font-bold text-white">{profile.name}</h2>
              <span className="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>
            <p className="text-xs text-neutral-400">@{profile.username}</p>
            <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                <Award className="w-3 h-3" />
                {profile.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={handleShareProfileWhatsApp}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md"
            title="Share profile link on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Bio section */}
      <div className="px-5 py-3 border-b border-neutral-800/60 bg-neutral-900/30">
        {!isEditingBio ? (
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">{profile.bio}</p>
            <button
              onClick={() => setIsEditingBio(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
            >
              <Edit3 className="w-3 h-3" /> Edit Bio
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              rows={2}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditingBio(false)}
                className="px-3 py-1 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBio}
                className="px-3 py-1 bg-amber-500 text-neutral-950 font-bold text-xs rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Counter Bar */}
      <div className="grid grid-cols-4 divide-x divide-neutral-800 border-b border-neutral-800 py-3 bg-neutral-900/40 text-center">
        <div>
          <span className="text-base font-bold text-white font-mono tabular-nums">
            {(profile.followersCount / 1000).toFixed(1)}K
          </span>
          <span className="block text-[10px] text-neutral-400 font-medium">Followers</span>
        </div>
        <div>
          <span className="text-base font-bold text-white font-mono tabular-nums">
            {profile.followingCount}
          </span>
          <span className="block text-[10px] text-neutral-400 font-medium">Following</span>
        </div>
        <div>
          <span className="text-base font-bold text-amber-400 font-mono tabular-nums">
            {(profile.clapsTotal / 1000).toFixed(1)}K
          </span>
          <span className="block text-[10px] text-neutral-400 font-medium">Taaliyan 👏</span>
        </div>
        <div>
          <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
            {(profile.whatsappSharesTotal / 1000).toFixed(1)}K
          </span>
          <span className="block text-[10px] text-neutral-400 font-medium">WA Shares 💬</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-neutral-800 px-5 bg-neutral-950 sticky top-0 z-20">
        <button
          onClick={() => setActiveTab('videos')}
          className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'videos'
              ? 'text-amber-400 border-amber-400'
              : 'text-neutral-400 border-transparent hover:text-neutral-200'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>My Videos ({myVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'liked'
              ? 'text-amber-400 border-amber-400'
              : 'text-neutral-400 border-transparent hover:text-neutral-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Clapped ({likedVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'analytics'
              ? 'text-amber-400 border-amber-400'
              : 'text-neutral-400 border-transparent hover:text-neutral-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Creator Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'settings'
              ? 'text-amber-400 border-amber-400'
              : 'text-neutral-400 border-transparent hover:text-neutral-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* TAB CONTENT: MY VIDEOS */}
      {activeTab === 'videos' && (
        <div className="p-4 flex-1">
          {myVideos.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 flex flex-col items-center">
              <span className="text-4xl mb-3">🎬</span>
              <h4 className="text-sm font-bold text-neutral-300">No videos published yet</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Upload your first comedy short or record a reaction skit using our built-in video editor!
              </p>
              <button
                onClick={onOpenCreate}
                className="mt-4 px-4 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg hover:bg-amber-400"
              >
                + Create Short Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {myVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => onSelectVideo(vid.id)}
                  className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 cursor-pointer shadow-md transition-transform hover:scale-[1.02]"
                >
                  {vid.posterUrl ? (
                    <img src={vid.posterUrl} alt={vid.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-t from-neutral-950 via-neutral-900 to-amber-950/30 flex items-center justify-center text-3xl">
                      🎭
                    </div>
                  )}

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <h5 className="text-[11px] font-semibold text-white line-clamp-2 leading-tight">
                      {vid.title}
                    </h5>
                    <div className="flex items-center justify-between text-[10px] text-neutral-300 mt-1 font-mono">
                      <span className="flex items-center gap-1 text-amber-400">
                        👏 {vid.clapsCount}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        💬 {vid.whatsappSharesCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: LIKED / CLAPPED */}
      {activeTab === 'liked' && (
        <div className="p-4 flex-1">
          {likedVideos.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 flex flex-col items-center">
              <span className="text-4xl mb-3">👏</span>
              <h4 className="text-sm font-bold text-neutral-300">No clapped videos yet</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Double tap on any comedy short in the feed to give a Taali!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {likedVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => onSelectVideo(vid.id)}
                  className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 cursor-pointer shadow-md transition-transform hover:scale-[1.02]"
                >
                  {vid.posterUrl ? (
                    <img src={vid.posterUrl} alt={vid.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-3xl">
                      😂
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <h5 className="text-[11px] font-semibold text-white line-clamp-2 leading-tight">
                      {vid.title}
                    </h5>
                    <span className="text-[10px] text-neutral-400 mt-0.5 truncate">
                      @{vid.creator.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CREATOR DASHBOARD & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="p-5 flex-1 space-y-6 max-w-3xl mx-auto w-full">
          {/* Header */}
          <div>
            <h3 className="font-display font-bold text-lg text-white">Creator Analytics & Comedy Insights</h3>
            <p className="text-xs text-neutral-400">Track viewer laughter retention, viral forwards, and audience metrics.</p>
          </div>

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                <span>7-Day Views</span>
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-bold font-mono text-white">1.82M</span>
              <span className="block text-[11px] text-emerald-400 font-medium mt-1">↑ +24.8% vs last week</span>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                <span>WhatsApp Forward Rate</span>
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold font-mono text-emerald-400">41,200</span>
              <span className="block text-[11px] text-emerald-400 font-medium mt-1">🔥 Top 3% viral velocity</span>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                <span>Laugh Retention</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-bold font-mono text-amber-300">84.6%</span>
              <span className="block text-[11px] text-neutral-400 font-medium mt-1">Average watch-through</span>
            </div>
          </div>

          {/* Daily Laugh & Taali Velocity Graph Simulation */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold text-white">Weekly Taali & Views Performance</h4>
                <p className="text-[10px] text-neutral-400">Daily breakdown of audience laughter applause</p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg">
                245K Total Claps
              </span>
            </div>

            {/* Bar chart bars */}
            <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4 border-b border-neutral-800 pb-2">
              {[
                { day: 'Mon', h: '45%', count: '28K' },
                { day: 'Tue', h: '60%', count: '39K' },
                { day: 'Wed', h: '55%', count: '34K' },
                { day: 'Thu', h: '75%', count: '48K' },
                { day: 'Fri', h: '95%', count: '64K' },
                { day: 'Sat', h: '100%', count: '78K' },
                { day: 'Sun', h: '85%', count: '55K' },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    style={{ height: item.h }}
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg group-hover:brightness-125 transition-all shadow-sm"
                  />
                  <span className="text-[10px] text-neutral-400 font-medium">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-3">
              <span>Peak Posting Hour: <strong className="text-amber-400">8:30 PM - 11:00 PM (Dinner Laughs)</strong></span>
              <span>Audience: 68% Young Adults (18-34)</span>
            </div>
          </div>

          {/* Top performing clips breakdown */}
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <h4 className="text-xs font-bold text-white mb-3">Top Performing Comedy Sketches</h4>
            <div className="space-y-2.5">
              {[
                { title: 'When Dad finds your online shopping cart 🛒', claps: '45.2K', shares: '18.9K', views: '289K' },
                { title: '5-Minute DIY Jugaad Gone Horribly Wrong! 🪛', claps: '89.4K', shares: '42.1K', views: '654K' },
                { title: 'POV: Attending a 9 AM Monday Standup Call 🐶', claps: '112.0K', shares: '68.0K', views: '890K' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-850 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="font-mono font-bold text-amber-500 w-4">#{i + 1}</span>
                    <span className="text-neutral-200 truncate">{c.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-neutral-400">
                    <span className="text-amber-400">👏 {c.claps}</span>
                    <span className="text-emerald-400">💬 {c.shares} WA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SETTINGS & PRIVACY */}
      {activeTab === 'settings' && (
        <div className="p-5 flex-1 space-y-6 max-w-xl mx-auto w-full">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Profile & Comedy Settings</h3>
            <p className="text-xs text-neutral-400">Control your privacy, viral sharing, and audio interactions.</p>
          </div>

          <div className="space-y-3">
            {/* Private Account */}
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Private Profile</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Only approved followers can see your comedy clips.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.isPrivate}
                onChange={() => handleToggleSetting('isPrivate')}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Direct WhatsApp Sharing */}
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Allow Direct WhatsApp Forwards</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Permit viewers to share comedy clips directly to WhatsApp groups.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.allowWhatsAppShares}
                onChange={() => handleToggleSetting('allowWhatsAppShares')}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Allow Duets */}
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Allow Comedy Duets & Sound Remixing</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Other creators can remix your punchline audio tracks.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.allowDuets}
                onChange={() => handleToggleSetting('allowDuets')}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Tactile Sound FX on Double Tap */}
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Taali Sound FX on Double Tap</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Play synthesized cheering applause when clapping for clips.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.soundEffectsFeedback}
                onChange={() => handleToggleSetting('soundEffectsFeedback')}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Test Sound FX button */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-neutral-200">Test Comedy Sound Synthesizer</h4>
              <p className="text-[10px] text-neutral-400">Verify audio feedback latency</p>
            </div>
            <button
              onClick={() => comedyAudio.playBaDumTss()}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold rounded-lg border border-neutral-700"
            >
              Play Ba-Dum-Tsss 🥁
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
