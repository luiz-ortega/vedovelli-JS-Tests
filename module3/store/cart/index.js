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
      remove(product) {
        setState(({ state }) => {
          const exists = !!state.products.find(({ id }) => id === product.id);

          if (exists) {
            state.products = state.products.filter(({ id }) => {
              return id !== product.id;
            });
          }
        });
      },
      removeAll() {
        setState(({ state }) => {
          state.products = [];
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
