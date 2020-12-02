/// <reference types="cypress" />;
import { makeServer } from '../../miragejs/server';

context('Store', () => {
  let server;

  const g = cy.get;
  const gid = cy.getByTestId;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should display the store', () => {
    cy.visit('/');

    g('body').contains('Brand');
    g('body').contains('Wrist Watch');
  });

  context('Store -> products List', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('/');
      gid('product-card').should('have.length', 0);
      g('body').contains('0 Products');
    });

    it('should display "1 Products" when 1 product is returned', () => {
      server.create('product');

      cy.visit('/');
      gid('product-card').should('have.length', 1);
      g('body').contains('1 Product');
    });

    it('should display "10 Products" when 10 products are returned', () => {
      server.createList('product', 10);

      cy.visit('/');
      gid('product-card').should('have.length', 10);
      g('body').contains('10 Product');
    });
  });

  context('Store > Search for products', () => {
    it('should type in the search field', () => {
      cy.visit('/');

      g('input[type="search"]')
        .type('Some text here')
        .should('have.value', 'Some text here');
    });

    it('should find product when product name is passed on search field', () => {
      server.createList('product', 10);

      server.create('product', {
        title: 'Relógio bonito',
      });

      cy.visit('/');
      g('input[type="search"]').type('Relógio bonito');
      gid('search-form').submit();
      gid('product-card').should('have.length', 1);
    });

    it('should not return any product', () => {
      server.createList('product', 10);

      cy.visit('/');
      g('input[type="search"]').type('Relógio bonito');
      gid('search-form').submit();
      gid('product-card').should('have.length', 0);
      g('body').contains('0 Products');
    });
  });

  context('Store > Shoping Cart', () => {
    it('should not display shopping cart when page first loads', () => {
      cy.visit('/');

      gid('shopping-cart').should('have.class', 'hidden');
    });

    it('should toogle shopping cart visibility when button is clicked', () => {
      cy.visit('/');

      gid('toggle-button').as('toogleButton');
      g('@toogleButton').click();
      gid('shopping-cart').should('not.have.class', 'hidden');

      g('@toogleButton').click({ force: true });
      gid('shopping-cart').should('have.class', 'hidden');
    });
  });
});
