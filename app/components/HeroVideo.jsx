import {useRef, useState, useEffect} from 'react';
import '../styles/hero-video.css';
import { useWindowSize } from '~/hooks/useWindowSize';

export function HeroVideo({src, poster}) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const {isMobile, isDesktop} = useWindowSize();

  useEffect(() => {
    videoRef.current?.play().catch(() => {
    });
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
    if (window.innerWidth <= 768) return; // ✅ no expande en mobile
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
      {isDesktop && (
        <video
          ref={videoRef}
          muted
          playsInline
          poster={poster}
          className="hero-video"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {isMobile && (
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay  
          loop            
          poster={poster}
          className="hero-video"
        >
          <source src={src} type="video/mp4" />
        </video>
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
