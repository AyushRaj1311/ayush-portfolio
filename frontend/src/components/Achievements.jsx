import { useEffect, useRef, useState } from 'react';
import { Award, Code, Brain, Shield, GitBranch, Trophy, BookOpen, Star } from 'lucide-react';
import './Achievements.css';

const achievementsData = [
  {
    title: "200+ DSA Solved",
    desc: "Strengthened core problem-solving & logical capabilities using Java.",
    icon: <Trophy size={20} />,
    color: "cyan",
    tag: "ALGORITHMS"
  },
  {
    title: "Full Stack Developer",
    desc: "Built scalable web architectures with React, Node, and Express.",
    icon: <Code size={20} />,
    color: "purple",
    tag: "ENGINEERING"
  },
  {
    title: "AI Enthusiast",
    desc: "Developing ML pipelines and exploring agentic AI network security.",
    icon: <Brain size={20} />,
    color: "green",
    tag: "COGNITION"
  },
  {
    title: "Cybersecurity Projects",
    desc: "Designed secure voting systems and IoT network mitigation nodes.",
    icon: <Shield size={20} />,
    color: "cyan",
    tag: "SECURITY"
  },
  {
    title: "Open Source Contributor",
    desc: "Publishing code to GitHub and improving collaborative repositories.",
    icon: <GitBranch size={20} />,
    color: "purple",
    tag: "COMMUNITY"
  },
  {
    title: "Hackathon Participant",
    desc: "Building rapid prototypes and solving real-world challenges.",
    icon: <Award size={20} />,
    color: "green",
    tag: "COMPETITIONS"
  },
  {
    title: "B.Tech CSE (2024-2028)",
    desc: "Galgotias University Computer Science Engineering degree path.",
    icon: <BookOpen size={20} />,
    color: "cyan",
    tag: "ACADEMICS"
  },
  {
    title: "CGPA 8.12",
    desc: "Maintained a strong academic record and analytical performance.",
    icon: <Star size={20} />,
    color: "purple",
    tag: "METRICS"
  }
];

function AchievementCard({ card }) {
  return (
    <div className={`achievement-card glass-panel ach-border-${card.color}`}>
      <div className={`achievement-icon-wrapper ach-icon-${card.color}`}>
        {card.icon}
      </div>
      <div className="achievement-details">
        <span className="achievement-tag-text">{card.tag}</span>
        <h3 className="achievement-title-text">{card.title}</h3>
        <p className="achievement-desc-text">{card.desc}</p>
      </div>
      {/* Decorative corner highlights */}
      <span className="card-decor-dot top-r"></span>
      <span className="card-decor-dot bottom-l"></span>
    </div>
  );
}

export default function Achievements() {
  return (
    <section className="achievements-section" id="achievements">
      <h2 className="section-title reveal-text active">Accomplishment Grid</h2>
      <div className="achievements-grid">
        {achievementsData.map((card, idx) => (
          <AchievementCard key={idx} card={card} />
        ))}
      </div>
    </section>
  );
}
