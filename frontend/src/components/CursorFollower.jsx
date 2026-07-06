import { useEffect, useState, useRef } from 'react';
import './CursorFollower.css';

export default function CursorFollower() {
  const getInitialPosition = () => {
    if (typeof window === 'undefined') {
      return { x: 0, y: 0 };
    }

    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  };

  const getInitialHiddenState = () => {
    if (typeof window === 'undefined') {
      return false;
    }

    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const [hidden, setHidden] = useState(getInitialHiddenState);
  const [visible, setVisible] = useState(!getInitialHiddenState());
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const cursorRef = useRef(null);
  const positionRef = useRef(getInitialPosition());
  const rafRef = useRef(null);

  useEffect(() => {
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setHidden(true);
      setVisible(false);
      return;
    }

    setHidden(false);
    setVisible(true);

    const updateCursorPosition = () => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
      rafRef.current = null;
    };

    const onMouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(updateCursorPosition);
      }
    };

    const onWindowBlur = () => {
      setVisible(false);
    };

    const onWindowFocus = () => {
      setVisible(true);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const handleInteractiveHover = (event) => {
      const target = event.target;
      const interactive = target instanceof Element && target.closest('a, button, input, textarea, select, .interactive-card, [role="button"]');
      setLinkHovered(Boolean(interactive));
    };

    const handleInteractiveLeave = (event) => {
      const nextTarget = event.relatedTarget;
      const isMovingToInteractive = nextTarget instanceof Element && nextTarget.closest('a, button, input, textarea, select, .interactive-card, [role="button"]');
      if (!isMovingToInteractive) {
        setLinkHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleInteractiveHover, { passive: true });
    window.addEventListener('mouseout', handleInteractiveLeave, { passive: true });

    updateCursorPosition();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleInteractiveHover);
      window.removeEventListener('mouseout', handleInteractiveLeave);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={cursorRef}
      className={`cursor-follower-wrapper ${clicked ? 'clicked' : ''} ${linkHovered ? 'hovered' : ''} ${visible ? 'visible' : 'hidden'}`}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="cursor-dot" />
      <div className="cursor-ring">
        <span className="hud-corner top-left"></span>
        <span className="hud-corner top-right"></span>
        <span className="hud-corner bottom-left"></span>
        <span className="hud-corner bottom-right"></span>
      </div>
    </div>
  );
}
