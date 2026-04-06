import {useRef, useState} from 'react';
import '../styles/hero-video.css';

export function HeroVideo({src, poster}) {
  const videoRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isExpanded) {
      videoRef.current.pause();
    }
  };

  const handleClick = () => {
    if (isExpanded) return;
    setIsExpanded(true);
    videoRef.current.muted = false;
    videoRef.current.play();
  };

  const handleCollapse = (e) => {
    e.stopPropagation();
    setIsExpanded(false);
    videoRef.current.muted = true;
  };

  return (
    <div className="hero-video-section">
      <div
        className={`hero-video-wrapper ${isExpanded ? 'expanded' : ''} ${isHovered && !isExpanded ? 'hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          poster={poster}
          className="hero-video"
        >
          <source src={src} type="video/mp4" />
        </video>
        {isHovered && !isExpanded && (
          <div className="hero-video-hint">
            <div className="hint-circle">
              <span className="hint-icon">▶</span>
            </div>
            <p className="hint-text">Click para ver</p>
          </div>
        )}
        {isExpanded && (
          <button className="hero-video-close" onClick={handleCollapse}>
            ×
          </button>
        )}
      </div>
    </div>
  );
}
