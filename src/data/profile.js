/* ---------------------------------------------------------------------------
   Every word the site renders lives here. Components read from this file, so
   copy changes should never need a trip into JSX.

   Items marked TODO are the only placeholders left in the build.
   --------------------------------------------------------------------------- */

export const profile = {
  name: 'Nithiesh Thulasimani',
  first: 'Nithiesh',
  initials: 'NT',
  role: 'Software Engineer',
  discipline: 'Backend & Systems Integration',
  company: 'App Innovation Technologies',
  domain: 'Healthcare Systems',
  location: 'Coimbatore, India',
  timezone: 'Asia/Kolkata',
  available: true,
  email: 'nithiesh151101@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nithiesh-thulasimani/',
  github: 'https://github.com/Nithiesh1511',
  githubUser: 'Nithiesh1511',
  /* Drop your photo into public/ as "profile" with any common extension; each
     candidate is tried in order, so nothing ever 404s visibly. */
  portraitCandidates: ['profile.jpg', 'profile.jpeg', 'profile.png', 'profile.webp', 'avatar.jpg'].map(
    (f) => import.meta.env.BASE_URL + f,
  ),

  headline: ['I build the layer', 'between systems.'],
  standfirst:
    'Software engineer working on healthcare integrations - the APIs, EDI exchanges and event flows that let clinical, payer and operational systems agree on what just happened.',
  summary:
    'Most of what I build is invisible by design. A patient books a visit, a coverage check clears, a prescription reaches a pharmacy, a lab result lands back on the right chart - and none of those systems were built to talk to each other. I write the layer that makes them, and the reconciliation that keeps them honest when one of them goes quiet.',
}

/* Rendered as a spec sheet - keep values short, the column is narrow. */
export const spec = [
  ['ROLE', 'Software Engineer'],
  ['ORG', 'App Innovation Technologies'],
  ['FOCUS', 'HealthTech · Integrations'],
  ['LANGUAGES', 'C#, TypeScript, SQL'],
  ['RUNTIME', '.NET 8, .NET Core MVC'],
  ['DATA', 'SQL Server, MySQL, Cosmos DB'],
  ['CLOUD', 'Azure, WebJobs, DevOps'],
  ['AUTOMATION', 'Zoho RPA, UiPath'],
  ['INTERFACES', 'REST, Swagger, GraphQL, X12'],
  ['BASE', 'Coimbatore, IN · UTC+5:30'],
]

export const ticker = [
  'C# / .NET 8',
  'REST',
  'GraphQL',
  'X12 EDI',
  'Azure',
  'Cosmos DB',
  'MongoDB',
  'Healthie',
  'Stedi',
  'DoseSpot',
  'Webhooks',
  'Zoho RPA',
  'UiPath',
  'Azure DevOps',
  'Swagger',
  'SQL Server',
  'React',
  'TypeScript',
  'CI/CD',
]

/* The three lines the work is actually judged on. */
export const principles = [
  {
    n: '01',
    title: 'Contracts before code',
    text: 'An integration is a promise about shape and timing. Write the contract down first and the implementation stops being negotiable.',
  },
  {
    n: '02',
    title: 'Assume the network lies',
    text: 'Webhooks arrive twice, out of order, or not at all. Everything is idempotent and reconciled against the originating record, never against arrival time.',
  },
  {
    n: '03',
    title: 'Failures should be readable',
    text: 'A payer rejection is a business event, not a stack trace. Errors get mapped into something the product - and the person on support - can act on.',
  },
]

/* `flow` drives the animated topology diagram on each case card.
   Coordinates are in a 300 x 150 viewBox. */
export const projects = [
  {
    id: 'tmx',
    num: '01',
    title: 'TMX Healthcare Platform',
    kind: 'PLATFORM · API SURFACE',
    year: '2025 -',
    role: 'Backend & integrations',
    summary:
      'A connected healthcare platform that folds clinical, insurance and operational workflows into a single reliable API surface.',
    detail:
      'The service sits between a patient-facing product and a fleet of third-party healthcare vendors. Every vendor speaks a different dialect - GraphQL here, X12 EDI there, webhooks somewhere else - so it normalises all of them onto one internal contract, then keeps both sides in step as state changes on either end.',
    facts: [
      ['SURFACE', 'REST + Webhooks'],
      ['UPSTREAM', 'Healthie GraphQL'],
      ['STORE', 'Cosmos DB'],
      ['RUNTIME', '.NET 8 on Azure'],
    ],
    stack: ['.NET 8', 'Healthie', 'Stedi', 'Azure', 'Cosmos DB'],
    accent: 'signal',
    flow: {
      nodes: [
        { id: 'app', label: 'Product', x: 26, y: 75, kind: 'edge' },
        { id: 'api', label: 'TMX API', x: 150, y: 75, kind: 'core' },
        { id: 'ehr', label: 'Healthie', x: 274, y: 28, kind: 'vendor' },
        { id: 'pay', label: 'Payers', x: 274, y: 75, kind: 'vendor' },
        { id: 'rx', label: 'DoseSpot', x: 274, y: 122, kind: 'vendor' },
      ],
      edges: [
        ['app', 'api'],
        ['api', 'ehr'],
        ['api', 'pay'],
        ['api', 'rx'],
      ],
    },
  },
  {
    id: 'eligibility',
    num: '02',
    title: 'Eligibility & Prior Authorization',
    kind: 'INSURANCE · AUTOMATION',
    year: '2025',
    role: 'Design & implementation',
    summary:
      'Real-time coverage checks that surface payer rules and authorization requirements before a claim is ever built.',
    detail:
      'Wraps the X12 270/271 eligibility exchange behind a single call. A 270 goes out to the payer, the 271 comes back as a dense positional document, and the service parses it into plan status, copay, deductible and service-level authorization requirements the product can render directly - instead of discovering the problem weeks later at adjudication.',
    facts: [
      ['TRANSACTION', 'X12 270 / 271'],
      ['CLEARINGHOUSE', 'Stedi'],
      ['MODE', 'Real-time'],
      ['OUTPUT', 'Typed coverage model'],
    ],
    stack: ['EDI 270/271', 'Stedi', 'GraphQL', '.NET 8'],
    accent: 'teal',
    flow: {
      nodes: [
        { id: 'req', label: 'Request', x: 26, y: 75, kind: 'edge' },
        { id: 'svc', label: '270 build', x: 116, y: 75, kind: 'core' },
        { id: 'ch', label: 'Stedi', x: 206, y: 75, kind: 'vendor' },
        { id: 'payer', label: 'Payer', x: 274, y: 40, kind: 'vendor' },
        { id: 'parse', label: '271 parse', x: 274, y: 116, kind: 'core' },
      ],
      edges: [
        ['req', 'svc'],
        ['svc', 'ch'],
        ['ch', 'payer'],
        ['ch', 'parse'],
      ],
    },
  },
  {
    id: 'clinical',
    num: '03',
    title: 'Labs & Medication Flows',
    kind: 'CLINICAL · INTEGRATION',
    year: '2025',
    role: 'Integration engineering',
    summary:
      'Patient-centric flows for lab orders, results and e-prescribing across external clinical systems.',
    detail:
      'Orders leave the platform, results return asynchronously, prescriptions round-trip through DoseSpot. The hard part is ordering: results and status changes arrive out of band and occasionally more than once, so the service reconciles every inbound event against the record that originated it rather than trusting the order it turned up in.',
    facts: [
      ['INGRESS', 'Async webhooks'],
      ['PARTNERS', 'DoseSpot, Lab APIs'],
      ['PATTERN', 'Idempotent reconcile'],
      ['STATE', 'Order-anchored'],
    ],
    stack: ['Healthie', 'DoseSpot', 'Lab APIs', 'Webhooks'],
    accent: 'amber',
    flow: {
      nodes: [
        { id: 'order', label: 'Order', x: 26, y: 46, kind: 'core' },
        { id: 'lab', label: 'Lab', x: 150, y: 26, kind: 'vendor' },
        { id: 'rx', label: 'DoseSpot', x: 150, y: 124, kind: 'vendor' },
        { id: 'hook', label: 'Webhook', x: 214, y: 75, kind: 'edge' },
        { id: 'rec', label: 'Reconcile', x: 274, y: 75, kind: 'core' },
      ],
      edges: [
        ['order', 'lab'],
        ['order', 'rx'],
        ['lab', 'hook'],
        ['rx', 'hook'],
        ['hook', 'rec'],
      ],
    },
  },
  {
    id: 'ehr',
    num: '04',
    title: 'EHR Automation System',
    kind: 'HEALTHCARE · AUTOMATION',
    year: '2024 -',
    role: 'Backend & automation',
    summary:
      'End-to-end automation for an Electronic Health Record system - data pulled, processed and filed without anyone re-keying it.',
    detail:
      'Backend services in .NET Core on SQL Server hold the record of truth. Zoho RPA bots extract data from the systems that have no API and push it through the workflow, Azure WebJobs fire the scheduled and background runs, and Azure DevOps carries every change from commit through CI/CD to an automated deployment.',
    facts: [
      ['BACKEND', '.NET Core'],
      ['STORE', 'SQL Server'],
      ['AUTOMATION', 'Zoho RPA'],
      ['TRIGGERS', 'Azure WebJobs'],
    ],
    stack: ['.NET Core', 'SQL Server', 'Zoho RPA', 'Azure WebJobs', 'Azure DevOps'],
    accent: 'teal',
    flow: {
      nodes: [
        { id: 'src', label: 'Source apps', x: 40, y: 40, kind: 'edge' },
        { id: 'job', label: 'WebJobs', x: 40, y: 112, kind: 'vendor' },
        { id: 'rpa', label: 'Zoho RPA', x: 138, y: 40, kind: 'vendor' },
        { id: 'api', label: '.NET Core', x: 180, y: 112, kind: 'core' },
        { id: 'db', label: 'SQL Server', x: 262, y: 75, kind: 'core' },
      ],
      edges: [
        ['src', 'rpa'],
        ['job', 'rpa'],
        ['job', 'api'],
        ['rpa', 'api'],
        ['api', 'db'],
      ],
    },
  },
  {
    id: 'suvadu',
    num: '05',
    title: 'Suvadu',
    kind: 'PERSONAL · TYPESCRIPT',
    year: '2026',
    role: 'Solo build',
    summary: 'A storefront built end to end in TypeScript - catalogue, cart, checkout and an admin behind it.',
    detail:
      'React and TypeScript on the front, Supabase for data, auth and storage behind it. Built to own the whole surface for once: schema and row-level policies through to the product page and the admin that writes to it.',
    facts: [
      ['LANGUAGE', 'TypeScript'],
      ['DATA', 'Supabase / Postgres'],
      ['STATUS', 'Active'],
      ['SOURCE', 'Public'],
    ],
    stack: ['TypeScript', 'React', 'Supabase', 'Vite'],
    link: 'https://github.com/Nithiesh1511/Suvadu',
    accent: 'signal',
    flow: {
      nodes: [
        { id: 'ui', label: 'React UI', x: 40, y: 75, kind: 'edge' },
        { id: 'ctx', label: 'Catalog', x: 150, y: 40, kind: 'core' },
        { id: 'admin', label: 'Admin', x: 150, y: 112, kind: 'core' },
        { id: 'db', label: 'Supabase', x: 266, y: 75, kind: 'vendor' },
      ],
      edges: [
        ['ui', 'ctx'],
        ['ui', 'admin'],
        ['ctx', 'db'],
        ['admin', 'db'],
      ],
    },
  },
]

export const stack = [
  {
    group: 'Backend',
    items: [
      { name: 'C# / .NET 8', level: 88, note: 'Services, .NET Core MVC, background jobs' },
      { name: 'REST API design', level: 85, note: 'Contracts, Swagger docs, error shape' },
      { name: 'GraphQL', level: 72, note: 'Healthie schema consumption' },
    ],
  },
  {
    group: 'Data',
    items: [
      { name: 'Cosmos DB', level: 78, note: 'Partitioning, throughput, RU cost' },
      { name: 'MongoDB', level: 80, note: 'Document modelling, aggregation' },
      { name: 'SQL Server / MySQL', level: 80, note: 'Relational queries, migrations' },
    ],
  },
  {
    group: 'Cloud & Delivery',
    items: [
      { name: 'Microsoft Azure', level: 76, note: 'App Services, WebJobs, Key Vault' },
      { name: 'Azure DevOps', level: 74, note: 'Repos, CI/CD, automated deployments' },
      { name: 'Observability', level: 68, note: 'Logs, traces, failure triage' },
    ],
  },
  {
    group: 'Automation',
    items: [
      { name: 'Zoho RPA', level: 74, note: 'Data extraction, workflow processing' },
      { name: 'UiPath', level: 62, note: 'Autopilot, attended automation' },
      { name: 'SDLC & Agile', level: 78, note: 'Testing, version control, delivery' },
    ],
  },
  {
    group: 'Product Surface',
    items: [
      { name: 'TypeScript', level: 76, note: 'Typed client and tooling' },
      { name: 'React', level: 74, note: 'Interactive interfaces' },
      { name: 'Figma', level: 60, note: 'Clickable prototypes' },
      { name: 'HealthTech domain', level: 84, note: 'X12, clinical and payer flows' },
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
    text: 'Bachelor of Science in Computer Technology / Computer Systems Technology - where programming, networks and how machines fit together first clicked.',
    tags: ['BSc', 'Computer Technology'],
  },
  {
    period: 'Jul 2022 - Apr 2024',
    title: 'MSc Computer Science',
    org: 'Bharathiar University',
    text: 'Master of Science in Computer Science - foundations in systems, data structures and software engineering.',
    tags: ['MSc', 'Computer Science'],
  },
  {
    period: 'Jan 2024 - Jul 2024',
    title: 'Software Engineering Intern',
    org: 'iTech Software Group',
    text: 'Built an Employee Management System on .NET and SQL, and backend components for IoT and ATMS applications. Tracked down and fixed major issues, supported functional and integration testing, and worked inside an Agile SDLC with disciplined version control.',
    tags: ['.NET', 'SQL', 'IoT', 'Agile'],
  },
  {
    period: 'Aug 2024 - 2026',
    title: 'Junior Software Engineer',
    org: 'iTech Software Group',
    text: 'Healthcare integration and automation. Built an end-to-end EHR automation system - .NET Core services on SQL Server, Zoho RPA for data extraction and workflow processing, Azure WebJobs for scheduled and background triggers, Azure DevOps for CI/CD and automated deployments - alongside the API contracts, X12 parsing and webhook reconciliation behind the case studies above.',
    tags: ['.NET Core', 'SQL Server', 'Zoho RPA', 'Azure WebJobs', 'Azure DevOps'],
  },
  {
    period: 'Jul 2026 - Present',
    title: 'Software Engineer',
    org: 'App Innovation Technologies',
    // TODO: replace with what you actually build here
    text: 'Bringing a backend and integrations background into product engineering.',
    tags: ['.NET', 'Backend'],
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

export const navLinks = [
  { id: 'about', label: 'About', n: '01' },
  { id: 'work', label: 'Work', n: '02' },
  { id: 'stack', label: 'Stack', n: '03' },
  { id: 'learning', label: 'Learning', n: '04' },
  { id: 'contact', label: 'Contact', n: '05' },
]
