import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Play, Film, Calendar, Code } from 'lucide-react';
import { GithubIcon } from './CustomIcons';
import './Projects.css';

const projectsData = [
  {
    id: 'shipyard-sentinel',
    title: 'Shipyard Sentinel',
    subtitle: 'Maritime Monitoring & Anomaly Detection',
    description: 'Advanced real-time monitoring and anomaly detection system for maritime shipyards. Built with robust backend analytics and a dynamic alert engine, keeping industrial environments secure.',
    github: 'https://github.com/AyushRaj1311/shipyard-sentinel',
    tags: ['Java', 'Object Oriented Programming', 'Data Structures', 'Git'],
    category: 'Industrial IoT',
    color: 'cyan',
    duration: '2 Months',
    matrixPattern: '0101101001100101'
  },
  {
    id: 'baseline-beater',
    title: 'Baseline Beater',
    subtitle: 'ML Model Optimizer & Benchmark Environment',
    description: 'A machine learning baseline comparison and hyperparameter tuning platform. Automatically trains standard regression and classification models to outperform basic benchmarks.',
    github: 'https://github.com/AyushRaj1311/Baseline-Beater',
    tags: ['Python', 'Machine Learning', 'Data Analysis', 'Scikit-Learn'],
    category: 'Artificial Intelligence',
    color: 'purple',
    duration: '3 Months',
    matrixPattern: '1100110011001100'
  },
  {
    id: 'online-voting-system',
    title: 'Online Voting System',
    subtitle: 'Secure & Verifiable Voting Platform',
    description: 'Secure, digital voting application built adhering to strict OOP principles. Implements double-entry validation, cryptographic tokens for vote integrity, and strict administrator privileges.',
    github: 'https://github.com/AyushRaj1311/online-voting-system',
    tags: ['Java', 'Security', 'Database', 'OOP'],
    category: 'Cybersecurity',
    color: 'green',
    duration: '1.5 Months',
    matrixPattern: '1010101010101010'
  },
  {
    id: 'chessforge',
    title: 'ChessForge',
    subtitle: 'Interactive Opening Book Editor',
    description: 'Interactive Chess board editor and study companion designed to record opening lines, track match progressions, and create custom chess training puzzles.',
    github: 'https://github.com/AyushRaj1311/ChessForge', // Fallback
    tags: ['JavaScript', 'HTML5', 'CSS3', 'Chessboard.js'],
    category: 'Games & Logic',
    color: 'cyan',
    duration: '2.5 Months',
    matrixPattern: '0011001100110011'
  },
  {
    id: 'travel-mingle',
    title: 'Travel Mingle',
    subtitle: 'Collaborative Travel Planner',
    description: 'Social networking platform for globetrotters. Features mutual itinerary planning, budget splitting calculators, and traveler matchmaking based on shared bucket lists.',
    github: 'https://github.com/AyushRaj1311/Travel-Mingle',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    category: 'Full Stack App',
    color: 'purple',
    duration: '3 Months',
    matrixPattern: '0110011001100110'
  },
  {
    id: 'agentic-ai-iot-security',
    title: 'Agentic AI IoT Security',
    subtitle: 'Autonomous Device Threat Mitigator',
    description: 'A cybersecurity defense network utilizing Agentic AI workflows to monitor network traffic, detect anomaly compromises on connected IoT hardware, and isolate infected nodes autonomously.',
    github: 'https://github.com/AyushRaj1311/Agentic-AI-IoT-Security',
    tags: ['Python', 'Agentic AI', 'Cybersecurity', 'IoT Protocols'],
    category: 'Cybersecurity',
    color: 'green',
    duration: '4 Months',
    matrixPattern: '1111000011110000'
  }
];

function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`project-poster glass-panel interactive-card project-${project.color} ${isHovered ? 'active-poster' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cinematic Poster Header / Decorative graphics */}
      <div className="poster-media-area">
        {/* Holographic grid matrix background representing image preview */}
        <div className="poster-matrix-grid">
          <div className="matrix-scan-overlay"></div>
          {/* Render binary grid simulation */}
          <div className="matrix-bits">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="matrix-bit">
                {project.matrixPattern[i % project.matrixPattern.length]}
              </span>
            ))}
          </div>
        </div>

        <div className="poster-badges">
          <span className="poster-category">{project.category}</span>
          <span className="poster-duration">
            <Calendar size={10} /> {project.duration}
          </span>
        </div>

        <div className="poster-play-glow">
          <Play size={30} className="play-icon" />
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="poster-details">
        <h3 className="poster-title">{project.title}</h3>
        <h4 className="poster-subtitle">{project.subtitle}</h4>
        
        {/* Expands on hover */}
        <div className="poster-expandable-content">
          <p className="poster-description">{project.description}</p>
          
          <div className="poster-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="poster-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="poster-actions">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button poster-btn"
            >
              <GithubIcon size={14} /> REPOSITORY
            </a>
          </div>
        </div>
      </div>

      {/* Cyber corners */}
      <span className="hud-corner top-left"></span>
      <span className="hud-corner top-right"></span>
      <span className="hud-corner bottom-left"></span>
      <span className="hud-corner bottom-right"></span>
    </div>
  );
}

export default function Projects() {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="projects-section" id="projects">
      <div className="projects-header">
        <h2 className="section-title reveal-text active">Project Screenings</h2>
        <div className="carousel-nav-buttons">
          <button className="carousel-nav-btn prev" onClick={scrollLeft}>&lt;</button>
          <button className="carousel-nav-btn next" onClick={scrollRight}>&gt;</button>
        </div>
      </div>

      <div className="projects-carousel-wrapper">
        <div className="projects-carousel" ref={scrollContainerRef}>
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
