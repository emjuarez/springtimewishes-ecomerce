import {useRef, useState, useEffect} from 'react';
import '../styles/hero-video.css';

export function HeroVideo({src, poster}) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    const handleEnter = () => {
      setIsHovered(true);
      videoRef.current?.play();
    };

    const handleLeave = () => {
      setIsHovered(false);
      if (!isExpanded) {
        videoRef.current?.pause();
      }
    };

    wrapper.addEventListener('mouseenter', handleEnter);
    wrapper.addEventListener('mouseleave', handleLeave);

    return () => {
      wrapper.removeEventListener('mouseenter', handleEnter);
      wrapper.removeEventListener('mouseleave', handleLeave);
    };
  }, [isExpanded]);

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
        ref={wrapperRef}
        className={`hero-video-wrapper ${isExpanded ? 'expanded' : ''} ${isHovered && !isExpanded ? 'hovered' : ''}`}
        onClick={handleClick}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          poster={poster}
          className="hero-video"
        >
          <source src={src} type="video/mp4" />
        </video>
        {/* {isHovered && !isExpanded && (
          <div className="hero-video-hint">
            <div className="hint-circle">
              <span className="hint-icon">▶</span>
            </div>
            <p className="hint-text">Click para ver</p>
          </div>
        )} */}
        {isExpanded && (
          <button className="hero-video-close" onClick={handleCollapse}>
            ×
          </button>
        )}
      </div>
    </div>
  );
}
