const keyValueToString = ([key, value]) => {
  if (typeof value === 'object' && !Array.isArray(value))
    throw new Error('Please check your params');
  return `${key}=${value}`;
};

module.exports.queryString = (obj) =>
  Object.entries(obj).map(keyValueToString).join('&');

module.exports.parse = (query) =>
  Object.fromEntries(
    query.split('&').map((item) => {
      let [key, value] = item.split('=');
      value = value.indexOf(',') > -1 ? value.split(',') : value;
      return [key, value];
    })
  );
