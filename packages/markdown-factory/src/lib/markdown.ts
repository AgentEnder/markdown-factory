/**
 * @license Apache-2.0
 * @module markdown-factory
 *
 * @description A simple library to generate markdown strings.
 */

/**
 * Function to create an arbitrary heading
 * @param level The level of the heading. Must be between 1 and 6.
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The markdown heading, with the contents section below it.
 *
 * @example
 * ```typescript
 * console.log(h(1, 'Heading 1', 'This is the contents of the section.'));
 * // Prints:
 * //
 * // # Heading 1
 * //
 * // This is the contents of the section.
 * ```
 */
export function h(level: number, title: string, ...contents: string[]) {
  assert(level >= 1, 'Heading level must be >= 1.');
  assert(level <= 6, 'Most markdown engines only support heading levels 1-6.');
  return lines(`${'#'.repeat(level)} ${title}`, contents);
}

/**
 * Function to create a level 1 heading.
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The markdown heading, with the contents section below it.
 *
 * @example
 * ```typescript
 * console.log(h1('Heading 1', 'This is the contents of the section.'));
 * // Prints:
 * //
 * // # Heading 1
 * //
 * // This is the contents of the section.
 * ```
 */
export function h1(title: string, ...contents: string[]) {
  return h(1, title, ...contents);
}

/**
 * Function to create a level 2 heading.
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The markdown heading, with the contents section below it.
 *
 * @example
 * ```typescript
 * console.log(h2('Heading 2', 'This is the contents of the section.'));
 * // Prints:
 * //
 * // ## Heading 2
 * //
 * // This is the contents of the section.
 * ```
 */
export function h2(title: string, ...contents: string[]) {
  return h(2, title, ...contents);
}

/**
 * Function to create a level 3 heading.
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The markdown heading, with the contents section below it.
 *
 * @example
 * ```typescript
 * console.log(h3('Heading 3', 'This is the contents of the section.'));
 * // Prints:
 * //
 * // ### Heading 3
 * //
 * // This is the contents of the section.
 * ```
 */
export function h3(title: string, ...contents: string[]) {
  return h(3, title, ...contents);
}

/**
 * Function to create a level 4 heading.
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The markdown heading, with the contents section below it.
 *
 * @example
 * ```typescript
 * console.log(h4('Heading 4', 'This is the contents of the section.'));
 * // Prints:
 * //
 * // #### Heading 4
 * //
 * // This is the contents of the section.
 * ```
 */
export function h4(title: string, ...contents: string[]) {
  return h(4, title, ...contents);
}

/**
 * Function to create a level 5 heading.
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The markdown heading, with the contents section below it.
 *
 * @example
 * ```typescript
 * console.log(h5('Heading 5', 'This is the contents of the section.'));
 * // Prints:
 * //
 * // ##### Heading 5
 * //
 * // This is the contents of the section.
 * ```
 */
export function h5(title: string, ...contents: string[]) {
  return h(5, title, ...contents);
}

/**
 * Function to create a level 6 heading.
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The markdown heading, with the contents section below it.
 *
 * @example
 * ```typescript
 * console.log(h6('Heading 6', 'This is the contents of the section.'));
 * // Prints:
 * //
 * // ###### Heading 6
 * //
 * // This is the contents of the section.
 * ```
 */
export function h6(title: string, ...contents: string[]) {
  return h(6, title, ...contents);
}

/**
 * Function to link to an external resource.
 * @param ref The reference to link to.
 * @param title The title/label of the link.
 * @returns Markdown link to the external resource.
 * @example
 * ```typescript
 * console.log(link('https://example.com', 'Example'));
 * // Prints:
 * //
 * // [Example](https://example.com)
 * ```
 */
export function link(ref: string, title?: string) {
  return `[${title ?? ref}](${ref})`;
}

/**
 * Function to create italicized text.
 * @param contents The text to italicize.
 * @returns Markdown italicized text.
 */
export function italics(contents: string) {
  return `*${contents}*`;
}

/**
 * Function to create bold text.
 * @param contents The text to bold.
 * @returns Markdown bold text.
 */
export function bold(contents: string) {
  return `**${contents}**`;
}

/**
 * Function to create strikethrough text.
 * @param contents The text to strikethrough.
 * @returns Markdown strikethrough text.
 */
export function strikethrough(contents: string) {
  return `~~${contents}~~`;
}

/**
 * Function to create inline code.
 * @param contents The code to inline.
 * @returns Markdown inline code.
 */
export function code(contents: string) {
  return `\`${contents}\``;
}

/**
 * Function to create a code block.
 * @param contents The code to include in the block.
 * @param language The language the code is written in.
 * @returns Markdown code block.
 */
export function codeBlock(contents: string, language?: string) {
  return `\`\`\`${language ? language : ''}
${contents}
\`\`\``;
}

/**
 * A simple table field. A string, that's a key of the object supplied to the {@link table} function.
 * @typeParam T The type of the objects in the array in the table.
 * @example
 * ```typescript
 * const items = [{name: 'Alice', age: 30}, {name: 'Bob', age: 40}];
 * console.log(table(items, ['name', 'age']));
 * // Prints:
 * //
 * // | name  | age |
 * // | ----  | --- |
 * // | Alice | 30  |
 * ```
 */
export type SimpleTableField<T> = keyof T;

/**
 * A mapped table field. A field with a label and a mapping function.
 *
 * @typeParam T The type of the objects in the array in the table.
 * @example
 * ```typescript
 * const items = [{name: 'Alice', age: 30}, {name: 'Bob', age: 40}];
 * console.log(table(items, [{label: 'Name', mapFn: (el) => el.name}, {label: 'Dog Age', mapFn: (el) => el.age * 7}]));
 * // Prints:
 * //
 * // | Name  | Age  |
 * // | ----  | ---  |
 * // | Alice | 210  |
 * // | Bob   | 280  |
 * ```
 */
export type MappedTableField<T> = {
  label: string;
  mapFn: (el: T) => string | { toString(): string };
};

/**
 * A renamed table field. A field with a label and a key of the object supplied to the {@link table} function.
 * @typeParam T The type of the objects in the array in the table.
 *
 * @example
 * ```typescript
 * const items = [{name: 'Alice', age: 30}, {name: 'Bob', age: 40}];
 * console.log(table(items, [{label: 'Name', field: 'name'}, {label: 'Age', field: 'age'}]));
 * // Prints:
 * //
 * // | Name  | Age |
 * // | ----  | --- |
 * // | Alice | 30  |
 * // | Bob   | 40  |
 * ```
 */
export type RenamedTableField<T> = {
  label: string;
  field: keyof T;
};

/**
 * Type to represent a field in a table. Can be a {@link SimpleTableField}, a {@link MappedTableField}, or a {@link RenamedTableField}.
 * @typeParam T The type of the objects in the array in the table.
 */
export type TableField<T extends Record<string, unknown>> =
  | SimpleTableField<T>
  | MappedTableField<T>
  | RenamedTableField<T>;

function normalizeTableField<T extends Record<string, unknown>>(
  f: TableField<T>
): Omit<MappedTableField<T>, 'mapFn'> & {
  mapFn: (...params: Parameters<MappedTableField<T>['mapFn']>) => string;
} {
  return {
    label: typeof f === 'object' ? f.label : f.toString(),
    mapFn:
      typeof f === 'object' && 'mapFn' in f
        ? (e) => f.mapFn(e).toString()
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e) => (e[typeof f === 'object' ? f.field : f] as any).toString(),
  };
}

/**
 * Function to create a table from an array of objects.
 * @param items The array of objects to create the table from.
 * @param fields The fields to include in the table. See {@link TableField}.
 * @typeParam T The type of the objects in the array. Should be inferred from the `items` parameter.
 * @returns Markdown table.
 * @example
 * ```typescript
 * const items = [{name: 'Alice', age: 30}, {name: 'Bob', age: 40}];
 * console.log(table(items, ['name', 'age']));
 * // Prints:
 * //
 * // | name  | age |
 * // | ----  | --- |
 * // | Alice | 30  |
 * // | Bob   | 40  |
 * ```
 */
export function table<
  T extends Record<string, unknown> = Record<string, unknown>
>(items: T[], fields: TableField<T>[]): string {
  const paddingMap: Map<keyof T, number> = new Map();
  const normalizedFields = fields.map(normalizeTableField);

  for (const field of normalizedFields) {
    const maxLength = Math.max(
      ...items.map((i) => field.mapFn(i).length),
      field.label.length
    );
    paddingMap.set(field.label, maxLength);
  }
  return [
    `| ${normalizedFields
      .map((x) => x.label.padEnd(paddingMap.get(x.label) ?? 0))
      .join(' | ')} |`,
    `| ${normalizedFields
      .map((x) => '-'.repeat(paddingMap.get(x.label) ?? 0))
      .join(' | ')} |`,
    ...items.map(
      (item) =>
        `| ${normalizedFields
          .map((x) => x.mapFn(item).padEnd(paddingMap.get(x.label) ?? 0))
          .join(' | ')} |`
    ),
  ].join('\n');
}

/**
 * Function to create a blockquote.
 * @param lines Lines to be blockquoted.
 * @returns The blockquoted markdown.
 */
export function blockQuote(...lines: string[]): string {
  const mappedFragments = lines.map((f) =>
    f
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n')
  );
  return mappedFragments.join('\n>\n').trim();
}

/**
 * Options for {@link orderedList} / {@link ol}.
 */
export type OrderedListOptions = { level?: number; startIdx?: number };

/**
 * Options for {@link unorderedList} / {@link ul}.
 */
export type UnorderedListOptions = { level?: number };

/**
 * Creates an unordered list.
 *
 * @param items Each item in the list.
 * @returns The unordered list markdown.
 * @example
 * ```typescript
 * console.log(unorderedList('item1', 'item2', 'item3'));
 * // Prints:
 * //
 * // - item1
 * //
 * // - item2
 * //
 * // - item3
 * ```
 **/
export function unorderedList(...items: string[]): string;

/**
 * Creates an unordered list.
 *
 * @param items Each item in the list.
 * @returns The unordered list markdown.
 * @example
 * ```typescript
 * console.log(unorderedList('item1', 'item2', 'item3'));
 * // Prints:
 * //
 * // - item1
 * //
 * // - item2
 * //
 * // - item3
 * ```
 **/
export function unorderedList(items: string[]): string;

/**
 * Creates an unordered list.
 *
 * @param options The options for the unordered list. See {@link UnorderedListOptions}.
 * @param items Each item in the list.
 * @returns The unordered list markdown.
 * @example
 * ```typescript
 * console.log(
 *   unorderedList(
 *     'item1',
 *     lines(
 *       'item 2',
 *       unorderedList({level: 2}, 'item a', 'item b')
 *     ),
 *     'item3'
 *   )
 * );
 * // Prints:
 * //
 * // - item1
 * //
 * // - item2
 * //
 * //   - item a
 * //
 * //   - item b
 * //
 * // - item3
 * ```
 **/
export function unorderedList(
  options: UnorderedListOptions,
  ...items: string[]
): string;

/**
 * Creates an unordered list.
 *
 * @param options The options for the unordered list. See {@link UnorderedListOptions}.
 * @param items Each item in the list.
 * @returns The unordered list markdown.
 * @example
 * ```typescript
 * console.log(
 *   unorderedList(
 *     'item1',
 *     lines(
 *       'item 2',
 *       unorderedList({level: 2}, 'item a', 'item b')
 *     ),
 *     'item3'
 *   )
 * );
 * // Prints:
 * //
 * // - item1
 * //
 * // - item2
 * //
 * //   - item a
 * //
 * //   - item b
 * //
 * // - item3
 * ```
 **/
export function unorderedList(
  options: UnorderedListOptions,
  items: string[]
): string;

/**
 * Creates an unordered list.
 *
 * @returns The unordered list markdown.
 * @example
 * ```typescript
 * console.log(unorderedList('item1', 'item2', 'item3'));
 * // Prints:
 * //
 * // - item1
 * //
 * // - item2
 * //
 * // - item3
 * ```
 **/
export function unorderedList(
  ...itemOrOptions:
    | [string?, ...string[]]
    | [string[]]
    | [UnorderedListOptions, string[]]
    | [UnorderedListOptions, ...string[]]
): string {
  const [first, ...rest] = itemOrOptions;

  const items: string[] =
    // Could be Sig 2, 3, or 4
    typeof first === 'object'
      ? Array.isArray(first)
        ? // Is sig 2.
          first
        : // Is sig 3 or 4.
          rest.flat()
      : // Is sig 1.
      first
      ? [first, ...rest.flat()]
      : [];

  const options: UnorderedListOptions =
    typeof first === 'object' && !Array.isArray(first) ? first : {};

  const level = (options?.level ?? 1) - 1;
  return lines(items.map((i) => `${'\t'.repeat(level)}- ${i}`));
}

/**
 * See {@link unorderedList}.
 **/
export const ul = unorderedList;

/**
 * Creates an ordered list.
 *
 * @param items Each item in the list.
 * @returns The ordered list markdown.
 * @example
 * ```typescript
 * console.log(orderedList('item1', 'item2', 'item3'));
 * // Prints:
 * //
 * // 1. item1
 * //
 * // 2. item2
 * //
 * // 3. item3
 * ```
 **/
export function orderedList(...items: string[]): string;

/**
 * Creates an ordered list.
 *
 * @param items Each item in the list.
 * @returns The ordered list markdown.
 * @example
 * ```typescript
 * console.log(orderedList('item1', 'item2', 'item3'));
 * // Prints:
 * //
 * // 1. item1
 * //
 * // 2. item2
 * //
 * // 3. item3
 * ```
 **/
export function orderedList(items: string[]): string;

/**
 * Creates an ordered list.
 *
 * @param options The options for the ordered list. See {@link OrderedListOptions}.
 * @param items Each item in the list.
 * @returns The ordered list markdown.
 * @example
 * ```typescript
 * console.log(
 *   orderedList(
 *     'item1',
 *     lines(
 *       'item 2',
 *       orderedList({level: 2}, 'item a', 'item b')
 *     ),
 *     'item3'
 *   )
 * );
 * // Prints:
 * //
 * // 1. item1
 * //
 * // 2. item2
 * //
 * //   1. item a
 * //
 * //   2. item b
 * //
 * // 3. item3
 * ```
 **/
export function orderedList(
  options: OrderedListOptions,
  ...items: string[]
): string;

/**
 * Creates an ordered list.
 *
 * @param options The options for the ordered list. See {@link OrderedListOptions}.
 * @param items Each item in the list.
 * @returns The ordered list markdown.
 * @example
 * ```typescript
 * console.log(
 *   orderedList(
 *     'item1',
 *     lines(
 *       'item 2',
 *       orderedList({level: 2}, 'item a', 'item b')
 *     ),
 *     'item3'
 *   )
 * );
 * // Prints:
 * //
 * // 1. item1
 * //
 * // 2. item2
 * //
 * //   1. item a
 * //
 * //   2. item b
 * //
 * // 3. item3
 * ```
 **/
export function orderedList(
  options: OrderedListOptions,
  items: string[]
): string;
export function orderedList(
  ...itemOrOptions:
    | [string?, ...string[]]
    | [string[]]
    | [OrderedListOptions, string[]]
    | [OrderedListOptions, ...string[]]
): string {
  const [first, ...rest] = itemOrOptions;

  const items: string[] =
    // Could be Sig 2, 3, or 4
    typeof first === 'object'
      ? Array.isArray(first)
        ? // Is sig 2.
          first
        : // Is sig 3 or 4.
          rest.flat()
      : // Is sig 1.
      first
      ? [first, ...rest.flat()]
      : [];
  const options: OrderedListOptions =
    typeof first === 'object' && !Array.isArray(first) ? first : {};
  const level = (options.level ?? 1) - 1;
  const startIdx = options?.startIdx ?? 1;

  return lines(
    items.map((i, idx) => `${'\t'.repeat(level)}${startIdx + idx}. ${i}`)
  );
}

/**
 * See {@link orderedList}.
 **/
export const ol = orderedList;

/**
 * Utility function to create new lines within markdown. Joins all strings with two new lines, as single new lines are ignored in markdown.
 * @param ls Each line in the markdown.
 * @returns Combined markdown.
 */
export function lines(...ls: (string[] | string)[]) {
  return ls.flat().join('\n\n');
}

/**
 * Function to create a link to a header within the same markdown file.
 * @param header Which header to link to.
 * @param linkText Optional text to display for the link.
 * @returns The markdown link.
 */
export function linkToHeader(header: string, linkText?: string): string {
  const sanitized = header
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/[\s+]/g, '-');
  return link(`#${sanitized}`, linkText ?? header);
}

/**
 * Function to create a table of contents from the headers in the markdown.
 * @param maxDepth The maximum depth of the table of contents.
 * @param s The markdown to generate the table of contents from.
 * @returns The table of contents markdown.
 */
export function tableOfContents(maxDepth: number, ...s: string[]) {
  const allLines = s.flatMap((l) => l.split('\n'));
  type Section = { depth: number; label: string; children?: Section[] };

  // This table of contents doesn't support root header / title.
  function collectSubsections(lines: string[]) {
    const sections: Section[] = [];
    const stack: Section[] = [];

    function getHeader(line: string) {
      const match = line.match(/^(#+) (.*)$/);
      if (match) {
        const [, header, label] = match;
        return { depth: header.length, label: linkToHeader(label) };
      }
      return null;
    }

    for (let idx = 0; idx < lines.length; idx++) {
      let line = lines[idx];

      // Ignore headers within code blocks
      if (line.startsWith('```')) {
        while (!line.endsWith('```')) {
          idx++;
          line = lines[idx];
        }
      }

      const header = getHeader(line);
      if (header) {
        const top = stack.length && stack[stack.length - 1];
        if (!top) {
          stack.push(header);
          sections.push(header);
        } else {
          if (header.depth === top.depth) {
            stack.pop();
            const parent = stack[stack.length - 1];
            if (parent) {
              parent.children ??= [];
              parent.children.push(header);
            } else {
              sections.push(header);
            }
            stack.push(header);
          } else if (header.depth > top.depth) {
            const newElement = {
              depth: header.depth,
              label: header.label,
              children: [],
            };
            top.children ??= [];
            top.children.push(newElement);
            stack.push(newElement);
          } else {
            let next: Section | undefined = stack[stack.length - 1];
            while (next) {
              if (next && next.depth > header.depth) {
                next = stack.pop();
              } else {
                break;
              }
            }
            const parent = stack[stack.length - 1];
            if (parent) {
              parent.children ??= [];
              parent.children.push(header);
            } else {
              sections.push(header);
            }
            stack.push(header);
          }
        }
      }
    }

    return sections;
  }

  const sections = collectSubsections(allLines);

  function buildListsFromSection(section: Section, startIdx = 1, level = 1) {
    const lists: string[] = [];
    lists.push(orderedList({ level, startIdx }, section.label));
    if (section.children && maxDepth > level) {
      const newLists = section.children.map((s, idx) =>
        buildListsFromSection(s, idx + 1, level + 1)
      );
      lists.push(...newLists);
    }
    return lines(lists);
  }

  return lines(
    sections.map((s, idx) => buildListsFromSection(s, idx + 1)),
    s
  );
}

/**
 * Function to create formatted front matter for markdown files.
 * @param metadata The metadata to include in the front matter.
 * @param format The format to output the front matter in. Defaults to 'yaml'.
 */
export function frontMatter(
  metadata: Record<string, unknown>,
  format: 'json' | 'yaml' = 'yaml'
): string {
  switch (format) {
    case 'json':
      return jsonFrontMatter(metadata);
    case 'yaml':
      return yamlFrontMatter(metadata);
  }
  throw new Error(`Unsupported front matter format: ${format}`);
}

function jsonFrontMatter(metadata: Record<string, unknown>): string {
  return ['---', JSON.stringify(metadata, null, 2), '---'].join('\n');
}

function yamlFrontMatter(metadata: Record<string, unknown>): string {
  let yaml: typeof import('yaml');
  try {
    yaml = require('yaml');
  } catch {
    throw new Error(
      'The frontMatter function requires the yaml package to be installed. Either install it or build frontmatter using `lines` directly'
    );
  }
  return ['---', yaml.stringify(metadata), '---'].join('\n');
}

/**
 * Removes indents, which is useful for printing warning and messages.
 *
 * Example:
 *
 * ```typescript
 * stripIndents`
 *  Options:
 *  - option1
 *  - option2
 * `
 * ```
 *
 * Pulled from @nrwl/devkit.
 */
export function stripIndents(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  const lines = String.raw(strings, ...values).split('\n');
  const minLeadingWhitespaceLength = Math.min(
    ...lines.filter(Boolean).map((line) => {
      const match = line.match(/^\s*/);
      return match ? match[0].length : 0;
    })
  );
  return lines
    .map((line) => line.slice(minLeadingWhitespaceLength).replace(/\\+`/g, '`'))
    .join('\n')
    .trim();
}

function assert(check: boolean, message: `${string}.`, allowByPass = true) {
  const bypassChecks =
    allowByPass &&
    (process.env['MARKDOWN_FACTORY_NO_CHECKS'] === 'true' ||
      process.env['NODE_ENV'] === 'production');
  if (!check && !bypassChecks) {
    const lines: string[] = [
      message,
      'If you are targetting an environment where this is known to be supported, please open an issue.',
    ];
    if (allowByPass) {
      lines.push(
        'As a temporary bypass, you can set MARKDOWN_FACTORY_NO_CHECKS=true to disable checks.'
      );
    }
    throw new Error(lines.join('\n'));
  }
}
