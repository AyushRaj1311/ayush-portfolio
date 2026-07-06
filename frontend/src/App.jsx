import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import Projects from './components/Projects';
import GithubProfile from './components/GithubProfile';
import Codolio from './components/Codolio';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import './App.css';

export default function App() {
  const canvasRef = useRef(null);

  // Initialize Lenis smooth scrolling immediately
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Starfield & Telemetry background loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle pool
    const numStars = Math.min(80, Math.max(40, Math.floor(window.innerWidth / 24)));
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.4 + 0.1,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        angle: Math.random() * Math.PI * 2
      });
    }

    let mouse = { x: canvas.width / 2, y: canvas.height / 2, tx: canvas.width / 2, ty: canvas.height / 2 };

    const handleMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dampen mouse move for parallax lag
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      const mouseOffsetLimit = 40;
      const offsetX = ((mouse.x / canvas.width) - 0.5) * mouseOffsetLimit;
      const offsetY = ((mouse.y / canvas.height) - 0.5) * mouseOffsetLimit;

      // Draw starry sky
      for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        // Twinkle opacity
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        // Apply mouse parallax offset to position
        const posX = star.x - offsetX * star.speed;
        const posY = star.y - offsetY * star.speed;

        ctx.fillStyle = `rgba(0, 245, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow drifts
        star.y += star.speed * 0.1;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <canvas ref={canvasRef} id="bg-canvas" />
      <div className="grid-overlay"></div>
      
      <div className="aurora-container">
        <div className="aurora aurora-1"></div>
        <div className="aurora aurora-2"></div>
        <div className="aurora aurora-3"></div>
      </div>

      <div className="portfolio-wrapper fade-in-app">
          {/* Cinematic Floating Navigation */}
          <header className="cinematic-nav">
            <div className="nav-logo" onClick={() => handleScrollTo('home')}>
              AYUSH_RAJ<span className="logo-suffix">//</span>
            </div>
            <nav className="nav-links">
              <button onClick={() => handleScrollTo('home')}>HOME</button>
              <button onClick={() => handleScrollTo('stats')}>METRICS</button>
              <button onClick={() => handleScrollTo('timeline')}>TIMELINE</button>
              <button onClick={() => handleScrollTo('skills')}>SKILLS</button>
              <button onClick={() => handleScrollTo('projects')}>PROJECTS</button>
              <button onClick={() => handleScrollTo('github')}>GITHUB</button>
              <button onClick={() => handleScrollTo('codolio')}>CODOLIO</button>
              <button onClick={() => handleScrollTo('achievements')}>RECORDS</button>
              <button onClick={() => handleScrollTo('contact')}>CONTACT</button>
            </nav>
            <div className="nav-hud-time">
              <span>2026-07-05</span>
            </div>
          </header>

          <main className="portfolio-content">
            <Hero />
            <Stats />
            <Timeline />
            <Skills />
            <Projects />
            <GithubProfile />
            <Codolio />
            <Achievements />
            <Contact />
          </main>

          <footer className="cinematic-footer">
            <div className="footer-grid-decor"></div>
            <div className="footer-content">
              <p>&copy; 2026 AYUSH RAJ. DESIGN INTEGRITY ASSURED.</p>
              <p className="footer-cyber-status">SECURITY_GRID: SECURE_ON_PORT_5001</p>
            </div>
          </footer>
      </div>
    </>
  );
}
