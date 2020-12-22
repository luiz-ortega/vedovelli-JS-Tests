import { fireEvent, render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import userEvent from "@testing-library/user-event";
import { useCartStore } from "../store/cart";
import CartItem from "./cart-item";
import { setAutoFreeze } from "immer";

setAutoFreeze(false);

const product = {
  title: "Relógio bonito",
  price: "22.00",
  image:
    "https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
};

const renderCartItem = () => {
  render(<CartItem product={product} />);
};

describe("CartItem", () => {
  let result;

  beforeEach(() => {
    result = renderHook(() => useCartStore()).result;
  });

  it("should render CartItem", () => {
    renderCartItem();

    expect(screen.getByTestId("cart-item")).toBeInTheDocument();
  });

  it("should display proper content", () => {
    renderCartItem();

    expect(
      screen.getByText(new RegExp(product.title, "i"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(product.price, "i"))
    ).toBeInTheDocument();
    expect(screen.getByTestId("image")).toHaveProperty("src", product.image);
    expect(screen.getByTestId("image")).toHaveProperty("alt", product.title);
  });

  it("should call remove() when remove button is clicled", async () => {
    const result = renderHook(() => useCartStore()).result;
    const spy = jest.spyOn(result.current.actions, "remove");

    renderCartItem();

    const removeButton = screen.getByRole("button", { name: /remove/i });

    await userEvent.click(removeButton);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });

  it("should call increase when increase button is clicked", async () => {
    const spy = jest.spyOn(result.current.actions, "increase");

    renderCartItem();

    const button = screen.getByTestId("increase");

    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });

  it("should call increase when decrease button is clicked", async () => {
    const spy = jest.spyOn(result.current.actions, "decrease");

    renderCartItem();

    const button = screen.getByTestId("decrease");

    await userEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });
});
