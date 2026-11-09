export type CartItem = {
  name: string;
  variant: string;
  quantity: number;
  price: number;
};

export interface ConversationState {
  cart: CartItem[];
  lastAssistantMessage: string;
  waitingForConfirmation: boolean;
  lastUpdated: number;
}

const DEMO_SESSION_KEY = "demo-user";

const conversationStates = new Map<string, ConversationState>();

function createInitialState(): ConversationState {
  return {
    cart: [],
    lastAssistantMessage: "",
    waitingForConfirmation: false,
    lastUpdated: Date.now(),
  };
}

export function getConversationState(sessionKey = DEMO_SESSION_KEY) {
  const existingState = conversationStates.get(sessionKey);

  if (existingState) {
    return existingState;
  }

  const initialState = createInitialState();
  conversationStates.set(sessionKey, initialState);
  return initialState;
}

export function saveConversationState(
  state: ConversationState,
  sessionKey = DEMO_SESSION_KEY
) {
  conversationStates.set(sessionKey, {
    ...state,
    cart: state.cart.map((item) => ({ ...item })),
    lastUpdated: Date.now(),
  });
}

export function clearConversationState(sessionKey = DEMO_SESSION_KEY) {
  conversationStates.delete(sessionKey);
}

