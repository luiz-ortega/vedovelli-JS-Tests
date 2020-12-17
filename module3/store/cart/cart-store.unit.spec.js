import { renderHook, act } from "@testing-library/react-hooks";
import { useCartStore } from ".";
import { makeServer } from "../../miragejs/server";

describe("Cart store", () => {
  let server;
  let result;
  let add;
  let toggle;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
    result = renderHook(() => useCartStore()).result;
    add = result.current.actions.add;
    toggle = result.current.actions.toggle;
  });

  afterEach(() => {
    server.shutdown();
    act(() => result.current.actions.reset());
  });

  it("should return open equals false on initial state", () => {
    expect(result.current.state.open).toBe(false);
  });

  it("should return an empty array for products on initial state", () => {
    expect(Array.isArray(result.current.state.products)).toBe(true);
    expect(result.current.state.products).toHaveLength(0);
  });

  it("should add 2 products to the list", () => {
    const products = server.createList("product", 2);

    for (const product of products) {
      act(() => add(product));
    }

    expect(result.current.state.products).toHaveLength(2);
  });

  it("should toggle open state", () => {
    expect(result.current.state.open).toBe(false);

    act(() => toggle());
    expect(result.current.state.open).toBe(true);

    act(() => toggle());
    expect(result.current.state.open).toBe(false);
  });
});
