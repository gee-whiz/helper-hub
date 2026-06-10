import { getPerson, getTeam, knowledgeItems, teams, type KnowledgeItem, type Team } from "@/lib/orgpilot-data";
import { normalizeText, type ChatIntent } from "./intents";

export type MatchResult =
  | {
      type: "knowledge";
      item: KnowledgeItem;
      score: number;
      possibleMatches: KnowledgeItem[];
    }
  | {
      type: "team";
      team: Team;
      score: number;
      relatedItems: KnowledgeItem[];
    };

function uniqueWords(value: string) {
  return [...new Set(normalizeText(value).split(/\s+/).filter(Boolean))];
}

function wordOverlap(query: string, target: string) {
  const queryWords = uniqueWords(query);
  const targetWords = uniqueWords(target);
  return targetWords.filter((word) => queryWords.includes(word)).length;
}

function similarity(query: string, target: string) {
  const queryWords = uniqueWords(query);
  const targetWords = uniqueWords(target);

  if (!queryWords.length || !targetWords.length) return 0;

  const hits = targetWords.filter((word) =>
    queryWords.some((queryWord) => queryWord === word || queryWord.includes(word) || word.includes(queryWord)),
  ).length;

  return hits / Math.max(queryWords.length, targetWords.length);
}

function scoreKnowledgeItem(query: string, item: KnowledgeItem, intent: ChatIntent) {
  const normalizedQuery = normalizeText(query);
  const normalizedLabel = normalizeText(item.label);
  const normalizedSummary = normalizeText(item.summary);
  const team = getTeam(item.ownerTeamId);
  const primary = getPerson(item.primaryContactId);
  const backup = getPerson(item.backupContactId);

  let score = 0;

  if (normalizedQuery.includes(normalizedLabel) || normalizedLabel.includes(normalizedQuery)) score += 18;
  score += wordOverlap(query, item.label) * 5;
  score += similarity(query, item.label) * 12;
  score += item.keywords.filter((keyword) => normalizedQuery.includes(normalizeText(keyword))).length * 6;
  score += wordOverlap(query, item.keywords.join(" ")) * 3;
  score += wordOverlap(query, normalizedSummary) * 1.5;
  score += wordOverlap(query, team.name) * 4;
  score += wordOverlap(query, `${primary.name} ${backup.name}`) * 3;

  if (intent === "expertise_lookup" && item.kind === "skill") score += 8;
  if (intent === "process_lookup" && item.kind === "process") score += 8;
  if (intent === "project_lookup" && item.kind === "project") score += 8;
  if (intent === "ownership_lookup" && item.kind === "service") score += 6;

  return score;
}

function scoreTeam(query: string, team: Team) {
  const relatedItems = knowledgeItems.filter((item) => item.ownerTeamId === team.id);
  const relatedText = relatedItems.flatMap((item) => [item.label, item.summary, item.keywords.join(" ")]).join(" ");
  const normalizedQuery = normalizeText(query);
  const normalizedTeam = normalizeText(team.name);

  let score = 0;
  if (normalizedQuery.includes(normalizedTeam) || normalizedTeam.includes(normalizedQuery)) score += 18;
  score += wordOverlap(query, team.name) * 6;
  score += wordOverlap(query, team.domain) * 3;
  score += wordOverlap(query, relatedText) * 1.5;
  score += similarity(query, team.name) * 10;
  return { team, score, relatedItems };
}

export function getRelatedSystems(item: KnowledgeItem) {
  return knowledgeItems
    .filter((candidate) => candidate.ownerTeamId === item.ownerTeamId && candidate.id !== item.id)
    .slice(0, 3);
}

export function findBestMatch(query: string, intent: ChatIntent): MatchResult | null {
  if (intent === "team_lookup") {
    const bestTeam = teams
      .map((team) => scoreTeam(query, team))
      .sort((a, b) => b.score - a.score)[0];

    if (bestTeam && bestTeam.score >= 3) {
      return {
        type: "team",
        team: bestTeam.team,
        score: bestTeam.score,
        relatedItems: bestTeam.relatedItems,
      };
    }
  }

  const ranked = knowledgeItems
    .map((item) => ({ item, score: scoreKnowledgeItem(query, item, intent) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];

  if (!best || best.score < 3) return null;

  return {
    type: "knowledge",
    item: best.item,
    score: best.score,
    possibleMatches: ranked.slice(1, 4).filter((match) => match.score >= 3).map((match) => match.item),
  };
}
