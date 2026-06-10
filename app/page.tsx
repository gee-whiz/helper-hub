"use client";

import Image from "next/image";
import { FormEvent, useMemo, useRef, useState } from "react";
import { exampleQuestions } from "@/lib/chat/mockData";
import { type ChatResponse, type ConversationContext } from "@/lib/chat/responseBuilder";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  response?: ChatResponse;
};

const starterMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hello! I'm If Helper Hub. Ask me to find system owners, teams, experts, projects, or internal processes.",
  },
];

const thinkingMessages = [
  "Searching organizational knowledge...",
  "Looking up service ownership...",
  "Reviewing project activity...",
];

const iconPaths = {
  ai: "/icons/symbol/24/ai-filled.svg",
  chat: "/icons/ui/24/chat.svg",
  check: "/icons/ui/24/check.svg",
  document: "/icons/symbol/24/document.svg",
  external: "/icons/ui/24/open-in-new.svg",
  link: "/icons/ui/24/link.svg",
  people: "/icons/symbol/24/people.svg",
  search: "/icons/ui/24/search.svg",
  send: "/icons/ui/24/send-message.svg",
  teams: "/icons/ui/24/microsoft.svg",
  user: "/icons/ui/24/user.svg",
} as const;

function confidenceTone(value: number) {
  if (value >= 85) return "bg-[#217331]";
  if (value >= 70) return "bg-[#B35A00]";
  return "bg-slate-400";
}

function Icon({
  name,
  className = "size-4",
}: {
  name: keyof typeof iconPaths;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        WebkitMask: `url(${iconPaths[name]}) center / contain no-repeat`,
        mask: `url(${iconPaths[name]}) center / contain no-repeat`,
      }}
    />
  );
}

function actionIcon(label: string): keyof typeof iconPaths {
  if (label.includes("Teams")) return "teams";
  if (label.includes("Jira")) return "external";
  if (label.includes("Confluence")) return "document";
  return "link";
}

function PersonCard({
  title,
  person,
}: {
  title: string;
  person: NonNullable<ChatResponse["answer"]["primaryContact"]>;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon name="user" />
        {title}
      </p>
      <div className="mt-3 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8F1FF] text-sm font-bold text-[#0054F0] dark:bg-[#06265E] dark:text-[#BFD6FF]">
          {person.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-950 dark:text-white">{person.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{person.role}</p>
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
            {person.email} · {person.location}
          </p>
        </div>
      </div>
    </div>
  );
}

function AnswerCard({
  response,
  onAsk,
}: {
  response: ChatResponse;
  onAsk: (question: string) => void;
}) {
  const { answer } = response;
  const hasRichAnswer = answer.item && answer.owningTeam;

  return (
    <div className="mt-4 space-y-4">
      {hasRichAnswer ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#E8F1FF] px-2.5 py-1 text-xs font-medium capitalize text-[#003A8C] dark:bg-[#06265E] dark:text-[#BFD6FF]">
                {answer.item?.kind}
              </span>
              {!response.matched ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  Possible match
                </span>
              ) : null}
            </div>
            <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
              {answer.item?.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {answer.item?.summary}
            </p>
          </div>
          <div className="min-w-32 rounded-lg bg-[#F6F9FF] p-3 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Confidence
              </span>
              <span className="text-lg font-bold text-slate-950 dark:text-white">
                {answer.confidence}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${confidenceTone(answer.confidence ?? 0)}`}
                style={{ width: `${answer.confidence ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Icon name="people" />
            Owning team
          </p>
          <p className="mt-2 font-semibold text-slate-950 dark:text-white">
            {answer.owningTeam?.name}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {answer.owningTeam?.domain} · {answer.owningTeam?.channel}
          </p>
        </div>
      </div>
      ) : null}

      {answer.primaryContact && answer.backupContact ? (
        <div className="grid gap-4 md:grid-cols-2">
          <PersonCard title="Primary contact" person={answer.primaryContact} />
          <PersonCard title="Backup contact" person={answer.backupContact} />
        </div>
      ) : null}

      {answer.evidence?.length ? (
        <div className="grid gap-3 md:grid-cols-3">
        {answer.evidence.map((source) => (
          <a
            key={`${source.type}-${source.title}`}
            href={source.url}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0054F0] hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-[#6EA2FF]"
          >
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#0054F0] dark:text-[#9FC2FF]">
              <Icon name="document" />
              {source.type}
            </span>
            <p className="mt-2 font-semibold text-slate-950 dark:text-white">{source.title}</p>
            <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
              {source.detail}
            </p>
          </a>
        ))}
      </div>
      ) : null}

      {answer.relatedSystems?.length ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Icon name="link" />
            Related services
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {answer.relatedSystems.map((system) => (
              <span
                key={system.id}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {system.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {answer.actions?.map((action) => (
          <a
            key={action.label}
            href={action.url}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#0054F0] hover:text-[#0054F0] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-[#6EA2FF] dark:hover:text-[#9FC2FF]"
          >
            <Icon name={actionIcon(action.label)} />
            {action.label}
          </a>
        ))}
      </div>

      {answer.suggestions.length ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Suggested questions
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {answer.suggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onAsk(suggestion)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#0054F0] hover:text-[#0054F0] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingText, setThinkingText] = useState(thinkingMessages[0]);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const messageCounter = useRef(0);

  const recentQuestions = useMemo(() => exampleQuestions.slice(6, 16), []);

  function nextMessageId(prefix: string) {
    messageCounter.current += 1;
    return `${prefix}-${messageCounter.current}`;
  }

  async function askQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: nextMessageId("user"),
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);
    setThinkingText(thinkingMessages[messageCounter.current % thinkingMessages.length]);

    try {
      const [result] = await Promise.all([
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, context: conversationContext }),
        }),
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ]);

      if (!result.ok) {
        throw new Error("Chat request failed");
      }

      const response = (await result.json()) as ChatResponse;
      setConversationContext(response.context);
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId("assistant"),
          role: "assistant",
          text: response.answer.answer,
          response,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId("assistant-error"),
          role: "assistant",
          text: "I couldn't complete that lookup just now. Try asking by service, team, project, or process name.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askQuestion(input);
  }

  return (
    <main className="min-h-screen bg-[#F7F3EF] text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-80 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/If-logo.svg" alt="If logo" width={40} height={40} priority />
                <p className="text-2xl font-bold tracking-tight">If Helper Hub</p>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Ask who owns what.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Try a prompt
            </p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {recentQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void askQuestion(question)}
                  className="inline-flex shrink-0 items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#0054F0] hover:text-[#0054F0] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#6EA2FF] dark:hover:text-[#9FC2FF]"
                >
                  <Icon name="search" className="mt-0.5 size-4" />
                  {question}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="hidden size-10 items-center justify-center rounded-lg bg-[#E8F1FF] text-[#0054F0] sm:flex dark:bg-[#06265E] dark:text-[#BFD6FF]">
                  <Icon name="ai" className="size-6" />
                </div>
                <div>
                <h1 className="text-lg font-semibold">Ownership assistant</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Find accountable teams, contacts, and source evidence in seconds.
                </p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-5xl space-y-5">
              {messages.length === 1 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#0054F0] dark:text-[#9FC2FF]">
                    <Icon name="chat" />
                    Internal knowledge routing
                  </p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight">
                    Ask a plain-language ownership question.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                   Helper Hub turns messy internal clues into an answer card with likely owner, backup, confidence, and source evidence behind the recommendation.
                  </p>
                </div>
              ) : null}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl rounded-lg px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-[#0054F0] text-white"
                        : "border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-6">{message.text}</p>
                    {message.response ? <AnswerCard response={message.response} onAsk={askQuestion} /> : null}
                  </div>
                </div>
              ))}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    <span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-[#0054F0]" />
                    {thinkingText}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <form onSubmit={onSubmit} className="mx-auto flex max-w-5xl gap-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask: Who owns the Travel Claims API?"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0054F0] focus:ring-4 focus:ring-[#DCEAFF] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-[#6EA2FF] dark:focus:ring-[#06265E]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0054F0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003A8C] disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                <Icon name="send" />
                Ask
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
