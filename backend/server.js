const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow all in dev, restrict in production if needed
app.use(cors());
app.use(express.json());

// Apply rate limiter to contact form only
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 contact requests per window
  message: { error: 'Too many messages sent from this IP. Please try again after 15 minutes.' }
});

// Cache for GitHub API data (1 hour)
let githubCache = null;
let githubCacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const CONTACT_LOG_PATH = path.join(__dirname, 'contact-messages.jsonl');

function appendContactMessage(payload) {
  try {
    const entry = `${JSON.stringify(payload)}\n`;
    fs.appendFileSync(CONTACT_LOG_PATH, entry, 'utf8');
  } catch (error) {
    console.error('Failed to write contact message to local log:', error);
  }
}

function createMailTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const smtpService = process.env.SMTP_SERVICE;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  }

  if (sendgridApiKey) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: sendgridApiKey
      }
    });
  }

  if (smtpService && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      service: smtpService,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  }

  return null;
}

// Mock GitHub payload to return when API fails, is rate-limited, or offline
const MOCK_GITHUB_DATA = {
  user: {
    login: "AyushRaj1311",
    name: "Ayush Raj",
    avatar_url: "https://avatars.githubusercontent.com/u/152912443?v=4",
    html_url: "https://github.com/AyushRaj1311",
    bio: "Computer Science Engineering Student | Full Stack Developer | AI Enthusiast | Problem Solver",
    public_repos: 12,
    followers: 15,
    following: 20
  },
  repos: [
    {
      name: "shipyard-sentinel",
      description: "Advanced monitoring and anomaly detection system for maritime shipyards. Built with real-time analytics and dynamic alerts.",
      html_url: "https://github.com/AyushRaj1311/shipyard-sentinel",
      language: "Java",
      stargazers_count: 5,
      forks_count: 2
    },
    {
      name: "Baseline-Beater",
      description: "Machine learning baseline comparison and optimization environment. Helps benchmarks standard models against customizable baselines.",
      html_url: "https://github.com/AyushRaj1311/Baseline-Beater",
      language: "Python",
      stargazers_count: 4,
      forks_count: 1
    },
    {
      name: "online-voting-system",
      description: "Secure and verifiable digital voting platform designed using object-oriented principles, featuring validation and multi-role controls.",
      html_url: "https://github.com/AyushRaj1311/online-voting-system",
      language: "Java",
      stargazers_count: 3,
      forks_count: 0
    },
    {
      name: "ChessForge",
      description: "Interactive chess board editor and training tool for tracking chess opening lines, matches, and puzzles.",
      html_url: "https://github.com/AyushRaj1311/ChessForge",
      language: "JavaScript",
      stargazers_count: 2,
      forks_count: 1
    },
    {
      name: "Travel-Mingle",
      description: "Social networking platform for travelers to plan itineraries, find travel buddies, and share experiences.",
      html_url: "https://github.com/AyushRaj1311/Travel-Mingle",
      language: "JavaScript",
      stargazers_count: 2,
      forks_count: 0
    },
    {
      name: "Agentic-AI-IoT-Security",
      description: "Security architecture using Agentic AI workflows to monitor, detect, and mitigate IoT device compromises and network intrusions.",
      html_url: "https://github.com/AyushRaj1311/Agentic-AI-IoT-Security",
      language: "Python",
      stargazers_count: 6,
      forks_count: 2
    }
  ],
  stats: {
    totalContributions2025: 412,
    longestStreak: 18,
    activeMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
  }
};

// Resume API - Serve resume file
app.get('/api/resume/download', (req, res) => {
  const filePath = path.join(__dirname, 'assets', 'Ayush_Raj_Resume.pdf');
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="Ayush_Raj_Resume.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } else {
    // If PDF doesn't exist, create a temporary text fallback or send error
    console.warn("Resume file not found at " + filePath + ". Attempting text fallback.");
    const textFallbackPath = path.join(__dirname, 'assets', 'Ayush_Raj_Resume.txt');
    if (fs.existsSync(textFallbackPath)) {
      res.setHeader('Content-Disposition', 'attachment; filename="Ayush_Raj_Resume.txt"');
      res.setHeader('Content-Type', 'text/plain');
      res.sendFile(textFallbackPath);
    } else {
      res.status(404).json({ error: 'Resume file not found. Please contact Ayush directly.' });
    }
  }
});

// GitHub profile aggregator with cache
app.get('/api/github/profile', async (req, res) => {
  const now = Date.now();
  if (githubCache && (now - githubCacheTime < CACHE_DURATION)) {
    return res.json(githubCache);
  }

  try {
    const headers = { 'User-Agent': 'Ayush-Cinematic-Portfolio-Server' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch user details
    const userRes = await fetch('https://api.github.com/users/AyushRaj1311', { headers });
    if (!userRes.ok) throw new Error('GitHub user API failed');
    const user = await userRes.json();

    // Fetch repos
    const reposRes = await fetch('https://api.github.com/users/AyushRaj1311/repos?sort=pushed&per_page=30', { headers });
    if (!reposRes.ok) throw new Error('GitHub repos API failed');
    const allRepos = await reposRes.json();

    // Filter to get the primary projects mentioned
    const highlightRepos = ["shipyard-sentinel", "Baseline-Beater", "online-voting-system", "ChessForge", "Travel-Mingle", "Agentic-AI-IoT-Security"];
    let repos = allRepos.filter(r => highlightRepos.some(hr => r.name.toLowerCase().includes(hr.toLowerCase())));
    
    // If we didn't find enough highlight repos, just take the top updated ones
    if (repos.length === 0) {
      repos = allRepos.slice(0, 6);
    }

    githubCache = {
      user: {
        login: user.login,
        name: user.name || "Ayush Raj",
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        bio: user.bio,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following
      },
      repos: repos.map(r => ({
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        language: r.language,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count
      })),
      stats: MOCK_GITHUB_DATA.stats // Use static display for timeline contributions
    };
    githubCacheTime = now;
    res.json(githubCache);
  } catch (error) {
    console.warn("GitHub Fetch Error: Using mock payload. Details:", error.message);
    // Return mock data so the app doesn't crash
    res.json(MOCK_GITHUB_DATA);
  }
});

// Contact API
app.post('/api/contact/send', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Simple validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields (name, email, subject, message) are required.' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  // Console log for visibility
  console.log(`Received contact message from ${name} (${email}): Subject: "${subject}" - Message: "${message}"`);

  const transporter = createMailTransporter();
  const targetEmail = process.env.SMTP_TO || process.env.CONTACT_TO_EMAIL || 'ayushraj1385@gmail.com';
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'portfolio@localhost';

  if (!transporter) {
    const fallbackPayload = {
      timestamp: new Date().toISOString(),
      name,
      email,
      subject,
      message
    };

    appendContactMessage(fallbackPayload);
    console.log('SMTP is not configured. Contact message was saved locally.');
    return res.status(500).json({
      success: false,
      error: 'SMTP is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS, or provide SENDGRID_API_KEY in Vercel environment variables.'
    });
  }

  try {
    const mailOptions = {
      from: `"${name}" <${fromEmail}>`,
      replyTo: email,
      to: targetEmail,
      subject: `Portfolio Contact: ${subject}`,
      text: `You received a message from your portfolio website:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <h3>New Portfolio Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #00F5FF; font-family: monospace;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${targetEmail}`);
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    const fallbackPayload = {
      timestamp: new Date().toISOString(),
      name,
      email,
      subject,
      message,
      error: error.message
    };

    appendContactMessage(fallbackPayload);
    console.error('Error sending email via Nodemailer. Message was saved locally instead:', error);
    res.status(200).json({ success: true, message: 'Message received. The mail service is unavailable, so it was saved locally for review.' });
  }
});

// Serve frontend assets if we bundle them in production (optional fallback)
// For dev, Vite runs on its own server.
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res, next) => {
  // If request starts with /api, pass it to routing, else serve react index
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send("Backend server is running. Frontend has not been built yet.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
