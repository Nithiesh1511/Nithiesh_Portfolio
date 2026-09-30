/* ---------------------------------------------------------------------------
   Every word the site renders lives here. Components read from this file, so
   copy changes should never need a trip into JSX.
   --------------------------------------------------------------------------- */

export const profile = {
  name: 'Nithiesh Thulasimani',
  first: 'Nithiesh',
  initials: 'NT',
  role: 'Software Engineer',
  discipline: 'Full-Stack · Builder',
  company: 'App Innovation Technologies',
  domain: 'Software Development · Healthcare Technology',
  location: 'Coimbatore, India',
  timezone: 'Asia/Kolkata',
  available: true,
  email: 'nithiesh151101@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nithiesh-thulasimani/',
  github: 'https://github.com/Nithiesh1511',
  githubUser: 'Nithiesh1511',
  /* Drop your photo into public/ as "profile" with any common extension; each
     candidate is tried in order, so nothing ever 404s visibly. */
  portraitCandidates: ['profile.png', 'profile.jpg', 'profile.webp', 'avatar.jpg'].map(
    (f) => import.meta.env.BASE_URL + f,
  ),

  headline: ['I build software', 'that turns ideas', 'into experiences.'],
  standfirst:
    'Full-Stack Developer working across frontend, backend, APIs, databases, cloud, automation and AI - building practical applications that solve real problems.',
  /* About: the heading sits in the section note; the summary is read word
     by word as it scrolls past, so keep it to one short paragraph. */
  aboutTitle: 'I build things that make complicated problems feel simple.',
  aboutTagline: "A developer with a curious mind and a builder's heart.",
  summary:
    "Hey, I'm Nithiesh - a Full Stack Developer who turns ideas, problems and curiosity into working software. It started with automation and grew into building full-stack applications with .NET, C#, ASP.NET Core, SQL Server, Azure, JavaScript and TypeScript: web apps, EHR platforms, reporting, integrations, cloud services - and lately, AI-assisted development. I like understanding the problem, working out how it all fits, building it, then making it better. Code is what I write. Problems are what I solve. Learning is what keeps me moving.",
  /* Trailing part of the summary to emphasise - must match its end exactly. */
  summaryHighlight: 'Code is what I write. Problems are what I solve. Learning is what keeps me moving.',
}

/* Rendered as a spec sheet - keep values short, the column is narrow. */
export const spec = [
  ['ROLE', 'Software Engineer'],
  ['ORG', 'App Innovation Technologies'],
  ['BUILD', 'Full-Stack · Web · Products'],
  ['FRONTEND', 'React · TypeScript · Razor, MVC'],
  ['BACKEND', 'C# · .NET · APIs · Services'],
  ['DATA', 'SQL Server · MySQL · Cosmos DB'],
  ['CLOUD', 'Azure · WebJobs · DevOps'],
  ['AUTOMATION', 'Zoho RPA · UiPath  · Workflows'],
  ['AI', 'AI-assisted · Exploring what’s next'],
  ['DOMAIN', 'Healthcare · EHR · Product Building'],
  ['BASE', 'Coimbatore, India · UTC+5:30'],
]

export const ticker = [
  'Frontend',
  'Backend',
  'C# / .NET 8',
  'ASP.NET Core',
  'Web APIs',
  'React',
  'TypeScript',
  'JavaScript',
  'three.js',
  'SQL Server',
  'Azure',
  'Supabase',
  'Microsoft Graph',
  'Automation',
  'Zoho RPA',
  'UiPath',
  'Azure DevOps',
  'CI/CD',
  'Healthcare · EHR',
  'AI-assisted dev',
]

/* How the work gets done, in three verbs. */
export const principles = [
  {
    n: '01',
    title: 'Build',
    text: 'Turn ideas and requirements into working software - something a person can actually open, click and rely on.',
  },
  {
    n: '02',
    title: 'Connect',
    text: 'Bring interfaces, APIs, databases, services and the people using them together, so the whole thing behaves like one system.',
  },
  {
    n: '03',
    title: 'Improve',
    text: 'Keep learning, refining and automating. Shipping is the start of the work, not the end of it.',
  },
]

/* Personal builds, each linking to its live site. `scene` picks the drawn
   animation (ProjectScene.jsx) shown in a browser frame on the card. */
export const projects = [
  {
    id: 'suvadu',
    num: '01',
    title: 'Suvadu',
    kind: 'FEATURED · PERSONAL PRODUCT',
    year: '2026',
    role: 'Designed & built solo',
    summary:
      'A premium custom-notebook brand, designed and developed from scratch - the whole product, not just the pages.',
    detail:
      'I built the customer experience, the admin that runs it and the data underneath: a responsive catalogue with a live 3D notebook preview, cart, accounts and checkout with online payments, plus an admin for products, collections, orders, customers, coupons and reviews. Supabase holds the Postgres schema, auth, row-level policies and edge functions. UI, frontend, application logic, database and product - one person, end to end.',
    facts: [
      ['FRONTEND', 'React + TypeScript'],
      ['DATA', 'Supabase / Postgres'],
      ['PAYMENTS', 'Edge functions'],
      ['STATUS', 'Active'],
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Supabase', 'Tailwind CSS', 'three.js'],
    link: 'https://nithiesh1511.github.io/Suvadu/',
    scene: 'notebook',
    linkLabel: 'live site',
    accent: 'signal',
  },
  {
    id: 'doctors-water',
    num: '02',
    title: "Doctor's Water",
    kind: 'PERSONAL · 3D WEB EXPERIENCE',
    year: '2026',
    role: 'Designed & built solo',
    summary:
      "A scroll-driven 3D product film for a Coimbatore packaged-water brand - the pour, the fill and the seal, played out as you scroll.",
    detail:
      'Built with React Three Fiber on three.js: a can uncaps and tips, water pours into a 20L bottle, fills it and gets capped, then the page settles into specs and contact. The water is simulated rather than faked - a stylised gravity model, a jet that pinches into pearls the way real streams do, splashes, crowns, ripples and bubbles - rendered through transmission and refraction materials with post-processing. GSAP and Lenis keep the camera choreography locked to the scroll, and the brand palette and copy come straight off the label.',
    facts: [
      ['RENDER', 'React Three Fiber'],
      ['WATER', 'Custom pour physics'],
      ['MOTION', 'GSAP + Lenis scroll'],
      ['STATUS', 'Live on GitHub Pages'],
    ],
    stack: ['React', 'three.js', 'React Three Fiber', 'Drei', 'Post-processing', 'GSAP', 'Vite'],
    link: 'https://nithiesh1511.github.io/Doctor_Water/',
    scene: 'water',
    linkLabel: 'live site',
    accent: 'teal',
  },
]

/* Grouped by layer of the stack. No self-scored percentages - just what I
   use and where it shows up. */
export const stack = [
  {
    group: 'Frontend',
    items: [
      { name: 'HTML & CSS', note: 'Semantic markup, modern layout, responsive UI' },
      { name: 'JavaScript & TypeScript', note: 'Interactive, typed front-end code' },
      { name: 'React', note: 'Component UIs - Suvadu and this site' },
      { name: 'three.js & React Three Fiber', note: "3D scenes - Doctor's Water, this site's forest" },
      { name: 'Razor & MVC views', note: 'Server-rendered .NET interfaces' },
    ],
  },
  {
    group: 'Backend',
    items: [
      { name: 'C# / .NET 8', note: '.NET Core services and background jobs' },
      { name: 'ASP.NET Core & MVC', note: 'Web applications end to end' },
      { name: 'Web API & REST', note: 'Contracts, Swagger docs, error shape' },
      { name: 'GraphQL', note: 'Consuming vendor schemas' },
    ],
  },
  {
    group: 'Database',
    items: [
      { name: 'SQL Server', note: 'Queries, stored procedures, reporting' },
      { name: 'MySQL', note: 'Relational modelling and migrations' },
      { name: 'Cosmos DB', note: 'Document storage on Azure' },
      { name: 'Data-driven apps', note: 'Schemas the UI and APIs agree on' },
    ],
  },
  {
    group: 'Cloud & DevOps',
    items: [
      { name: 'Microsoft Azure', note: 'App Services, WebJobs, Key Vault' },
      { name: 'Azure DevOps', note: 'Repos, pipelines, automated deployments' },
      { name: 'CI/CD', note: 'Commit to production without hand-offs' },
      { name: 'Microsoft Graph', note: 'Microsoft 365 data for reporting' },
    ],
  },
  {
    group: 'Automation',
    items: [
      { name: 'Zoho RPA', note: 'Data extraction, workflow processing' },
      { name: 'UiPath', note: 'Autopilot, attended automation' },
      { name: 'API workflows', note: 'Scheduled and event-driven jobs' },
      { name: 'Process automation', note: 'Taking the re-keying out of a workflow' },
    ],
  },
  {
    group: 'AI & Modern Dev',
    items: [
      { name: 'AI prompting', note: 'Getting precise, useful output' },
      { name: 'AI-assisted development', note: 'Pairing with AI tools to build and debug' },
      { name: 'Developer AI tools', note: 'RAG, assistants, faster feedback loops' },
    ],
  },
]

/* Oldest first, so the trunk grows upward through the practice: education at
   the root, the current role at the growing tip. */
export const timeline = [
  {
    period: 'Jul 2019 - May 2022',
    title: 'BSc Computer Technology',
    org: 'Sri Krishna Adithya College of Arts and Science',
    text: 'Where programming, networks and how machines fit together first clicked.',
    tags: ['BSc', 'Computer Technology'],
  },
  {
    period: 'Jul 2022 - Apr 2024',
    title: 'MSc Computer Science',
    org: 'Bharathiar University',
    text: 'Foundations in systems, data structures and software engineering.',
    tags: ['MSc', 'Computer Science'],
  },
  {
    period: 'Jan 2024 - Jul 2024',
    title: 'Software Development Intern',
    org: 'iTech Software Group',
    text: 'First real-world software development: an Employee Management System on .NET and SQL, plus backend pieces for IoT and ATMS applications. Learned debugging, testing and how a team ships inside an Agile SDLC.',
    tags: ['.NET', 'SQL', 'EMS', 'IoT', 'ATMS'],
  },
  {
    period: 'Aug 2024 - 2026',
    title: 'Junior Software Engineer',
    org: 'iTech Software Group',
    text: 'Worked on healthcare and EHR software with .NET Core, MVC, Web APIs, SQL Server and Azure. Built backend services, web application features, database-driven workflows, reporting with Microsoft Graph, Zoho RPA automation and integrations with third-party healthcare systems.',
    tags: ['.NET Core', 'MVC', 'Web API', 'SQL Server', 'Azure', 'Microsoft Graph', 'Zoho RPA'],
  },
  {
    period: 'Jul 2026 - Present',
    title: 'Software Engineer',
    org: 'App Innovation Technologies',
    text: 'Building software applications and backend systems with .NET, C#, web technologies, APIs, SQL Server and cloud services - feature work, integrations (including healthcare and FHIR where the product needs it), debugging and keeping production solutions healthy.',
    tags: ['.NET', 'C#', 'Web APIs', 'SQL Server', 'Cloud'],
    current: true,
  },
]

/* Certificates and badges, rendered as fully grown seedlings. A course still
   in progress can go here too: give it `minutes` (length) and `left` (what
   remains) instead of `certified`, and its sapling grows as `left` shrinks.
   `link` adds a verify link to the card. */
export const learning = [
  {
    title: 'UiPath Autopilot for Everyone',
    edition: 'October 2025 updates',
    by: 'UiPath',
    topic: 'Automation',
    icon: 'bot',
    certified: true,
    platform: 'Certificate · 2025',
  },
  {
    title: 'Building RAG Apps Using MongoDB',
    edition: 'Issued 06 Aug 2025',
    by: 'MongoDB',
    topic: 'RAG · Gen AI',
    icon: 'data',
    certified: true,
    platform: 'Skill badge · 2025',
    link: 'https://www.credly.com/go/S3fHfAZV',
  },
  {
    title: 'AI Tools & ChatGPT Workshop',
    edition: 'AI presentations, data analysis, coding',
    by: 'be10X',
    topic: 'AI Tools',
    icon: 'ai',
    certified: true,
    platform: 'Certificate · 2025',
  },
  {
    title: 'JavaScript, jQuery & TypeScript: Full-Stack Web Development',
    by: 'Certificate course',
    topic: 'Web',
    icon: 'code',
    certified: true,
    platform: 'Certificate',
  },
]

/* Ordered as the sections appear on the page; the NT mark is the way home. */
export const navLinks = [
  { id: 'about', label: 'About', n: '01' },
  { id: 'work', label: 'Projects', n: '02' },
  { id: 'stack', label: 'Skills', n: '03' },
  { id: 'path', label: 'Experience', n: '05' },
  { id: 'contact', label: 'Contact', n: '06' },
]
