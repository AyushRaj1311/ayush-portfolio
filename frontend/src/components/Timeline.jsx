import { useEffect, useRef, useState } from 'react';
import { Calendar, GraduationCap, Code, Briefcase, Award, Zap } from 'lucide-react';
import './Timeline.css';

const timelineData = [
  {
    year: '2024',
    title: 'Started B.Tech CSE',
    subtitle: 'Galgotias University',
    description: 'Began Bachelor of Technology in Computer Science Engineering. Discovered a deep passion for coding and software engineering paradigms.',
    icon: <GraduationCap size={18} />,
    color: 'cyan'
  },
  {
    year: '2025',
    title: 'Full Stack Engineering',
    subtitle: 'Core Web Architecture',
    description: 'Started learning advanced frontend and backend development: specializing in HTML5, CSS3, JavaScript, React, Node.js, and Express.',
    icon: <Code size={18} />,
    color: 'purple'
  },
  {
    year: '2025',
    title: 'Web Development Internship',
    subtitle: 'Completed Industry Internship',
    description: 'Gained practical experience implementing clean web designs, developing core APIs, and integrating frontend components.',
    icon: <Briefcase size={18} />,
    color: 'green'
  },
  {
    year: '2025–Present',
    title: 'Software Project Engineering',
    subtitle: 'Built Multiple Software Projects',
    description: 'Engineered Baseline Beater, ChessForge, Travel Mingle, and AI-Agent IoT Security modules utilizing modern tools.',
    icon: <Zap size={18} />,
    color: 'cyan'
  },
  {
    year: '2026',
    title: '200+ DSA Problems',
    subtitle: 'Algorithmic Mastery',
    description: 'Strengthened problem-solving abilities by solving over 200 coding problems in Java across various structures (arrays, trees, graphs).',
    icon: <Award size={18} />,
    color: 'purple'
  },
  {
    year: 'Future',
    title: 'Software Development Engineer',
    subtitle: 'Product & Scalability Focus',
    description: 'Aiming to secure a role as an SDE to build production-grade, secure, and AI-enabled software that simplifies human lives.',
    icon: <GraduationCap size={18} />,
    color: 'green'
  }
];

function TimelineCard({ item, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div 
      className={`timeline-item ${isLeft ? 'left' : 'right'} ${isVisible ? 'visible' : ''}`}
      ref={cardRef}
    >
      <div className={`timeline-badge badge-${item.color}`}>
        {item.icon}
      </div>
      
      <div className="timeline-card glass-panel">
        <span className="timeline-year">{item.year}</span>
        <h3 className="timeline-title-text">{item.title}</h3>
        <h4 className="timeline-subtitle-text">{item.subtitle}</h4>
        <p className="timeline-desc-text">{item.description}</p>
        <span className="card-corner top-l"></span>
        <span className="card-corner bottom-r"></span>
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <section className="timeline-section" id="timeline">
      <h2 className="section-title reveal-text active">Mission Timeline</h2>
      
      <div className="timeline-container">
        {/* Central timeline line */}
        <div className="timeline-center-line">
          <div className="timeline-glow-progress"></div>
        </div>

        {timelineData.map((item, idx) => (
          <TimelineCard key={idx} item={item} index={idx} />
        ))}
      </div>
    </section>
  );
}
