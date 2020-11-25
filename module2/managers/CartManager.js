import Vue from 'vue';

const initialState = {
  open: false,
  items: [],
};

export class CartManager {
  state;

  constructor() {
    this.state = Vue.observable(initialState);
  }

  open() {
    this.state.open = true;

    return this.getState();
  }

  close() {
    this.state.open = false;

    return this.getState();
  }

  getState() {
    return this.state;
  }

  productIsInTheCart(product) {
    return !!this.state.items.find(({ id }) => id === product.id);
  }

  hasProducts() {
    return this.state.items.length > 0;
  }

  addProduct(product) {
    if (!this.productIsInTheCart(product)) {
      this.state.items.push(product);
    }

    return this.getState();
  }

  removeProduct(productId) {
    this.state.items = [
      ...this.state.items.filter((product) => product.id !== productId),
    ];

    return this.getState();
  }

  clearProducts() {
    this.state.items = [];
    this.state.open = false;

    return this.getState();
  }
}
