import {useState, useEffect, useRef} from 'react';
import {audioManager} from '~/lib/audioManager.js';
import '../styles/audio-player.css';

export function AudioPlayer() {
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const audio = audioManager.get();
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    if (audio.readyState >= 1) setDuration(audio.duration);
    setCurrentTime(audio.currentTime);
    setIsPlaying(!audio.paused);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  const handleStop = () => {
    const audio = audioManager.get();
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const handleProgressClick = (e) => {
    const audio = audioManager.get();
    if (!audio || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const newTime = ((e.clientX - rect.left) / rect.width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  if (!isMounted) return null;

  return (
    <div className="audio-player">
      <div className="player-topdiv">
        <div className="audio-controls">
          <button className="audio-btn" onClick={handleStop} aria-label="Stop">
            <img src="/images/Layout/stop.png" alt="" className="audiosign" />
          </button>
          <button
            className="audio-btn audio-btn--main"
            onClick={() => audioManager.toggle()}
            aria-label='Play'
          >
            <img src="/images/Layout/play.png" alt="" className="audiosign" />
          </button>
          <button
            className="audio-btn audio-btn--main"
            onClick={() => audioManager.toggle()}
            aria-label='Pause'
          >
            <img src="/images/Layout/pause.png" alt="" className="audiosign" />
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
