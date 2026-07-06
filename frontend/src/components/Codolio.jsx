import { useEffect, useState } from 'react';
import { Terminal, Award, AwardIcon, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import './Codolio.css';

export default function Codolio() {
  const [activeConsoleTab, setActiveConsoleTab] = useState('summary');

  const stats = {
    totalProblems: 200,
    leetcodeSolved: 124,
    gfgSolved: 62,
    otherSolved: 14,
    globalRankPercent: 'Top 15%',
    accuracyRate: '78.5%',
    currentStreak: 12,
    maxStreak: 32
  };

  const badges = [
    { name: 'Algorithmic Specialist', desc: 'Solved 150+ DSA problems in Java', color: 'cyan' },
    { name: 'OOP Architect', desc: 'Designed multiple clean OOP programs', color: 'purple' },
    { name: 'System Integrator', desc: 'Successfully deployed full-stack APIs', color: 'green' }
  ];

  const logLines = [
    "[SYS] INITIALIZING COGNITIVE INTERFACE...",
    "[SYS] FETCHING CODOLIO DATA PACKETS...",
    `[INFO] PROFILE DETECTED: AYUSH RAJ (ID: 1141)`,
    `[DATA] TOTAL PROBLEMS VERIFIED: ${stats.totalProblems}+`,
    "[DATA] PRIMARY COMPILING KERNEL: JAVA_17",
    "[SYS] STATUS: OPTIMAL"
  ];

  return (
    <section className="codolio-section" id="codolio">
      <h2 className="section-title reveal-text active">Codolio Console</h2>

      <div className="codolio-dashboard glass-panel">
        {/* Terminal Header */}
        <div className="codolio-header">
          <div className="terminal-actions">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="terminal-filename">CODER_STATS_LOADER.bin</span>
          </div>
          <a 
            href="https://codolio.com/profile/Ayush%20Raj%201141" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="codolio-profile-link"
          >
            VIEW CODOLIO PROFILE <ChevronRight size={14} />
          </a>
        </div>

        {/* Dashboard Grid */}
        <div className="codolio-body-grid">
          {/* Left Console Navigation & Logs */}
          <div className="console-left-panel">
            <div className="console-tabs">
              <button 
                className={`console-tab-btn ${activeConsoleTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveConsoleTab('summary')}
              >
                SUMMARY.LOG
              </button>
              <button 
                className={`console-tab-btn ${activeConsoleTab === 'achievements' ? 'active' : ''}`}
                onClick={() => setActiveConsoleTab('achievements')}
              >
                ACHIEVEMENTS.DB
              </button>
            </div>

            <div className="console-log-box">
              {logLines.map((line, idx) => (
                <div key={idx} className="console-log-line">
                  <span className="line-number">{(idx + 1).toString().padStart(2, '0')}</span>
                  <span className="line-text">{line}</span>
                </div>
              ))}
            </div>
            
            <div className="codolio-avatar-hologram">
              <div className="hologram-circle ring-1"></div>
              <div className="hologram-circle ring-2"></div>
              <div className="hologram-circle ring-3"></div>
              <div className="hologram-core">
                <span className="core-icon">&lt;/&gt;</span>
              </div>
              <div className="hologram-text">SYNCED ENGINE</div>
            </div>
          </div>

          {/* Right Console Metrics Display */}
          <div className="console-right-panel">
            {activeConsoleTab === 'summary' ? (
              <div className="metrics-layout">
                <div className="metrics-header-hud">
                  <Terminal size={14} /> <span>METRIC_DUMP.json</span>
                </div>

                <div className="metrics-grid">
                  <div className="metric-box">
                    <div className="metric-box-title">DSA PROBLEMS SOLVED</div>
                    <div className="metric-box-val text-glow-cyan">{stats.totalProblems}+</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-box-title">ACCURACY RATE</div>
                    <div className="metric-box-val text-glow-green">{stats.accuracyRate}</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-box-title">CURRENT STREAK</div>
                    <div className="metric-box-val text-glow-purple">{stats.currentStreak} Days</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-box-title">GLOBAL PERCENTILE</div>
                    <div className="metric-box-val text-glow-cyan">{stats.globalRankPercent}</div>
                  </div>
                </div>

                {/* Sub platform distribution */}
                <div className="platform-distribution">
                  <div className="dist-title">PLATFORM_WEIGHTS.cfg</div>
                  
                  <div className="dist-item">
                    <div className="dist-label-row">
                      <span>LeetCode (Daily + DSA)</span>
                      <span>{stats.leetcodeSolved} Solved</span>
                    </div>
                    <div className="dist-bar-track">
                      <div className="dist-bar-fill fill-cyan" style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div className="dist-item">
                    <div className="dist-label-row">
                      <span>GeeksforGeeks (Curated DSA)</span>
                      <span>{stats.gfgSolved} Solved</span>
                    </div>
                    <div className="dist-bar-track">
                      <div className="dist-bar-fill fill-purple" style={{ width: '31%' }} />
                    </div>
                  </div>

                  <div className="dist-item">
                    <div className="dist-label-row">
                      <span>Other (Hackathons / Codeforces)</span>
                      <span>{stats.otherSolved} Solved</span>
                    </div>
                    <div className="dist-bar-track">
                      <div className="dist-bar-fill fill-green" style={{ width: '7%' }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="achievements-layout">
                <div className="metrics-header-hud">
                  <Award size={14} /> <span>EARNED_BADGES.db</span>
                </div>

                <div className="badges-list">
                  {badges.map((badge, idx) => (
                    <div key={idx} className="badge-item glass-panel">
                      <div className={`badge-icon-frame icon-${badge.color}`}>
                        <Zap size={16} />
                      </div>
                      <div className="badge-details">
                        <div className="badge-title">{badge.name}</div>
                        <div className="badge-desc">{badge.desc}</div>
                      </div>
                      <div className="badge-status-glow">
                        <CheckCircle2 size={16} className="status-check" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
