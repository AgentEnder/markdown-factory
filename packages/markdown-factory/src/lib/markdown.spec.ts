import {
  blockQuote,
  codeBlock,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  stripIndents,
  table,
  tableOfContents,
} from './markdown';

describe('markdown', () => {
  describe('table', () => {
    it('should handle simple fields');
    const items = [
      { name: 'A', age: 1 },
      { name: 'B', age: 2 },
      { name: 'C', age: 3 },
    ];
    const result = table(items, ['name', 'age']);
    expect(result).toEqual(stripIndents`
      | name | age |
      | ---- | --- |
      | A    | 1   |
      | B    | 2   |
      | C    | 3   |`);

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
        stripIndents`
          | name | age | City   |
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
        stripIndents`
        | First Name | age |
        | ---------- | --- |
        | A          | 1   |
        | B          | 2   |
        | C          | 3   |`
      );
    });
  });

  describe('blockQuote', () => {
    it('should handle simple blockquote', () => {
      const result = blockQuote('Hello World');
      expect(result).toEqual('> Hello World');
    });

    it('should handle multiline blockquote', () => {
      const result = blockQuote(`Hello World
This is a multiline blockquote`);

      expect(result).toEqual(stripIndents`
      > Hello World
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

  describe('tableOfContents', () => {
    it('should handle simple table of contents', () => {
      const result = tableOfContents(2, h2('Level 2 - 1'), h2('Level 2 - 2'));
      expect(result).toEqual(stripIndents`
    1. [Level 2 - 1](#level-2---1)
    
    2. [Level 2 - 2](#level-2---2)
    
    ## Level 2 - 1

    ## Level 2 - 2`);
    });

    it('should ignore headers within code blocks', () => {
      const result = tableOfContents(
        2,
        h2(
          'Level 2 - 1',
          codeBlock(
            stripIndents`
              # This is a header
              ## This is a subheader
              ### This is a sub sub header`,
            'markdown'
          )
        ),
        h2('Level 2 - 2')
      );
      expect(result).toEqual(stripIndents`
    1. [Level 2 - 1](#level-2---1)
    
    2. [Level 2 - 2](#level-2---2)
    
    ## Level 2 - 1

    \`\`\`markdown
    # This is a header
    ## This is a subheader
    ### This is a sub sub header
    \`\`\`

    ## Level 2 - 2`);
    });

    it('should ignore headers within block quotes', () => {
      const result = tableOfContents(
        2,
        h2(
          'Level 2 - 1',
          blockQuote(
            h1('Quoted level 1'),
            h2('Quoted level 2'),
            h3('Quoted level 3'),
            h4('Quoted level 4')
          )
        ),
        h2('Level 2 - 2')
      );
      expect(result).toEqual(stripIndents`
    1. [Level 2 - 1](#level-2---1)
    
    2. [Level 2 - 2](#level-2---2)
    
    ## Level 2 - 1

    > # Quoted level 1
    >
    > ## Quoted level 2
    >
    > ### Quoted level 3
    >
    > #### Quoted level 4

    ## Level 2 - 2`);
    });

    it('should handle full-depth headers', () => {
      const result = tableOfContents(
        6,
        h1(
          'Title',
          h2(
            'Level 2 - 1',
            h3('Level 3 - 1', h4('Level 4', h5('Level 5', h6('Level 6')))),
            h3('Level 3 - 2', h4('Level 4', h5('Level 5', h6('Level 6'))))
          )
        )
      );
      expect(result).toMatchInlineSnapshot(`
        "1. [Title](#title)

        	1. [Level 2 - 1](#level-2---1)

        		1. [Level 3 - 1](#level-3---1)

        			1. [Level 4](#level-4)

        				1. [Level 5](#level-5)

        					1. [Level 6](#level-6)

        		2. [Level 3 - 2](#level-3---2)

        			1. [Level 4](#level-4)

        				1. [Level 5](#level-5)

        					1. [Level 6](#level-6)

        # Title

        ## Level 2 - 1

        ### Level 3 - 1

        #### Level 4

        ##### Level 5

        ###### Level 6

        ### Level 3 - 2

        #### Level 4

        ##### Level 5

        ###### Level 6"
      `);
    });
    
    it('should handle depth-limited headers', () => {
      const result = tableOfContents(
        3,
        h1(
          'Title',
          h2(
            'Level 2 - 1',
            h3('Level 3 - 1', h4('Level 4', h5('Level 5', h6('Level 6')))),
            h3('Level 3 - 2', h4('Level 4', h5('Level 5', h6('Level 6'))))
          )
        )
      );
      expect(result).toMatchInlineSnapshot(`
        "1. [Title](#title)

        	1. [Level 2 - 1](#level-2---1)

        		1. [Level 3 - 1](#level-3---1)

        		2. [Level 3 - 2](#level-3---2)

        # Title

        ## Level 2 - 1

        ### Level 3 - 1

        #### Level 4

        ##### Level 5

        ###### Level 6

        ### Level 3 - 2

        #### Level 4

        ##### Level 5

        ###### Level 6"
      `);
    });
  });
});
