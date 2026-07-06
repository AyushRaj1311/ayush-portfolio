import { useState, useEffect } from 'react';
import { ArrowRight, Download, Send, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './CustomIcons';
import './Hero.css';

export default function Hero() {
  const titles = [
    "Full Stack Developer",
    "Java Developer",
    "React Developer",
    "AI Enthusiast",
    "Problem Solver",
    "Open Source Contributor",
    "200+ DSA Problems Solved"
  ];

  const [currentText, setCurrentText] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer;
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      // Deleting text
      timer = setTimeout(() => {
        setCurrentText(currentTitle.substring(0, currentText.length - 1));
        setTypingSpeed(50);
      }, typingSpeed);
    } else {
      // Writing text
      timer = setTimeout(() => {
        setCurrentText(currentTitle.substring(0, currentText.length + 1));
        setTypingSpeed(150);
      }, typingSpeed);
    }

    // Switch states
    if (!isDeleting && currentText === currentTitle) {
      // Pause at full text
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
      setTypingSpeed(200);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="home">
      {/* Decorative background grid line */}
      <div className="hero-hud-frame">
        <span className="hud-line vertical left"></span>
        <span className="hud-line vertical right"></span>
      </div>

      <div className="hero-content">
        <div className="hero-tag">
          <Terminal size={14} className="hero-tag-icon" />
          <span>SYSTEMS_INITIALIZED_2024.BTECH_CSE</span>
        </div>
        
        <h1 className="hero-title">
          <span className="first-name">AYUSH</span>
          <span className="last-name text-glow-cyan">RAJ</span>
        </h1>

        <div className="typing-container">
          <span className="typing-prefix">&gt;_ </span>
          <span className="typing-text">{currentText}</span>
          <span className="typing-cursor">|</span>
        </div>

        <p className="hero-bio">
          Developing scalable applications, AI-integrated software architectures, and solving real-world challenges. Combining strong algorithmic thinking with robust full-stack architectures.
        </p>

        <div className="hero-actions">
          <button className="cyber-button" onClick={() => scrollToSection('projects')}>
            EXPLORE WORK <ArrowRight size={16} />
          </button>
          
          <a
            className="cyber-button secondary"
            href="/api/resume/download"
            download="Ayush_Raj_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            DOWNLOAD RESUME <Download size={16} />
          </a>

          <button className="cyber-button accent" onClick={() => scrollToSection('contact')}>
            CONTACT ME <Send size={16} />
          </button>
        </div>

        <div className="hero-socials">
          <a href="https://github.com/AyushRaj1311" target="_blank" rel="noopener noreferrer" className="hero-social-link" title="GitHub">
            <GithubIcon size={20} />
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/ayush-raj-534206330" target="_blank" rel="noopener noreferrer" className="hero-social-link" title="LinkedIn">
            <LinkedinIcon size={20} />
            <span>LinkedIn</span>
          </a>
          <a href="https://codolio.com/profile/Ayush%20Raj%201141" target="_blank" rel="noopener noreferrer" className="hero-social-link codolio-link" title="Codolio">
            <span className="codolio-icon">&lt;/&gt;</span>
            <span>Codolio</span>
          </a>
        </div>
      </div>

      {/* Decorative telemetry and down arrow */}
      <div className="hero-scroll-indicator" onClick={() => scrollToSection('stats')}>
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>SCROLL DOWN</span>
      </div>
    </section>
  );
}
