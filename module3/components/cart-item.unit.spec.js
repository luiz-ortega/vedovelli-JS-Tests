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

  it("should display 1 as initial quantity", () => {
    renderCartItem();

    expect(screen.getByTestId("quantity").textContent).toBe("1");
  });

  it("should increase quantity by 1 when second button is clicked", async () => {
    renderCartItem();

    const [removeButton, firstButton, secondButton] = screen.getAllByRole(
      "button"
    );

    await fireEvent.click(secondButton);

    expect(screen.getByTestId("quantity").textContent).toBe("2");
  });

  it("should descrease quantity by 1 when second button is clicked", async () => {
    renderCartItem();

    const [removeButton, firstButton, secondButton] = screen.getAllByRole(
      "button"
    );

    await fireEvent.click(firstButton);
    await fireEvent.click(secondButton);

    expect(screen.getByTestId("quantity").textContent).toBe("1");
  });

  it("should not go below zero in the quantity", async () => {
    renderCartItem();

    const [firstButton, secondButton] = screen.getAllByRole("button");

    await fireEvent.click(secondButton);
    await fireEvent.click(secondButton);

    await fireEvent.click(firstButton);
    await fireEvent.click(firstButton);
    await fireEvent.click(firstButton);
    await fireEvent.click(firstButton);

    expect(screen.getByTestId("quantity").textContent).toBe("0");
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
});
