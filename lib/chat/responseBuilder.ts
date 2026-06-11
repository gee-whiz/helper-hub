import {
  getPerson,
  getTeam,
  knowledgeItems,
  type EvidenceSource,
  type KnowledgeItem,
  type Ownership,
  type Person,
  type ResponsibilityScope,
  type Team,
} from "@/lib/orgpilot-data";
import { detectIntent, isContextFollowUp, type ChatIntent } from "./intents";
import { detectScopeRequest, findBestMatch, getRelatedSystems, scopeLabel, selectOwnership } from "./matcher";

export type ConversationContext = {
  recentItemId?: string;
  recentTeamId?: string;
  recentIntent?: ChatIntent;
  recentScope?: ResponsibilityScope;
};

export type RichAnswer = {
  answer: string;
  confidence?: number;
  primaryContact?: Person;
  backupContact?: Person;
  owningTeam?: Team;
  item?: Pick<KnowledgeItem, "id" | "label" | "kind" | "summary">;
  evidence?: EvidenceSource[];
  actions?: KnowledgeItem["actions"];
  possibleMatches?: Pick<KnowledgeItem, "id" | "label" | "kind" | "summary">[];
  suggestions: string[];
  relatedSystems?: Pick<KnowledgeItem, "id" | "label" | "kind" | "summary">[];
  scope?: ResponsibilityScope;
};

export type ChatResponse = {
  query: string;
  matched: boolean;
  intent: ChatIntent;
  answer: RichAnswer;
  context: ConversationContext;
};

const helpText = `I can help answer questions such as:
• Who owns the Travel Claims API?
• Who can approve Azure subscriptions?
• Who knows Kotlin Multiplatform?
• Which team owns customer onboarding?
• How do I request production access?
• What is PAP?`;

const defaultSuggestions = [
  "Who owns the Travel Claims API?",
  "Who knows Kotlin Multiplatform?",
  "Which team manages Azure?",
];

function itemSummary(item: KnowledgeItem) {
  return {
    id: item.id,
    label: item.label,
    kind: item.kind,
    summary: item.summary,
  };
}

function relatedSuggestions(item: KnowledgeItem) {
  const noun = item.kind === "skill" ? "expertise area" : item.kind;
  return [
    "Who is the backup contact?",
    `Which team owns this ${noun}?`,
    "What other systems does this team manage?",
  ];
}

function ownerVerb(item: KnowledgeItem) {
  if (item.kind === "skill") return "I found a likely expert for that skill.";
  if (item.kind === "process") return "I found the team most likely to handle that process.";
  if (item.kind === "project") return "I found the likely project lead and accountable team.";
  return "I found a likely owner for that service.";
}

function buildKnowledgeResponse(
  query: string,
  intent: ChatIntent,
  item: KnowledgeItem,
  ownership: Ownership,
  possibleMatches: KnowledgeItem[] = [],
): ChatResponse {
  const owningTeam = getTeam(ownership.ownerTeamId);
  const primaryContact = getPerson(ownership.primaryContactId);
  const backupContact = getPerson(ownership.backupContactId);
  const relatedSystems = getRelatedSystems(item).map(itemSummary);
  const scope = scopeLabel(ownership.scope);
  const answerText = item.kind === "process"
    ? `${item.label} (${scope}): ${item.summary} ${primaryContact.name} is the primary contact, with ${backupContact.name} as backup.`
    : `${ownerVerb(item)} For ${scope.toLowerCase()}, ${primaryContact.name} is the primary contact, with ${backupContact.name} as backup.`;

  return {
    query,
    matched: true,
    intent,
    answer: {
      answer: answerText,
      confidence: ownership.confidence,
      primaryContact,
      backupContact,
      owningTeam,
      item: itemSummary(item),
      scope: ownership.scope,
      evidence: item.evidence,
      actions: item.actions,
      possibleMatches: possibleMatches.map(itemSummary),
      suggestions: relatedSuggestions(item),
      relatedSystems,
    },
    context: {
      recentItemId: item.id,
      recentTeamId: owningTeam.id,
      recentIntent: intent,
      recentScope: ownership.scope,
    },
  };
}

function buildTeamResponse(query: string, team: Team, relatedItems: KnowledgeItem[]): ChatResponse {
  const primaryItem = relatedItems[0];
  const primaryOwnership = primaryItem?.ownerships.find((ownership) => ownership.ownerTeamId === team.id) ?? (primaryItem ? selectOwnership(primaryItem) : undefined);
  const primaryContact = primaryOwnership ? getPerson(primaryOwnership.primaryContactId) : undefined;

  return {
    query,
    matched: true,
    intent: "team_lookup",
    answer: {
      answer: primaryContact
        ? `${team.name} looks like the right team. ${primaryContact.name} is a good starting contact based on related ownership records.`
        : `${team.name} looks like the right team.`,
      confidence: primaryOwnership?.confidence ?? 82,
      primaryContact,
      backupContact: primaryOwnership ? getPerson(primaryOwnership.backupContactId) : undefined,
      owningTeam: team,
      item: primaryItem ? itemSummary(primaryItem) : undefined,
      scope: primaryOwnership?.scope,
      evidence: primaryItem?.evidence ?? [],
      actions: primaryItem?.actions ?? [{ label: "Ask in Teams", url: "#" }],
      suggestions: [
        `What does ${team.name} manage?`,
        "Who is the primary contact?",
        "What related services does this team own?",
      ],
      relatedSystems: relatedItems.slice(0, 3).map(itemSummary),
    },
    context: {
      recentItemId: primaryItem?.id,
      recentTeamId: team.id,
      recentIntent: "team_lookup",
      recentScope: primaryOwnership?.scope,
    },
  };
}

function findContextItem(context?: ConversationContext) {
  return knowledgeItems.find((item) => item.id === context?.recentItemId);
}

function buildFollowUpResponse(query: string, context: ConversationContext | undefined, intent: ChatIntent): ChatResponse | null {
  const followUp = isContextFollowUp(query);
  const item = findContextItem(context);
  if (!followUp || !item) return null;

  const scopeRequest = detectScopeRequest(query);
  const ownership =
    !scopeRequest.country && !scopeRequest.global && context?.recentScope
      ? item.ownerships.find((candidate) => candidate.scope.scopeType === context.recentScope?.scopeType && candidate.scope.country === context.recentScope?.country) ??
        selectOwnership(item, scopeRequest)
      : selectOwnership(item, scopeRequest);
  const team = getTeam(ownership.ownerTeamId);
  const primary = getPerson(ownership.primaryContactId);
  const backup = getPerson(ownership.backupContactId);
  const relatedSystems = getRelatedSystems(item).map(itemSummary);
  const scope = scopeLabel(ownership.scope);

  const detail = {
    backup: `${backup.name} is the backup contact for ${item.label} (${scope}).`,
    team: `${team.name} owns ${item.label} for ${scope.toLowerCase()}. Their channel is ${team.channel}.`,
    evidence: `The strongest signals for ${item.label} (${scope}) are ${item.evidence.map((source) => source.title).join(", ")}.`,
    related: relatedSystems.length
      ? `${team.name} also appears connected to ${relatedSystems.map((system) => system.label).join(", ")}.`
      : `I do not see closely related systems for ${item.label} yet.`,
    primary: `${primary.name} is the primary contact for ${item.label} (${scope}).`,
  }[followUp];

  return {
    query,
    matched: true,
    intent,
    answer: {
      answer: detail,
      confidence: ownership.confidence,
      primaryContact: primary,
      backupContact: backup,
      owningTeam: team,
      item: itemSummary(item),
      scope: ownership.scope,
      evidence: item.evidence,
      actions: item.actions,
      suggestions: relatedSuggestions(item),
      relatedSystems,
    },
    context: {
      recentItemId: item.id,
      recentTeamId: team.id,
      recentIntent: intent,
      recentScope: ownership.scope,
    },
  };
}

function simpleResponse(query: string, intent: ChatIntent, answer: string, suggestions = defaultSuggestions): ChatResponse {
  return {
    query,
    matched: true,
    intent,
    answer: {
      answer,
      suggestions,
    },
    context: {
      recentIntent: intent,
    },
  };
}

function fallbackResponse(query: string, intent: ChatIntent): ChatResponse {
  return {
    query,
    matched: false,
    intent,
    answer: {
      answer: `I couldn't find a clear owner for that request.

Possible next steps:
• Search by team
• Search by project
• Search by service name

You can also ask questions such as:
'Who owns customer onboarding?'
'Who knows React?'
'Which team manages Azure?'`,
      suggestions: [
        "Which team manages Azure?",
        "Who owns the Travel Claims API?",
        "Who maintains data contracts?",
      ],
    },
    context: {
      recentIntent: intent,
    },
  };
}

export function generateResponse(message: string, conversationContext?: ConversationContext): ChatResponse {
  const query = message.trim();
  const intent = detectIntent(query);
  const followUp = buildFollowUpResponse(query, conversationContext, intent);

  if (followUp) return followUp;

  if (intent === "greeting") {
    return simpleResponse(
      query,
      intent,
      "Hello! I'm Helper Hub. I can help you find system owners, teams, experts, projects, and internal processes. What are you looking for today?",
      ["Who owns the Travel Claims API?", "Who knows Kotlin Multiplatform?", "Which team manages Azure?"],
    );
  }

  if (intent === "help") {
    return simpleResponse(query, intent, helpText, ["Find a service owner", "Find an expert", "Find an approval process"]);
  }

  if (intent === "farewell") {
    return simpleResponse(
      query,
      intent,
      "Happy to help. Feel free to ask if you need to find a team, owner, expert, or process.",
      ["Who owns the Travel Claims API?", "Who is the backup contact?", "Which team manages Azure?"],
    );
  }

  const match = findBestMatch(query, intent);

  if (!match) return fallbackResponse(query, intent);

  if (match.type === "team") {
    return buildTeamResponse(query, match.team, match.relatedItems);
  }

  return buildKnowledgeResponse(query, intent, match.item, match.ownership, match.possibleMatches);
}
