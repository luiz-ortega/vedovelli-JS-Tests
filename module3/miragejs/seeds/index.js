/*
 * Mirage JS guide on Seeds: https://miragejs.com/docs/data-layer/factories#in-development
 */

const usersSeeder = (server) => {
  server.createList('user', 10);
};

const productsSeeder = (server) => {
  server.createList('product', 10);
};

export default function seeds(server) {
  usersSeeder(server);
  productsSeeder(server);
}
