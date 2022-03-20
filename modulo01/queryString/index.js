module.exports.queryString = (obj) =>
  Object.entries(obj)
    .map(([key, val]) => {
      if (typeof val === 'object' && !Array.isArray(val))
        throw new Error('Please check your params');
      return `${key}=${val}`;
    })
    .join('&');
