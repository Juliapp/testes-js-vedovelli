import Dinero from 'dinero.js';
const Money = Dinero;

export const calculatePercentageDiscount = (
  amount,
  { condition, quantity }
) => {
  if (quantity > condition?.minimum) {
    return amount.percentage(condition.percentage);
  }
  return Money({ amount: 0 });
};

export const calculateQuantityDiscount = (amount, { condition, quantity }) => {
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

export const calculateDiscount = (amount, item) => {
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
