const { queryString, parse } = require('.');

describe('Object to query string', () => {
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

describe('Query string to object', () => {
  it('should convert a query string to object', () => {
    const query = 'name=Juli&profession=developer';
    expect(parse(query)).toEqual({
      name: 'Juli',
      profession: 'developer',
    });
  });

  it('should convert a query string to single key value pair', () => {
    const query = 'name=Juli';
    expect(parse(query)).toEqual({
      name: 'Juli',
    });
  });

  it('shoud take care of coma to array', () => {
    const query = 'name=Juli&abilities=JS,TDD';

    expect(parse(query)).toEqual({
      name: 'Juli',
      abilities: ['JS', 'TDD'],
    });
  });
});
