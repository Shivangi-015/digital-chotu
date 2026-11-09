import { fetchCatalog } from "@/app/lib/backend";
import { applyCartActions } from "@/app/lib/cart";
import { buildChatResponse } from "@/app/lib/chat-response";
import {
  clearConversationState,
  getConversationState,
  saveConversationState,
  type ConversationState,
} from "@/app/lib/conversation-state";
import {
  buildGeminiPrompt,
  buildGeminiSystemInstruction,
  filterCatalogForMessage,
  parseGeminiShoppingResult,
} from "@/app/lib/gemini-shopping";
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});
let cachedCatalog: Awaited<ReturnType<typeof fetchCatalog>> | null = null;
let lastCatalogFetch = 0;

async function getCatalog() {
  const now = Date.now();

  if (cachedCatalog && now - lastCatalogFetch < 5 * 60 * 1000) {
    return cachedCatalog;
  }

  cachedCatalog = await fetchCatalog();
  lastCatalogFetch = now;

  return cachedCatalog;
}

function getLocalResponse(message: string, state: ConversationState) {
  const text = message.toLowerCase().trim();

  if (["hi", "hello", "hey", "namaste", "namaskar"].includes(text)) {
    return buildChatResponse(state, {
      chotuReply: "Namaste ji! Batayiye, aaj kya mangwana hai?",
      quickReplies: null,
      showSummary: false,
      done: false,
    });
  }

  if (
    [
      "thanks",
      "thank you",
      "thankyou",
      "ok",
      "okay",
      "theek hai",
      "thik hai",
      "acha",
      "achha",
    ].includes(text)
  ) {
    return buildChatResponse(state, {
      chotuReply: "Ji 😊 Aur kuch chahiye?",
      quickReplies: ["No, thanks"],
      showSummary: false,
      done: false,
    });
  }

  if (
    [
      "no",
      "no thanks",
      "nothing",
      "nothing else",
      "aur kuch nahi",
      "aur kuch nahi chahiye",
      "bas",
      "bye",
      "goodbye",
    ].includes(text)
  ) {
    return buildChatResponse(state, {
      chotuReply: "Theek hai ji. Phir milte hain!",
      quickReplies: null,
      showSummary: false,
      done: true,
    });
  }

  return null;
}

function saveAssistantState(
  state: ConversationState,
  chotuReply: string,
  waitingForConfirmation: boolean
) {
  saveConversationState({
    ...state,
    lastAssistantMessage: chotuReply,
    waitingForConfirmation,
  });
}

function buildConfirmedOrderResponse() {
  const emptyState = getConversationState();

  return buildChatResponse(emptyState, {
    chotuReply:
      "Done! Your order is placed. It will reach you soon. Thank you — see you next time!",
    quickReplies: null,
    showSummary: false,
    done: true,
    orderPlaced: true,
  });
}

export async function POST(req: NextRequest) {
  let state = getConversationState();

  try {
    const { userMessage, confirmed } = await req.json();

    if (confirmed) {
      clearConversationState();
      return NextResponse.json(buildConfirmedOrderResponse());
    }

    const localReply = getLocalResponse(userMessage, state);

    if (localReply) {
      saveAssistantState(state, localReply.chotuReply, false);
      return NextResponse.json(localReply);
    }

    const catalog = await getCatalog();

    // Only send the products relevant to this turn instead of the
    // entire catalog — cuts prompt size drastically as the catalog grows.
    const relevantCatalog = filterCatalogForMessage(
      catalog,
      userMessage,
      state.lastAssistantMessage
    );

    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[gemini] sending ${relevantCatalog.length}/${catalog.length} products for message: "${userMessage}"`
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,

      messages: [
        {
          role: "system",
          content: buildGeminiSystemInstruction(catalog),
        },
        {
          role: "user",
          content: buildGeminiPrompt(state, userMessage),
        },
      ],

      response_format: {
        type: "json_object",
      },
    });

    const parsed = parseGeminiShoppingResult(
      completion.choices[0].message.content ?? "{}"
    );

    state = {
      ...state,
      cart: applyCartActions(state.cart, parsed.actions),
      lastAssistantMessage: parsed.chotuReply,
      waitingForConfirmation: parsed.waitingForConfirmation,
    };
    saveConversationState(state);

    return NextResponse.json(
      buildChatResponse(state, {
        chotuReply: parsed.chotuReply,
        quickReplies: parsed.quickReplies,
        showSummary: parsed.showSummary,
        done: parsed.done,
        orderPlaced: false,
      })
    );
  } catch (err: any) {
    console.error("Chat API error:", err);

    let reply =
      "Sorry ji, kuch problem ho gayi. Thodi der baad phir try kariye.";

    if (err?.status === 429) {
      reply = "Main abhi thoda busy hoon 😅 Ek minute baad phir se try kariye.";
    }

    state = getConversationState();

    return NextResponse.json(
      buildChatResponse(state, {
        chotuReply: reply,
        quickReplies: null,
        showSummary: false,
        done: false,
        orderPlaced: false,
      })
    );
  }
}