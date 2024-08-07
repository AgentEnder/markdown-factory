import {
  blockQuote,
  codeBlock,
  frontMatter,
  h,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ol,
  stripIndents,
  table,
  tableOfContents,
  ul,
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

  describe('headings', () => {
    it('should handle h1', () => {
      const result = h1('Hello World');
      expect(result).toEqual('# Hello World');
    });

    it('should handle h2', () => {
      const result = h2('Hello World');
      expect(result).toEqual('## Hello World');
    });

    it('should handle h3', () => {
      const result = h3('Hello World');
      expect(result).toEqual('### Hello World');
    });

    it('should handle h4', () => {
      const result = h4('Hello World');
      expect(result).toEqual('#### Hello World');
    });

    it('should handle h5', () => {
      const result = h5('Hello World');
      expect(result).toEqual('##### Hello World');
    });

    it('should handle h6', () => {
      const result = h6('Hello World');
      expect(result).toEqual('###### Hello World');
    });

    it('should error for invalid heading levels', () => {
      expect(() => h(7, 'Hello World')).toThrowErrorMatchingInlineSnapshot(
        `
        "Most markdown engines only support heading levels 1-6.
        If you are targetting an environment where this is known to be supported, please open an issue.
        As a temporary bypass, you can set MARKDOWN_FACTORY_NO_CHECKS=true to disable checks."
      `
      );
      expect(() => h(0, 'Hello World')).toThrowErrorMatchingInlineSnapshot(
        `
        "Heading level must be >= 1.
        If you are targetting an environment where this is known to be supported, please open an issue.
        As a temporary bypass, you can set MARKDOWN_FACTORY_NO_CHECKS=true to disable checks."
      `
      );
      process.env['MARKDOWN_FACTORY_NO_CHECKS'] = 'true';
      expect(() => h(7, 'Hello World')).not.toThrow();
      delete process.env['MARKDOWN_FACTORY_NO_CHECKS'];
    });
  });

  describe('unordered lists', () => {
    it('should support singular element', () => {
      expect(ul('Hello World')).toMatchInlineSnapshot(`
        "- Hello World"
      `);
    });

    it('should accept simple arrays', () => {
      expect(ul(['a', 'b', 'c'])).toMatchInlineSnapshot(`
        "- a

        - b

        - c"
        `);
    });

    it('should accept spread arrays', () => {
      expect(ul('a', 'b', 'c')).toMatchInlineSnapshot(`
        "- a

        - b

        - c"
        `);
    });

    it('should obey level for simple arrays', () => {
      expect(ul({ level: 2 }, ['a', 'b', 'c'])).toMatchInlineSnapshot(`
        "	- a

        	- b

        	- c"
        `);
    });

    it('should obey level for spread arrays', () => {
      expect(ul({ level: 2 }, 'a', 'b', 'c')).toMatchInlineSnapshot(`
        "	- a

        	- b

        	- c"
        `);
    });
  });

  describe('ordered lists', () => {
    it('should support singular element', () => {
      expect(ol('Hello World')).toMatchInlineSnapshot(`
        "1. Hello World"
      `);
    });

    it('should accept simple arrays', () => {
      expect(ol(['a', 'b', 'c'])).toMatchInlineSnapshot(`
        "1. a

        2. b

        3. c"
        `);
    });

    it('should accept spread arrays', () => {
      expect(ol('a', 'b', 'c')).toMatchInlineSnapshot(`
        "1. a

        2. b

        3. c"
        `);
    });

    it('should obey options for simple arrays', () => {
      expect(ol({ level: 2, startIdx: 2 }, ['a', 'b', 'c']))
        .toMatchInlineSnapshot(`
        "	2. a

        	3. b

        	4. c"
        `);
    });

    it('should obey options for spread arrays', () => {
      expect(ol({ level: 2, startIdx: 2 }, 'a', 'b', 'c'))
        .toMatchInlineSnapshot(`
        "	2. a

        	3. b

        	4. c"
        `);
    });
  });

  describe('frontMatter', () => {
    const data = {
      title: 'Hello World',
      objectProperty: { a: 1, b: 2 },
      multiline: 'Hello\nWorld',
      list: ['a', 'b', 'c'],
      bool: true,
    };

    it('should handle valid yaml front matter', () => {
      const result = frontMatter(data, 'yaml');
      expect(result).toMatchInlineSnapshot(`
        "---

        title: Hello World
        objectProperty:
          a: 1
          b: 2
        multiline: |-
          Hello
          World
        list:
          - a
          - b
          - c
        bool: true


        ---"
      `);
    });

    it('should handle valid json front matter', () => {
      const result = frontMatter(data, 'json');
      expect(result).toMatchInlineSnapshot(`
        "---

        {
          \\"title\\": \\"Hello World\\",
          \\"objectProperty\\": {
            \\"a\\": 1,
            \\"b\\": 2
          },
          \\"multiline\\": \\"Hello\\\\nWorld\\",
          \\"list\\": [
            \\"a\\",
            \\"b\\",
            \\"c\\"
          ],
          \\"bool\\": true
        }

        ---"
      `);
    });
  });
});
