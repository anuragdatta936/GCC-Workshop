import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'ALGORITHMIC_DRIVE', artist: 'AI_SYNTH', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CYBERNETIC_CITY', artist: 'AI_BEATS', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'DIGITAL_DREAMS', artist: 'AI_CHILL', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-void border-t-4 border-glitch-cyan p-4 z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-1/3">
          <div className={`w-14 h-14 bg-glitch-magenta flex items-center justify-center border-2 border-white ${isPlaying ? 'animate-pulse' : ''}`}>
            <Disc3 className="text-void w-10 h-10" />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-glitch-cyan text-2xl truncate">ID: {TRACKS[currentTrack].title}</h3>
            <p className="text-glitch-magenta text-xl truncate">SRC: {TRACKS[currentTrack].artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full sm:w-1/3 justify-center">
          <button onClick={prevTrack} className="text-glitch-cyan hover:text-void hover:bg-glitch-cyan p-2 transition-none border-2 border-transparent hover:border-white">
            <SkipBack className="w-8 h-8" />
          </button>
          <button onClick={togglePlay} className="w-16 h-16 bg-glitch-cyan text-void flex items-center justify-center hover:bg-white transition-none border-2 border-white">
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <button onClick={nextTrack} className="text-glitch-cyan hover:text-void hover:bg-glitch-cyan p-2 transition-none border-2 border-transparent hover:border-white">
            <SkipForward className="w-8 h-8" />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-1/3 justify-end">
          <button onClick={() => setIsMuted(!isMuted)} className="text-glitch-magenta hover:text-void hover:bg-glitch-magenta p-2 transition-none border-2 border-transparent hover:border-white">
            {isMuted || volume === 0 ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-32"
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={nextTrack}
        loop={false}
      />
    </div>
  );
}
