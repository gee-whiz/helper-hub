"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { type ChatResponse, type ConversationContext } from "@/lib/chat/responseBuilder";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  response?: ChatResponse;
};

const promptSuggestions = [
  { label: "Travel Claims API", question: "Who owns the Travel Claims API?" },
  { label: "Azure approvals", question: "Who can approve Azure subscriptions?" },
  { label: "Kotlin experts", question: "Who knows Kotlin Multiplatform?" },
  { label: "Production access", question: "How do I request production data access?" },
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

function AnswerCard({
  response,
}: {
  response: ChatResponse;
}) {
  const { answer } = response;
  const hasRichAnswer = answer.item && answer.owningTeam;
  const scopeText = answer.scope?.scopeType === "country" ? answer.scope.country : "Global";

  return (
    <div className="mt-3 md:mt-4">
      {hasRichAnswer ? (
        <div className="rounded-lg bg-white p-3 shadow-sm md:border md:border-slate-200 md:p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-slate-950 md:text-lg dark:text-white">
              {answer.item?.label}
            </h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="capitalize">{answer.item?.kind}</span>
              <span aria-hidden="true">·</span>
              <span>{scopeText}</span>
              <span aria-hidden="true">·</span>
              <span>{answer.confidence}% confidence</span>
              {!response.matched ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-700 dark:text-amber-300">Possible match</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-3 space-y-1.5 text-sm leading-5 text-slate-700 dark:text-slate-200">
            <p>
              <span className="font-medium text-slate-950 dark:text-white">Owner team:</span> {answer.owningTeam?.name}
            </p>
            {answer.primaryContact ? (
              <p>
                <span className="font-medium text-slate-950 dark:text-white">Primary:</span> {answer.primaryContact.name} · {answer.primaryContact.role}
              </p>
            ) : null}
            {answer.backupContact ? (
              <p>
                <span className="font-medium text-slate-950 dark:text-white">Backup:</span> {answer.backupContact.name} · {answer.backupContact.role}
              </p>
            ) : null}
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500 md:text-sm dark:text-slate-400">
            {answer.item?.summary}
          </p>

          {answer.evidence?.length || answer.actions?.length ? (
            <div className="mt-3 hidden border-t border-slate-100 pt-3 md:block dark:border-slate-800">
              {answer.evidence?.length ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sources</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {answer.evidence.slice(0, 3).map((source) => (
                      <a
                        key={`${source.type}-${source.title}`}
                        href={source.url}
                        className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 transition hover:text-[#0054F0] dark:bg-slate-900 dark:text-slate-300 dark:hover:text-[#9FC2FF]"
                        title={source.detail}
                      >
                        <Icon name="document" className="size-3" />
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {answer.actions?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {answer.actions.slice(0, 2).map((action) => (
                    <a
                      key={action.label}
                      href={action.url}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0054F0] transition hover:text-[#003A8C] dark:text-[#9FC2FF]"
                    >
                      <Icon name={actionIcon(action.label)} className="size-3.5" />
                      {action.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingText, setThinkingText] = useState(thinkingMessages[0]);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const messageCounter = useRef(0);

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
    <main className="min-h-[100dvh] bg-[#F7F3EF] text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-[100dvh] flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:px-6 md:py-5 lg:w-80 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <div className="flex items-center gap-2 md:gap-3">
                <Image src="/If-logo.svg" alt="If logo" width={32} height={32} priority className="md:size-10" />
                <p className="text-xl font-bold tracking-tight md:text-2xl">If Helper Hub</p>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 md:mt-1 md:text-sm">
                Ask who owns what.
              </p>
            </div>
          </div>

          <div className="mt-3 md:mt-6">
            <p className="hidden text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 md:block">
              Try a prompt
            </p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {promptSuggestions.map((prompt, index) => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() => void askQuestion(prompt.question)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#0054F0] hover:text-[#0054F0] md:px-3 md:py-2 md:text-sm lg:items-start dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#6EA2FF] dark:hover:text-[#9FC2FF] ${
                    index > 1 ? "hidden md:inline-flex" : ""
                  }`}
                >
                  <Icon name="search" className="size-3.5 md:mt-0.5 md:size-4" />
                  <span className="md:hidden">{prompt.label}</span>
                  <span className="hidden md:inline">{prompt.question}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex min-h-0 flex-1 flex-col">
          <header className="hidden border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:block">
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

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3 md:px-4 md:py-6">
            <div className="mx-auto max-w-5xl space-y-3 md:space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl rounded-lg px-3 py-2.5 shadow-sm md:px-4 md:py-3 ${
                      message.role === "user"
                        ? "bg-[#0054F0] text-white"
                        : "bg-white text-slate-800 md:border md:border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-5 md:leading-6">{message.text}</p>
                    {message.response ? <AnswerCard response={message.response} /> : null}
                  </div>
                </div>
              ))}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-white px-3 py-2.5 text-sm text-slate-600 shadow-sm md:border md:border-slate-200 md:px-4 md:py-3 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    <span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-[#0054F0]" />
                    {thinkingText}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 md:static md:p-4 md:pb-[calc(1rem+env(safe-area-inset-bottom))] md:shadow-none">
            <form onSubmit={onSubmit} className="mx-auto flex max-w-5xl gap-2 md:gap-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask: Who owns the Travel Claims API?"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0054F0] focus:ring-4 focus:ring-[#DCEAFF] md:px-4 md:py-3 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-[#6EA2FF] dark:focus:ring-[#06265E]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0054F0] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003A8C] disabled:cursor-not-allowed disabled:bg-slate-300 md:px-5 md:py-3 dark:disabled:bg-slate-700"
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
