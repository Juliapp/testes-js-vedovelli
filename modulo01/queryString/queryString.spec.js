const { queryString } = require('.');

describe('Object query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const obj = {
      name: 'Juli',
      profession: 'developer',
    };

    expect(queryString(obj)).toBe('name=Juli&profession=developer');
  });
});
