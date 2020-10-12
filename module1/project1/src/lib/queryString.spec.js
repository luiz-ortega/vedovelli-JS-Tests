const { queryString } = require('./queryString');

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
