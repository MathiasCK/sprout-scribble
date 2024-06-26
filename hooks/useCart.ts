/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Variant = {
  variantId: number;
  quantity: number;
};

export type CartItem = {
  id: number;
  name: string;
  image: string;
  variant: Variant;
  price: number;
};

export type CartState = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
};

export const useCart = create<CartState>()(
  persist(
    set => ({
      cart: [],
      addToCart: item =>
        set(state => {
          const existingItem = state.cart.find(
            cartItem => cartItem.variant.variantId === item.variant.variantId
          );
          if (existingItem) {
            return {
              cart: state.cart.map(cartItem =>
                cartItem.variant.variantId === item.variant.variantId
                  ? {
                      ...cartItem,
                      variant: {
                        ...cartItem.variant,
                        quantity:
                          cartItem.variant.quantity + item.variant.quantity,
                      },
                    }
                  : cartItem
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              {
                ...item,
                variant: {
                  variantId: item.variant.variantId,
                  quantity: item.variant.quantity,
                },
              },
            ],
          };
        }),
      removeFromCart: item =>
        set(state => {
          const updatedCart = state.cart.map(cartItem => {
            if (cartItem.variant.variantId === item.variant.variantId) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - item.variant.quantity,
                },
              };
            }
            return cartItem;
          });
          return {
            cart: updatedCart.filter(cartItem => cartItem.variant.quantity > 0),
          };
        }),
    }),
    {
      name: "cart-storage",
    }
  )
);
