import { blockQuote, h1, h2, h3, table } from './markdown';

describe('markdown', () => {
  describe('table', () => {
    it('should handle simple fields');
    const items = [
      { name: 'A', age: 1 },
      { name: 'B', age: 2 },
      { name: 'C', age: 3 },
    ];
    const result = table(items, ['name', 'age']);
    expect(result).toEqual(
      `| name | age |
| ---- | --- |
| A    | 1   |
| B    | 2   |
| C    | 3   |`
    );
  });

  it('should handle mapped fields', () => {
    const items = [
      { name: 'A', age: 1, address: { city: 'A City' } },
      { name: 'B', age: 2, address: { city: 'B City' } },
      { name: 'C', age: 3, address: { city: 'C City' } },
    ];
    const result = table(items, [
      'name',
      'age',
      { label: 'City', mapFn: (item) => item.address.city },
    ]);
    expect(result).toEqual(
      `| name | age | City   |
| ---- | --- | ------ |
| A    | 1   | A City |
| B    | 2   | B City |
| C    | 3   | C City |`
    );
  });

  it('should handle relabled fields', () => {
    const items = [
      { name: 'A', age: 1 },
      { name: 'B', age: 2 },
      { name: 'C', age: 3 },
    ];
    const result = table(items, [
      { label: 'First Name', field: 'name' },
      'age',
    ]);
    expect(result).toEqual(
      `| First Name | age |
| ---------- | --- |
| A          | 1   |
| B          | 2   |
| C          | 3   |`
    );
  });

  describe('blockQuote', () => {
    it('should handle simple blockquote', () => {
      const result = blockQuote('Hello World');
      expect(result).toEqual('> Hello World');
    });

    it('should handle multiline blockquote', () => {
      const result = blockQuote(`Hello World
This is a multiline blockquote`);

      expect(result).toEqual(`> Hello World
> This is a multiline blockquote`);
    });
  });

  describe('nesting', () => {
    it('should handle nested headers', () => {
      expect(
        h1(
          'Level 1 - 1',
          h2('Level 2 - 1', h3('Level 3 - 1'), h3('Level 3 - 2')),
          h2('Level 2 - 2', h3('Level 3 - 3'), h3('Level 3 - 4'))
        )
      ).toEqual(`# Level 1 - 1

## Level 2 - 1

### Level 3 - 1

### Level 3 - 2

## Level 2 - 2

### Level 3 - 3

### Level 3 - 4`);
    });
  });
});
