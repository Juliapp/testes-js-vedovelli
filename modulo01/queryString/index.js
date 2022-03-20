module.exports.queryString = (obj) =>
  Object.entries(obj)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
