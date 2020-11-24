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

    return this.state;
  }

  close() {
    this.state.open = false;

    return this.state;
  }

  productIsInTheCart(product) {
    return !!this.state.items.find(({ id }) => id === product.id);
  }

  addProduct(product) {
    if (!this.productIsInTheCart(product)) {
      this.state.items.push(product);
    }

    return this.state;
  }

  removeProduct(id) {
    const index = this.state.items.findIndex((product) => product.id === id);
    this.state.items.splice(index, 1);

    return this.state;
  }
}
