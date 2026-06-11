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

export type ResponsibilityScope = {
  scopeType: "global" | "country" | "business-unit";
  country?: string;
  market?: string;
  businessUnit?: string;
};

export type Ownership = {
  scope: ResponsibilityScope;
  ownerTeamId: string;
  primaryContactId: string;
  backupContactId: string;
  confidence: number;
};

export type KnowledgeItem = {
  id: string;
  label: string;
  kind: "service" | "project" | "process" | "skill";
  summary: string;
  keywords: string[];
  ownerships: Ownership[];
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
    role: "Product Owner",
    teamId: "claims-platform",
    location: "Oslo",
    skills: ["claims APIs", "Node.js", "service ownership", "incident response"],
    email: "alice.johnson@if.fi",
  },
  {
    id: "george-kapoya",
    name: "George Kapoya",
    role: "Solutions Developer",
    teamId: "claims-platform",
    location: "Helsinki",
    skills: ["payments", "claims orchestration", "Java", "Azure"],
    email: "george.kapoya@if.fi",
  },
  {
    id: "kristians-voronics",
    name: "Voroņičs, Kristiāns",
    role: "Solutions Developer",
    teamId: "claims-platform",
    location: "Tampere",
    skills: ["claims APIs", "Java", "incident response"],
    email: "kristians.voronics@if.fi",
  },
  {
    id: "lassi-voutilainen",
    name: "Voutilainen, Lassi",
    role: "Platform Owner",
    teamId: "cloud-governance",
    location: "Helsinki",
    skills: ["Azure subscriptions", "policy as code", "landing zones"],
    email: "lassi.voutilainen@if.fi",
  },
  {
    id: "jyri-jarvinen",
    name: "Järvinen, Jyri",
    role: "Solutions Developer",
    teamId: "data-enablement",
    location: "Tampere",
    skills: ["Snowflake", "dbt", "data contracts"],
    email: "jyri.jarvinen@if.fi",
  },
  {
    id: "jiaqi-yang",
    name: "Yang, Jiaqi",
    role: "Solutions Developer",
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
    role: "Lead Architect",
    teamId: "cloud-governance",
    location: "Helsinki",
    skills: ["landing zones", "policy as code", "security reviews"],
    email: "samir.patel@if.fi",
  },
  {
    id: "nina-holm",
    name: "Nina Holm",
    role: "Chapter Lead",
    teamId: "customer-mobile",
    location: "Stockholm",
    skills: ["mobile redesign", "design systems", "research synthesis"],
    email: "nina.holm@if.fi",
  },
  {
    id: "marcus-lee",
    name: "Marcus Lee",
    role: "Solutions Developer",
    teamId: "customer-mobile",
    location: "Stockholm",
    skills: ["SwiftUI", "Kotlin Multiplatform", "mobile architecture"],
    email: "marcus.lee@if.fi",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "Product Owner",
    teamId: "partner-integrations",
    location: "Copenhagen",
    skills: ["partner APIs", "OAuth", "developer portals"],
    email: "priya.nair@if.fi",
  },
  {
    id: "tom-bakker",
    name: "Tom Bakker",
    role: "Platform Owner",
    teamId: "data-enablement",
    location: "Oslo",
    skills: ["Snowflake", "dbt", "data contracts", "lineage"],
    email: "tom.bakker@if.fi",
  },
  {
    id: "aino-korhonen",
    name: "Aino Korhonen",
    role: "Service Owner",
    teamId: "claims-platform-finland",
    location: "Helsinki",
    skills: ["claims APIs", "Finland market", "incident response"],
    email: "aino.korhonen@if.fi",
  },
  {
    id: "erik-lund",
    name: "Erik Lund",
    role: "Product Owner",
    teamId: "claims-platform-norway",
    location: "Oslo",
    skills: ["claims APIs", "Norway market", "service ownership"],
    email: "erik.lund@if.fi",
  },
  {
    id: "maja-andersson",
    name: "Maja Andersson",
    role: "Engineering Manager",
    teamId: "claims-platform-sweden",
    location: "Stockholm",
    skills: ["claims APIs", "Sweden market", "release readiness"],
    email: "maja.andersson@if.fi",
  },
  {
    id: "freja-nielsen",
    name: "Freja Nielsen",
    role: "Service Owner",
    teamId: "claims-platform-denmark",
    location: "Copenhagen",
    skills: ["claims APIs", "Denmark market", "operations"],
    email: "freja.nielsen@if.fi",
  },
  {
    id: "veera-laine",
    name: "Veera Laine",
    role: "Scrum Master",
    teamId: "cloud-governance-finland",
    location: "Espoo",
    skills: ["Azure subscriptions", "PAP approvals", "Finland market"],
    email: "veera.laine@if.fi",
  },
  {
    id: "ole-hansen",
    name: "Ole Hansen",
    role: "Lead Architect",
    teamId: "cloud-governance-norway",
    location: "Oslo",
    skills: ["Azure subscriptions", "PAP approvals", "Norway market"],
    email: "ole.hansen@if.fi",
  },
  {
    id: "elin-svensson",
    name: "Elin Svensson",
    role: "Platform Owner",
    teamId: "cloud-governance-sweden",
    location: "Stockholm",
    skills: ["Azure subscriptions", "PAP approvals", "Sweden market"],
    email: "elin.svensson@if.fi",
  },
  {
    id: "anders-madsen",
    name: "Anders Madsen",
    role: "Service Owner",
    teamId: "cloud-governance-denmark",
    location: "Copenhagen",
    skills: ["Azure subscriptions", "PAP approvals", "Denmark market"],
    email: "anders.madsen@if.fi",
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
  {
    id: "claims-platform-finland",
    name: "Claims Platform Finland",
    domain: "Finland claims ownership, travel reimbursement flows",
    channel: "#claims-platform-fi",
  },
  {
    id: "claims-platform-norway",
    name: "Claims Platform Norway",
    domain: "Norway claims ownership, travel reimbursement flows",
    channel: "#claims-platform-no",
  },
  {
    id: "claims-platform-sweden",
    name: "Claims Platform Sweden",
    domain: "Sweden claims ownership, travel reimbursement flows",
    channel: "#claims-platform-se",
  },
  {
    id: "claims-platform-denmark",
    name: "Claims Platform Denmark",
    domain: "Denmark claims ownership, travel reimbursement flows",
    channel: "#claims-platform-dk",
  },
  {
    id: "cloud-governance-finland",
    name: "Cloud Governance Finland",
    domain: "Finland cloud approvals, PAP, landing zone exceptions",
    channel: "#cloud-governance-fi",
  },
  {
    id: "cloud-governance-norway",
    name: "Cloud Governance Norway",
    domain: "Norway cloud approvals, PAP, landing zone exceptions",
    channel: "#cloud-governance-no",
  },
  {
    id: "cloud-governance-sweden",
    name: "Cloud Governance Sweden",
    domain: "Sweden cloud approvals, PAP, landing zone exceptions",
    channel: "#cloud-governance-se",
  },
  {
    id: "cloud-governance-denmark",
    name: "Cloud Governance Denmark",
    domain: "Denmark cloud approvals, PAP, landing zone exceptions",
    channel: "#cloud-governance-dk",
  },
];

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: "travel-claims-api",
    label: "Travel Claims API",
    kind: "service",
    summary: "Claims submission and reimbursement status API for employee travel expenses.",
    keywords: ["travel", "claims", "claim", "api", "reimbursement", "expense", "expenses"],
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "claims-platform", primaryContactId: "alice-johnson", backupContactId: "george-kapoya", confidence: 92 },
      { scope: { scopeType: "country", country: "Finland", market: "Finland" }, ownerTeamId: "claims-platform-finland", primaryContactId: "aino-korhonen", backupContactId: "george-kapoya", confidence: 94 },
      { scope: { scopeType: "country", country: "Norway", market: "Norway" }, ownerTeamId: "claims-platform-norway", primaryContactId: "erik-lund", backupContactId: "alice-johnson", confidence: 91 },
      { scope: { scopeType: "country", country: "Sweden", market: "Sweden" }, ownerTeamId: "claims-platform-sweden", primaryContactId: "maja-andersson", backupContactId: "nina-holm", confidence: 90 },
      { scope: { scopeType: "country", country: "Denmark", market: "Denmark" }, ownerTeamId: "claims-platform-denmark", primaryContactId: "freja-nielsen", backupContactId: "priya-nair", confidence: 89 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "cloud-governance", primaryContactId: "maria-chen", backupContactId: "samir-patel", confidence: 89 },
      { scope: { scopeType: "country", country: "Finland", market: "Finland" }, ownerTeamId: "cloud-governance-finland", primaryContactId: "veera-laine", backupContactId: "maria-chen", confidence: 92 },
      { scope: { scopeType: "country", country: "Norway", market: "Norway" }, ownerTeamId: "cloud-governance-norway", primaryContactId: "ole-hansen", backupContactId: "samir-patel", confidence: 90 },
      { scope: { scopeType: "country", country: "Sweden", market: "Sweden" }, ownerTeamId: "cloud-governance-sweden", primaryContactId: "elin-svensson", backupContactId: "maria-chen", confidence: 91 },
      { scope: { scopeType: "country", country: "Denmark", market: "Denmark" }, ownerTeamId: "cloud-governance-denmark", primaryContactId: "anders-madsen", backupContactId: "samir-patel", confidence: 88 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "customer-mobile", primaryContactId: "nina-holm", backupContactId: "marcus-lee", confidence: 86 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "customer-mobile", primaryContactId: "marcus-lee", backupContactId: "nina-holm", confidence: 81 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "partner-integrations", primaryContactId: "priya-nair", backupContactId: "samir-patel", confidence: 88 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "data-enablement", primaryContactId: "tom-bakker", backupContactId: "maria-chen", confidence: 84 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "cloud-governance", primaryContactId: "maria-chen", backupContactId: "samir-patel", confidence: 87 },
      { scope: { scopeType: "country", country: "Finland", market: "Finland" }, ownerTeamId: "cloud-governance-finland", primaryContactId: "veera-laine", backupContactId: "maria-chen", confidence: 91 },
      { scope: { scopeType: "country", country: "Norway", market: "Norway" }, ownerTeamId: "cloud-governance-norway", primaryContactId: "ole-hansen", backupContactId: "samir-patel", confidence: 89 },
      { scope: { scopeType: "country", country: "Sweden", market: "Sweden" }, ownerTeamId: "cloud-governance-sweden", primaryContactId: "elin-svensson", backupContactId: "maria-chen", confidence: 90 },
      { scope: { scopeType: "country", country: "Denmark", market: "Denmark" }, ownerTeamId: "cloud-governance-denmark", primaryContactId: "anders-madsen", backupContactId: "samir-patel", confidence: 88 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "claims-platform", primaryContactId: "george-kapoya", backupContactId: "alice-johnson", confidence: 90 },
      { scope: { scopeType: "country", country: "Finland", market: "Finland" }, ownerTeamId: "claims-platform-finland", primaryContactId: "aino-korhonen", backupContactId: "george-kapoya", confidence: 93 },
      { scope: { scopeType: "country", country: "Norway", market: "Norway" }, ownerTeamId: "claims-platform-norway", primaryContactId: "erik-lund", backupContactId: "alice-johnson", confidence: 89 },
      { scope: { scopeType: "country", country: "Sweden", market: "Sweden" }, ownerTeamId: "claims-platform-sweden", primaryContactId: "maja-andersson", backupContactId: "nina-holm", confidence: 88 },
      { scope: { scopeType: "country", country: "Denmark", market: "Denmark" }, ownerTeamId: "claims-platform-denmark", primaryContactId: "freja-nielsen", backupContactId: "priya-nair", confidence: 87 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "partner-integrations", primaryContactId: "priya-nair", backupContactId: "samir-patel", confidence: 78 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "customer-mobile", primaryContactId: "marcus-lee", backupContactId: "nina-holm", confidence: 76 },
    ],
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
    ownerships: [
      { scope: { scopeType: "global" }, ownerTeamId: "data-enablement", primaryContactId: "tom-bakker", backupContactId: "priya-nair", confidence: 83 },
    ],
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
  "Who owns the Travel Claims API in Finland?",
  "Who owns Claims in Norway?",
  "Who can approve Azure subscriptions?",
  "Who approves Azure subscriptions in Sweden?",
  "Who handles PAP approvals in Denmark?",
  "Who worked on the mobile redesign?",
  "Who knows Kotlin Multiplatform?",
  "Who owns the Partner Onboarding API?",
  "Who approves Snowflake access requests?",
  "What is PAP?",
  "How does the Production Approval Process work?",
  "Who owns the Claims Event Stream?",
  "Who owns the Claims Event Stream in Finland?",
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
