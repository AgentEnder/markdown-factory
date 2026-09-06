1. [Markdown Factory](#markdown-factory)

   1. [Why?](#why)

   2. [Getting Started](#getting-started)

      1. [Installation](#installation)

      2. [Usage](#usage)

   3. [Examples](#examples)

   4. [API](#api)

      1. [Headers](#headers)

      2. [`link`](#link)

      3. [`linkToHeader`](#linktoheader)

      4. [`table`](#table)

      5. [`tableOfContents`](#tableofcontents)

      6. [`codeBlock`](#codeblock)

      7. [`stripIndents`](#stripindents)

      8. [`blockQuote`](#blockquote)

      9. [`orderedList`](#orderedlist)

      10. [`unorderedList`](#unorderedlist)

   5. [Slack Flavor](#slack-flavor)

      1. [`asBlockkitBlocks`](#asblockkitblocks)

      2. [`asMdast`](#asmdast)

# Markdown Factory

Utilities to easily generate valid markdown from within JavaScript

## Why?

For static content, this library is **mostly** unnecessary. However, when generating a report from a dynamic data source this library can be rather useful.

An example of using this library for dynamic data, could be the implementation of the `tableOfContents` function. Inside it, we parse the headings and then use the utils to generate an appropriate table of contents. You can read more about it here: [`tableOfContents`](#tableofcontents)

## Getting Started

### Installation

npm install markdown-factory

### Usage

Import the functions you need from markdown-factory, they are named based on the markdown they generate. For the most part, they take text content as the first argument, and any additional arguments are treated as sub-elements.

```typescript
import { h1, h2, h3 } from 'markdown-factory';
h1('Hello World', h2('subheading', h3('sub-subheading', 'foo-bar')));
```

## Examples

Some advanced usages of the library can be found below:

- The [`generate-readme`](https://github.com/agentender/markdown-factory/tree/main/tools/generate-readme.ts) script generates this document

- The [implementation file](https://github.com/agentender/markdown-factory/tree/main/packages/markdown-factory/src/lib/markdown.ts) for this library contains `tableOfContents` which dynamically composes several of these utility functions.

## API

### Headers

Headers are generated using the `h1`, `h2`, `h3`, `h4`, `h5`, and `h6` functions. For example, a document with a title and 3 subsections could be generated like this:

```typescript
h1('Title', h2('Section 1', h3('Subsection 1', 'foo')), h2('Section 2', h3('Subsection 2', 'bar')), h2('Section 3', h3('Subsection 3', 'baz')));
```

### `link`

A link can be generated using the `link` function. It takes a url and optionally a label as arguments.

```typescript
link('https://google.com', 'Google');
```

### `linkToHeader`

A link to a header can be generated using the `linkToHeader` function. It takes a header and optionally a label as arguments.

This differs from `link` in that the contents of the ref are sanitized and parsed from header text first. This involves removing all non-alphanumeric characters, and replacing spaces with dashes. If this doesn't suit your use case, you should use `link` directly instead.

```typescript
linkToHeader('Resources!', 'More Resources and Information');
```

```markdown
[More Resources and Information](#resources)
```

### `table`

One of the more useful functions in this library is the `table` function. It takes an array of objects, and a list of fields to display. The fields are described in one of 3 forms:

1. A simple string, which will be used as the label and the field name

2. An object with a `label` and `field` property, which will be used as the label and the field name, respectively.

3. An object with a `label` and `mapFn` property, which will be used as the label and a function to map the item to a string value.

These can be mixed and matched within the `fields` array as needed. For example, if you needed to relabel 1 field, and map another, you could do the following:

```typescript
table(items, [
  {
    label: 'First Name',
    field: 'name',
  },
  'age',
  {
    label: 'City',
    mapFn: (item) => item.address.city,
  },
]);
```

### `tableOfContents`

The `tableOfContents` function takes a depth and the contents that it should cover. It will generate a table of contents for the headers up to the specified depth. For example, if you had a document with the following headers:

```markdown
# Title

## Section 1

### Subsection 1

### Subsection 2

## Section 2

### Subsection 3

#### Subsubsection 1

### Subsection 4
```

You could generate a table of contents like this:

```typescript
tableOfContents(3, mrkdwnContents);
```

The expected output would be:

```markdown
- [Section 1](#section-1)
  - [Subsection 1](#subsection-1)
  - [Subsection 2](#subsection-2)
- [Section 2](#section-2)
  - [Subsection 3](#subsection-3)
  - [Subsection 4](#subsection-4)
```

> Note: The depth passed into the function is equivalent to the maximum "level" of the headings displayed. e.g., `depth=3` would not show any h4 or h5 headings.

### `codeBlock`

The `codeBlock` function takes a string of code and an optional language. It will wrap the code in a code block, and optionally add syntax highlighting for the language. For example:

```typescript
import { codeBlock } from 'markdown-factory';
codeBlock('const foo = "bar";', 'typescript');
```

### `stripIndents`

The `stripIndents` function is rather unique in terms of this libraries functions. It doesn directly correlate to a markdown element, but is rather a utility function that strips leading whitespace from each line of a string. This doesn't affect the rendered markdown, but can be useful when writing code in a template string. For example, we can write this:

```typescript
import { codeBlock, stripIndents } from 'markdown-factory';
if (someCondition) {
  if (someOtherCondition) {
    codeBlock(
      stripIndents`
      const foo = "bar";
      const baz = "qux";
    `,
      'typescript'
    );
  }
}
```

Instead of this:

```typescript
import { codeBlock } from 'markdown-factory';
if (someCondition) {
  if (someOtherCondition) {
    codeBlock(
      `const foo = "bar";
const baz = "qux";`,
      'typescript'
    );
  }
}
```

### `blockQuote`

The `blockQuote` function takes a string of text to render as a quote. For example:

```typescript
import { blockQuote } from 'markdown-factory';
blockQuote('This is a quote');
```

### `orderedList`

The `orderedList` function takes a list of strings to render as an ordered list. For example:

```typescript
import { h1, orderedList } from 'markdown-factory';
h1('Sandwich Recipe', orderedList('Slice bread', 'Spread mayo', 'Add lettuce', 'Add tomato', 'Add cheese', 'Add meat', 'Add condiments', 'Eat'));
```

You can also pass an options object as the first argument to the `orderedList` function. The options object can contain the following properties:

- `startIdx` - The number to start the list at. Defaults to 1.

- level - The level of the list (for nesting lists). Defaults to 1.

For example, the following code would produce a nested list that starts at 3:

```typescript
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
)
```

> Note - The actual numbers in an ordered list are not used in rendered markdown, but they are visible in the source. This is why the `startIdx` option is useful. For example, the following two lists are identical once rendered:
>
> ```markdown
> # List 1
>
> 1. Item 1
> 2. Item 2
> 3. Item 3
>
> # List 2
>
> 1. Item 1
> 1. Item 2
> 1. Item 3
> ```

### `unorderedList`

The `unorderedList` function takes a list of strings to render as an unordered list. For example:

```typescript
import { h1, unorderedList } from 'markdown-factory';
h1('Sandwich Ingredients', unorderedList('Bread', 'Mayo', 'Lettuce', 'Tomato', 'Cheese', 'Meat', 'Condiments'));
```

You can also pass an options object as the first argument to the `unorderedList` function. The options object can contain the following properties:

- level - The level of the list (for nesting lists). Defaults to 1.

For example, the following code would produce a nested list:

```typescript
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
)
```

## Slack Flavor

A Slack flavored build of the same API is available from the `markdown-factory/slack-mrkdwn` entrypoint. It renders [mrkdwn](https://api.slack.com/reference/surfaces/formatting) instead of standard markdown, and every function returns a `MrkdwnString` - a string that also carries the AST built up by the nested invocations.

```typescript
import { h1, ul, bold } from 'markdown-factory/slack-mrkdwn';

const message = h1('Deploy finished', `Status: ${bold('green')}`, ul('api', 'web'));

message.toString(); // the raw mrkdwn
message.asBlockkitBlocks(); // the same content as Block Kit blocks
message.asMdast(); // the same content as an mdast tree
```

> Note - `MrkdwnString` extends `String`, so template literals, concatenation, `.length`, every `String` method, `JSON.stringify` and `==` all behave as they always have. It is an object rather than the `string` primitive though, so a few things do differ:
>
> - TypeScript will not assign it to a `string`. Use `String(value)`, or `value.toString()`.
>
> - Strict equality against a string literal (`value === '*foo*'`), `switch (value)`, `array.includes(value)` and `set.has(value)` are all `false`. Use `==`, or convert first.
>
> - `typeof value` is `'object'`, so APIs that check it - `fs.writeFileSync(path, value)`, for instance - need `String(value)`.

### `asBlockkitBlocks`

Block Kit has no markdown parser, and only a handful of block types, so the AST is mapped onto the blocks that exist:

| Markdown                      | Block Kit                                                                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Headings (depth 1-2)          | A `header` block, with formatting stripped and the text truncated to 150 characters                                                       |
| Headings (depth 3-6)          | A `section` block containing bold text                                                                                                    |
| Paragraphs and inline content | Merged into a single `section` block until the next block level element                                                                   |
| Lists                         | A `section` block, with `•`/numbered bullets and indented sub-lists                                                                       |
| Code blocks                   | A `rich_text` block containing `rich_text_preformatted`                                                                                   |
| Tables                        | A `table` block. Cells built with `link`, `bold` and friends become `rich_text` cells, so they stay formatted; plain cells are `raw_text` |
| Block quotes                  | A `section` block using Slack's `>` quote syntax                                                                                          |

Text longer than Slack's 3000 character section limit is split across several `section` blocks on line boundaries. The defaults can be adjusted per call:

```typescript
message.asBlockkitBlocks({
  maxHeaderLevel: 3, // render h3s as header blocks too. Defaults to 2.
  maxSectionLength: 3000, // characters per section block.
  maxHeaderLength: 150, // characters per header block.
  emoji: true, // whether Slack should escape emoji in header blocks.
  tableBlocks: true, // render tables as `table` blocks.
});
```

> Note - only messages support `table` blocks. Set `tableBlocks: false` when the output is bound for a modal or an App Home tab, and tables fall back to preformatted text. A table Slack would reject - over 100 rows, over 20 columns, or over 10,000 characters of cell content in the message - falls back on its own either way, so the message stays valid.

### `asMdast`

The AST follows the [mdast](https://github.com/syntax-tree/mdast) vocabulary - `heading` nodes have a `depth`, emphasis is `strong`/`emphasis`/`delete`, lists hold `listItem` children, and so on. `asMdast` converts it into an mdast tree that is structurally assignable to the types in `@types/mdast`, so it can be handed to the unified / remark ecosystem:

```typescript
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import type { Root } from 'mdast';

const tree: Root = message.asMdast();
const gfm = unified().use(remarkGfm).use(remarkStringify).stringify(tree);
```

> Note - none of the mdast packages are dependencies of this library; the conversion is a plain object transform. Content that was passed in as a plain string becomes an mdast `html` node rather than a `text` node, since it is already rendered markdown and escaping it would change what it renders to.
