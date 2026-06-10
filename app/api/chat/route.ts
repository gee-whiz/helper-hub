import {
  ChatResponse,
  getPerson,
  getTeam,
  knowledgeItems,
  type KnowledgeItem,
} from "@/lib/orgpilot-data";

type ChatRequest = {
  message?: string;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
}

function scoreItem(query: string, item: KnowledgeItem) {
  const normalizedQuery = normalize(query);
  const words = normalizedQuery.split(/\s+/).filter(Boolean);
  const keywordHits = item.keywords.filter((keyword) =>
    normalizedQuery.includes(normalize(keyword)),
  ).length;
  const labelHits = normalize(item.label)
    .split(/\s+/)
    .filter((word) => words.includes(word)).length;

  return keywordHits * 3 + labelHits * 2;
}

function toAnswer(item: KnowledgeItem, query: string, possibleMatches?: KnowledgeItem[]): ChatResponse {
  const owningTeam = getTeam(item.ownerTeamId);
  const primaryContact = getPerson(item.primaryContactId);
  const backupContact = getPerson(item.backupContactId);
  const noun = item.kind === "skill" ? "expertise" : item.kind;

  return {
    query,
    matched: !possibleMatches,
    answer: {
      answer: `The ${item.label} ${noun} appears to be owned by ${owningTeam.name}. Primary contact: ${primaryContact.name}. Backup contact: ${backupContact.name}.`,
      confidence: possibleMatches ? Math.min(item.confidence, 58) : item.confidence,
      primaryContact,
      backupContact,
      owningTeam,
      item: {
        id: item.id,
        label: item.label,
        kind: item.kind,
        summary: item.summary,
      },
      evidence: item.evidence,
      actions: item.actions,
      possibleMatches: possibleMatches?.map((match) => ({
        id: match.id,
        label: match.label,
        kind: match.kind,
        summary: match.summary,
      })),
    },
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ChatRequest;
  const message = body.message?.trim();

  if (!message) {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }

  const ranked = knowledgeItems
    .map((item) => ({ item, score: scoreItem(message, item) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];

  if (best.score > 0) {
    return Response.json(toAnswer(best.item, message));
  }

  const possibleMatches = knowledgeItems
    .filter((item) => ["service", "process", "project"].includes(item.kind))
    .slice(0, 3);

  return Response.json(toAnswer(possibleMatches[0], message, possibleMatches));
}
