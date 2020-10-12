const { queryString } = require('./queryString')

describe('Objet to query string', () => {
    it('should create a valida query string when an object is provided', () => {
        const obj = {
            name: 'Luiz',
            profession: 'Developer'
        };

        expect(queryString(obj)).toBe(
            'name=Luiz&profession=Developer'
        );
    });
})