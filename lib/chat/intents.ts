export type ChatIntent =
  | "greeting"
  | "farewell"
  | "help"
  | "ownership_lookup"
  | "expertise_lookup"
  | "process_lookup"
  | "project_lookup"
  | "team_lookup"
  | "unknown";

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

export function detectIntent(message: string): ChatIntent {
  const normalized = normalizeText(message);

  if (!normalized) return "unknown";

  const shortGreeting = /^(hi|hello|hey|hej|good morning|good afternoon|good evening)$/.test(normalized);
  if (shortGreeting || hasAny(normalized, ["good morning", "good afternoon", "good evening"])) {
    return "greeting";
  }

  if (
    /^(thanks|thank you|bye|goodbye|see you|cheers)$/.test(normalized) ||
    hasAny(normalized, ["thanks", "thank you", "bye", "goodbye"])
  ) {
    return "farewell";
  }

  if (
    hasAny(normalized, [
      "what can you do",
      "help",
      "how does this work",
      "what should i ask",
      "examples",
      "show me prompts",
    ])
  ) {
    return "help";
  }

  if (hasAny(normalized, ["who knows", "expert", "expertise", "skill", "mentor", "specialist"])) {
    return "expertise_lookup";
  }

  if (hasAny(normalized, ["approve", "approval", "request", "process", "workflow", "how do i", "how can i"])) {
    return "process_lookup";
  }

  if (hasAny(normalized, ["project", "worked on", "leading", "lead for", "initiative", "redesign", "refresh"])) {
    return "project_lookup";
  }

  if (
    hasAny(normalized, ["which team", "what team", "team owns", "team manages", "managed by", "owned by team", "who is in"]) ||
    (normalized.includes("what does") && hasAny(normalized, ["manage", "own", "handle"]))
  ) {
    return "team_lookup";
  }

  if (hasAny(normalized, ["owner", "owns", "owning", "support", "supports", "manage", "manages", "service", "api", "system"])) {
    return "ownership_lookup";
  }

  return "unknown";
}

export function isContextFollowUp(message: string) {
  const normalized = normalizeText(message);

  if (hasAny(normalized, ["backup", "secondary contact", "alternate contact", "fallback contact"])) {
    return "backup" as const;
  }

  if (hasAny(normalized, ["which team", "owning team", "team", "channel"])) {
    return "team" as const;
  }

  if (hasAny(normalized, ["evidence", "source", "sources", "why", "confidence"])) {
    return "evidence" as const;
  }

  if (hasAny(normalized, ["related", "other systems", "other services", "what else"])) {
    return "related" as const;
  }

  if (hasAny(normalized, ["primary", "owner", "contact"])) {
    return "primary" as const;
  }

  return null;
}
