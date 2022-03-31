import Cart from '.';

describe('Cart', () => {
  let cart;

  let product = {
    title: 'Adidas running shoes - men',
    price: 353_88,
  };

  let product2 = {
    title: 'Adidas running shoes  - women',
    price: 418_72,
  };

  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created Cart instance', () => {
      expect(cart.getTotal().getAmount()).toEqual(0);
    });

    it('should multiply quantity and price and receive the total amount', () => {
      cart.add({ product, quantity: 2 });
      expect(cart.getTotal().getAmount()).toEqual(353_88 * 2);
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

      expect(cart.getTotal().getAmount()).toEqual(353_88 * 1);
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

      cart.remove({ product });

      expect(cart.getTotal().getAmount()).toEqual(418_72 * 1);
    });
  });

  describe('checkout', () => {
    it('should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 3,
      });

      // Create the external folder __snapshots__ and put result in there.
      // If something changes it will shows on the terminal
      expect(cart.checkout()).toMatchSnapshot();

      //   expect(cart.checkout()).toMatchInlineSnapshot(`
      //     Object {
      //       "items": Array [
      //         Object {
      //           "product": Object {
      //             "price": 35388,
      //             "title": "Adidas running shoes - men",
      //           },
      //           "quantity": 2,
      //         },
      //         Object {
      //           "product": Object {
      //             "price": 41872,
      //             "title": "Adidas running shoes  - women",
      //           },
      //           "quantity": 3,
      //         },
      //       ],
      //       "total": 196392,
      //     }
      //  `);
    });

    it('should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 3,
      });

      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
    });

    it('should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 3,
      });
      expect(cart.summary().formatted).toBe('R$1,963.92');
    });

    it('should return an object with the total and the list of items', () => {
      cart.add({
        product: product2,
        quantity: 3,
      });

      cart.checkout();

      expect(cart.getTotal().getAmount()).toEqual(0);
    });
  });

  describe('specical conditions', () => {
    it('should apply percentage discount quantity above minimum is passage', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 3,
      });

      expect(cart.getTotal().getAmount()).toEqual(74315);
    });

    it('should NOT apply percentage discount quantity below minimum', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 2,
      });

      expect(cart.getTotal().getAmount()).toEqual(353_88 * 2);
    });

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 4,
      });

      expect(cart.getTotal().getAmount()).toEqual(353_88 * 2);
    });

    it('should NOT apply quantity discount for even quantities when condition is not reached', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 1,
      });

      expect(cart.getTotal().getAmount()).toEqual(353_88);
    });

    it('should apply quantity discount for odd quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toEqual(353_88 * 5 * 0.6);
    });

    it('should receive 2 or more conditions and determinate the more advantageous', () => {
      const condition2 = {
        quantity: 2,
      };

      const condition1 = {
        percentage: 30,
        quantity: 2,
      };

      const condition3 = {
        quantity: 10,
      };

      cart.add({
        product,
        condition: [condition1, condition2, condition3],
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toEqual(353_88 * 5 * 0.6);
    });
  });
});
