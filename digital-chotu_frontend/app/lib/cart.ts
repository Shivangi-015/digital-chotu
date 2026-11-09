import type { CartItem } from "./conversation-state";

export type CartAction =
  | {
      type: "add";
      item: CartItem;
    }
  | {
      type: "remove";
      name: string;
      variant?: string;
    }
  | {
      type: "update_quantity";
      name: string;
      variant?: string;
      quantity: number;
      price?: number;
    }
  | {
      type: "update_variant";
      name: string;
      variant?: string;
      newVariant: string;
      price: number;
    };

function itemMatches(item: CartItem, name: string, variant?: string) {
  const sameName = item.name.toLowerCase() === name.toLowerCase();
  const sameVariant = variant
    ? item.variant.toLowerCase() === variant.toLowerCase()
    : true;

  return sameName && sameVariant;
}

function normalizeQuantity(quantity: number) {
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

export function applyCartActions(cart: CartItem[], actions: CartAction[]) {
  return actions.reduce((currentCart, action) => {
    if (action.type === "add") {
      const nextItem = {
        ...action.item,
        quantity: normalizeQuantity(action.item.quantity),
      };
      const existingItem = currentCart.find((item) =>
        itemMatches(item, nextItem.name, nextItem.variant)
      );

      if (!existingItem) {
        return [...currentCart, nextItem];
      }

      return currentCart.map((item) =>
        item === existingItem
          ? { ...item, quantity: item.quantity + nextItem.quantity, price: nextItem.price }
          : item
      );
    }

    if (action.type === "remove") {
      return currentCart.filter(
        (item) => !itemMatches(item, action.name, action.variant)
      );
    }

    if (action.type === "update_quantity") {
      return currentCart.map((item) =>
        itemMatches(item, action.name, action.variant)
          ? {
              ...item,
              quantity: normalizeQuantity(action.quantity),
              price: action.price ?? item.price,
            }
          : item
      );
    }

    if (action.type === "update_variant") {
      return currentCart.map((item) =>
        itemMatches(item, action.name, action.variant)
          ? { ...item, variant: action.newVariant, price: action.price }
          : item
      );
    }

    return currentCart;
  }, cart);
}

export function calculateCartTotal(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.quantity * item.price, 0);
}

