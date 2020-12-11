import { Server } from "miragejs";

const products = [
  {
    title: "Relógio bonito",
    price: "22.00",
    image:
      "https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
  },
];

export const makeServer = ({ environment = "development" } = {}) => {
  return new Server({
    environment,
    routes() {
      this.namespace = "api";
      this.get("products", () => ({
        products,
      }));
    },
  });
};
