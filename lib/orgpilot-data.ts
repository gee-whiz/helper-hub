export type Person = {
  id: string;
  name: string;
  role: string;
  teamId: string;
  location: string;
  skills: string[];
  email: string;
};

export type Team = {
  id: string;
  name: string;
  domain: string;
  channel: string;
};

export type EvidenceSource = {
  title: string;
  type: "Service Catalog" | "Jira" | "GitHub" | "Confluence" | "Teams" | "HR Skills";
  detail: string;
  url: string;
};

export type KnowledgeItem = {
  id: string;
  label: string;
  kind: "service" | "project" | "process" | "skill";
  summary: string;
  keywords: string[];
  ownerTeamId: string;
  primaryContactId: string;
  backupContactId: string;
  confidence: number;
  evidence: EvidenceSource[];
  actions: {
    label: string;
    url: string;
  }[];
};

export type ChatAnswer = {
  answer: string;
  confidence: number;
  primaryContact: Person;
  backupContact: Person;
  owningTeam: Team;
  item: Pick<KnowledgeItem, "id" | "label" | "kind" | "summary">;
  evidence: EvidenceSource[];
  actions: KnowledgeItem["actions"];
  possibleMatches?: Pick<KnowledgeItem, "id" | "label" | "kind" | "summary">[];
};

export type ChatResponse = {
  query: string;
  matched: boolean;
  answer: ChatAnswer;
};

export const people: Person[] = [
  {
    id: "alice-johnson",
    name: "Alice Johnson",
    role: "Principal Engineer",
    teamId: "claims-platform",
    location: "Oslo",
    skills: ["claims APIs", "Node.js", "service ownership", "incident response"],
    email: "alice.johnson@if.fi",
  },
  {
    id: "george-kapoya",
    name: "George Kapoya",
    role: "Staff Backend Engineer",
    teamId: "claims-platform",
    location: "Helsinki",
    skills: ["payments", "claims orchestration", "Java", "Azure"],
    email: "george.kapoya@if.fi",
  },
  {
    id: "kristians-voronics",
    name: "Voroņičs, Kristiāns",
    role: "Backend Engineer",
    teamId: "claims-platform",
    location: "Tampere",
    skills: ["claims APIs", "Java", "incident response"],
    email: "kristians.voronics@if.fi",
  },
  {
    id: "lassi-voutilainen",
    name: "Voutilainen, Lassi",
    role: "Cloud Engineer",
    teamId: "cloud-governance",
    location: "Helsinki",
    skills: ["Azure subscriptions", "policy as code", "landing zones"],
    email: "lassi.voutilainen@if.fi",
  },
  {
    id: "jyri-jarvinen",
    name: "Järvinen, Jyri",
    role: "Data Engineer",
    teamId: "data-enablement",
    location: "Tampere",
    skills: ["Snowflake", "dbt", "data contracts"],
    email: "jyri.jarvinen@if.fi",
  },
  {
    id: "jiaqi-yang",
    name: "Yang, Jiaqi",
    role: "Partner Integration Engineer",
    teamId: "partner-integrations",
    location: "Copenhagen",
    skills: ["partner APIs", "OAuth", "developer portals"],
    email: "jiaqi.yang@if.fi",
  },
  {
    id: "maria-chen",
    name: "Maria Chen",
    role: "Engineering Manager",
    teamId: "cloud-governance",
    location: "Espoo",
    skills: ["Azure subscriptions", "finops", "approval workflows"],
    email: "maria.chen@if.fi",
  },
  {
    id: "samir-patel",
    name: "Samir Patel",
    role: "Cloud Platform Lead",
    teamId: "cloud-governance",
    location: "Helsinki",
    skills: ["landing zones", "policy as code", "security reviews"],
    email: "samir.patel@if.fi",
  },
  {
    id: "nina-holm",
    name: "Nina Holm",
    role: "Product Design Lead",
    teamId: "customer-mobile",
    location: "Stockholm",
    skills: ["mobile redesign", "design systems", "research synthesis"],
    email: "nina.holm@if.fi",
  },
  {
    id: "marcus-lee",
    name: "Marcus Lee",
    role: "Senior iOS Engineer",
    teamId: "customer-mobile",
    location: "Stockholm",
    skills: ["SwiftUI", "Kotlin Multiplatform", "mobile architecture"],
    email: "marcus.lee@if.fi",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "API Product Owner",
    teamId: "partner-integrations",
    location: "Copenhagen",
    skills: ["partner APIs", "OAuth", "developer portals"],
    email: "priya.nair@if.fi",
  },
  {
    id: "tom-bakker",
    name: "Tom Bakker",
    role: "Data Platform Engineer",
    teamId: "data-enablement",
    location: "Oslo",
    skills: ["Snowflake", "dbt", "data contracts", "lineage"],
    email: "tom.bakker@if.fi",
  },
];

export const teams: Team[] = [
  {
    id: "claims-platform",
    name: "Claims Platform",
    domain: "Claims processing, reimbursements, travel expenses",
    channel: "#claims-platform",
  },
  {
    id: "cloud-governance",
    name: "Cloud Governance",
    domain: "Cloud subscription approval, policy, landing zones",
    channel: "#cloud-governance",
  },
  {
    id: "customer-mobile",
    name: "Customer Mobile",
    domain: "iOS, Android, shared mobile foundations",
    channel: "#customer-mobile",
  },
  {
    id: "partner-integrations",
    name: "Partner Integrations",
    domain: "External APIs, partner onboarding, OAuth clients",
    channel: "#partner-integrations",
  },
  {
    id: "data-enablement",
    name: "Data Enablement",
    domain: "Analytics platform, datasets, governance",
    channel: "#data-enablement",
  },
];

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: "travel-claims-api",
    label: "Travel Claims API",
    kind: "service",
    summary: "Claims submission and reimbursement status API for employee travel expenses.",
    keywords: ["travel", "claims", "claim", "api", "reimbursement", "expense", "expenses"],
    ownerTeamId: "claims-platform",
    primaryContactId: "alice-johnson",
    backupContactId: "george-kapoya",
    confidence: 92,
    evidence: [
      { title: "Service Catalog", type: "Service Catalog", detail: "Owner set to Claims Platform on 2026-05-21.", url: "#" },
      { title: "Jira CLAIMS-4821", type: "Jira", detail: "Alice listed as tech lead for migration to v3.", url: "#" },
      { title: "GitHub commits", type: "GitHub", detail: "Recent maintainers: Alice Johnson, George Kapoya.", url: "#" },
    ],
    actions: [
      { label: "Open Jira", url: "#" },
      { label: "View Confluence", url: "#" },
      { label: "Ask in Teams", url: "#" },
    ],
  },
  {
    id: "azure-subscription-approval",
    label: "Azure subscription approvals",
    kind: "process",
    summary: "Approval workflow for new Azure subscriptions and landing zone exceptions.",
    keywords: ["azure", "subscription", "subscriptions", "approve", "approval", "cloud", "tenant"],
    ownerTeamId: "cloud-governance",
    primaryContactId: "maria-chen",
    backupContactId: "samir-patel",
    confidence: 89,
    evidence: [
      { title: "Confluence CLOUD-OPS", type: "Confluence", detail: "Approval matrix names Cloud Governance as process owner.", url: "#" },
      { title: "Teams approvals", type: "Teams", detail: "Maria handled the last seven subscription approvals.", url: "#" },
    ],
    actions: [
      { label: "View Confluence", url: "#" },
      { label: "Ask in Teams", url: "#" },
    ],
  },
  {
    id: "mobile-redesign",
    label: "Mobile redesign",
    kind: "project",
    summary: "2026 customer app redesign covering navigation, claims flows, and account overview.",
    keywords: ["mobile", "redesign", "app", "ios", "android", "navigation", "design"],
    ownerTeamId: "customer-mobile",
    primaryContactId: "nina-holm",
    backupContactId: "marcus-lee",
    confidence: 86,
    evidence: [
      { title: "Jira MOB-1840", type: "Jira", detail: "Nina is project design lead; Marcus owns app shell delivery.", url: "#" },
      { title: "Confluence research readout", type: "Confluence", detail: "Customer Mobile listed as accountable team.", url: "#" },
    ],
    actions: [
      { label: "Open Jira", url: "#" },
      { label: "View Confluence", url: "#" },
      { label: "Ask in Teams", url: "#" },
    ],
  },
  {
    id: "kotlin-multiplatform",
    label: "Kotlin Multiplatform",
    kind: "skill",
    summary: "Internal expertise for shared mobile business logic and KMP module rollout.",
    keywords: ["kotlin", "multiplatform", "kmp", "shared", "mobile", "android"],
    ownerTeamId: "customer-mobile",
    primaryContactId: "marcus-lee",
    backupContactId: "nina-holm",
    confidence: 81,
    evidence: [
      { title: "HR Skills graph", type: "HR Skills", detail: "Marcus tagged as KMP mentor and mobile architecture reviewer.", url: "#" },
      { title: "GitHub shared-mobile", type: "GitHub", detail: "Marcus authored the shared networking module.", url: "#" },
    ],
    actions: [
      { label: "View Confluence", url: "#" },
      { label: "Ask in Teams", url: "#" },
    ],
  },
  {
    id: "partner-onboarding-api",
    label: "Partner Onboarding API",
    kind: "service",
    summary: "External partner provisioning API for onboarding, credentials, and sandbox access.",
    keywords: ["partner", "onboarding", "api", "sandbox", "credentials", "oauth"],
    ownerTeamId: "partner-integrations",
    primaryContactId: "priya-nair",
    backupContactId: "samir-patel",
    confidence: 88,
    evidence: [
      { title: "Service Catalog", type: "Service Catalog", detail: "Partner Integrations owns production and sandbox endpoints.", url: "#" },
      { title: "Jira PARTNER-2209", type: "Jira", detail: "Priya accepted the latest OAuth scope changes.", url: "#" },
    ],
    actions: [
      { label: "Open Jira", url: "#" },
      { label: "View Confluence", url: "#" },
    ],
  },
  {
    id: "snowflake-access",
    label: "Snowflake access requests",
    kind: "process",
    summary: "Request and approval path for Snowflake warehouse access and data product roles.",
    keywords: ["snowflake", "warehouse", "data", "access", "role", "roles", "dataset"],
    ownerTeamId: "data-enablement",
    primaryContactId: "tom-bakker",
    backupContactId: "maria-chen",
    confidence: 84,
    evidence: [
      { title: "Confluence DATA-ACCESS", type: "Confluence", detail: "Data Enablement manages request routing and role templates.", url: "#" },
      { title: "Jira DATA-771", type: "Jira", detail: "Tom updated the approval automation in May.", url: "#" },
    ],
    actions: [
      { label: "Open Jira", url: "#" },
      { label: "View Confluence", url: "#" },
      { label: "Ask in Teams", url: "#" },
    ],
  },
  {
    id: "production-approval-process",
    label: "Production Approval Process (PAP)",
    kind: "process",
    summary: "Mock production readiness and approval flow before a service, change, or integration can go live.",
    keywords: ["pap", "production", "approval", "approvals", "process", "readiness", "go-live", "go live", "release", "change", "launch", "signoff", "sign-off"],
    ownerTeamId: "cloud-governance",
    primaryContactId: "maria-chen",
    backupContactId: "samir-patel",
    confidence: 87,
    evidence: [
      { title: "Confluence PAP overview", type: "Confluence", detail: "PAP is described as the pre-production checklist for risk, monitoring, rollback, security, and owner sign-off.", url: "#" },
      { title: "Teams production readiness", type: "Teams", detail: "Cloud Governance routes PAP questions and confirms which approvals are needed for launch.", url: "#" },
    ],
    actions: [
      { label: "View PAP checklist", url: "#" },
      { label: "Ask in Teams", url: "#" },
    ],
  },
  {
    id: "claims-event-stream",
    label: "Claims Event Stream",
    kind: "service",
    summary: "Kafka event stream publishing claims lifecycle changes to downstream systems.",
    keywords: ["claims", "event", "stream", "kafka", "lifecycle", "downstream"],
    ownerTeamId: "claims-platform",
    primaryContactId: "george-kapoya",
    backupContactId: "alice-johnson",
    confidence: 90,
    evidence: [
      { title: "Service Catalog", type: "Service Catalog", detail: "Claims Platform owns topic schemas and release cadence.", url: "#" },
      { title: "GitHub schema registry", type: "GitHub", detail: "George approved the latest schema compatibility change.", url: "#" },
    ],
    actions: [
      { label: "View Confluence", url: "#" },
      { label: "Ask in Teams", url: "#" },
    ],
  },
  {
    id: "api-gateway-policy",
    label: "API gateway policy exceptions",
    kind: "process",
    summary: "Review path for API gateway exceptions, OAuth scopes, and rate-limit changes.",
    keywords: ["gateway", "policy", "exception", "exceptions", "rate", "limit", "oauth", "api"],
    ownerTeamId: "partner-integrations",
    primaryContactId: "priya-nair",
    backupContactId: "samir-patel",
    confidence: 78,
    evidence: [
      { title: "Confluence API Governance", type: "Confluence", detail: "Partner Integrations reviews partner-facing gateway exceptions.", url: "#" },
      { title: "Jira API-990", type: "Jira", detail: "Priya routed the latest exception request.", url: "#" },
    ],
    actions: [
      { label: "Open Jira", url: "#" },
      { label: "Ask in Teams", url: "#" },
    ],
  },
  {
    id: "customer-identity-refresh",
    label: "Customer identity refresh",
    kind: "project",
    summary: "Modernization project for login, consent prompts, and mobile identity handoff.",
    keywords: ["customer", "identity", "login", "consent", "authentication", "mobile"],
    ownerTeamId: "customer-mobile",
    primaryContactId: "marcus-lee",
    backupContactId: "nina-holm",
    confidence: 76,
    evidence: [
      { title: "Jira ID-3120", type: "Jira", detail: "Customer Mobile owns mobile handoff workstream.", url: "#" },
      { title: "Confluence identity refresh", type: "Confluence", detail: "Marcus noted as app integration lead.", url: "#" },
    ],
    actions: [
      { label: "Open Jira", url: "#" },
      { label: "View Confluence", url: "#" },
    ],
  },
  {
    id: "data-contracts",
    label: "Data contracts",
    kind: "process",
    summary: "Standards and review process for analytical data contracts and schema evolution.",
    keywords: ["data", "contract", "contracts", "schema", "lineage", "dbt", "analytics"],
    ownerTeamId: "data-enablement",
    primaryContactId: "tom-bakker",
    backupContactId: "priya-nair",
    confidence: 83,
    evidence: [
      { title: "Confluence Data Contracts", type: "Confluence", detail: "Tom maintains the current data contract template.", url: "#" },
      { title: "GitHub dbt platform", type: "GitHub", detail: "Recent schema review approvals by Data Enablement.", url: "#" },
    ],
    actions: [
      { label: "View Confluence", url: "#" },
      { label: "Ask in Teams", url: "#" },
    ],
  },
];

export const demoQuestions = [
  "Who owns the Travel Claims API?",
  "Who can approve Azure subscriptions?",
  "Who worked on the mobile redesign?",
  "Who knows Kotlin Multiplatform?",
  "Who owns the Partner Onboarding API?",
  "Who approves Snowflake access requests?",
  "What is PAP?",
  "How does the Production Approval Process work?",
  "Who owns the Claims Event Stream?",
  "Who reviews API gateway policy exceptions?",
  "Who is leading the customer identity refresh?",
  "Who maintains data contracts?",
];

export function getPerson(id: string) {
  const person = people.find((item) => item.id === id);
  if (!person) {
    throw new Error(`Missing mock person: ${id}`);
  }
  return person;
}

export function getTeam(id: string) {
  const team = teams.find((item) => item.id === id);
  if (!team) {
    throw new Error(`Missing mock team: ${id}`);
  }
  return team;
}
