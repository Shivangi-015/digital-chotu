import { calculateCartTotal } from "./cart";
import type { CartItem, ConversationState } from "./conversation-state";

export type ChatApiResponse = {
  chotuReply: string;
  quickReplies: string[] | null;
  cart: CartItem[];
  cartTotal: number;
  showSummary: boolean;
  done: boolean;
  orderPlaced?: boolean;
};

export function buildChatResponse(
  state: ConversationState,
  response: Omit<ChatApiResponse, "cart" | "cartTotal">
): ChatApiResponse {
  return {
    ...response,
    cart: state.cart,
    cartTotal: calculateCartTotal(state.cart),
  };
}

