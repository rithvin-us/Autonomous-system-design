import { useEffect, useRef, useState } from 'react';
import type { VisualProps } from './registry';
import './presentationEnd.css';

/**
 * Closing Outro Slide:
 * Plays the cropped 16:9 celebration / Q&A video ("That's the end of our presentation").
 * Supports autoplay, looping, audio toggle, custom controls, and keyboard interaction.
 */
export default function PresentationEnd({ visual }: VisualProps<'presentationEnd'>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showMutePrompt, setShowMutePrompt] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(14);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt unmuted play first
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          // Browser prevented unmuted autoplay; fallback to muted autoplay
          video.muted = true;
          setIsMuted(true);
          setShowMutePrompt(true);
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setShowMutePrompt(false);
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      }
    }
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const resolvedVideoSrc =
    visual.videoSrc.startsWith('http') || visual.videoSrc.startsWith('data:')
      ? visual.videoSrc
      : `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${visual.videoSrc.replace(/^\//, '')}`;

  return (
    <div className="presentation-end-wrapper" onClick={(e) => {
      // If clicking outside controls, toggle play/pause or unmute
      if ((e.target as HTMLElement).closest('.pe-controls')) return;
      if (isMuted) {
        toggleMute();
      } else {
        togglePlay();
      }
    }}>
      <div className="pe-video-container">
        <video
          ref={videoRef}
          src={resolvedVideoSrc}
          className="pe-video"
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Floating unmute helper banner if browser muted initial playback */}
      {showMutePrompt && isMuted && (
        <button
          type="button"
          className="pe-unmute-banner"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          aria-label="Click to turn on sound"
        >
          <svg className="pe-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <span>Click to enable sound</span>
        </button>
      )}

      {/* Floating HUD controls bar */}
      <div className="pe-controls" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="pe-btn pe-play-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? (
            <svg className="pe-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="pe-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className="pe-btn pe-restart-btn"
          onClick={handleRestart}
          aria-label="Replay from start"
          title="Replay from start"
        >
          <svg className="pe-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        </button>

        <div className="pe-timeline-container" onClick={handleSeek}>
          <div className="pe-timeline-track">
            <div className="pe-timeline-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="pe-time-text">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <button
          type="button"
          className={`pe-btn pe-mute-btn ${isMuted ? 'is-muted' : 'is-unmuted'}`}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="pe-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="pe-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
          <span className="pe-mute-label">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>
      </div>
    </div>
  );
}
