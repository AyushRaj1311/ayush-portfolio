import { useEffect, useState } from 'react';
import { Star, GitFork, BookOpen, Users, Code2 } from 'lucide-react';
import { GithubIcon } from './CustomIcons';
import './GithubProfile.css';

export default function GithubProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/github/profile')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch github telemetry');
        return res.json();
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using offline mock fallback for GitHub profile. Details:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Generate grid values for the contribution graph
  const generateContributionGrid = () => {
    const grid = [];
    const seed = [0, 0, 1, 2, 0, 3, 4, 1, 2, 0, 1, 3, 0, 2, 4, 0, 1, 2, 3, 0, 0, 1, 2, 0];
    // Create 7 rows (days of week) and 45 columns (weeks)
    for (let row = 0; row < 7; row++) {
      const rowCells = [];
      for (let col = 0; col < 42; col++) {
        // Generate pseudo-random contribution levels [0, 4] for realistic graph
        const valIndex = (row * col + col * 3 + row * 7) % seed.length;
        rowCells.push(seed[valIndex]);
      }
      grid.push(rowCells);
    }
    return grid;
  };

  const contributionGrid = generateContributionGrid();

  if (loading) {
    return (
      <section className="github-section" id="github">
        <h2 className="section-title reveal-text active">GitHub Sync</h2>
        <div className="github-loading glass-panel">
          <div className="loader-dots">
            <span></span><span></span><span></span>
          </div>
          <p className="hud-label">SYNCING TELEMETRY WITH GITHUB.COM...</p>
        </div>
      </section>
    );
  }

  const profile = data ? data.user : {
    login: "AyushRaj1311",
    name: "Ayush Raj",
    avatar_url: "https://avatars.githubusercontent.com/u/152912443?v=4",
    bio: "Computer Science Engineering Student | Full Stack Developer | AI Enthusiast | Problem Solver",
    public_repos: 12,
    followers: 15,
    following: 20
  };

  const repos = data ? data.repos : [];
  const stats = data ? data.stats : { totalContributions2025: 412, longestStreak: 18 };

  return (
    <section className="github-section" id="github">
      <h2 className="section-title reveal-text active">GitHub Grid</h2>

      <div className="github-dashboard-grid">
        {/* Profile Card */}
        <div className="github-profile-card glass-panel">
          <div className="profile-banner"></div>
          <div className="profile-content">
            <img src={profile.avatar_url} alt={profile.name} className="profile-avatar" />
            <h3 className="profile-name">{profile.name}</h3>
            <a 
              href={profile.html_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="profile-username"
            >
              @{profile.login} <GithubIcon size={12} />
            </a>
            <p className="profile-bio">{profile.bio}</p>

            <div className="profile-stats-row">
              <div className="profile-stat-item">
                <Users size={16} className="stat-icon" />
                <div className="stat-val">{profile.followers}</div>
                <div className="stat-desc">Followers</div>
              </div>
              <div className="profile-stat-item">
                <BookOpen size={16} className="stat-icon" />
                <div className="stat-val">{profile.public_repos}</div>
                <div className="stat-desc">Repos</div>
              </div>
            </div>
            
            <a 
              href={profile.html_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cyber-button github-view-btn"
            >
              FOLLOW ON GITHUB
            </a>
          </div>
        </div>

        {/* Contributions Calendar Card */}
        <div className="github-contributions-card glass-panel">
          <div className="card-header-hud">
            <div className="hud-title-sub">CONTRIBUTION_MAP.db</div>
            <div className="contribution-metrics">
              <span>{stats.totalContributions2025} commits in 2025</span>
              <span className="divider">|</span>
              <span>Longest streak: {stats.longestStreak} days</span>
            </div>
          </div>

          <div className="contributions-graph-scroll">
            <div className="contributions-graph-grid">
              {contributionGrid.map((row, rowIdx) => (
                <div key={rowIdx} className="graph-row">
                  {row.map((cellVal, cellIdx) => (
                    <div 
                      key={cellIdx} 
                      className={`graph-cell level-${cellVal}`} 
                      title={`${cellVal > 0 ? cellVal : 'No'} commits`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="graph-legend">
            <span>Less</span>
            <div className="legend-cells">
              <div className="legend-cell level-0"></div>
              <div className="legend-cell level-1"></div>
              <div className="legend-cell level-2"></div>
              <div className="legend-cell level-3"></div>
              <div className="legend-cell level-4"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Repos Grid */}
      <div className="github-repos-header">
        <Code2 size={18} className="repos-header-icon" />
        <h3>REPOSITORIES_GRID.cfg</h3>
      </div>
      
      <div className="github-repos-grid">
        {repos.map((repo) => (
          <a 
            key={repo.name} 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="repo-card glass-panel"
          >
            <div className="repo-header">
              <h4 className="repo-name">{repo.name}</h4>
              <span className="repo-lang-tag lang-java">{repo.language || 'Code'}</span>
            </div>
            <p className="repo-desc">{repo.description || 'No description provided.'}</p>
            <div className="repo-meta">
              <div className="repo-meta-item">
                <Star size={12} /> <span>{repo.stargazers_count}</span>
              </div>
              <div className="repo-meta-item">
                <GitFork size={12} /> <span>{repo.forks_count}</span>
              </div>
            </div>
            <span className="card-corner top-l"></span>
            <span className="card-corner bottom-r"></span>
          </a>
        ))}
      </div>
    </section>
  );
}
