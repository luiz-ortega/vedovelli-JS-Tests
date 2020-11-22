import { CartManager } from '@/managers/CartManager';

describe('CartManager', () => {
  it('should set cart to open', () => {
    const manager = new CartManager();
    const state = manager.open();

    expect(state.open).toBe(true);
  });

  it('should set cart to closed', () => {
    const manager = new CartManager();
    const state = manager.close();

    expect(state.open).toBe(false);
  });

  it.todo('should add product to the cart only once');

  it.todo('should remove product from the cart');

  it.todo('should clear products');

  it.todo('should return true if cart is not empty');

  it.todo('should return true if product is already in the cart');
});
