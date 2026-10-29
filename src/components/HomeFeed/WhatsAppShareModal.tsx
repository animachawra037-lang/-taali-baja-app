import React, { useState } from 'react';
import { VideoItem } from '../../types';
import { MessageCircle, Copy, Check, Send, Sparkles, ExternalLink, X, Smartphone } from 'lucide-react';

interface WhatsAppShareModalProps {
  video: VideoItem;
  isOpen: boolean;
  onClose: () => void;
  onShareSuccess: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  video,
  isOpen,
  onClose,
  onShareSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPunchline, setSelectedPunchline] = useState<number>(0);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://taalibaja.app';
  const videoShareUrl = `${currentUrl}#video-${video.id}`;

  const punchlineTemplates = [
    `😂 Bhai ye dekh, hans hans ke pet dard ho gaya! "${video.title}" by @${video.creator.username} 👏\nDekh idhar: ${videoShareUrl}`,
    `💀 100% RELATABLE comedy clip! "${video.title}" 🤣 Taali Baja pe dekho:\n${videoShareUrl}`,
    `👏 Taali bajao is bande ke liye! Comedy level ultra pro max 💥\n"${video.title}"\n${videoShareUrl}`,
  ];

  const fullMessage = punchlineTemplates[selectedPunchline];

  const handleOpenWhatsApp = (isStatus = false) => {
    onShareSuccess();
    const encodedText = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    
    // Open in new tab or native WhatsApp scheme
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullMessage);
    setCopied(true);
    onShareSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: fullMessage,
          url: videoShareUrl,
        });
        onShareSuccess();
        onClose();
      } catch {
        // User dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle for mobile */}
        <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 fill-emerald-500 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Share on WhatsApp</h3>
              <p className="text-xs text-neutral-400">Spread the laughs with friends & family</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Preview Card */}
        <div className="mt-4 p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/50 flex gap-3 items-center">
          <div className="w-14 h-18 bg-neutral-800 rounded-lg overflow-hidden shrink-0 relative">
            {video.posterUrl ? (
              <img src={video.posterUrl} alt={video.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-amber-500/20 flex items-center justify-center text-xl">🎬</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1">
              <span className="text-[9px] font-mono font-bold text-amber-400">{video.durationSeconds}s</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold line-clamp-2 text-white">{video.title}</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">by @{video.creator.username}</p>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-emerald-400 font-medium">
              <span>💬 {video.whatsappSharesCount.toLocaleString()} forwards already!</span>
            </div>
          </div>
        </div>

        {/* Punchline selector */}
        <div className="mt-4">
          <label className="text-xs font-medium text-neutral-300 block mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Choose Funny WhatsApp Caption:
          </label>
          <div className="space-y-2">
            {punchlineTemplates.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPunchline(idx)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                  selectedPunchline === idx
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-sm'
                    : 'bg-neutral-800/40 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <p className="line-clamp-2 font-medium">{p.split('\n')[0]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <button
            onClick={() => handleOpenWhatsApp(false)}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Send to WhatsApp Chat / Group</span>
          </button>

          <button
            onClick={() => handleOpenWhatsApp(true)}
            className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] transition-all rounded-xl font-medium text-xs text-emerald-400 flex items-center justify-center gap-2 border border-emerald-500/30"
          >
            <Smartphone className="w-4 h-4" />
            <span>Share to WhatsApp Status</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 border border-neutral-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleNativeShare}
              className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 border border-neutral-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>More Apps</span>
            </button>
          </div>
        </div>

        {/* Tip */}
        <p className="text-[11px] text-center text-neutral-400 mt-4">
          Tip: Tap WhatsApp to paste directly into your college or family groups!
        </p>
      </div>
    </div>
  );
};
