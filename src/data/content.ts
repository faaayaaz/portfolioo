export const profile = {
  name: "Muhammed Fayaz",
  shortName: "Fayaz",
  role: "Data & Business Intelligence Analyst",
  email: "fayas818@gmail.com",
  phone: "+971 56 884 0852",
  location: "Dubai, United Arab Emirates",
  linkedin: "https://www.linkedin.com/in/faaayaaz/",
  github: "https://github.com/faaayaaz",
  resume: "/Muhammed_Fayaz_Resume.pdf",
  headline: ["Making complex", "data make", "a difference."],
  introduction:
    "I turn healthcare data into clear decisions, dependable reporting, and better ways of working.",
  summary:
    "From a database query to the decision it informs. I connect the dots between healthcare systems, business questions, and the people who need answers.",
  about:
    "I’m Fayaz, a Computer Science graduate working at the intersection of analytics and healthcare in the UAE. At Safecare Technology, I help clients turn reporting requirements into reliable dashboards, validated data, and practical workflows.",
  philosophy:
    "Good analytics starts with a better question. I work closely with the people behind the process, validate the data at every step, and build reporting they can actually use.",
  education: {
    degree: "B.E. Computer Science",
    school: "P.A. College of Engineering · VTU",
    year: "2019 — 2023",
    location: "Mangalore, India",
  },
  metrics: [
    {
      value: 7,
      suffix: "+",
      label: "Healthcare integrations",
      detail: "Client implementations led",
      source: "Professional experience · résumé",
    },
    {
      value: 35,
      suffix: "%",
      label: "Less manual reporting",
      detail: "Through ETL & Power BI automation",
      source: "Reported impact · résumé",
    },
    {
      value: 2,
      suffix: "+",
      label: "Years in analytics",
      detail: "Business intelligence & client delivery",
      source: "Since June 2024 · résumé",
    },
  ],
};
export const navigation = [
  { label: "About", id: "about" },
  { label: "Selected work", id: "work" },
  { label: "Experience", id: "experience" },
  { label: "Live lab", id: "lab" },
];
export const themes = [
  {
    id: "observatory",
    name: "Observatory Dark",
    color: "#c4f29b",
    description: "Deep green · soft lime",
  },
  {
    id: "clinical",
    name: "Clinical Light",
    color: "#135e78",
    description: "Clean white · medical blue",
  },
  {
    id: "violet",
    name: "Midnight Violet",
    color: "#dfbaff",
    description: "Midnight · lavender",
  },
  {
    id: "emerald",
    name: "Emerald Pulse",
    color: "#6ff5bd",
    description: "Forest · fresh mint",
  },
  {
    id: "contrast",
    name: "High Contrast",
    color: "#ffffff",
    description: "Black · white · clear focus",
  },
] as const;
export type Theme = (typeof themes)[number]["id"];
export const skills = [
  {
    label: "Analytics",
    description: "From the question to the insight.",
    tools: [
      { name: "Power BI", context: "Interactive dashboards · semantic models" },
      {
        name: "DAX & Power Query",
        context: "Measures · transformations · reporting logic",
      },
      { name: "Excel", context: "Power Pivot · VBA · exploratory analysis" },
      { name: "Tableau", context: "Visual exploration · business reporting" },
    ],
  },
  {
    label: "Data engineering",
    description: "Reliable foundations for every report.",
    tools: [
      {
        name: "SQL & MySQL",
        context: "Queries · validation · operational datasets",
      },
      { name: "PostgreSQL", context: "Relational querying · data modeling" },
      {
        name: "ETL pipelines",
        context: "Automated extraction · transformation · delivery",
      },
      {
        name: "Data modeling",
        context: "Star schemas · warehouses · quality checks",
      },
    ],
  },
  {
    label: "Healthcare & tools",
    description: "Business context makes the difference.",
    tools: [
      {
        name: "Healthcare analytics",
        context: "Operational KPIs · client reporting",
      },
      {
        name: "DHA / NABIDH context",
        context: "Integration validation · compliance reporting",
      },
      {
        name: "Data governance",
        context: "Consistent metrics · standardized reports",
      },
      {
        name: "Git & Python",
        context: "Version control · academic machine learning",
      },
    ],
  },
];
export const experience = [
  {
    period: "JUN 2024 — PRESENT",
    title: "Business Intelligence Analyst",
    subtitle: "& Software Support",
    company: "Safecare Technology",
    location: "Sharjah, UAE",
    type: "Full-time",
    bullets: [
      "Led 7+ healthcare client integrations, with 100% data integrity and DHA compliance reported in my résumé.",
      "Automated ETL and Power BI reporting to reduce manual effort by 35% and shorten reporting cycles.",
      "Translate client requirements into KPIs, data models, dashboards, and validated implementation workflows.",
      "Support delivery from requirements and migration through client training and go-live.",
    ],
    tags: ["Power BI", "SQL", "ETL", "Healthcare"],
  },
  {
    period: "AUG — SEP 2022",
    title: "Data Science Intern",
    subtitle: "",
    company: "Code Lab Systems",
    location: "Mangalore, India",
    type: "Internship",
    bullets: [
      "Cleaned and validated datasets in Excel and Power BI for consistent analysis.",
      "Explored trends and correlations, then presented findings through interactive dashboards.",
    ],
    tags: ["Data quality", "EDA", "Power BI"],
  },
];
export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  kind: string;
  year: string;
  description: string;
  tags: string[];
  visual: "healthcare" | "skin" | "workforce" | "iot";
  stat: string;
  statLabel: string;
  problem: string;
  approach: string;
  solution: string;
  impact: string;
};
export const projects: Project[] = [
  {
    slug: "healthcare-operations",
    number: "01",
    title: "A pulse on healthcare operations.",
    category: "BUSINESS INTELLIGENCE",
    kind: "Interactive concept",
    year: "2026",
    visual: "healthcare",
    description:
      "An at-a-glance view of patient visits, department performance, and the signals that matter.",
    tags: ["Healthcare analytics", "KPI design", "React demo"],
    stat: "4",
    statLabel: "departments, one clear view",
    problem:
      "Operational teams need a consistent view across departments, without navigating disconnected reports or exposing patient information.",
    approach:
      "This portfolio concept uses a deterministic synthetic dataset across four departments and six months. KPIs are calculated from the same filtered records as the charts.",
    solution:
      "A responsive operations dashboard with department and date filters, visit trends, and directly comparable KPIs. The browser demo is implemented with React and Recharts; it is not an employer dashboard or a Power BI embed.",
    impact:
      "Demonstrates KPI design, filtering, and healthcare reporting in the browser. No measured client outcome is claimed for this concept.",
  },
  {
    slug: "skin-cancer-detection",
    number: "02",
    title: "Finding patterns. Supporting care.",
    category: "MACHINE LEARNING",
    kind: "Academic project",
    year: "2023",
    visual: "skin",
    description:
      "A convolutional neural network exploring classification of dermoscopic skin images.",
    tags: ["Python", "TensorFlow", "CNN"],
    stat: "92%+",
    statLabel: "reported evaluation metrics",
    problem:
      "Dermoscopic images contain complex patterns. This academic project explored whether a convolutional neural network could support automated image classification.",
    approach:
      "Applied augmentation, normalization, and stratified data splits. Evaluated the CNN with accuracy, precision, recall, F1, confusion matrices, and ROC curves.",
    solution:
      "A TensorFlow classification workflow, from image preparation to evaluation. The visual shown here is a schematic reconstruction, not a clinical diagnostic tool.",
    impact:
      "The résumé reports accuracy, precision, recall, and F1 above 92%. The dataset, model artifacts, and independent validation are not supplied; no clinical or deployment claims are made.",
  },
  {
    slug: "workforce-analytics",
    number: "03",
    title: "Understanding the human side of data.",
    category: "PEOPLE ANALYTICS",
    kind: "Academic project",
    year: "2023",
    visual: "workforce",
    description:
      "Exploring attendance patterns and the relationship between flexibility and unplanned absence.",
    tags: ["Excel", "ETL", "Power BI"],
    stat: "3",
    statLabel: "lenses: attendance, leave, workload",
    problem:
      "HR teams need to understand the relationships between work arrangements, sick leave, and workload before recommending interventions.",
    approach:
      "Analyzed employee data using correlation analysis and hypothesis testing. Used Excel, ETL, and Power BI to explore attendance patterns and potential risk factors.",
    solution:
      "An analytical reporting workflow with absenteeism prediction and recommendations. The portfolio chart is an illustrative synthetic visualization, not a screenshot of the original report.",
    impact:
      "The academic work identified an association between flexible arrangements and fewer unplanned absences. A numeric improvement or causal effect is not asserted.",
  },
  {
    slug: "connected-home",
    number: "04",
    title: "Small signals. Connected systems.",
    category: "SYSTEMS & IOT",
    kind: "Academic project",
    year: "2022",
    visual: "iot",
    description:
      "A practical bridge between software, connected devices, and everyday control.",
    tags: ["NodeMCU", "Blynk IoT", "C++"],
    stat: "2",
    statLabel: "relay channels controlled",
    problem:
      "Connected lighting should respond to a smartphone while retaining accessible manual control and clear feedback about device status.",
    approach:
      "Combined a NodeMCU ESP8266 with a two-channel relay and the Blynk platform. Implemented embedded control logic in C++.",
    solution:
      "Smartphone and physical-switch control with real-time state monitoring and notifications. The card’s circuit graphic is an illustrative system diagram.",
    impact:
      "Implemented control of two relay channels. The project demonstrates embedded programming and end-to-end systems thinking alongside analytics.",
  },
];
export const certifications = [
  "Google Data Analytics Professional Certificate",
  "Microsoft Power BI · DAX & data modeling",
  "PwC Power BI Job Simulation",
  "Accenture Data Analytics Job Simulation",
];
export const ui = {
  siteTitle: "Muhammed Fayaz — Data & BI Analyst",
  available: "Open to meaningful opportunities",
  heroEyebrow: "HEALTHCARE DATA. HUMAN IMPACT.",
  work: "Explore my work",
  resume: "Download résumé",
  contact: "Let’s talk",
  heroCaption: "Based in the UAE. Building clarity, one insight at a time.",
  labDisclaimer: "Synthetic sample data · No patient or employer information",
  footer: "Built with intention. Backed by curiosity.",
};
export const sections = {
  work: {
    title: "Behind every number,",
    emphasis: "a better question.",
    description:
      "A selection of analytical explorations, practical systems, and ideas made tangible.",
    note: "Original project visuals are illustrative. Healthcare demos use synthetic data only.",
  },
  about: { title: "Curious by nature.", emphasis: "Precise by practice." },
  skills: {
    title: "The right tools.",
    emphasis: "Used with intent.",
    description:
      "A practical toolkit, built through client delivery and hands-on exploration.",
    footnote: "EXPERIENCE IN CONTEXT. NO ARBITRARY SKILL SCORES.",
  },
  experience: {
    title: "Built in the",
    emphasis: "real world.",
    description: "Working where data, systems, and people meet.",
  },
  lab: {
    title: "Don’t just take my word.",
    emphasis: "Explore the data.",
    description:
      "Change a filter. Follow a trend. A small, working example of how I think about reporting.",
  },
  contact: {
    title: "Have a question?",
    emphasis: "answer.",
    description:
      "A reporting challenge, an opportunity, or a good conversation about data. I’d like to hear about it.",
    labels: {
      name: "Your name",
      email: "Email address",
      message: "What’s on your mind?",
    },
    guidance:
      "Your message opens in your email app unless direct delivery is configured.",
    success: "Message sent. Thanks for getting in touch.",
    draft:
      "Your email draft is ready. Open it in your email app, then send to finish.",
  },
  process: [
    {
      title: "Ask the right question.",
      text: "Understand the decision before building the dashboard.",
    },
    {
      title: "Trust the foundation.",
      text: "Validate, model, and make the numbers consistent.",
    },
    {
      title: "Make the answer usable.",
      text: "Build clear reporting that fits the real workflow.",
    },
  ],
};
