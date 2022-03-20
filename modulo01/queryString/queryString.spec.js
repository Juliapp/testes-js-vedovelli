const { queryString } = require('.');

describe('Object query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const obj = {
      name: 'Juli',
      profession: 'developer',
    };

    expect(queryString(obj)).toBe('name=Juli&profession=developer');
  });

  it('should create a valid query string even when array is passed as value', () => {
    const obj = {
      name: 'Juli',
      profession: 'developer',
      abilities: ['JS', 'TDD'],
    };

    expect(queryString(obj)).toBe(
      'name=Juli&profession=developer&abilities=JS,TDD'
    );
  });

  it('should throw an error when an object is passed as value', () => {
    const obj = {
      name: 'Juli',
      abilities: {
        first: 'JS',
        second: 'TDD',
      },
    };

    expect(() => queryString(obj)).toThrowError();
  });
});
