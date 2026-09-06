import { writeFileSync } from 'fs';
import { join } from 'path';
import {
  blockQuote,
  codeBlock,
  h1,
  h2,
  h3,
  link,
  linkToHeader,
  orderedList,
  stripIndents,
  table,
  tableOfContents,
  unorderedList,
} from '../packages/markdown-factory/src/lib/markdown';

export const contents = tableOfContents(
  3,
  h1(
    'Markdown Factory',
    'Utilities to easily generate valid markdown from within JavaScript',
    // 3,
    h2(
      `Why?`,
      'For static content, this library is **mostly** unnecessary. However, when generating a report from a dynamic data source this library can be rather useful. ',
      `An example of using this library for dynamic data, could be the implementation of the \`tableOfContents\` function. Inside it, we parse the headings and then use the utils to generate an appropriate table of contents. You can read more about it here: ${linkToHeader(
        'tableOfContents',
        '`tableOfContents`'
      )}`
    ),
    h2(
      'Getting Started',
      h3('Installation', 'npm install markdown-factory'),
      h3(
        'Usage',
        'Import the functions you need from markdown-factory, they are named based on the markdown they generate. For the most part, they take text content as the first argument, and any additional arguments are treated as sub-elements.',
        codeBlock(
          stripIndents`
        import { h1, h2, h3 } from 'markdown-factory';
        h1('Hello World', h2('subheading', h3('sub-subheading', 'foo-bar')))`,
          'typescript'
        )
      )
    ),
    h2(
      'Examples',
      'Some advanced usages of the library can be found below:',
      unorderedList(
        `The ${link(
          './tools/generate-readme.ts',
          '`generate-readme`'
        )} script generates this document`,
        `The ${link(
          './packages/markdown-factory/src/lib/markdown.ts',
          'implementation file'
        )} for this library contains \`tableOfContents\` which dynamically composes several of these utility functions.`
      )
    ),
    h2(
      'API',
      h3(
        'Headers',
        'Headers are generated using the `h1`, `h2`, `h3`, `h4`, `h5`, and `h6` functions. For example, a document with a title and 3 subsections could be generated like this:',
        codeBlock(
          stripIndents`
        h1('Title', 
          h2('Section 1', h3('Subsection 1', 'foo')), 
          h2('Section 2', h3('Subsection 2', 'bar')), 
          h2('Section 3', h3('Subsection 3', 'baz'))
        )`,
          'typescript'
        )
      ),
      h3(
        '`link`',
        'A link can be generated using the `link` function. It takes a url and optionally a label as arguments.',
        codeBlock('link("https://google.com", "Google")', 'typescript')
      ),
      h3(
        '`linkToHeader`',
        'A link to a header can be generated using the `linkToHeader` function. It takes a header and optionally a label as arguments.',
        "This differs from `link` in that the contents of the ref are sanitized and parsed from header text first. This involves removing all non-alphanumeric characters, and replacing spaces with dashes. If this doesn't suit your use case, you should use `link` directly instead.",
        codeBlock(
          'linkToHeader("Resources!", "More Resources and Information")',
          'typescript'
        ),
        codeBlock('[More Resources and Information](#resources)', 'markdown')
      ),
      h3(
        '`table`',
        'One of the more useful functions in this library is the `table` function. It takes an array of objects, and a list of fields to display. The fields are described in one of 3 forms:',
        orderedList(
          'A simple string, which will be used as the label and the field name',
          'An object with a `label` and `field` property, which will be used as the label and the field name, respectively.',
          'An object with a `label` and `mapFn` property, which will be used as the label and a function to map the item to a string value.'
        ),
        'These can be mixed and matched within the `fields` array as needed. For example, if you needed to relabel 1 field, and map another, you could do the following:',
        codeBlock(
          stripIndents`
        table(items, [ {
          label: "First Name", 
          field: "name" 
        }, 
        "age", 
        { 
          label: "City", 
          mapFn: (item) => item.address.city 
        }]);`,
          'typescript'
        )
      ),
      h3(
        '`tableOfContents`',
        'The `tableOfContents` function takes a depth and the contents that it should cover. It will generate a table of contents for the headers up to the specified depth. For example, if you had a document with the following headers:',
        codeBlock(
          stripIndents`
          # Title
          ## Section 1
          ### Subsection 1
          ### Subsection 2
          ## Section 2
          ### Subsection 3
          #### Subsubsection 1
          ### Subsection 4
          `,
          'markdown'
        ),
        'You could generate a table of contents like this:',
        codeBlock(
          stripIndents`
          tableOfContents(3, mrkdwnContents);`,
          'typescript'
        ),
        'The expected output would be:',
        codeBlock(
          stripIndents`
            - [Section 1](#section-1)
              - [Subsection 1](#subsection-1)
              - [Subsection 2](#subsection-2)
            - [Section 2](#section-2)
              - [Subsection 3](#subsection-3)
              - [Subsection 4](#subsection-4)`,
          'markdown'
        ),
        blockQuote(
          'Note: The depth passed into the function is equivalent to the maximum "level" of the headings displayed. e.g., `depth=3` would not show any h4 or h5 headings.'
        )
      ),
      h3(
        '`codeBlock`',
        `The \`codeBlock\` function takes a string of code and an optional language. It will wrap the code in a code block, and optionally add syntax highlighting for the language. For example:`,
        codeBlock(
          stripIndents`
          import { codeBlock } from 'markdown-factory';
          codeBlock('const foo = "bar";', 'typescript');`,
          'typescript'
        )
      ),
      h3(
        '`stripIndents`',
        "The `stripIndents` function is rather unique in terms of this libraries functions. It doesn\t directly correlate to a markdown element, but is rather a utility function that strips leading whitespace from each line of a string. This doesn't affect the rendered markdown, but can be useful when writing code in a template string. For example, we can write this:",
        codeBlock(
          stripIndents`
          import { codeBlock, stripIndents } from 'markdown-factory';
          if(someCondition) {
            if(someOtherCondition) {
              codeBlock(stripIndents\`
                const foo = "bar";
                const baz = "qux";
              \`, 'typescript');
            }
          }`,
          'typescript'
        ),
        'Instead of this:',
        codeBlock(
          stripIndents`
            import { codeBlock } from 'markdown-factory';
            if(someCondition) {
              if(someOtherCondition) {
                codeBlock(\`const foo = "bar";
            const baz = "qux";\`, 'typescript');
              }
            }`,
          'typescript'
        )
      ),
      h3(
        '`blockQuote`',
        `The \`blockQuote\` function takes a string of text to render as a quote. For example:`,
        codeBlock(
          stripIndents`
          import { blockQuote } from 'markdown-factory';
          blockQuote('This is a quote');`,
          'typescript'
        )
      ),
      h3(
        '`orderedList`',
        `The \`orderedList\` function takes a list of strings to render as an ordered list. For example:`,
        codeBlock(
          stripIndents`
          import { h1, orderedList } from 'markdown-factory';
          h1('Sandwich Recipe', orderedList(
            'Slice bread',
            'Spread mayo',
            'Add lettuce',
            'Add tomato',
            'Add cheese',
            'Add meat',
            'Add condiments',
            'Eat'
          ));`,
          'typescript'
        ),
        'You can also pass an options object as the first argument to the `orderedList` function. The options object can contain the following properties:',
        unorderedList(
          '`startIdx` - The number to start the list at. Defaults to 1.',
          'level - The level of the list (for nesting lists). Defaults to 1.'
        ),
        'For example, the following code would produce a nested list that starts at 3:',
        codeBlock(
          stripIndents`
          import { h1, orderedList } from 'markdown-factory';
          h1('Sandwich Recipe', orderedList(
            lines(
              'Slice bread', 
              orderedList(
                {startIdx: 3, level: 2}, 
                'Grab knife', 
                'Cut bread', 
                'Place on plate'
              )
            ),
            'Spread mayo'
          )`,
          'typescript'
        ),
        blockQuote(
          'Note - The actual numbers in an ordered list are not used in rendered markdown, but they are visible in the source. This is why the `startIdx` option is useful. For example, the following two lists are identical once rendered:',
          codeBlock(
            stripIndents`
            # List 1

            1. Item 1
            2. Item 2
            3. Item 3

            # List 2

            1. Item 1
            1. Item 2
            1. Item 3`,
            'markdown'
          )
        )
      ),
      h3(
        '`unorderedList`',
        `The \`unorderedList\` function takes a list of strings to render as an unordered list. For example:`,
        codeBlock(
          stripIndents`
          import { h1, unorderedList } from 'markdown-factory';
          h1('Sandwich Ingredients', unorderedList(
            'Bread',
            'Mayo',
            'Lettuce',
            'Tomato',
            'Cheese',
            'Meat',
            'Condiments'
          ));`,
          'typescript'
        ),
        'You can also pass an options object as the first argument to the `unorderedList` function. The options object can contain the following properties:',
        unorderedList(
          'level - The level of the list (for nesting lists). Defaults to 1.'
        ),
        'For example, the following code would produce a nested list:',
        codeBlock(
          stripIndents`
          import { h1, unorderedList } from 'markdown-factory';
          h1('Sandwich Ingredients', unorderedList(
            'Bread',
            'Ham',
            lines(
              'Condiments', 
              unorderedList(
                { level: 2 }, 
                'Ketchup', 
                'Mayo', 
                'Mustard'
              )
            ),
            'Spread mayo'
          )`,
          'typescript'
        )
      )
    ),
    h2(
      'Slack Flavor',
      `A Slack flavored build of the same API is available from the \`markdown-factory/slack-mrkdwn\` entrypoint. It renders ${link(
        'https://api.slack.com/reference/surfaces/formatting',
        'mrkdwn'
      )} instead of standard markdown, and every function returns a \`MrkdwnString\` - a string that also carries the AST built up by the nested invocations.`,
      codeBlock(
        `import { h1, ul, bold } from 'markdown-factory/slack-mrkdwn';

const message = h1('Deploy finished', \`Status: \${bold('green')}\`, ul('api', 'web'));

message.toString();         // the raw mrkdwn
message.asBlockkitBlocks(); // the same content as Block Kit blocks
message.asMdast();          // the same content as an mdast tree`,
        'typescript'
      ),
      blockQuote(
        'Note - `MrkdwnString` extends `String`, so it can be interpolated, concatenated and compared like any other string. It is not the `string` primitive type though, so functions that are typed to accept `string` need `String(value)` (or `value.toString()`).'
      ),
      h3(
        '`asBlockkitBlocks`',
        'Block Kit has no markdown parser, and only a handful of block types, so the AST is mapped onto the blocks that exist:',
        table(
          [
            {
              element: 'Headings (depth 1-2)',
              output:
                'A `header` block, with formatting stripped and the text truncated to 150 characters',
            },
            {
              element: 'Headings (depth 3-6)',
              output: 'A `section` block containing bold text',
            },
            {
              element: 'Paragraphs and inline content',
              output:
                'Merged into a single `section` block until the next block level element',
            },
            {
              element: 'Lists',
              output:
                'A `section` block, with `•`/numbered bullets and indented sub-lists',
            },
            {
              element: 'Code blocks and tables',
              output:
                'A `section` block of preformatted text, so that table columns stay aligned',
            },
            {
              element: 'Block quotes',
              output: "A `section` block using Slack's `>` quote syntax",
            },
          ],
          [
            { label: 'Markdown', field: 'element' },
            { label: 'Block Kit', field: 'output' },
          ]
        ),
        "Text longer than Slack's 3000 character section limit is split across several `section` blocks on line boundaries. The defaults can be adjusted per call:",
        codeBlock(
          stripIndents`
          message.asBlockkitBlocks({
            maxHeaderLevel: 3, // render h3s as header blocks too. Defaults to 2.
            maxSectionLength: 3000, // characters per section block.
            maxHeaderLength: 150, // characters per header block.
            emoji: true, // whether Slack should escape emoji in header blocks.
          });`,
          'typescript'
        )
      ),
      h3(
        '`asMdast`',
        `The AST follows the ${link(
          'https://github.com/syntax-tree/mdast',
          'mdast'
        )} vocabulary - \`heading\` nodes have a \`depth\`, emphasis is \`strong\`/\`emphasis\`/\`delete\`, lists hold \`listItem\` children, and so on. \`asMdast\` converts it into an mdast tree that is structurally assignable to the types in \`@types/mdast\`, so it can be handed to the unified / remark ecosystem:`,
        codeBlock(
          stripIndents`
          import { unified } from 'unified';
          import remarkGfm from 'remark-gfm';
          import remarkStringify from 'remark-stringify';
          import type { Root } from 'mdast';

          const tree: Root = message.asMdast();
          const gfm = unified().use(remarkGfm).use(remarkStringify).stringify(tree);`,
          'typescript'
        ),
        blockQuote(
          'Note - none of the mdast packages are dependencies of this library; the conversion is a plain object transform. Content that was passed in as a plain string becomes an mdast `html` node rather than a `text` node, since it is already rendered markdown and escaping it would change what it renders to.'
        )
      )
    )
  )
);

if (require.main === module) {
  writeFileSync(join(__dirname, '../README.md'), contents);
}
