import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import Search from '@/components/Search';
import ProductList from '.';

describe('ProductList - integration', () => {
  it('should mount the component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.vm).toBeDefined();
  });

  it('should mount the Search component as a child', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Search)).toBeDefined();
  });

  it('should mount the ProductCard component 10 times', () => {
    const wrapper = mount(ProductList);
    const cards = wrapper.findAllComponents(ProductCard);
    expect(cards).toHaveLength(10);
  });
});
