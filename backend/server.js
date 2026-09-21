import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import path from 'path';
import { fileURLToPath } from 'url';

// Models
import User from './models/User.js';
import Skill from './models/Skill.js';
import TechStack from './models/TechStack.js';
import Experience from './models/Experience.js';
import Project from './models/Project.js';
import Certification from './models/Certification.js';
import SiteConfig from './models/SiteConfig.js';

// Middleware & Utilities
import attachSiteConfig from './middleware/attachSiteConfig.js';

// Routes
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import skillRoutes from './routes/skills.js';
import techStackRoutes from './routes/techstack.js';
import experienceRoutes from './routes/experience.js';
import projectRoutes from './routes/projects.js';
import certificationRoutes from './routes/certifications.js';
import siteConfigRoutes from './routes/siteConfig.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(attachSiteConfig);
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/techstack', techStackRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/config', siteConfigRoutes);
app.use('/api/resume', resumeRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    siteName: req.siteConfig?.identity?.name || 'Dennis Portfolio'
  });
});
app.get('/api/get_health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
// Database Connection & Auto-Seeding
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dennis-portfolio';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully.');
    await seedAdmin();
    await seedInitialData();
    
    // Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Admin User Seeding Function
async function seedAdmin() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'adminpassword123';
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const admin = new User({
        username,
        password: hashedPassword
      });
      
      await admin.save();
      console.log(`Admin user successfully seeded: username="${username}"`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

// Initial Data Seeding Function
async function seedInitialData() {
  try {
    // 0. Seed Singleton SiteConfig
    await SiteConfig.getSingleton();
    console.log('Singleton SiteConfig verified/initialized.');

    // 1. Seed Skills/Tools
    const skillsCount = await Skill.countDocuments();
    if (skillsCount === 0) {
      const initialSkills = [
        { category: 'Languages', items: ['JavaScript (Node.js)', 'Python', 'Java', 'C', 'C++'] },
        { category: 'Frontend', items: ['React.js', 'Vite', 'HTML', 'CSS', 'Tailwind CSS', 'Framer Motion', 'Three.js'] },
        { category: 'Backend & Frameworks', items: ['Node.js', 'Express.js', 'Django', 'Mongoose', 'EJS'] },
        { category: 'Databases', items: ['MongoDB', 'PostgreSQL'] },
        { category: 'Auth & Security', items: ['JWT', 'bcrypt', 'Middleware route protection'] },
        { category: 'DevOps & Infrastructure', items: ['Linux VPS Administration', 'Nginx (Reverse Proxy, Virtual Hosts)', 'PM2', 'Git release/rollback workflows', 'systemd', 'Environment Config'] },
        { category: 'SEO & Web Performance', items: ['SSR', 'Dynamic XML Sitemaps', 'Canonical Tags', 'Open Graph / JSON-LD Schema', '301 Redirects', 'Multer/Sharp image pipeline'] },
        { category: 'Tools & Libraries', items: ['Git/GitHub', 'VS Code', 'Nodemailer', 'REST APIs', 'NumPy', 'Pandas'] },
        { category: 'Design & Visuals', items: ['Banner Design', 'HTML/CSS Banners', 'Canvas', 'SVG Assets', 'Social Media Formats', 'Ad Creatives'] }
      ];
      await Skill.insertMany(initialSkills);
      console.log('Initial Skills data successfully seeded.');
    }

    // 2. Seed TechStack Icons
    const techStackCount = await TechStack.countDocuments();
    if (techStackCount === 0) {
      const initialTech = [
        { name: 'React.js', icon: '' },
        { name: 'Node.js', icon: '' },
        { name: 'Express.js', icon: '' },
        { name: 'MongoDB', icon: '' },
        { name: 'Python', icon: '' },
        { name: 'Linux VPS', icon: '' },
        { name: 'Nginx', icon: '' },
        { name: 'PM2', icon: '' },
        { name: 'JavaScript', icon: '' },
        { name: 'Docker', icon: '' },
        { name: 'Git', icon: '' }
      ];
      await TechStack.insertMany(initialTech);
      console.log('Initial TechStack icons successfully seeded.');
    }

    // 3. Seed Experiences
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      const initialExperience = [
        {
          company: 'Techdataseeders',
          role: 'Full Stack Developer',
          period: 'March 2026 – Present | Ahmedabad, Gujarat',
          points: [
            'Kuiper MERN Application (https://kuiperapp.co.in/): Solely architected, built, and deployed a production MERN application end-to-end on Linux VPS with Nginx configured as a reverse proxy across separate virtual hosts (kuiperapp.co.in and api.kuiperapp.co.in), PM2 process management, Git-based release workflow with commit-level rollbacks, automated cron sync jobs (biometricSync.js), and JWT auth.',
            'Techdataseeders Website (https://techdataseeders.com/): Converted static frontend to Node.js/Express/MongoDB with EJS server-side rendering, JWT + bcrypt admin protection, full technical SEO (dynamic XML sitemaps, canonical tags, JSON-LD schema, 301 redirects for 50+ legacy URLs), robots.txt AI crawler rules, 100+ mobile CSS breakpoints, and a Multer + Sharp WebP image processing pipeline.'
          ],
          order: 1
        },
        {
          company: 'Xbyte',
          role: 'Junior Python Developer',
          period: 'March 2025 – November 2025 | Ahmedabad, Gujarat',
          points: [
            'Developed and deployed Python web scraping solutions for 10+ dynamic websites across healthcare, hospitality, and agency domains.',
            'Built ETL pipelines, automated data extraction workflows, and optimized scripts against dynamic DOM changes and anti-bot measures.'
          ],
          order: 2
        },
        {
          company: 'Topnotch Solution',
          role: 'Python Intern',
          period: 'December 2024 – February 2025 | Ahmedabad, Gujarat',
          points: [
            'Developed Python backend scripts, customized ERP workflows, and built web pages using Odoo Website Builder.'
          ],
          order: 3
        }
      ];
      await Experience.insertMany(initialExperience);
      console.log('Initial Experience records successfully seeded.');
    }

    // 4. Seed Projects
    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      const initialProjects = [
        {
          title: 'Kuiper MERN Application',
          description: 'Solely architected, built, and deployed a production MERN application on a self-provisioned Linux VPS with Nginx reverse proxying, PM2 process management, automated cron sync jobs, and isolated JWT authentication.',
          image: '',
          github: 'https://github.com/dennis090503/',
          demo: 'https://kuiperapp.co.in/',
          stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Nginx', 'PM2', 'Linux VPS']
        },
        {
          title: 'Techdataseeders SSR & CMS Platform',
          description: 'Re-engineered static site into a dynamic server-side rendered Node.js web application with JWT-secured blog CMS, technical SEO infrastructure (XML sitemap, JSON-LD, 301 redirects), and image optimization pipeline.',
          image: '',
          github: 'https://github.com/dennis090503/',
          demo: 'https://techdataseeders.com/',
          stack: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'Multer', 'Sharp', 'Nginx', 'Technical SEO']
        },
        {
          title: 'Denkar — Digital Agency Website',
          description: 'Designed and developed a responsive digital agency website showcasing services, development workflow, interactive testimonials, FAQs, and a live project portfolio with smooth visual effects.',
          image: '',
          github: 'https://github.com/dennis090503/',
          demo: 'https://denkar.onrender.com/',
          stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Three.js']
        },
        {
          title: 'Sarab — Restaurant Ordering Platform',
          description: 'Full-stack restaurant ordering system featuring interactive menu browsing, cart & checkout workflows, JWT-protected admin dashboard for menu CRUD, real-time order status tracking, and revenue management.',
          image: '',
          github: 'https://github.com/dennis090503/',
          demo: 'https://sarab-86ft.onrender.com/',
          stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Axios', 'Bcrypt']
        },
        {
          title: 'Chat Application (MERN Stack)',
          description: 'Real-time messaging platform with user authentication, RESTful APIs, WebSocket communication, and responsive UI.',
          image: '',
          github: 'https://github.com/dennis090503/',
          demo: '#',
          stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Socket.io', 'REST APIs']
        },
        {
          title: 'Face Recognition Attendance System',
          description: 'Real-time facial recognition attendance tracker logging detected faces with timestamps into CSV files, removing manual entry entirely.',
          image: '',
          github: 'https://github.com/dennis090503/',
          demo: '#',
          stack: ['Python', 'OpenCV', 'Face Recognition', 'CSV', 'Machine Learning']
        },
        {
          title: 'YouTube Audio & Video Downloader',
          description: 'Desktop application built in Python using Tkinter for downloading YouTube audio and video with URL-based input processing and file handling.',
          image: '',
          github: 'https://github.com/dennis090503/',
          demo: '#',
          stack: ['Python', 'Tkinter']
        }
      ];
      await Project.insertMany(initialProjects);
      console.log('Initial Projects data successfully seeded.');
    }

    // 5. Seed Certifications
    const certsCount = await Certification.countDocuments();
    if (certsCount === 0) {
      const initialCerts = [
        { title: 'Exploratory Data Analysis for Machine Learning', issuer: 'Coursera / IBM', url: '' },
        { title: 'HTML, CSS, and JavaScript for Web Developers', issuer: 'Johns Hopkins University', url: '' },
        { title: 'Inheritance and Data Structures in Java', issuer: 'University of Pennsylvania', url: '' },
        { title: 'Introduction to Java', issuer: 'Coursera', url: '' }
      ];
      await Certification.insertMany(initialCerts);
      console.log('Initial Certifications data successfully seeded.');
    }
  } catch (error) {
    console.error('Error seeding initial portfolio data:', error);
  }
}
