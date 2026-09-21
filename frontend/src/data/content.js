export const profile = {
  name: 'Dennis Lalwani',
  roles: ['Full Stack Developer', 'MERN Stack Engineer', 'Python Developer'],
  location: 'Ahmedabad, Gujarat, India',
  summary:
    'Full Stack Developer with production ownership of MERN applications and Node/Express/MongoDB websites, including end-to-end deployment on self-managed Linux VPS infrastructure (Nginx reverse proxy, PM2 process management, Git-based rollback). Background in Python data engineering (web scraping, ETL pipelines) prior to full-stack work. Experienced across REST API design, JWT authentication, server-side rendering, technical SEO, and release operations.',
};

export const stats = [
  { value: '1+', label: 'Years Experience' },
  { value: '10+', label: 'Websites Scraped' },
  { value: '20+', label: 'Projects Completed' },
  { value: '100%', label: 'Production Ownership' },
];

export const skills = {
  Languages: ['JavaScript (Node.js)', 'Python', 'Java', 'C', 'C++'],
  Frontend: ['React.js', 'Vite', 'HTML', 'CSS', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  'Backend & Frameworks': ['Node.js', 'Express.js', 'Django', 'Mongoose', 'EJS'],
  Databases: ['MongoDB', 'PostgreSQL'],
  'Auth & Security': ['JWT', 'bcrypt', 'Middleware route protection'],
  'DevOps & Infrastructure': ['Linux VPS Administration', 'Nginx (Reverse Proxy, Virtual Hosts)', 'PM2', 'Git release/rollback workflows', 'systemd', 'Environment Config'],
  'SEO & Web Performance': ['SSR', 'Dynamic XML Sitemaps', 'Canonical Tags', 'Open Graph / JSON-LD Schema', '301 Redirects', 'Multer/Sharp image pipeline'],
  'Tools & Libraries': ['Git/GitHub', 'VS Code', 'Nodemailer', 'REST APIs', 'NumPy', 'Pandas'],
  'Design & Visuals': ['Banner Design', 'HTML/CSS Banners', 'Canvas', 'SVG Assets', 'Social Media Formats', 'Ad Creatives'],
};

export const experience = [
  {
    company: 'Techdataseeders',
    role: 'Full Stack Developer',
    period: 'March 2026 – Present | Ahmedabad, Gujarat',
    points: [
      'Kuiper MERN Application (https://kuiperapp.co.in/): Architected and built a MERN application end-to-end as sole full-stack developer, taking the product from initial build to a live production system on a self-provisioned Linux VPS.',
      'Deployed and operated the production environment on a Linux VPS with Nginx configured as a reverse proxy across two separate virtual hosts (kuiperapp.co.in for the frontend, api.kuiperapp.co.in for the API), isolating traffic and simplifying service-level maintenance.',
      'Engineered a Git-based release workflow with commit-level rollback to any prior commit, automated cron background job synchronization (biometricSync.js), and enforced JWT-based authentication in production with environment-isolated secrets.',
      'Techdataseeders Website (https://techdataseeders.com/): Converted static frontend to Node.js/Express/MongoDB with EJS server-side rendering, JWT + bcrypt admin protection, full technical SEO (dynamic XML sitemaps, canonical tags, JSON-LD schema, 301 redirects for 50+ legacy URLs), robots.txt AI crawler rules, 100+ mobile CSS breakpoints, and a Multer + Sharp WebP image processing pipeline.',
    ],
  },
  {
    company: 'Xbyte',
    role: 'Junior Python Developer',
    period: 'March 2025 – November 2025 | Ahmedabad, Gujarat',
    points: [
      'Developed and deployed Python-based web scraping solutions to extract structured data from 10+ dynamic websites across healthcare, hospitality, and agency domains.',
      'Created and maintained ETL pipelines to clean, validate, and store large datasets, improving data accuracy and consistency.',
      'Automated end-to-end data extraction workflows, reducing manual effort, improving operational efficiency, and optimizing scripts against dynamic DOM changes and anti-bot challenges.',
    ],
  },
  {
    company: 'Topnotch Solution',
    role: 'Python Intern',
    period: 'December 2024 – February 2025 | Ahmedabad, Gujarat',
    points: [
      'Assisted in Python backend development, writing clean and maintainable scripts under senior developer guidance.',
      'Debugged and optimized existing Python code to improve performance and reliability.',
      'Built and customized web pages using Odoo Website Builder, gaining experience with frontend components, layouts, and ERP workflows.',
    ],
  },
];

export const projects = [
  {
    title: 'Kuiper MERN Application',
    description:
      'Solely architected, built, and deployed a production MERN application on a self-provisioned Linux VPS with Nginx reverse proxying, PM2 process management, automated cron sync jobs, and isolated JWT authentication.',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Nginx', 'PM2', 'Linux VPS'],
    github: 'https://github.com/dennis090503/',
    demo: 'https://kuiperapp.co.in/',
  },
  {
    title: 'Techdataseeders SSR & CMS Platform',
    description:
      'Re-engineered static site into a dynamic server-side rendered Node.js web application with JWT-secured blog CMS, technical SEO infrastructure (XML sitemap, JSON-LD, 301 redirects), and image optimization pipeline.',
    stack: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'Multer', 'Sharp', 'Nginx', 'Technical SEO'],
    github: 'https://github.com/dennis090503/',
    demo: 'https://techdataseeders.com/',
  },
  {
    title: 'Denkar — Digital Agency Website',
    description:
      'Designed and developed a responsive digital agency website showcasing services, development workflow, interactive testimonials, FAQs, and a live project portfolio with smooth visual effects.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
    github: 'https://github.com/dennis090503/',
    demo: 'https://denkar.onrender.com/',
  },
  {
    title: 'Sarab — Restaurant Ordering Platform',
    description:
      'Full-stack restaurant ordering system featuring interactive menu browsing, cart & checkout workflows, JWT-protected admin dashboard for menu CRUD, real-time order status tracking, and revenue management.',
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Axios', 'Bcrypt'],
    github: 'https://github.com/dennis090503/',
    demo: 'https://sarab-86ft.onrender.com/',
  },
  {
    title: 'Chat Application (MERN Stack)',
    description:
      'Real-time messaging platform with user authentication, RESTful APIs, message handling, and responsive UI.',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST APIs'],
    github: 'https://github.com/dennis090503/',
    demo: '#',
  },
  {
    title: 'Face Recognition Attendance System',
    description:
      'Real-time facial recognition attendance tracker logging detected faces with timestamps into CSV files for reporting and tracking.',
    stack: ['Python', 'OpenCV', 'Face Recognition', 'CSV'],
    github: 'https://github.com/dennis090503/',
    demo: '#',
  },
  {
    title: 'YouTube Audio & Video Downloader',
    description:
      'Desktop application built in Python using Tkinter for downloading YouTube audio and video with URL-based input processing and file handling.',
    stack: ['Python', 'Tkinter'],
    github: 'https://github.com/dennis090503/',
    demo: '#',
  },
];

export const education = {
  degree: 'Bachelor of Engineering in Computer Science and Technology',
  institution: 'LJ University',
  location: 'Ahmedabad, Gujarat',
  period: 'Nov 2022 – Sept 2026',
};

export const achievements = [
  'Exploratory Data Analysis for Machine Learning',
  'HTML, CSS, and JavaScript for Web Developers',
  'Inheritance and Data Structures in Java',
  'Introduction to Java',
];

export const techStackIcons = [
  'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'Linux VPS', 'Nginx', 'PM2', 'JavaScript', 'Docker', 'Git',
];

export const contact = {
  email: 'dennislalwani09@gmail.com',
  location: 'Ahmedabad, Gujarat, India',
  linkedin: 'https://linkedin.com/in/dennis-lalwani-900805266',
  github: 'https://github.com/dennis090503/',
};