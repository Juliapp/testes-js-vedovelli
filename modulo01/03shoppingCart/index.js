import find from 'lodash/find';
import remove from 'lodash/remove';
import Dinero from 'dinero.js';

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

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
      let discount = amount.percentage(0);

      if (
        item.condition &&
        item.condition.percentage &&
        item.quantity > item.condition.minimum
      ) {
        discount = amount.percentage(item.condition.percentage);
      }

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
