/* Technical Editorial direction: this file defines the authored vocabulary behind the site—clear, specific, enterprise-ready, and honest about placeholders. */
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Cloud,
  Database,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Radio,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type ContentItem = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  summary: string;
  icon: LucideIcon;
  capabilities: string[];
  outcomes: string[];
  related: string[];
  accent?: string;
};

export const services: ContentItem[] = [
  {
    slug: "data-engineering",
    title: "Data Engineering",
    eyebrow: "01 / FOUNDATIONS",
    description: "Build dependable pipelines, models, and platforms that make data usable at the pace your business moves.",
    summary: "From fragmented sources to a governed, observable data foundation.",
    icon: Workflow,
    capabilities: ["Pipeline development", "ETL / ELT", "Warehouse and lakehouse development", "Batch and real-time processing", "Orchestration and observability"],
    outcomes: ["More reliable downstream reporting", "Less manual data preparation", "A platform ready for new use cases"],
    related: ["Data Warehouse", "Data Lakehouse", "Enterprise Data Platform"],
  },
  {
    slug: "analytics-bi",
    title: "Analytics & BI",
    eyebrow: "02 / DECISIONS",
    description: "Turn trusted data into clear reporting, useful KPIs, and self-service insight for every decision-maker.",
    summary: "Make the right questions easier to ask—and answer.",
    icon: BarChart3,
    capabilities: ["Business intelligence", "Dashboard development", "Reporting automation", "Data modeling", "KPI frameworks and executive reporting"],
    outcomes: ["Shorter reporting cycles", "Consistent definitions across teams", "More confident operational decisions"],
    related: ["Customer 360", "Real-Time Analytics", "Data Warehouse"],
  },
  {
    slug: "cloud-data-solutions",
    title: "Cloud Data Solutions",
    eyebrow: "03 / SCALE",
    description: "Modernize data architecture in the cloud with practical migration paths and a focus on performance, resilience, and cost.",
    summary: "Move from legacy constraints to a more adaptable operating model.",
    icon: Cloud,
    capabilities: ["Cloud data architecture", "Migration planning and execution", "Cloud-native pipelines", "Infrastructure modernization", "Cost optimization"],
    outcomes: ["A clearer modernization roadmap", "Better fit between workloads and infrastructure", "An operating model that can scale responsibly"],
    related: ["Cloud Migration", "Enterprise Data Platform", "Data Lakehouse"],
  },
  {
    slug: "ai-machine-learning",
    title: "AI & Machine Learning",
    eyebrow: "04 / INTELLIGENCE",
    description: "Prepare the data infrastructure that analytical models, machine learning, and generative AI depend on.",
    summary: "Make data usable for intelligence without skipping the engineering underneath.",
    icon: BrainCircuit,
    capabilities: ["AI-ready data platforms", "ML data pipelines", "Feature engineering", "Generative AI data infrastructure", "RAG and vector data infrastructure"],
    outcomes: ["Better governed model inputs", "Repeatable pathways from data to experiments", "A practical foundation for future AI programs"],
    related: ["AI-Ready Data Platform", "Real-Time Analytics", "Data Governance"],
  },
  {
    slug: "data-governance",
    title: "Data Governance & Security",
    eyebrow: "05 / TRUST",
    description: "Create the controls, context, and ownership needed to make data more discoverable, reliable, and responsibly used.",
    summary: "Governance that helps teams move with confidence—not friction.",
    icon: ShieldCheck,
    capabilities: ["Data governance", "Cataloging and lineage", "Metadata management", "Data quality", "Privacy, access control, and security"],
    outcomes: ["Clearer accountability for data", "More transparent data flows", "A stronger basis for responsible analytics"],
    related: ["Data Governance", "Enterprise Data Platform", "Customer 360"],
  },
  {
    slug: "managed-data-services",
    title: "Managed Data Services",
    eyebrow: "06 / CONTINUITY",
    description: "Keep data platforms healthy with monitoring, incident response, performance tuning, and continuous improvement.",
    summary: "The operational discipline to keep your data work moving.",
    icon: Activity,
    capabilities: ["Platform monitoring", "Pipeline monitoring", "Incident management", "Performance optimization", "Cloud cost optimization"],
    outcomes: ["Fewer operational surprises", "A clearer view of platform health", "Steady improvement after go-live"],
    related: ["Enterprise Data Platform", "Cloud Migration", "Data Engineering"],
  },
];

export const solutions: ContentItem[] = [
  { slug: "data-warehouse", title: "Modern Data Warehouse", eyebrow: "01 / SOLUTION", description: "Centralize and model trusted data for reporting, analytics, and operational clarity.", summary: "A dependable analytical core for the questions your business keeps asking.", icon: Database, capabilities: ["Warehouse architecture", "Dimensional and semantic modeling", "ELT patterns", "Workload performance", "Governed access"], outcomes: ["Consistent reporting", "Faster analysis cycles", "A foundation for self-service BI"], related: ["Data Engineering", "Analytics & BI", "Technology"] },
  { slug: "data-lakehouse", title: "Data Lakehouse", eyebrow: "02 / SOLUTION", description: "Bring structured and unstructured data together in an architecture designed for analytics and advanced workloads.", summary: "Flexibility for diverse data without losing the discipline of a platform.", icon: Layers3, capabilities: ["Lakehouse architecture", "Open table patterns", "Streaming and batch convergence", "Data lifecycle design", "Access and quality controls"], outcomes: ["More useful data coverage", "Simpler paths to advanced analytics", "Better alignment between engineering and science"], related: ["Cloud Data Solutions", "AI & Machine Learning", "Data Governance"] },
  { slug: "enterprise-data-platform", title: "Enterprise Data Platform", eyebrow: "03 / SOLUTION", description: "Design an operating foundation that connects data producers, consumers, controls, and delivery practices.", summary: "The architecture behind repeatable data work at enterprise scale.", icon: Network, capabilities: ["Platform reference architecture", "Data product patterns", "Observability", "Identity and access", "Operating model design"], outcomes: ["A clearer path from source to decision", "More reusable platform capabilities", "Better alignment across teams"], related: ["Data Governance", "Managed Data Services", "Technology"] },
  { slug: "customer-360", title: "Customer 360", eyebrow: "04 / SOLUTION", description: "Connect customer signals across systems to create a more complete and usable view of the relationship.", summary: "Replace fragmented customer context with a shared point of view.", icon: GitBranch, capabilities: ["Identity resolution", "Customer data modeling", "Event and transaction integration", "Segmentation", "Activation-ready datasets"], outcomes: ["More consistent customer context", "Better targeting inputs", "A shared language across teams"], related: ["Analytics & BI", "Data Warehouse", "Retail"] },
  { slug: "real-time-analytics", title: "Real-Time Analytics", eyebrow: "05 / SOLUTION", description: "Make time-sensitive signals available when the business can still act on them.", summary: "Shorten the distance between an event and a useful decision.", icon: Radio, capabilities: ["Event streaming", "Near-real-time pipelines", "Operational dashboards", "Alerting inputs", "Latency-aware architecture"], outcomes: ["Faster operational response", "More current decision context", "A better basis for event-driven work"], related: ["Data Engineering", "AI & Machine Learning", "Manufacturing"] },
  { slug: "cloud-migration", title: "Cloud Migration", eyebrow: "06 / SOLUTION", description: "Move data workloads with a sequenced plan for architecture, risk, cutover, and continuous optimization.", summary: "Modernization that respects the systems already carrying the business.", icon: Cloud, capabilities: ["Migration assessment", "Target-state architecture", "Workload sequencing", "Cutover planning", "FinOps and optimization"], outcomes: ["A manageable migration path", "Reduced legacy dependency", "Better visibility into cloud trade-offs"], related: ["Cloud Data Solutions", "Managed Data Services", "Technology"] },
  { slug: "ai-ready-data-platform", title: "AI-Ready Data Platform", eyebrow: "07 / SOLUTION", description: "Prepare governed, discoverable, well-structured data for machine learning and generative AI initiatives.", summary: "Good AI starts with data systems people can trust.", icon: Sparkles, capabilities: ["Retrieval-ready data pipelines", "Feature and embedding workflows", "Vector data infrastructure", "Model input governance", "Evaluation data foundations"], outcomes: ["More usable model inputs", "A safer path from pilot to scale", "Less time spent reworking data foundations"], related: ["AI & Machine Learning", "Data Governance", "Data Lakehouse"] },
  { slug: "data-governance", title: "Data Governance", eyebrow: "08 / SOLUTION", description: "Establish the operating practices and technical controls that help data stay understandable and accountable.", summary: "Governance designed for adoption, not documentation alone.", icon: LockKeyhole, capabilities: ["Catalog and lineage", "Ownership models", "Quality rules", "Access patterns", "Privacy and policy alignment"], outcomes: ["More transparent data usage", "Better confidence in shared datasets", "Controls that fit day-to-day work"], related: ["Data Governance & Security", "Enterprise Data Platform", "Healthcare"] },
];

export const industries = [
  { slug: "financial-services", title: "Financial Services", description: "Build clearer, more governed data foundations for complex financial operations.", icon: ShieldCheck, useCases: ["Risk and performance reporting", "Customer and account intelligence", "Data platform modernization"] },
  { slug: "healthcare", title: "Healthcare", description: "Connect data across clinical, operational, and administrative environments with care for context and control.", icon: Activity, useCases: ["Operational analytics", "Patient and member data foundations", "Quality and performance reporting"] },
  { slug: "retail", title: "Retail & E-commerce", description: "Turn fragmented commerce and customer signals into usable context across the journey.", icon: BarChart3, useCases: ["Customer 360", "Inventory and demand analytics", "Personalization data foundations"] },
  { slug: "manufacturing", title: "Manufacturing", description: "Use integrated operational data to improve visibility across plants, products, and supply networks.", icon: Gauge, useCases: ["Production analytics", "Predictive maintenance inputs", "Quality and traceability data"] },
  { slug: "logistics", title: "Logistics & Supply Chain", description: "Make movement, capacity, and service signals easier to connect and act on.", icon: GitBranch, useCases: ["Network visibility", "Shipment and route analytics", "Operational exception management"] },
  { slug: "technology", title: "Technology & SaaS", description: "Create data systems that support product decisions, customer intelligence, and sustainable growth.", icon: Network, useCases: ["Product analytics", "Usage and revenue intelligence", "Platform operating models"] },
  { slug: "telecom", title: "Telecom", description: "Bring together network, subscriber, and service data for more timely decisions.", icon: Radio, useCases: ["Network performance", "Subscriber intelligence", "Service operations analytics"] },
  { slug: "media", title: "Media", description: "Connect audience, content, and commercial data without losing the detail behind the signal.", icon: Layers3, useCases: ["Audience analytics", "Content performance", "Advertising and subscription data"] },
  { slug: "energy", title: "Energy", description: "Create durable data foundations for asset, operations, and sustainability-related intelligence.", icon: Cloud, useCases: ["Asset performance", "Operations visibility", "Planning and reporting data"] },
  { slug: "government", title: "Government", description: "Improve data clarity and interoperability across public programs and operational systems.", icon: Database, useCases: ["Program reporting", "Cross-system data integration", "Public service analytics"] },
];

export const technologyGroups = [
  { title: "Cloud", note: "Common cloud environments — capability status confirmed in discovery.", items: ["AWS", "Microsoft Azure", "Google Cloud"] },
  { title: "Data Platforms", note: "Modern analytical platforms — capability status confirmed in discovery.", items: ["Snowflake", "Databricks", "BigQuery", "Redshift", "Microsoft Fabric"] },
  { title: "Data Engineering", note: "Engineering tools and runtimes — capability status confirmed in discovery.", items: ["Apache Spark", "Kafka", "Airflow", "dbt", "Python"] },
  { title: "BI & Analytics", note: "Analytics tools — capability status confirmed in discovery.", items: ["Power BI", "Tableau", "Looker"] },
  { title: "AI / ML", note: "Infrastructure patterns rather than product partnerships.", items: ["Machine learning infrastructure", "LLM data infrastructure", "RAG infrastructure", "Vector databases"] },
];

export const caseStudies = [
  { slug: "operating-model-framework", label: "CASE STUDY FRAMEWORK", industry: "Industry context / discovery dependent", title: "Modernizing a fragmented reporting foundation", problem: "A growing organization is working across disconnected sources and inconsistent reporting definitions.", solution: "A sequenced data platform modernization program with clearer ownership, reusable models, and a governed reporting layer.", technology: "Technology stack / confirmed in discovery", result: "Business result metrics / confirmed in discovery." },
  { slug: "customer-intelligence-framework", label: "CASE STUDY FRAMEWORK", industry: "Retail or commerce", title: "Connecting customer signals across the journey", problem: "Customer, transaction, and interaction data live in separate systems, limiting shared context.", solution: "A customer intelligence foundation built around identity, modeling, and activation-ready datasets.", technology: "Technology stack / confirmed in discovery", result: "Business result metrics / confirmed in discovery." },
  { slug: "cloud-foundation-framework", label: "CASE STUDY FRAMEWORK", industry: "Technology or SaaS", title: "Creating a clearer path to cloud data", problem: "Legacy data workloads make it difficult to scale analytics and understand infrastructure trade-offs.", solution: "A practical target-state architecture, workload sequencing, and optimization plan.", technology: "Technology stack / confirmed in discovery", result: "Business result metrics / confirmed in discovery." },
  { slug: "realtime-operations-framework", label: "CASE STUDY FRAMEWORK", industry: "Manufacturing or logistics", title: "Shortening the path from event to action", problem: "Operational teams receive signals too late to respond consistently.", solution: "A streaming-aware data architecture for fresher visibility and clearer exception inputs.", technology: "Technology stack / confirmed in discovery", result: "Business result metrics / confirmed in discovery." },
];

export const resources = [
  { slug: "data-platform-modernization", category: "Blog", type: "Perspective", title: "A practical way to think about data platform modernization", description: "A practical field note on sequencing architecture, clarifying ownership, and turning a modernization ambition into work a team can actually deliver and operate." },
  { slug: "warehouse-or-lakehouse", category: "Technical Articles", type: "Technical article", title: "Warehouse or lakehouse: start with the decision you need to support", description: "A decision framework for choosing between warehouse and lakehouse patterns by looking at the questions, workloads, governance needs, and operating model behind the choice." },
  { slug: "data-readiness-guide", category: "Guides", type: "Guide", title: "The data readiness conversation before an AI initiative", description: "A structured set of questions about data quality, lineage, access, evaluation, and repeatability to work through before an AI initiative moves beyond a promising experiment." },
  { slug: "managed-data-operations", category: "Whitepapers", type: "Whitepaper", title: "What healthy data operations look like after go-live", description: "A practical operating outline covering monitoring, incident response, ownership, performance review, and the continuous improvement habits that keep a data platform healthy after go-live." },
  { slug: "architecture-office-hours", category: "Webinars", type: "Webinar", title: "Architecture office hours: bring the hard part", description: "A guided discussion format for bringing a difficult architecture, platform, analytics, or AI question and leaving with a clearer set of options to investigate." },
  { slug: "governance-without-friction", category: "Reports", type: "Report", title: "Governance that people can actually use", description: "A working perspective on making governance understandable, adoptable, and connected to the daily decisions teams make with data." },
];

export const coachingPrograms = [
  { slug: "data-analytics", title: "Data Analytics", summary: "Excel, SQL, Python, Power BI, and data visualization for business insights.", description: "Master the tools and techniques that turn raw data into clear, actionable business insights—from spreadsheets to interactive dashboards.", icon: BarChart3, duration: "1 month", level: "Beginner to Intermediate", topics: ["Excel & Google Sheets", "SQL for analytics", "Python (Pandas, NumPy)", "Power BI & Tableau", "Statistical fundamentals", "Data storytelling"] },
  { slug: "data-engineering", title: "Data Engineering", summary: "ETL pipelines, data warehousing, Spark, Airflow, and cloud data platforms.", description: "Build the infrastructure that makes data usable—design pipelines, model warehouses, and operate modern cloud-native data platforms.", icon: Workflow, duration: "1 month", level: "Intermediate to Advanced", topics: ["Python & SQL at scale", "ETL / ELT patterns", "Apache Spark & Airflow", "Data warehousing (Snowflake, BigQuery)", "Cloud platforms (AWS, GCP, Azure)", "Data quality & observability"] },
  { slug: "mern-stack", title: "MERN Stack", summary: "MongoDB, Express.js, React, and Node.js full-stack development.", description: "Go from zero to deploying production-grade web applications using the most popular JavaScript full-stack—MongoDB, Express, React, and Node.js.", icon: Layers3, duration: "3–4 months", level: "Beginner to Intermediate", topics: ["JavaScript / TypeScript", "React & state management", "Node.js & Express.js", "MongoDB & Mongoose", "REST APIs & authentication", "Deployment & DevOps basics"] },
  { slug: "full-stack-development", title: "Full Stack Development", summary: "Frontend, backend, databases, and deployment—end-to-end web development.", description: "A comprehensive program covering every layer of modern web development—HTML/CSS, JavaScript, frameworks, server-side logic, databases, and deployment.", icon: Network, duration: "1 months", level: "Beginner to Advanced", topics: ["HTML, CSS, JavaScript", "React / Next.js", "Node.js / Python backend", "SQL & NoSQL databases", "API design & GraphQL", "CI/CD & cloud deployment"] },
  { slug: "agentic-ai", title: "Agentic AI", summary: "AI agents, LLM orchestration, RAG, tool-use, and autonomous AI systems.", description: "Learn to build autonomous AI systems that reason, plan, and act—covering LLM orchestration, retrieval-augmented generation, tool integration, and multi-agent architectures.", icon: BrainCircuit, duration: "1 months", level: "Intermediate to Advanced", topics: ["LLM fundamentals & prompting", "LangChain / LlamaIndex", "RAG architectures", "Tool-use & function calling", "Multi-agent systems", "Evaluation & deployment"] },
  { slug: "machine-learning", title: "Machine Learning", summary: "Supervised, unsupervised, and deep learning with Python and scikit-learn.", description: "Build a solid ML foundation—from regression and classification through neural networks—with hands-on projects using Python, scikit-learn, and TensorFlow.", icon: Sparkles, duration: "1 months", level: "Intermediate", topics: ["Python for ML", "Supervised learning", "Unsupervised learning", "Feature engineering", "Deep learning basics", "Model deployment (MLOps)"] },
];

/**
 * Upcoming seminars / workshops shown on /coaching/seminars.
 * Add one entry per scheduled event; `title` is the value stored in the database.
 * Leave the array empty and the page shows a "schedule coming soon" state instead of the form.
 */
export const upcomingSeminars: { slug: string; title: string; date: string; mode: string; summary: string }[] = [];

export const engagementModels = [
  { title: "Consulting & Advisory", description: "Clarify the current state, compare target-state options, and build an actionable architecture or transformation roadmap.", bestFor: "Teams defining direction", duration: "Short-term or periodic", team: "Senior advisors", flexibility: "High", typical: "Assessment, roadmap, architecture review" },
  { title: "Project Delivery", description: "Move from an agreed scope to a working data capability with delivery sequencing, technical build, enablement, and handover.", bestFor: "A defined transformation outcome", duration: "Fixed-scope", team: "Delivery pod", flexibility: "Scoped with change control", typical: "Platform, migration, or analytics build" },
  { title: "Dedicated Engineering Team", description: "Extend your roadmap with a focused cross-functional team that can build, document, and improve data products and platform capabilities over time.", bestFor: "A sustained data roadmap", duration: "Ongoing", team: "Dedicated cross-functional team", flexibility: "High", typical: "Continuous platform and product delivery" },
  { title: "Staff Augmentation", description: "Add focused engineering capacity where your team needs help with a specific platform, pipeline, modeling, cloud, or delivery challenge.", bestFor: "Teams needing specific capacity", duration: "Flexible", team: "Embedded specialists", flexibility: "High", typical: "Skill or delivery gap support" },
  { title: "Managed Services", description: "Protect platform continuity through monitoring, incident response, performance improvement, cost awareness, and a steady operational rhythm.", bestFor: "Teams protecting platform continuity", duration: "Ongoing", team: "Operations and engineering support", flexibility: "Service-based", typical: "Monitoring, incidents, and improvement" },
];

export const primaryNav = [
  { label: "Services", href: "/services", menu: services.map(({ slug, title, summary }) => ({ slug, title, summary })) },
  { label: "Solutions", href: "/solutions", menu: solutions.map(({ slug, title, summary }) => ({ slug, title, summary })) },
  { label: "Industries", href: "/industries", menu: industries.map(({ slug, title, description }) => ({ slug, title, summary: description })) },
  { label: "Technology", href: "/technology", menu: technologyGroups.flatMap((group) => group.items.slice(0, 3).map((item) => ({ slug: item.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title: item, summary: group.title }))) },
  { label: "Coaching", href: "/coaching", menu: coachingPrograms.map(({ slug, title, summary }) => ({ slug, title, summary })) },
  { label: "Resources", href: "/resources", menu: resources.slice(0, 4).map(({ slug, title, description }) => ({ slug, title, summary: description })) },
];
