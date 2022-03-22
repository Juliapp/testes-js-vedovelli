import find from 'lodash/find';
import remove from 'lodash/remove';
import Dinero from 'dinero.js';

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (amount, { condition, quantity }) => {
  if (quantity > condition?.minimum) {
    return amount.percentage(condition.percentage);
  }
  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (amount, { condition, quantity }) => {
  const isEven = quantity % 2 === 0;

  if (quantity > condition?.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
};

const calculateAndCompareDiscount = (best, func, quantity, cond, amount) => {
  let current = func(amount, { condition: cond, quantity });
  return best.getAmount() > current.getAmount() ? best : current;
};

const calculateDiscount = (amount, item) => {
  const { quantity, condition } = item;
  const list = Array.isArray(condition) ? condition : [condition];
  let theBestDiscount = Money({ amount: 0 });

  list.map((cond) => {
    let func;

    if (cond?.percentage) func = calculatePercentageDiscount;
    else func = calculateQuantityDiscount;

    theBestDiscount = calculateAndCompareDiscount(
      theBestDiscount,
      func,
      quantity,
      cond,
      amount
    );
  });

  return theBestDiscount;
};

export default class Cart {
  products = [];

  add(item) {
    const itemToBeFind = { product: item.product };

    if (find(this.products, itemToBeFind)) this.remove(itemToBeFind);

    this.products.push(item);
  }

  remove(item) {
    remove(this.products, item);
  }

  getTotal() {
    return this.products.reduce((acc, item) => {
      const amount = Money({ amount: item.quantity * item.product.price });

      let discount = Money({ amount: 0 });

      if (item.condition) {
        discount = calculateDiscount(amount, item);
      }

      // if (item.condition?.percentage) {
      //   discount = calculatePercentageDiscount(amount, item);
      // } else if (item.condition?.quantity) {
      //   discount = calculateQuantityDiscount(amount, item);
      // }

      return acc.add(amount).subtract(discount);
    }, Money({ amount: 0 }));
  }

  summary() {
    return {
      total: this.getTotal().getAmount(),
      items: this.products,
    };
  }

  checkout() {
    const { total, items } = this.summary();

    this.products = [];

    return { total, items };
  }
}
