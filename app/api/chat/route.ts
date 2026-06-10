import { generateResponse, type ConversationContext } from "@/lib/chat/responseBuilder";

type ChatRequest = {
  message?: string;
  context?: ConversationContext;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ChatRequest;
  const message = body.message?.trim();

  if (!message) {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }

  return Response.json(generateResponse(message, body.context));
}
