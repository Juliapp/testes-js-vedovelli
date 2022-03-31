const keyValueToString = ([key, value]) => {
  if (typeof value === 'object' && !Array.isArray(value))
    throw new Error('Please check your params');
  return `${key}=${value}`;
};

export function queryString(obj) {
  return Object.entries(obj).map(keyValueToString).join('&');
}

export function parse(query) {
  return Object.fromEntries(
    query.split('&').map((item) => {
      let [key, value] = item.split('=');
      value = value.indexOf(',') > -1 ? value.split(',') : value;
      return [key, value];
    })
  );
}
