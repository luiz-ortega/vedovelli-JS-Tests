import create from "zustand";
import produce from "immer";

const initialState = {
  open: false,
  products: [],
};

const addProduct = (store, product) => {
  if (
    store.state.products.find(
      (storedProduct) => storedProduct.id === product.id
    )
  ) {
    return store.state.products;
  }

  return [...store.state.products, product];
};

export const useCartStore = create((set) => {
  const setState = (fn) => set(produce(fn));

  return {
    state: {
      ...initialState,
    },
    actions: {
      toggle() {
        setState(({ state }) => {
          state.open = !state.open;
        });
      },
      reset() {
        setState((store) => {
          store.state = initialState;
        });
      },
      add(product) {
        setState((store) => {
          store.state = {
            open: true,
            products: addProduct(store, product),
          };
        });
      },
    },
  };
});
