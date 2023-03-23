import { writeFileSync } from 'fs';
import { join } from 'path';
import {
  codeBlock,
  h1,
  h2,
  h3,
  h4,
  orderedList,
  stripIndents,
  // tableOfContents,
} from '../packages/markdown-factory/src/lib/markdown';

const contents = h1(
  'Markdown Factory',
  'Utilities to easily generate valid markdown from within JavaScript',
  // tableOfContents(
  // 3,
  h2(
    `Why?`,
    'For static content, this library is **mostly** unnecessary. However, when generating a report from a dynamic data source this library can be rather useful. '
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
      `The \`blockQuote\` function takes a string of text to render as a quote. For example:`
    ),
    codeBlock(
      stripIndents`
        import { blockQuote } from 'markdown-factory';
        blockQuote('This is a quote');`,
      'typescript'
    ),
    h3(
      '`orderedList`',
      `The \`orderedList\` function takes a list of strings to render as an ordered list. For example:`
    ),
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
    h3(
      '`unorderedList`',
      `The \`unorderedList\` function takes a list of strings to render as an unordered list. For example:`
    ),
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
    )
  )
  // )
);

writeFileSync(join(__dirname, '../README.md'), contents);
