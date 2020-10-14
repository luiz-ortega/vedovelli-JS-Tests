import Cart from './Cart';

describe('Cart', () => {
    let cart;

    let product = {
        title: 'Adidas running shoes - men',
        price: 35388,
    };

    let product2 = {
        title: 'Adidas running shoes - women',
        price: 41872,
    };

    beforeEach(() => {
        cart = new Cart();
    });

    describe('getTotal()', () => {
        it('should return 0 when getTotal() is executed in a newly created instance', () => {
            expect(cart.getTotal().getAmount()).toEqual(0);
        });

        it('should multiply quantity and price and receive the total amount', () => {
            const item = {
                product,
                quantity: 2,
            };

            cart.add(item);

            expect(cart.getTotal().getAmount()).toEqual(70776);
        });

        it('should ensure no more than one product exists at a time', () => {
            cart.add({
                product,
                quantity: 2,
            });

            cart.add({
                product,
                quantity: 1,
            });

            expect(cart.getTotal().getAmount()).toEqual(35388);
        });

        it('should update total when a product gets included and then removed', () => {
            cart.add({
                product,
                quantity: 2,
            });

            cart.add({
                product: product2,
                quantity: 1,
            });

            cart.remove(product);

            expect(cart.getTotal().getAmount()).toEqual(41872);
        });
    });

    describe('checkout()', () => {
        it('should return an object with the total and the list of items', () => {
            cart.add({
                product,
                quantity: 3,
            });

            cart.add({
                product: product2,
                quantity: 3,
            });

            expect(cart.checkout()).toMatchSnapshot();
        });

        it('should return an object with the total and the list of items when sumary() is called', () => {
            cart.add({
                product,
                quantity: 3,
            });

            cart.add({
                product: product2,
                quantity: 3,
            });

            expect(cart.sumary()).toMatchSnapshot();
            expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
        });

        it('include formatted amount in the summary', () => {
            cart.add({
                product,
                quantity: 5,
            });

            cart.add({
                product: product2,
                quantity: 3,
            });

            expect(cart.sumary().formatted).toEqual('R$3,025.56');
        });

        it('should reset the cart when checkout() is called', () => {
            cart.add({
                product: product2,
                quantity: 3,
            });

            cart.checkout();

            expect(cart.getTotal().getAmount()).toEqual(0);
        });
    });

    describe('special conditions', () => {
        it('should apply percentage discount when quantity above limit is passed', () => {
            const condition = {
                percentage: 30,
                minimun: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 3,
            });

            expect(cart.getTotal().getAmount()).toEqual(74315);
        });

        it('should NOT apply percentage discount when quantity is below or equals to minimun', () => {
            const condition = {
                percentage: 30,
                minimun: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 2,
            });

            expect(cart.getTotal().getAmount()).toEqual(70776);
        });

        it('should apply quantity discount for event quantities', () => {
            const condition = {
                quantity: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 4,
            });

            expect(cart.getTotal().getAmount()).toEqual(70776);
        });

        it('should NOT apply quantity discount for event quantities when condition is not even', () => {
            const condition = {
                quantity: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 1,
            });

            expect(cart.getTotal().getAmount()).toEqual(35388);
        });

        it('should apply quantity discount for odd quantity', () => {
            const condition = {
                quantity: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 5,
            });

            expect(cart.getTotal().getAmount()).toEqual(106164);
        });

        it('should receive two or more conditions and determine/apply the best discount. First case.', () => {
            const condition1 = {
                percentage: 30,
                minimun: 2,
            };

            const condition2 = {
                quantity: 2,
            };

            cart.add({
                product,
                condition: [condition1, condition2],
                quantity: 5,
            });

            expect(cart.getTotal().getAmount()).toEqual(106164);
        });

        it('should receive two or more conditions and determine/apply the best discount. Second case.', () => {
            const condition1 = {
                percentage: 80,
                minimun: 2,
            };

            const condition2 = {
                quantity: 2,
            };

            cart.add({
                product,
                condition: [condition1, condition2],
                quantity: 5,
            });

            expect(cart.getTotal().getAmount()).toEqual(35388);
        });
    });
});
