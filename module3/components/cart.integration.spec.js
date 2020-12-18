import { renderHook, act } from "@testing-library/react-hooks";
import { screen, render } from "@testing-library/react";
import { useCartStore } from "../store/cart";
import { makeServer } from "../miragejs/server";
import userEvent from "@testing-library/user-event";
import Cart from "./cart";

describe("Cart", () => {
  let server;
  let result;
  let spy;
  let add;
  let toggle;
  let reset;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
    result = renderHook(() => useCartStore()).result;
    add = result.current.actions.add;
    reset = result.current.actions.reset;
    toggle = result.current.actions.toggle;
    spy = jest.spyOn(result.current.actions, "toggle");
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  it("should render Cart", () => {
    render(<Cart />);

    expect(screen.getByTestId("cart")).toBeInTheDocument();
  });
});
