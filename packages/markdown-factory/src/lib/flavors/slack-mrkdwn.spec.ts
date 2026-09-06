import * as defaultMarkdown from '../markdown';
import slackMrkdwn, {
  blockQuote,
  bold,
  code,
  codeBlock,
  h1,
  h2,
  h3,
  italics,
  lines,
  link,
  MrkdwnString,
  ol,
  strikethrough,
  stripIndents,
  table,
  ul,
} from './slack-mrkdwn';

describe('slack-mrkdwn', () => {
  describe('mrkdwn output', () => {
    it('should use slack syntax for inline formatting', () => {
      expect(bold('foo').toString()).toEqual('*foo*');
      expect(italics('foo').toString()).toEqual('_foo_');
      expect(strikethrough('foo').toString()).toEqual('~foo~');
      expect(link('https://example.com', 'Example').toString()).toEqual(
        '<https://example.com|Example>'
      );
      expect(link('https://example.com').toString()).toEqual(
        '<https://example.com/>'
      );
    });

    it('should behave like a string', () => {
      const value = bold('foo');
      expect(`${value}`).toEqual('*foo*');
      expect(value + '!').toEqual('*foo*!');
      expect(value.length).toEqual(5);
      expect(value == '*foo*').toBe(true);
      expect(JSON.stringify({ value })).toEqual('{"value":"*foo*"}');
    });

    it('should match the default flavor for block level elements', () => {
      const items = [{ name: 'A' }, { name: 'B' }];
      expect(h1('Title', 'body').toString()).toEqual(
        defaultMarkdown.h1('Title', 'body')
      );
      expect(ul('a', 'b').toString()).toEqual(defaultMarkdown.ul('a', 'b'));
      expect(ol({ startIdx: 3 }, 'a', 'b').toString()).toEqual(
        defaultMarkdown.ol({ startIdx: 3 }, 'a', 'b')
      );
      expect(table(items, ['name']).toString()).toEqual(
        defaultMarkdown.table(items, ['name'])
      );
      expect(codeBlock('const a = 1;', 'ts').toString()).toEqual(
        defaultMarkdown.codeBlock('const a = 1;', 'ts')
      );
      expect(blockQuote('a', 'b').toString()).toEqual(
        defaultMarkdown.blockQuote('a', 'b')
      );
    });

    it('should compose nested invocations', () => {
      expect(h1('Title', ul('a', bold('b'))).toString()).toEqual(
        ['# Title', '', '- a', '', '- *b*'].join('\n')
      );
    });

    it('should support the list overloads', () => {
      expect(ul(['a', 'b']).toString()).toEqual(ul('a', 'b').toString());
      expect(ul({ level: 2 }, ['a']).toString()).toEqual('\t- a');
      expect(ul({ level: 2 }, 'a').toString()).toEqual('\t- a');
      expect(ul().toString()).toEqual('');
    });

    it('should not confuse mrkdwn items for a list options object', () => {
      expect(ul(bold('a'), 'b').toString()).toEqual('- *a*\n\n- b');
      expect(ol(bold('a')).toString()).toEqual('1. *a*');
    });

    it('should expose the factory as an object and a default export', () => {
      expect(slackMrkdwn.bold('foo').toString()).toEqual('*foo*');
      expect(slackMrkdwn.h1('Title').toString()).toEqual('# Title');
    });
  });

  describe('ast', () => {
    it('should record nested nodes', () => {
      const result = h1('Title', ul('a'), codeBlock('const a = 1;', 'ts'));
      expect(result).toBeInstanceOf(MrkdwnString);
      expect(result.ast).toMatchObject({
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: 'Title' }],
        section: [
          {
            type: 'list',
            ordered: false,
            children: [
              { type: 'listItem', children: [{ type: 'text', value: 'a' }] },
            ],
          },
          { type: 'code', value: 'const a = 1;', lang: 'ts' },
        ],
      });
    });

    it('should record table headers and rows', () => {
      const items = [
        { name: 'A', age: 1 },
        { name: 'B', age: 2 },
      ];
      const result = table(items, [
        { label: 'Name', field: 'name' },
        'age',
        { label: 'Dog Age', mapFn: (item) => item.age * 7 },
      ]);
      expect(result.ast).toMatchObject({
        type: 'table',
        children: [
          { type: 'tableRow', mrkdwn: 'Name | age | Dog Age' },
          { type: 'tableRow', mrkdwn: 'A | 1 | 7' },
          { type: 'tableRow', mrkdwn: 'B | 2 | 14' },
        ],
      });
      expect(
        result.ast.type === 'table' &&
          result.ast.children[0].children.map((cell) => cell.mrkdwn)
      ).toEqual(['Name', 'age', 'Dog Age']);
    });

    it('should use mdast node names', () => {
      expect(bold('a').ast.type).toEqual('strong');
      expect(italics('a').ast.type).toEqual('emphasis');
      expect(strikethrough('a').ast.type).toEqual('delete');
      expect(code('a').ast.type).toEqual('inlineCode');
      expect(codeBlock('a').ast.type).toEqual('code');
      expect(blockQuote('a').ast.type).toEqual('blockquote');
      expect(lines('a').ast.type).toEqual('root');
      expect(link('https://example.com', 'Example').ast).toMatchObject({
        type: 'link',
        url: 'https://example.com',
        children: [{ type: 'text', value: 'Example' }],
      });
      expect(ol({ startIdx: 3 }, 'a').ast).toMatchObject({
        type: 'list',
        ordered: true,
        start: 3,
      });
    });

    it('should keep the ast of contents passed to tableOfContents', () => {
      const contents = h2('Section 1', 'body');
      const result = slackMrkdwn.tableOfContents(2, contents);
      expect(result.toString()).toEqual(
        defaultMarkdown.tableOfContents(2, contents.toString())
      );
      expect(result.ast).toMatchObject({
        type: 'root',
        children: [
          { type: 'text' },
          {
            type: 'heading',
            depth: 2,
            children: [{ type: 'text', value: 'Section 1' }],
          },
        ],
      });
    });

    it('should treat plain strings as text nodes', () => {
      expect(lines('a', 'b').ast).toMatchObject({
        type: 'root',
        children: [
          { type: 'text', value: 'a' },
          { type: 'text', value: 'b' },
        ],
      });
    });
  });

  describe('asBlockkitBlocks', () => {
    it('should render headings as header blocks', () => {
      expect(h1('Title', 'Body text').asBlockkitBlocks()).toEqual([
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Title', emoji: true },
        },
        { type: 'section', text: { type: 'mrkdwn', text: 'Body text' } },
      ]);
    });

    it('should strip inline formatting from header text', () => {
      expect(h1(lines(bold('Deploy'), code('api'))).asBlockkitBlocks()).toEqual(
        [
          {
            type: 'header',
            text: { type: 'plain_text', text: 'Deploy\n\napi', emoji: true },
          },
        ]
      );
    });

    it('should render deep headings as bold sections', () => {
      expect(h3('Subsection', 'body').asBlockkitBlocks()).toEqual([
        { type: 'section', text: { type: 'mrkdwn', text: '*Subsection*' } },
        { type: 'section', text: { type: 'mrkdwn', text: 'body' } },
      ]);
      expect(h3('Subsection').asBlockkitBlocks({ maxHeaderLevel: 3 })).toEqual([
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Subsection', emoji: true },
        },
      ]);
    });

    it('should truncate long headers', () => {
      const blocks = h1('a'.repeat(200)).asBlockkitBlocks();
      expect(blocks[0]).toEqual({
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${'a'.repeat(149)}…`,
          emoji: true,
        },
      });
    });

    it('should merge adjacent inline content into a single section', () => {
      expect(lines('first', bold('second')).asBlockkitBlocks()).toEqual([
        {
          type: 'section',
          text: { type: 'mrkdwn', text: 'first\n\n*second*' },
        },
      ]);
    });

    it('should render code blocks without the language fence', () => {
      expect(codeBlock('const a = 1;', 'ts').asBlockkitBlocks()).toEqual([
        {
          type: 'section',
          text: { type: 'mrkdwn', text: '```\nconst a = 1;\n```' },
        },
      ]);
    });

    it('should render tables as preformatted text', () => {
      const result = table([{ name: 'A' }], ['name']);
      expect(result.asBlockkitBlocks()).toEqual([
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\`\`\`\n${result.toString()}\n\`\`\``,
          },
        },
      ]);
    });

    it('should render block quotes with slack quote syntax', () => {
      expect(blockQuote('quoted', 'lines').asBlockkitBlocks()).toEqual([
        {
          type: 'section',
          text: { type: 'mrkdwn', text: '> quoted\n>\n> lines' },
        },
      ]);
    });

    it('should render lists with bullets and numbers', () => {
      expect(ul('a', 'b').asBlockkitBlocks()).toEqual([
        { type: 'section', text: { type: 'mrkdwn', text: '• a\n• b' } },
      ]);
      expect(ol({ startIdx: 3 }, 'a', 'b').asBlockkitBlocks()).toEqual([
        { type: 'section', text: { type: 'mrkdwn', text: '3. a\n4. b' } },
      ]);
    });

    it('should indent nested lists', () => {
      const list = ul('a', lines('b', ul({ level: 2 }, 'b1', 'b2')), 'c');
      expect(list.asBlockkitBlocks()).toEqual([
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: ['• a', '• b', '    • b1', '    • b2', '• c'].join('\n'),
          },
        },
      ]);
    });

    it('should keep wrapped item text attached to its bullet', () => {
      expect(ul('line one\nline two').asBlockkitBlocks()).toEqual([
        {
          type: 'section',
          text: { type: 'mrkdwn', text: '• line one\n  line two' },
        },
      ]);
    });

    it('should split sections that exceed the character limit', () => {
      const long = lines(...Array.from({ length: 40 }, () => 'x'.repeat(100)));
      const blocks = long.asBlockkitBlocks();
      expect(blocks.length).toBeGreaterThan(1);
      for (const block of blocks) {
        expect(block.type).toEqual('section');
        expect(
          block.type === 'section' ? block.text.text.length : 0
        ).toBeLessThanOrEqual(3000);
      }
    });

    it('should split a single line that exceeds the character limit', () => {
      const blocks = lines('x'.repeat(7000)).asBlockkitBlocks();
      expect(
        blocks.map((b) => (b.type === 'section' ? b.text.text.length : 0))
      ).toEqual([3000, 3000, 1000]);
    });

    it('should honor the maxSectionLength option', () => {
      const blocks = lines('aaa', 'bbb').asBlockkitBlocks({
        maxSectionLength: 5,
      });
      expect(blocks).toEqual([
        { type: 'section', text: { type: 'mrkdwn', text: 'aaa' } },
        { type: 'section', text: { type: 'mrkdwn', text: 'bbb' } },
      ]);
    });

    it('should skip empty content', () => {
      expect(lines('', '  ').asBlockkitBlocks()).toEqual([]);
      expect(ul().asBlockkitBlocks()).toEqual([]);
    });

    it('should render a full document', () => {
      const message = h1(
        'Deploy finished',
        lines('All services are up.'),
        h2('Services', ul('api', 'web')),
        h2('Logs', codeBlock('done in 4s'))
      );
      expect(message.asBlockkitBlocks()).toEqual([
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Deploy finished', emoji: true },
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: 'All services are up.' },
        },
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Services', emoji: true },
        },
        { type: 'section', text: { type: 'mrkdwn', text: '• api\n• web' } },
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Logs', emoji: true },
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: '```\ndone in 4s\n```' },
        },
      ]);
    });
  });

  describe('asMdast', () => {
    it('should produce an mdast tree', () => {
      const message = h1(
        'Deploy finished',
        `Status: ${bold('green')}`,
        h2('Services', ul('api', lines('web', ul({ level: 2 }, 'ssr'))))
      );
      expect(message.asMdast()).toEqual({
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 1,
            children: [{ type: 'html', value: 'Deploy finished' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'html', value: 'Status: *green*' }],
          },
          {
            type: 'heading',
            depth: 2,
            children: [{ type: 'html', value: 'Services' }],
          },
          {
            type: 'list',
            ordered: false,
            start: null,
            children: [
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'html', value: 'api' }],
                  },
                ],
              },
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'html', value: 'web' }],
                  },
                  {
                    type: 'list',
                    ordered: false,
                    start: null,
                    children: [
                      {
                        type: 'listItem',
                        children: [
                          {
                            type: 'paragraph',
                            children: [{ type: 'html', value: 'ssr' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
    });

    it('should keep inline formatting as mdast phrasing content', () => {
      expect(lines(bold(code('api')), strikethrough('old')).asMdast()).toEqual({
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'strong',
                children: [{ type: 'inlineCode', value: 'api' }],
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              { type: 'delete', children: [{ type: 'html', value: 'old' }] },
            ],
          },
        ],
      });
    });

    it('should convert code blocks, quotes and tables', () => {
      expect(
        codeBlock('const a = 1;', 'ts', { title: 'a.ts' }).asMdast()
      ).toEqual({
        type: 'root',
        children: [
          {
            type: 'code',
            lang: 'ts',
            meta: 'title="a.ts"',
            value: 'const a = 1;',
          },
        ],
      });
      expect(blockQuote('quoted').asMdast()).toEqual({
        type: 'root',
        children: [
          {
            type: 'blockquote',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'html', value: 'quoted' }],
              },
            ],
          },
        ],
      });
      expect(table([{ name: 'A' }], ['name']).asMdast()).toEqual({
        type: 'root',
        children: [
          {
            type: 'table',
            children: [
              {
                type: 'tableRow',
                children: [
                  {
                    type: 'tableCell',
                    children: [{ type: 'html', value: 'name' }],
                  },
                ],
              },
              {
                type: 'tableRow',
                children: [
                  {
                    type: 'tableCell',
                    children: [{ type: 'html', value: 'A' }],
                  },
                ],
              },
            ],
          },
        ],
      });
    });

    it('should render ordered list starts', () => {
      expect(ol({ startIdx: 3 }, 'a').asMdast().children[0]).toMatchObject({
        type: 'list',
        ordered: true,
        start: 3,
      });
    });
  });

  describe('stripIndents', () => {
    it('should strip indents and return a mrkdwn string', () => {
      const result = stripIndents`
        line one
        line two`;
      expect(result).toBeInstanceOf(MrkdwnString);
      expect(result.toString()).toEqual('line one\nline two');
    });
  });

  describe('frontMatter', () => {
    it('should return a mrkdwn string', async () => {
      const result = await slackMrkdwn.frontMatter({ title: 'a' }, 'json');
      expect(result).toBeInstanceOf(MrkdwnString);
      expect(result.toString()).toEqual(
        await defaultMarkdown.frontMatter({ title: 'a' }, 'json')
      );
    });
  });
});
