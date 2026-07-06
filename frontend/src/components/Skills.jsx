import { useEffect, useRef, useState } from 'react';
import './Skills.css';

const skillsData = [
  { name: 'Java', level: 90, category: 'Languages', color: 'cyan' },
  { name: 'JavaScript', level: 85, category: 'Languages', color: 'cyan' },
  { name: 'C Language', level: 80, category: 'Languages', color: 'cyan' },
  { name: 'React.js', level: 85, category: 'Frontend', color: 'purple' },
  { name: 'HTML5', level: 90, category: 'Frontend', color: 'purple' },
  { name: 'CSS3', level: 80, category: 'Frontend', color: 'purple' },
  { name: 'Node.js', level: 75, category: 'Backend', color: 'green' },
  { name: 'Express.js', level: 75, category: 'Backend', color: 'green' },
  { name: 'DSA', level: 85, category: 'Concepts', color: 'cyan' },
  { name: 'OOP', level: 90, category: 'Concepts', color: 'purple' },
  { name: 'Git & GitHub', level: 85, category: 'Tools', color: 'green' },
  { name: 'VS Code', level: 90, category: 'Tools', color: 'green' }
];

function SkillCard({ skill }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeCircle, setActiveCircle] = useState(false);

  useEffect(() => {
    // Trigger SVG progress circle animation on mount / screen entrance
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveCircle(true);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position relative to card center (-0.5 to 0.5)
    const xVal = (e.clientX - rect.left) / width - 0.5;
    const yVal = (e.clientY - rect.top) / height - 0.5;

    // Multiply by max tilt angles
    setTilt({
      x: xVal * 15,
      y: yVal * -15
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // SVG parameters for radial gauge
  const radius = 35;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (skill.level / 100) * circumference;

  return (
    <div
      ref={cardRef}
      className={`skill-card glass-panel interactive-card card-${skill.color}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.02, 1.02, 1.02)`
      }}
    >
      {/* Floating particles background within card */}
      <div className="skill-card-particles">
        <span className="skill-particle sp-1"></span>
        <span className="skill-particle sp-2"></span>
        <span className="skill-particle sp-3"></span>
      </div>

      <div className="skill-header">
        <span className="skill-category-tag">{skill.category}</span>
        <div className="skill-progress-ring">
          <svg width="80" height="80" viewBox="0 0 80 80">
            {/* Track Circle */}
            <circle
              className="progress-ring-track"
              cx="40"
              cy="40"
              r={radius}
              strokeWidth={strokeWidth}
            />
            {/* Indicator Circle */}
            <circle
              className="progress-ring-indicator"
              cx="40"
              cy="40"
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              style={{
                strokeDashoffset: activeCircle ? strokeDashoffset : circumference,
                transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </svg>
          <div className="skill-percentage-value">{skill.level}%</div>
        </div>
      </div>

      <h3 className="skill-name-text">{skill.name}</h3>
      
      {/* HUD decorative corners */}
      <span className="hud-corner top-left"></span>
      <span className="hud-corner top-right"></span>
      <span className="hud-corner bottom-left"></span>
      <span className="hud-corner bottom-right"></span>
    </div>
  );
}

export default function Skills() {
  const categories = ['Languages', 'Frontend', 'Backend', 'Concepts', 'Tools'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSkills = activeCategory === 'All'
    ? skillsData
    : skillsData.filter(s => s.category === activeCategory);

  return (
    <section className="skills-section" id="skills">
      <h2 className="section-title reveal-text active">Holographic Skills</h2>

      {/* Category selection bar */}
      <div className="skills-categories-bar">
        <button 
          className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          ALL CORES
        </button>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="skills-grid">
        {filteredSkills.map((skill, idx) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </section>
  );
}
