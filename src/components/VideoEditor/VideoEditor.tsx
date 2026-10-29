import React, { useState, useRef, useEffect } from 'react';
import { 
  VideoItem, 
  ComedyCategory, 
  TextOverlayItem, 
  StickerOverlayItem, 
  SoundEffectItem 
} from '../../types';
import { SOUND_EFFECTS } from '../../data/seedData';
import { comedyAudio } from '../../utils/soundEffects';
import { 
  Upload, 
  Camera, 
  Scissors, 
  Type, 
  Smile, 
  Volume2, 
  Play, 
  Pause, 
  Trash2, 
  Check, 
  Sparkles, 
  X, 
  Maximize2, 
  RotateCcw,
  Film,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VideoEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newVideo: Partial<VideoItem>) => void;
  initialSound?: string;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  isOpen,
  onClose,
  onPublish,
  initialSound,
}) => {
  const [activeStep, setActiveStep] = useState<'source' | 'edit' | 'publish'>('source');
  const [videoSrc, setVideoSrc] = useState<string>('https://assets.mixkit.co/videos/preview/mixkit-young-man-laughing-and-recording-himself-42861-large.mp4');
  const [videoDuration, setVideoDuration] = useState<number>(15);
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(15);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '4:5'>('9:16');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeTool, setActiveTool] = useState<'trim' | 'text' | 'stickers' | 'audio'>('trim');

  // Video element refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Live Camera recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  // Text overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlayItem[]>([
    {
      id: 'txt-1',
      text: 'TAALI BAJA! 😂',
      font: 'impact',
      color: '#facc15',
      bgColor: 'rgba(0,0,0,0.7)',
      x: 50,
      y: 20,
      scale: 1,
    },
  ]);
  const [newTextInput, setNewTextInput] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<'impact' | 'comic' | 'bollywood' | 'clean'>('impact');
  const [selectedTextColor, setSelectedTextColor] = useState<string>('#facc15');

  // Sticker overlays
  const [stickerOverlays, setStickerOverlays] = useState<StickerOverlayItem[]>([
    {
      id: 'stk-1',
      content: '👏',
      x: 75,
      y: 75,
      scale: 1.2,
    },
  ]);

  // Sound mixer
  const [selectedSound, setSelectedSound] = useState<SoundEffectItem | null>(SOUND_EFFECTS[0]);
  const [videoVolume, setVideoVolume] = useState<number>(80);
  const [sfxVolume, setSfxVolume] = useState<number>(100);

  // Metadata for publishing
  const [title, setTitle] = useState<string>('My Hilarious Comedy Take 🤣');
  const [caption, setCaption] = useState<string>('Wait for the end twist! Share on WhatsApp if you laughed! #TaaliBaja #ComedyClip');
  const [category, setCategory] = useState<ComedyCategory>('Desi Skits');
  const [allowWhatsApp, setAllowWhatsApp] = useState<boolean>(true);

  // Available stickers
  const STICKER_PRESETS = [
    '😂', '🤣', '👏', '💀', '🕶️', '🥸', '🌶️', '🔥', '👑', '🍿', '⚡', '🏆', 
    'BRUH', 'KAPOW!', 'WAH JABARDAST', 'AYYO!'
  ];

  // Templates for instant funny edits
  const TEMPLATES = [
    {
      name: 'Laugh Attack Skit',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-laughing-and-recording-himself-42861-large.mp4',
      duration: 15,
      title: 'When the joke finally clicks after 5 minutes 😂',
    },
    {
      name: 'Mirror Comedy Roast',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-putting-on-sunglasses-in-front-of-a-mirror-40455-large.mp4',
      duration: 18,
      title: 'Trying to look cool before entering the party 😎',
    },
    {
      name: 'Pet Shenanigans',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-funny-dog-sitting-in-front-of-a-laptop-42867-large.mp4',
      duration: 14,
      title: 'Doggo doing overtime for extra treats 🐶',
    },
  ];

  // Sync initial sound if passed
  useEffect(() => {
    if (initialSound) {
      const match = SOUND_EFFECTS.find((s) => s.name.toLowerCase().includes(initialSound.toLowerCase()));
      if (match) setSelectedSound(match);
    }
  }, [initialSound]);

  // Video playback time listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const dur = Math.floor(video.duration) || 15;
      setVideoDuration(dur);
      setTrimEnd(dur);
    };

    const handleTime = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
        video.play();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTime);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTime);
    };
  }, [trimStart, trimEnd, videoSrc]);

  // Apply speed changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Start Camera
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
    } catch {
      alert('Camera access denied or unavailable. You can upload any video or use a comedy template!');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    try {
      const recorder = new MediaRecorder(streamRef.current);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoSrc(url);
        stopCamera();
        setActiveStep('edit');
        comedyAudio.playTaali();
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordSeconds(0);
    } catch {
      alert('Could not start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setActiveStep('edit');
      comedyAudio.playTaali();
    }
  };

  // Toggle Play
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Add text
  const handleAddText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTextInput.trim()) return;
    const newText: TextOverlayItem = {
      id: `txt-${Date.now()}`,
      text: newTextInput.trim(),
      font: selectedFont,
      color: selectedTextColor,
      bgColor: 'rgba(0,0,0,0.7)',
      x: 50,
      y: 40 + (textOverlays.length * 15) % 40,
      scale: 1,
    };
    setTextOverlays([...textOverlays, newText]);
    setNewTextInput('');
    comedyAudio.playBaDumTss();
  };

  // Add sticker
  const handleAddSticker = (emoji: string) => {
    const newSticker: StickerOverlayItem = {
      id: `stk-${Date.now()}`,
      content: emoji,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      scale: 1.2,
    };
    setStickerOverlays([...stickerOverlays, newSticker]);
    comedyAudio.playBoing();
  };

  // Handle Publish
  const handleFinalPublish = () => {
    const newVideo: Partial<VideoItem> = {
      title,
      caption,
      category,
      videoUrl: videoSrc,
      durationSeconds: Math.max(1, Math.round(trimEnd - trimStart)),
      audioTitle: selectedSound ? `${selectedSound.name} (Custom Remix)` : 'Original Comedy Audio',
      audioAuthor: 'aman_taalibaaz',
      clapsCount: 1,
      commentsCount: 0,
      whatsappSharesCount: 0,
      soundEffectUsed: selectedSound?.id,
      aspectRatio,
    };

    onPublish(newVideo);
    comedyAudio.playTaali();

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#ef4444', '#ec4899'],
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full h-full md:max-w-4xl md:h-[90vh] bg-neutral-950 border border-neutral-800 md:rounded-3xl shadow-2xl flex flex-col text-neutral-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base leading-tight">Taali Studio · Video Editor</h2>
              <p className="text-[11px] text-neutral-400">Trim, meme, add comedy sounds & publish</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Step indicators */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs mr-2">
              <span className={`px-2 py-0.5 rounded-md ${activeStep === 'source' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-500'}`}>1. Source</span>
              <span className="text-neutral-600">/</span>
              <span className={`px-2 py-0.5 rounded-md ${activeStep === 'edit' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-500'}`}>2. Edit & Meme</span>
              <span className="text-neutral-600">/</span>
              <span className={`px-2 py-0.5 rounded-md ${activeStep === 'publish' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-500'}`}>3. Publish</span>
            </div>

            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col md:flex-row">
          {/* STEP 1: SOURCE PICKER */}
          {activeStep === 'source' && (
            <div className="flex-1 p-6 flex flex-col max-w-2xl mx-auto w-full justify-center">
              <div className="text-center mb-6">
                <span className="text-4xl mb-2 inline-block animate-bounce">🎬</span>
                <h3 className="text-xl font-display font-bold">Create Your Comedy Short</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Upload a video clip, record a live reaction, or pick a trending meme template.
                </p>
              </div>

              {/* Live Camera Box if activated */}
              {isCameraActive ? (
                <div className="relative w-full max-w-sm mx-auto aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl mb-4">
                  <video
                    ref={cameraVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 text-white text-xs font-mono font-bold px-3 py-1 rounded-full animate-pulse">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      <span>REC {recordSeconds}s</span>
                    </div>
                  )}
                  <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-full shadow-lg flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" /> Start Recording
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-6 py-3 bg-white text-neutral-950 font-bold text-sm rounded-full shadow-lg flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 text-red-600" /> Done Recording
                      </button>
                    )}
                    <button
                      onClick={stopCamera}
                      className="px-4 py-3 bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Option A: Upload File */}
                  <label className="border-2 border-dashed border-neutral-700 hover:border-amber-500 bg-neutral-900/50 hover:bg-neutral-900/90 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 group-hover:scale-110 flex items-center justify-center mb-3 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-white">Upload Video File</span>
                    <span className="text-[11px] text-neutral-400 mt-1">MP4, WebM, MOV (Max 60s)</span>
                  </label>

                  {/* Option B: Live Camera */}
                  <button
                    onClick={startCamera}
                    className="border-2 border-neutral-800 hover:border-rose-500 bg-neutral-900/50 hover:bg-neutral-900/90 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 group-hover:scale-110 flex items-center justify-center mb-3 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-white">Record with Camera</span>
                    <span className="text-[11px] text-neutral-400 mt-1">Shoot a funny live skit or roast</span>
                  </button>
                </div>
              )}

              {/* Option C: Pick Template */}
              {!isCameraActive && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-3">
                    Or choose a comedy starter template:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TEMPLATES.map((tmpl, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setVideoSrc(tmpl.url);
                          setTitle(tmpl.title);
                          setActiveStep('edit');
                          comedyAudio.playTaali();
                        }}
                        className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-full h-24 bg-neutral-800 rounded-lg flex items-center justify-center text-3xl mb-2">
                            {idx === 0 ? '🤣' : idx === 1 ? '😎' : '🐶'}
                          </div>
                          <h4 className="text-xs font-bold text-white leading-tight">{tmpl.name}</h4>
                          <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{tmpl.title}</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-amber-400 font-medium">
                          <span>{tmpl.duration}s</span>
                          <span>Use Template →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: EDITING TOOL (CANVAS + CONTROLS) */}
          {activeStep === 'edit' && (
            <div className="flex-1 flex flex-col md:flex-row h-full">
              {/* Left: Video Preview Canvas */}
              <div className="flex-1 bg-black flex items-center justify-center p-4 relative min-h-[380px] select-none">
                <div 
                  className={`relative overflow-hidden bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 ${
                    aspectRatio === '9:16'
                      ? 'w-[260px] h-[460px]'
                      : aspectRatio === '1:1'
                      ? 'w-[360px] h-[360px]'
                      : 'w-[300px] h-[375px]'
                  }`}
                >
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    playsInline
                    loop
                    className="w-full h-full object-cover"
                    onClick={togglePlay}
                  />

                  {/* Text Overlays rendering */}
                  {textOverlays.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        position: 'absolute',
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: 'translate(-50%, -50%)',
                        color: item.color,
                        backgroundColor: item.bgColor,
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-black uppercase text-center cursor-move shadow-lg border border-black/40 ${
                        item.font === 'impact' ? 'font-sans tracking-wide' : 'font-display'
                      }`}
                    >
                      {item.text}
                    </div>
                  ))}

                  {/* Sticker Overlays rendering */}
                  {stickerOverlays.map((stk) => (
                    <div
                      key={stk.id}
                      style={{
                        position: 'absolute',
                        left: `${stk.x}%`,
                        top: `${stk.y}%`,
                        transform: `translate(-50%, -50%) scale(${stk.scale})`,
                      }}
                      className="cursor-move select-none text-2xl drop-shadow-lg"
                    >
                      {stk.content}
                    </div>
                  ))}

                  {/* Play/Pause Button overlay */}
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>

                  {/* Audio badge on preview */}
                  {selectedSound && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5 text-[10px] text-amber-300">
                      <span>{selectedSound.icon}</span>
                      <span className="truncate">{selectedSound.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Editing Tool Panels */}
              <div className="w-full md:w-96 bg-neutral-900 border-l border-neutral-800 flex flex-col">
                {/* Tool Selector Tabs */}
                <div className="flex border-b border-neutral-800 bg-neutral-950/50">
                  <button
                    onClick={() => setActiveTool('trim')}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      activeTool === 'trim' ? 'text-amber-400 border-b-2 border-amber-400 bg-neutral-900' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" /> Trim & Ratio
                  </button>
                  <button
                    onClick={() => setActiveTool('text')}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      activeTool === 'text' ? 'text-amber-400 border-b-2 border-amber-400 bg-neutral-900' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" /> Text
                  </button>
                  <button
                    onClick={() => setActiveTool('stickers')}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      activeTool === 'stickers' ? 'text-amber-400 border-b-2 border-amber-400 bg-neutral-900' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smile className="w-3.5 h-3.5" /> Stickers
                  </button>
                  <button
                    onClick={() => setActiveTool('audio')}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      activeTool === 'audio' ? 'text-amber-400 border-b-2 border-amber-400 bg-neutral-900' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" /> SFX Mixer
                  </button>
                </div>

                {/* Tool Sub-panel */}
                <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
                  {/* 1. TRIM & RATIO TOOL */}
                  {activeTool === 'trim' && (
                    <div className="space-y-4">
                      {/* Timeline Scrubber */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-neutral-300">Video Trim Range</span>
                          <span className="font-mono text-amber-400 font-bold">
                            {trimStart}s - {trimEnd}s ({(trimEnd - trimStart).toFixed(0)}s total)
                          </span>
                        </div>
                        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                          <div>
                            <span className="text-[10px] text-neutral-400">Start Time: {trimStart}s</span>
                            <input
                              type="range"
                              min={0}
                              max={Math.max(0, trimEnd - 1)}
                              value={trimStart}
                              onChange={(e) => setTrimStart(Number(e.target.value))}
                              className="w-full accent-amber-500"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-400">End Time: {trimEnd}s</span>
                            <input
                              type="range"
                              min={trimStart + 1}
                              max={videoDuration || 30}
                              value={trimEnd}
                              onChange={(e) => setTrimEnd(Number(e.target.value))}
                              className="w-full accent-amber-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Aspect Ratio Selector */}
                      <div>
                        <span className="text-xs font-semibold text-neutral-300 block mb-2">Crop / Aspect Ratio</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: '9:16 Shorts', val: '9:16' as const },
                            { label: '1:1 Square', val: '1:1' as const },
                            { label: '4:5 Portrait', val: '4:5' as const },
                          ].map((item) => (
                            <button
                              key={item.val}
                              onClick={() => setAspectRatio(item.val)}
                              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                                aspectRatio === item.val
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                  : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Speed Control */}
                      <div>
                        <span className="text-xs font-semibold text-neutral-300 block mb-2">Comedy Speed Control</span>
                        <div className="grid grid-cols-4 gap-2">
                          {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => setPlaybackSpeed(speed)}
                              className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                playbackSpeed === speed
                                  ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500'
                                  : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                              }`}
                            >
                              {speed === 0.5 ? '0.5x Slow' : speed === 2.0 ? '2x Fast' : `${speed}x`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. TEXT TOOL */}
                  {activeTool === 'text' && (
                    <div className="space-y-4">
                      <form onSubmit={handleAddText} className="space-y-2.5">
                        <label className="text-xs font-semibold text-neutral-300 block">Add Funny Caption Overlay</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTextInput}
                            onChange={(e) => setNewTextInput(e.target.value)}
                            placeholder="e.g. Wait for Papa's reaction 💀"
                            className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-amber-500 text-xs text-white rounded-xl px-3 py-2 outline-none"
                          />
                          <button
                            type="submit"
                            className="px-3 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl hover:bg-amber-400"
                          >
                            Add
                          </button>
                        </div>
                      </form>

                      {/* Font selector */}
                      <div>
                        <span className="text-[11px] text-neutral-400 block mb-1.5">Meme Font Style</span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'impact', label: 'Impact Meme' },
                            { id: 'comic', label: 'Comic Fun' },
                            { id: 'bollywood', label: 'Bollywood Retro' },
                            { id: 'clean', label: 'Clean Modern' },
                          ].map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setSelectedFont(f.id as any)}
                              className={`py-1.5 px-2 text-xs rounded-lg border text-left transition-all ${
                                selectedFont === f.id
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                  : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Palette */}
                      <div>
                        <span className="text-[11px] text-neutral-400 block mb-1.5">Text Color</span>
                        <div className="flex gap-2">
                          {['#facc15', '#ffffff', '#ef4444', '#10b981', '#38bdf8', '#ec4899'].map((c) => (
                            <button
                              key={c}
                              onClick={() => setSelectedTextColor(c)}
                              style={{ backgroundColor: c }}
                              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                                selectedTextColor === c ? 'scale-115 border-white shadow-lg' : 'border-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Overlays list */}
                      {textOverlays.length > 0 && (
                        <div className="pt-2 border-t border-neutral-800">
                          <span className="text-[11px] text-neutral-400 block mb-2">Active Text Layers</span>
                          <div className="space-y-1.5">
                            {textOverlays.map((txt) => (
                              <div key={txt.id} className="flex items-center justify-between p-2 bg-neutral-950 rounded-lg text-xs">
                                <span className="truncate max-w-[200px] text-neutral-200">{txt.text}</span>
                                <button
                                  onClick={() => setTextOverlays(textOverlays.filter((t) => t.id !== txt.id))}
                                  className="text-neutral-500 hover:text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. STICKERS TOOL */}
                  {activeTool === 'stickers' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-neutral-300 block mb-2">
                          Tap Sticker to Add to Video
                        </span>
                        <div className="grid grid-cols-4 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                          {STICKER_PRESETS.map((stk) => (
                            <button
                              key={stk}
                              onClick={() => handleAddSticker(stk)}
                              className="h-12 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 rounded-lg text-xl hover:scale-110 active:scale-95 transition-transform"
                            >
                              {stk}
                            </button>
                          ))}
                        </div>
                      </div>

                      {stickerOverlays.length > 0 && (
                        <div>
                          <span className="text-[11px] text-neutral-400 block mb-1.5">Placed Stickers ({stickerOverlays.length})</span>
                          <div className="flex gap-2 flex-wrap">
                            {stickerOverlays.map((stk) => (
                              <div key={stk.id} className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-800 text-xs">
                                <span>{stk.content}</span>
                                <button
                                  onClick={() => setStickerOverlays(stickerOverlays.filter((s) => s.id !== stk.id))}
                                  className="text-neutral-500 hover:text-red-400 ml-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. AUDIO / SFX MIXER */}
                  {activeTool === 'audio' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-neutral-300 block mb-2">
                          Comedy Soundboard & Punchline Audio
                        </span>
                        <div className="space-y-2">
                          {SOUND_EFFECTS.map((sfx) => (
                            <div
                              key={sfx.id}
                              onClick={() => {
                                setSelectedSound(sfx);
                                comedyAudio.playSoundById(sfx.id);
                              }}
                              className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                selectedSound?.id === sfx.id
                                  ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                                  : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl">{sfx.icon}</span>
                                <div>
                                  <h4 className="text-xs font-bold leading-tight">{sfx.name}</h4>
                                  <p className="text-[10px] text-neutral-400">{sfx.description}</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  comedyAudio.playSoundById(sfx.id);
                                }}
                                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-semibold text-amber-300"
                              >
                                Test SFX
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Volume controls */}
                      <div className="pt-2 border-t border-neutral-800 space-y-3">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-neutral-400">Original Video Audio</span>
                            <span className="font-mono text-neutral-200">{videoVolume}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={videoVolume}
                            onChange={(e) => setVideoVolume(Number(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-neutral-400">Comedy SFX Volume</span>
                            <span className="font-mono text-amber-400">{sfxVolume}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={sfxVolume}
                            onChange={(e) => setSfxVolume(Number(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom step navigation in Edit view */}
                <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
                  <button
                    onClick={() => setActiveStep('source')}
                    className="px-3 py-2 text-xs text-neutral-400 hover:text-white"
                  >
                    ← Change Video
                  </button>
                  <button
                    onClick={() => {
                      setActiveStep('publish');
                      comedyAudio.playTaali();
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
                  >
                    <span>Next: Publish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PUBLISH & SHARE SETTINGS */}
          {activeStep === 'publish' && (
            <div className="flex-1 p-6 max-w-xl mx-auto w-full flex flex-col justify-center space-y-5">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Publish Video to Taali Baja</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Ready to make thousands of people laugh!</p>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Comedy Title / Hook</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. When the teacher calls your name unexpectedly 💀"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 text-xs text-white rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Caption & Comedy Hashtags</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 text-xs text-white rounded-xl px-3.5 py-2.5 outline-none resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Comedy Category</label>
                <div className="flex flex-wrap gap-2">
                  {(['Desi Skits', 'Standup', 'Memes', 'Relatable', 'Bloopers', 'Office Humor'] as ComedyCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        category === cat
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp Share Permission Toggle */}
              <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Enable One-Tap WhatsApp Forwarding</h4>
                  <p className="text-[11px] text-neutral-400">Allows viewers to forward your clip straight to WhatsApp groups</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowWhatsApp}
                  onChange={(e) => setAllowWhatsApp(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Publish Action buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setActiveStep('edit')}
                  className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold text-xs rounded-xl"
                >
                  ← Back to Editor
                </button>
                <button
                  onClick={handleFinalPublish}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 active:scale-[0.99] transition-all text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish to Feed & Profile (Taali Baja!)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
