import { mount } from '@vue/test-utils';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';
import { CartManager } from '@/managers/CartManager';

describe('CartItem', () => {
  let server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  const mountCartItem = () => {
    const cartManager = new CartManager();

    const product = server.create('product', {
      title: 'Lindo relógio',
      price: '22.33',
    });

    const wrapper = mount(CartItem, {
      propsData: {
        product,
      },
      mocks: {
        $cart: cartManager,
      },
    });

    return { wrapper, product, cartManager };
  };

  it('should mount the component', () => {
    const { wrapper } = mountCartItem();

    expect(wrapper.vm).toBeDefined();
  });

  it('should display product info', () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCartItem();
    const content = wrapper.text();

    expect(content).toContain(title);
    expect(content).toContain(price);
  });

  it('should display product quantity', () => {
    const { wrapper } = mountCartItem();
    const quantity = wrapper.find('[data-testid="quantity"]');

    expect(quantity.text()).toContain('1');
  });

  it('should increase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCartItem();
    const button = wrapper.find('[data-testid="+"]');
    const quantity = wrapper.find('[data-testid="quantity"]');

    await button.trigger('click');
    expect(quantity.text()).toContain('2');
    await button.trigger('click');
    expect(quantity.text()).toContain('3');
    await button.trigger('click');
    expect(quantity.text()).toContain('4');
  });

  it('should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = mountCartItem();
    const buttonIncrease = wrapper.find('[data-testid="+"]');
    const buttonDecrease = wrapper.find('[data-testid="-"]');
    const quantity = wrapper.find('[data-testid="quantity"]');

    await buttonIncrease.trigger('click');
    expect(quantity.text()).toContain('2');
    await buttonIncrease.trigger('click');
    expect(quantity.text()).toContain('3');
    await buttonDecrease.trigger('click');
    expect(quantity.text()).toContain('2');
    await buttonDecrease.trigger('click');
    expect(quantity.text()).toContain('1');
    await buttonDecrease.trigger('click');
    expect(quantity.text()).toContain('0');
  });

  it('should not go below zero when button - is repeatedly clicked', async () => {
    const { wrapper } = mountCartItem();
    const buttonDecrease = wrapper.find('[data-testid="-"]');
    const quantity = wrapper.find('[data-testid="quantity"]');

    await buttonDecrease.trigger('click');
    expect(quantity.text()).toContain('0');
    await buttonDecrease.trigger('click');
    expect(quantity.text()).toContain('0');
  });

  it('should display a button to remove item from cart', () => {
    const { wrapper } = mountCartItem();
    const button = wrapper.find('[data-testid="remove-button"]');

    expect(button.exists()).toBe(true);
  });

  it('should call cart manager removeProduct() when button gets clicked', async () => {
    const { wrapper, cartManager, product } = mountCartItem();
    const spy = jest.spyOn(cartManager, 'removeProduct');

    await wrapper.find('[data-testid="remove-button"]').trigger('click');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product.id);
  });
});
