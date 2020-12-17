import { renderHook, act } from "@testing-library/react-hooks";
import { useCartStore } from ".";

describe("Cart", () => {
  it("should return open equals false on initial state", () => {
    const { result } = renderHook(() => useCartStore());

    expect(result.current.state.open).toBe(false);
  });

  it("should return an empty array for products on initial state", () => {
    const { result } = renderHook(() => useCartStore());

    expect(Array.isArray(result.current.state.products)).toBe(true);
    expect(result.current.state.products).toHaveLength(0);
  });

  it("should toggle open state", () => {
    const { result } = renderHook(() => useCartStore());

    const {
      actions: { toggle },
    } = result.current;

    expect(result.current.state.open).toBe(false);

    act(() => toggle());
    expect(result.current.state.open).toBe(true);

    act(() => toggle());
    expect(result.current.state.open).toBe(false);
  });
});
