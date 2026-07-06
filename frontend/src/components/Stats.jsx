import { useEffect, useRef, useState } from 'react';
import './Stats.jsx';
import './Stats.css';

const statItems = [
  { label: 'Problems Solved', target: 200, suffix: '+', duration: 1500, decimals: 0 },
  { label: 'Projects Built', target: 7, suffix: '+', duration: 1000, decimals: 0 },
  { label: 'Technologies', target: 10, suffix: '+', duration: 1000, decimals: 0 },
  { label: 'Started B.Tech', target: 2024, suffix: '', duration: 1200, decimals: 0 },
  { label: 'B.Tech CGPA', target: 8.12, suffix: '', duration: 1500, decimals: 2 },
  { label: 'Coding Passion', target: 100, suffix: '%', duration: 1800, decimals: 0 }
];

function CountUpItem({ label, target, suffix, duration, decimals }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const animationTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animationTriggered.current) {
          animationTriggered.current = true;
          startCountAnimation();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const startCountAnimation = () => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const currentVal = progress * target;
      setCount(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    window.requestAnimationFrame(step);
  };

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count);

  return (
    <div className="stat-card glass-panel" ref={elementRef}>
      <div className="stat-inner-grid"></div>
      <div className="stat-glare"></div>
      <div className="stat-number text-glow-cyan">
        {formattedCount}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="stats-section" id="stats">
      <h2 className="section-title reveal-text active">Operational Metrics</h2>
      <div className="stats-grid">
        {statItems.map((item, idx) => (
          <CountUpItem key={idx} {...item} />
        ))}
      </div>
    </section>
  );
}
