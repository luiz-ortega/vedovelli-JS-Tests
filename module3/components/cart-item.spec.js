import { fireEvent, render, screen } from "@testing-library/react";
import CartItem from "./cart-item";

const product = {
  title: "Relógio bonito",
  price: "22.00",
  image:
    "https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
};

const renderCartItem = () => {
  render(<CartItem product={product} addToCart={addToCart} />);
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
});
