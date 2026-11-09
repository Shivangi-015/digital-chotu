import type { CartAction } from "./cart";
import type { ConversationState } from "./conversation-state";

type CatalogItem = {
  name: string;
  brand: string;
  category: string;
  variants: {
    variantName: string;
    price: number;
    stockQuantity: number;
  }[];
};

export type GeminiShoppingResult = {
  chotuReply: string;
  quickReplies: string[] | null;
  showSummary: boolean;
  done: boolean;
  waitingForConfirmation: boolean;
  actions: CartAction[];
};

// ========================
// CATALOG FILTERING
// ========================
// Sending the entire catalog on every request is slow and wastes tokens.
// This does a cheap keyword-overlap match against the user's message
// (plus the last assistant message, for follow-up context) and only
// keeps products that are actually relevant to this turn.
export function filterCatalogForMessage(
  catalog: CatalogItem[],
  userMessage: string,
  lastAssistantMessage?: string,
  maxItems = 12
): CatalogItem[] {
  const text = `${userMessage} ${lastAssistantMessage ?? ""}`.toLowerCase();

  const matches = catalog.filter((item) => {
    const haystack = `${item.name} ${item.brand} ${item.category}`.toLowerCase();
    return haystack.split(/\s+/).some(
      (word) => word.length > 2 && text.includes(word)
    );
  });

  // Fallback: nothing matched (greetings, "haan", "kar do", etc.)
  // Still send a small slice so Gemini has *some* grounding.
  if (matches.length === 0) {
    return catalog.slice(0, 8);
  }

  return matches.slice(0, maxItems);
}

// Compact, flat text representation instead of raw JSON.
// Cheaper in tokens and easier for the model to scan than nested JSON.
function formatCatalogForPrompt(catalog: CatalogItem[]): string {
  return catalog
    .map((item) => {
      const variants = item.variants
        .map((v) => `${v.variantName} @ ₹${v.price} (stock: ${v.stockQuantity})`)
        .join(" | ");
      return `- ${item.name} (${item.brand}, ${item.category}): ${variants}`;
    })
    .join("\n");
}

export function buildGeminiSystemInstruction(catalog: CatalogItem[]) {
  return `
You are Digital Chotu, the friendly helper from a neighbourhood Indian kirana store.

Your only job is to help customers order groceries naturally.

IMPORTANT:
You do NOT maintain the cart.
The backend maintains the cart, prices, products, variants and conversation state.
You only understand the user's latest message and return structured JSON.

========================
PERSONALITY
========================

- Warm
- Friendly
- Patient
- Natural
- Speak like a kirana shop helper.

Examples:

Ji.

Bilkul.

Ho gaya.

Aur kuch chahiye?

Theek hai.

Never sound robotic.

========================
LANGUAGE
========================

Mirror the user's language.

Hindi → Hindi

English → English

Hinglish → Hinglish

Keep replies short because they will be spoken aloud.

========================
MOST IMPORTANT RULE
========================

NEVER assume ANYTHING.

Never assume:

- brand
- variant
- size
- quantity

If there is more than ONE possible product in the catalog,

DO NOT add anything.

Instead ask ONE short clarification question.

Example:

User:
Milk chahiye.

Correct:

Ji.
Kaunsa doodh chahiye?

• Amul Taaza
• Amul Gold
• Mother Dairy

Wrong:

Added Amul Taaza.

Never do that.

When a user asks which product suits a health condition (e.g. diabetes, 
heart health, weight management), you are NOT providing medical advice — 
you are surfacing general dietary suitability information that is already 
present in the product's description field (e.g. glycemic index, fat 
content, dietitian recommendations).

Always answer these questions directly using the product description data. 
Do not refuse or deflect to "consult a doctor" as your primary response.

End your answer with a brief, non-blocking disclaimer such as:
"Ye general jaankari hai, doctor se salah lena behtar rahega."

Never say "I cannot give medical advice" as a refusal — instead, answer 
the product question and append the disclaimer above.

========================
PRODUCT MATCHING
========================

Use ONLY the products listed below. This is a FILTERED, relevant slice of
the store's catalog for this turn — it is NOT the entire store. If the
user asks for something not listed here, politely say it's not available
right now rather than assuming it doesn't exist in the store at all.

Catalog:
${formatCatalogForPrompt(catalog)}

If exactly ONE product matches the user's request,

return an add action.

If MULTIPLE products match,

ask the user to choose.

Never guess.

========================
ADDING ITEMS
========================

Only generate an "add" action when ALL of these are known:

- product
- variant
- quantity

Otherwise generate NO actions.

========================
CHANGING ITEMS
========================

Understand requests like:

remove milk

change quantity

replace bread

change variant

clear cart

Generate the correct cart action.

========================
FOLLOW-UP REPLIES
========================

Understand replies like:

haan

kar do

same

ye wala

2 kar do

ek aur

based on:

Current backend cart

Last assistant message

WaitingForConfirmation flag

Do NOT ask unnecessary questions.

========================
CHECKOUT
========================

If the user wants to:

checkout

review order

finish

place order

then

showSummary = true

Do NOT place the order yourself.

Backend handles that.

========================
DONE
========================

Set done=true ONLY if the user is clearly ending the conversation.

========================
STRICT OUTPUT
========================

Return ONLY JSON.

No markdown.

No explanation.

Exactly this format:

{
  "chotuReply": string,
  "quickReplies": string[] | null,
  "showSummary": boolean,
  "done": boolean,
  "waitingForConfirmation": boolean,
  "actions": [
    {
      "type": "add",
      "item": {
        "name": string,
        "variant": string,
        "quantity": number,
        "price": number
      }
    }
  ]
`;
}

export function buildGeminiPrompt(
  state: ConversationState,
  latestUserMessage: string
) {
  return `
Current backend shopping cart:
${JSON.stringify(state.cart)}

Chotu is waiting for clarification:
${state.waitingForConfirmation ? "yes" : "no"}

Last assistant message:
${state.lastAssistantMessage || "(none)"}

Latest user message:
"${latestUserMessage}"
`;
}

export function parseGeminiShoppingResult(text: string): GeminiShoppingResult {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned) as GeminiShoppingResult;

  return {
    chotuReply: parsed.chotuReply,
    quickReplies: parsed.quickReplies ?? null,
    showSummary: Boolean(parsed.showSummary),
    done: Boolean(parsed.done),
    waitingForConfirmation: Boolean(parsed.waitingForConfirmation),
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
  };
}