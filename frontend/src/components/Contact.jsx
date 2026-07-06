import { useState } from 'react';
import { Send, Mail, MapPin, Terminal, CheckCircle, AlertTriangle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './CustomIcons';
import confetti from 'canvas-confetti';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    type: 'idle', // idle, loading, success, error
    message: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: 'error', message: 'All telemetry fields must be filled.' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus({ type: 'error', message: 'Invalid transmission address (email).' });
      return;
    }

    setStatus({ type: 'loading', message: 'TRANSMITTING MESSAGE PACKETS...' });

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: result.message || 'Transmission successful. Message received!'
        });
        
        // Clear form
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Trigger cinematic confetti explosion
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00F5FF', '#7C3AED', '#14F195', '#ffffff']
        });
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Transmission failure. Please try again later.'
        });
      }
    } catch (error) {
      console.error("Transmission error:", error);
      setStatus({
        type: 'error',
        message: 'Could not connect to the communications grid. Try again later.'
      });
    }
  };

  return (
    <section className="contact-section" id="contact">
      <h2 className="section-title reveal-text active">Communications Grid</h2>

      <div className="contact-layout-grid">
        {/* Left Column Info Panel */}
        <div className="contact-info-panel glass-panel">
          <div className="contact-info-header">
            <Terminal size={14} className="terminal-info-icon" />
            <span>AYUSH_RAJ_COMMS.info</span>
          </div>

          <div className="info-intro">
            <h3>Establish Connection</h3>
            <p>Have a question, a project opportunity, or want to discuss Software Development roles? Send a packet through the secure grid, and I will respond as soon as possible.</p>
          </div>

          <div className="contact-detail-items">
            <div className="contact-detail-item">
              <div className="detail-icon"><Mail size={18} /></div>
              <div className="detail-content">
                <div className="detail-title">SECURE_EMAIL</div>
                <a href="mailto:ayushraj1385@gmail.com" className="detail-value">ayushraj1385@gmail.com</a>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="detail-icon"><MapPin size={18} /></div>
              <div className="detail-content">
                <div className="detail-title">COORDS_NODE</div>
                <div className="detail-value">Uttar Pradesh, India</div>
              </div>
            </div>
          </div>

          <div className="contact-social-grid">
            <a href="https://www.linkedin.com/in/ayush-raj-534206330" target="_blank" rel="noopener noreferrer" className="social-badge linkedin" title="LinkedIn">
              <LinkedinIcon size={18} /> <span>LinkedIn</span>
            </a>
            <a href="https://github.com/AyushRaj1311" target="_blank" rel="noopener noreferrer" className="social-badge github" title="GitHub">
              <GithubIcon size={18} /> <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Right Column Form Panel */}
        <div className="contact-form-panel glass-panel">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">NAME / CALLSIGN</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Tony Stark"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status.type === 'loading'}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">TRANSMISSION ADDRESS (EMAIL)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status.type === 'loading'}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">TRANSMISSION HEADER (SUBJECT)</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="e.g. SDE Opportunity"
                value={formData.subject}
                onChange={handleChange}
                disabled={status.type === 'loading'}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">DATA PACKET MESSAGE</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Enter details..."
                value={formData.message}
                onChange={handleChange}
                disabled={status.type === 'loading'}
                required
              ></textarea>
            </div>

            {/* Status alerts */}
            {status.type !== 'idle' && (
              <div className={`status-alert alert-${status.type}`}>
                {status.type === 'loading' && <div className="spinner-loader" />}
                {status.type === 'success' && <CheckCircle size={16} className="alert-icon" />}
                {status.type === 'error' && <AlertTriangle size={16} className="alert-icon" />}
                <span>{status.message}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="cyber-button submit-btn" 
              disabled={status.type === 'loading'}
            >
              <Send size={14} /> TRANSMIT PACKET
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
