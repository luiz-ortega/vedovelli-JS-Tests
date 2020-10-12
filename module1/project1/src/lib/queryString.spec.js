const { queryString, parse } = require('./queryString');

describe('Objet to query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const obj = {
      name: 'Luiz',
      profession: 'Developer',
    };

    expect(queryString(obj)).toBe('name=Luiz&profession=Developer');
  });

  it('should create a valid query string event when an array value is passed', () => {
    const obj = {
      name: 'Luiz',
      abilities: ['JS', 'TDD'],
    };

    expect(queryString(obj)).toBe('name=Luiz&abilities=JS,TDD');
  });

  it('should throw an error when an object is passsed as value', () => {
    const obj = {
      name: 'Luiz',
      abilities: {
        first: 'JS',
        second: 'TDD',
      },
    };

    expect(() => {
      queryString(obj);
    }).toThrowError();
  });
});

describe('Query string to object', () => {
  it('should convert a query string to object', () => {
    const qs = 'name=Luiz&profession=Developer';

    expect(parse(qs)).toEqual({
      name: 'Luiz',
      profession: 'Developer',
    });
  });

  it('should convert a query string of a single key-value pair', () => {
    const qs = 'name=Luiz';

    expect(parse(qs)).toEqual({
      name: 'Luiz',
    });
  });

  it('should convert a query string to an object taking care of coma separating values', () => {
    const qs = 'name=Luiz&abilities=JS,TDD';

    expect(parse(qs)).toEqual({
      name: 'Luiz',
      abilities: ['JS', 'TDD'],
    });
  });
});
