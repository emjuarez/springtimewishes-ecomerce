import {useState, useRef, useEffect} from 'react';
import '../styles/audio-player.css';

export function AudioPlayer({src, title = 'Audio'}) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
        console.log('currentTime:', audio.currentTime, 'duration:', audio.duration);
        setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
     if (audio.readyState >= 1) {
    setDuration(audio.duration);
  }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e) => {
    const bar = progressRef.current;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const handleMuteToggle = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;



  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className='player-topdiv'>
         <div className="audio-controls">
            <button
            className="audio-btn"
            onClick={handleStop}
            aria-label="Stop"
            >
            ■
            </button>
            <button
            className="audio-btn audio-btn--main"
            onClick={isPlaying ? handlePause : handlePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            >
            {isPlaying ? '❚❚' : '▶'}
            </button>
        </div>
        <span className="audio-time info">{formatTime(currentTime)}</span>
      </div>
      <div
        className="audio-progress-bar"
        ref={progressRef}
        onClick={handleProgressClick}
      >
        <div
          className="audio-progress-fill"
          style={{width: `${progressPercent}%`}}
        />
      </div>
    </div>
  );
}