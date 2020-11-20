import { mount } from '@vue/test-utils';
import Vue from 'vue';
import ProductCard from '@/components/ProductCard';
import Search from '@/components/Search';
import axios from 'axios';
import { makeServer } from '@/miragejs/server';
import ProductList from '.';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('ProductList - integration', () => {
  let server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  const getProducts = (quantity = 10, overrides = []) => {
    let overrideList = [];

    if (overrides.length > 0) {
      overrideList = overrides.map((override) =>
        server.create('product', override)
      );
    }

    const products = [
      ...server.createList('product', quantity),
      ...overrideList,
    ];

    return products;
  };

  const mountProductList = async (
    quantity = 10,
    overrides = [],
    shouldReject = false
  ) => {
    const products = await getProducts(quantity, overrides);

    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error('')));
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }));
    }

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    return { wrapper, products };
  };

  it('should mount the component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.vm).toBeDefined();
  });

  it('should mount the Search component as a child', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Search)).toBeDefined();
  });

  it('should call axios.get on component mount', () => {
    mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });

  it('should mount the ProductCard component 10 times', async () => {
    const { wrapper } = await mountProductList();

    const cards = wrapper.findAllComponents(ProductCard);
    expect(cards).toHaveLength(10);
  });

  it('should display the error message when Promise rejects', async () => {
    const { wrapper } = await mountProductList(10, [], true);

    expect(wrapper.text()).toContain('Problemas ao carregar a lista');
  });

  it('should filter the product list when a search is performed', async () => {
    // Arrange
    const { wrapper } = await mountProductList(10, [
      {
        title: 'Meu relógio amado',
      },
      {
        title: 'Meu outro relógio estimado',
      },
    ]);

    // Act
    const search = wrapper.findComponent(Search);
    search.find('input[type="search"]').setValue('relógio');

    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('relógio');
    expect(cards).toHaveLength(2);
  });

  it('should filter the product list when a serach term is empty', async () => {
    // Arrange
    const { wrapper } = await mountProductList();

    // Act
    const search = wrapper.findComponent(Search);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');

    search.find('input[type="search"]').setValue('');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('');
    expect(cards).toHaveLength(10);
  });
});