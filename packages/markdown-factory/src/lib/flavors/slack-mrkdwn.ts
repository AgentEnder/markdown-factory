/**
 * @license Apache-2.0
 * @module markdown-factory/slack-mrkdwn
 *
 * @description Slack flavored (mrkdwn) markdown generation. Every function
 * returns a {@link MrkdwnString}, which behaves like a string but additionally
 * exposes {@link MrkdwnString.asBlockkitBlocks | asBlockkitBlocks} to render
 * the same content as Slack Block Kit blocks, and
 * {@link MrkdwnString.asMdast | asMdast} to hand the same content to the
 * unified / remark ecosystem.
 */

import * as defaultMarkdown from '../markdown.js';
import type {
  MappedTableField,
  OrderedListOptions,
  TableField,
  UnorderedListOptions,
} from '../markdown.js';
import type {
  ListItemNode,
  ListNode,
  MrkdwnStringLike,
  TableRowNode,
} from './slack/ast.js';
import {
  isMrkdwnString,
  mrkdwnString,
  MrkdwnString,
  toNode,
  toRaw,
} from './slack/ast.js';

export * from './slack/ast.js';
export * from './slack/blockkit.js';
export * from './slack/mdast.js';
export type {
  MappedTableField,
  OrderedListOptions,
  RenamedTableField,
  SimpleTableField,
  TableField,
  UnorderedListOptions,
} from '../markdown.js';

/**
 * Function to create an arbitrary heading.
 *
 * Slack's mrkdwn has no heading syntax, so the rendered text uses standard
 * markdown headings. When rendered via
 * {@link MrkdwnString.asBlockkitBlocks | asBlockkitBlocks}, headings become
 * `header` blocks instead.
 *
 * @param level The level of the heading. Must be between 1 and 6.
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The heading, with the contents section below it.
 */
export function h(
  level: number,
  title: MrkdwnStringLike,
  ...contents: MrkdwnStringLike[]
): MrkdwnString {
  return mrkdwnString({
    type: 'heading',
    mrkdwn: defaultMarkdown.h(level, toRaw(title), ...contents.map(toRaw)),
    depth: level,
    children: [toNode(title)],
    section: contents.map(toNode),
  });
}

/**
 * Function to create a level 1 heading. See {@link h}.
 *
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The heading, with the contents section below it.
 */
export function h1(
  title: MrkdwnStringLike,
  ...contents: MrkdwnStringLike[]
): MrkdwnString {
  return h(1, title, ...contents);
}

/**
 * Function to create a level 2 heading. See {@link h}.
 *
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The heading, with the contents section below it.
 */
export function h2(
  title: MrkdwnStringLike,
  ...contents: MrkdwnStringLike[]
): MrkdwnString {
  return h(2, title, ...contents);
}

/**
 * Function to create a level 3 heading. See {@link h}.
 *
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The heading, with the contents section below it.
 */
export function h3(
  title: MrkdwnStringLike,
  ...contents: MrkdwnStringLike[]
): MrkdwnString {
  return h(3, title, ...contents);
}

/**
 * Function to create a level 4 heading. See {@link h}.
 *
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The heading, with the contents section below it.
 */
export function h4(
  title: MrkdwnStringLike,
  ...contents: MrkdwnStringLike[]
): MrkdwnString {
  return h(4, title, ...contents);
}

/**
 * Function to create a level 5 heading. See {@link h}.
 *
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The heading, with the contents section below it.
 */
export function h5(
  title: MrkdwnStringLike,
  ...contents: MrkdwnStringLike[]
): MrkdwnString {
  return h(5, title, ...contents);
}

/**
 * Function to create a level 6 heading. See {@link h}.
 *
 * @param title The title of the heading.
 * @param contents The contents of the section.
 * @returns The heading, with the contents section below it.
 */
export function h6(
  title: MrkdwnStringLike,
  ...contents: MrkdwnStringLike[]
): MrkdwnString {
  return h(6, title, ...contents);
}

/**
 * Function to link to an external resource, using Slack's link syntax.
 *
 * @param ref The reference to link to.
 * @param title The title/label of the link.
 * @returns Slack link to the external resource.
 * @example
 * ```typescript
 * console.log(link('https://example.com', 'Example'));
 * // Prints:
 * //
 * // <https://example.com|Example>
 * ```
 */
export function link(
  ref: MrkdwnStringLike,
  title?: MrkdwnStringLike
): MrkdwnString {
  const rawRef = toRaw(ref);
  const rawTitle = title === undefined ? undefined : toRaw(title);
  return mrkdwnString({
    type: 'link',
    mrkdwn: rawTitle ? `<${rawRef}|${rawTitle}>` : `<${rawRef}/>`,
    url: rawRef,
    children: title === undefined ? [] : [toNode(title)],
  });
}

/**
 * Function to create italicized text.
 *
 * @param contents The text to italicize.
 * @returns Italicized mrkdwn.
 */
export function italics(contents: MrkdwnStringLike): MrkdwnString {
  return mrkdwnString({
    type: 'emphasis',
    mrkdwn: `_${toRaw(contents)}_`,
    children: [toNode(contents)],
  });
}

/**
 * Function to create bold text.
 *
 * @param contents The text to bold.
 * @returns Bold mrkdwn.
 */
export function bold(contents: MrkdwnStringLike): MrkdwnString {
  return mrkdwnString({
    type: 'strong',
    mrkdwn: `*${toRaw(contents)}*`,
    children: [toNode(contents)],
  });
}

/**
 * Function to create strikethrough text.
 *
 * @param contents The text to strikethrough.
 * @returns Strikethrough mrkdwn.
 */
export function strikethrough(contents: MrkdwnStringLike): MrkdwnString {
  return mrkdwnString({
    type: 'delete',
    mrkdwn: `~${toRaw(contents)}~`,
    children: [toNode(contents)],
  });
}

/**
 * Function to create inline code.
 *
 * @param contents The code to inline.
 * @returns Inline code mrkdwn.
 */
export function code(contents: MrkdwnStringLike): MrkdwnString {
  const value = toRaw(contents);
  return mrkdwnString({
    type: 'inlineCode',
    mrkdwn: defaultMarkdown.code(value),
    value,
  });
}

/**
 * Function to create a code block.
 *
 * @param contents The code to include in the block.
 * @param language The language the code is written in.
 * @param attributes Optional key-value attributes to include in the code fence.
 * @returns Code block mrkdwn.
 */
export function codeBlock(
  contents: MrkdwnStringLike,
  language?: string,
  attributes?: Record<string, string>
): MrkdwnString {
  const value = toRaw(contents);
  return mrkdwnString({
    type: 'code',
    mrkdwn: defaultMarkdown.codeBlock(value, language, attributes),
    value,
    lang: language,
    attributes,
  });
}

/**
 * Function to create a table from an array of objects.
 *
 * Block Kit has no table primitive, so tables are rendered as preformatted
 * text by {@link MrkdwnString.asBlockkitBlocks | asBlockkitBlocks}.
 *
 * @param items The array of objects to create the table from.
 * @param fields The fields to include in the table. See `TableField`.
 * @typeParam T The type of the objects in the array.
 * @returns Table markdown.
 */
export function table<
  T extends Record<string, unknown> = Record<string, unknown>
>(items: T[], fields: TableField<T>[]): MrkdwnString {
  const normalizedFields = fields.map(normalizeTableField);
  return mrkdwnString({
    type: 'table',
    mrkdwn: defaultMarkdown.table(items, fields),
    children: [
      tableRow(normalizedFields.map((field) => field.label)),
      ...items.map((item) =>
        tableRow(normalizedFields.map((field) => field.mapFn(item)))
      ),
    ],
  });
}

/**
 * Function to create a blockquote.
 *
 * @param lines Lines to be blockquoted.
 * @returns The blockquoted mrkdwn.
 */
export function blockQuote(...lines: MrkdwnStringLike[]): MrkdwnString {
  return mrkdwnString({
    type: 'blockquote',
    mrkdwn: defaultMarkdown.blockQuote(...lines.map(toRaw)),
    children: lines.map(toNode),
  });
}

/**
 * Creates an unordered list.
 *
 * @param items Each item in the list.
 * @returns The unordered list mrkdwn.
 */
export function unorderedList(...items: MrkdwnStringLike[]): MrkdwnString;

/**
 * Creates an unordered list.
 *
 * @param items Each item in the list.
 * @returns The unordered list mrkdwn.
 */
export function unorderedList(items: MrkdwnStringLike[]): MrkdwnString;

/**
 * Creates an unordered list.
 *
 * @param options The options for the unordered list. See `UnorderedListOptions`.
 * @param items Each item in the list.
 * @returns The unordered list mrkdwn.
 */
export function unorderedList(
  options: UnorderedListOptions,
  ...items: MrkdwnStringLike[]
): MrkdwnString;

/**
 * Creates an unordered list.
 *
 * @param options The options for the unordered list. See `UnorderedListOptions`.
 * @param items Each item in the list.
 * @returns The unordered list mrkdwn.
 */
export function unorderedList(
  options: UnorderedListOptions,
  items: MrkdwnStringLike[]
): MrkdwnString;

export function unorderedList(
  ...itemsOrOptions: ListArgs<UnorderedListOptions>
): MrkdwnString {
  const { options, items } =
    normalizeListArgs<UnorderedListOptions>(itemsOrOptions);
  return listNode({
    ordered: false,
    mrkdwn: defaultMarkdown.unorderedList(options, items.map(toRaw)),
    level: options.level ?? 1,
    items,
  });
}

/**
 * See {@link unorderedList}.
 **/
export const ul = unorderedList;

/**
 * Creates an ordered list.
 *
 * @param items Each item in the list.
 * @returns The ordered list mrkdwn.
 */
export function orderedList(...items: MrkdwnStringLike[]): MrkdwnString;

/**
 * Creates an ordered list.
 *
 * @param items Each item in the list.
 * @returns The ordered list mrkdwn.
 */
export function orderedList(items: MrkdwnStringLike[]): MrkdwnString;

/**
 * Creates an ordered list.
 *
 * @param options The options for the ordered list. See `OrderedListOptions`.
 * @param items Each item in the list.
 * @returns The ordered list mrkdwn.
 */
export function orderedList(
  options: OrderedListOptions,
  ...items: MrkdwnStringLike[]
): MrkdwnString;

/**
 * Creates an ordered list.
 *
 * @param options The options for the ordered list. See `OrderedListOptions`.
 * @param items Each item in the list.
 * @returns The ordered list mrkdwn.
 */
export function orderedList(
  options: OrderedListOptions,
  items: MrkdwnStringLike[]
): MrkdwnString;

export function orderedList(
  ...itemsOrOptions: ListArgs<OrderedListOptions>
): MrkdwnString {
  const { options, items } =
    normalizeListArgs<OrderedListOptions>(itemsOrOptions);
  return listNode({
    ordered: true,
    mrkdwn: defaultMarkdown.orderedList(options, items.map(toRaw)),
    level: options.level ?? 1,
    start: options.startIdx ?? 1,
    items,
  });
}

/**
 * See {@link orderedList}.
 **/
export const ol = orderedList;

/**
 * Utility function to create new lines. Joins all strings with two new lines,
 * as single new lines are ignored in markdown.
 *
 * @param ls Each line in the markdown.
 * @returns Combined mrkdwn.
 */
export function lines(
  ...ls: (MrkdwnStringLike[] | MrkdwnStringLike)[]
): MrkdwnString {
  const flattened = ls.flat();
  return mrkdwnString({
    type: 'root',
    mrkdwn: defaultMarkdown.lines(flattened.map(toRaw)),
    children: flattened.map(toNode),
  });
}

/**
 * Function to create a link to a header within the same document.
 *
 * Slack does not support anchor links within a message, so this is mostly
 * useful when the output is destined for somewhere other than a Slack message.
 *
 * @param header Which header to link to.
 * @param linkText Optional text to display for the link.
 * @returns The link markdown.
 */
export function linkToHeader(
  header: MrkdwnStringLike,
  linkText?: MrkdwnStringLike
): MrkdwnString {
  const rawHeader = toRaw(header);
  const rawLinkText = linkText === undefined ? undefined : toRaw(linkText);
  // Mirrors the sanitization done by the default flavor.
  const sanitized = rawHeader
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/[\s+]/g, '-');
  return mrkdwnString({
    type: 'link',
    mrkdwn: defaultMarkdown.linkToHeader(rawHeader, rawLinkText),
    url: `#${sanitized}`,
    children: [toNode(rawLinkText ?? rawHeader)],
  });
}

/**
 * Function to create a table of contents from the headers in the markdown.
 *
 * @param maxDepth The maximum depth of the table of contents.
 * @param s The markdown to generate the table of contents from.
 * @returns The table of contents, followed by the contents it covers.
 */
export function tableOfContents(
  maxDepth: number,
  ...s: MrkdwnStringLike[]
): MrkdwnString {
  const raw = s.map(toRaw);
  const mrkdwn = defaultMarkdown.tableOfContents(maxDepth, ...raw);
  // The default flavor returns `lines(tableOfContents, ...contents)`, so the
  // contents can be sliced back off to recover the generated portion while
  // keeping the AST of the contents that were passed in.
  const contents = defaultMarkdown.lines(raw);
  const generated = mrkdwn.slice(0, mrkdwn.length - contents.length).trim();
  return mrkdwnString({
    type: 'root',
    mrkdwn,
    children: [...(generated ? [toNode(generated)] : []), ...s.map(toNode)],
  });
}

/**
 * Function to create formatted front matter for markdown files.
 *
 * @param metadata The metadata to include in the front matter.
 * @param format The format to output the front matter in. Defaults to 'yaml'.
 * @returns The front matter.
 */
export async function frontMatter(
  metadata: Record<string, unknown>,
  format: 'json' | 'yaml' = 'yaml'
): Promise<MrkdwnString> {
  return mrkdwnString(
    toNode(await defaultMarkdown.frontMatter(metadata, format))
  );
}

/**
 * Removes indents, which is useful for printing warnings and messages.
 *
 * @param strings The template strings.
 * @param values The interpolated values.
 * @returns The de-indented text.
 */
export function stripIndents(
  strings: TemplateStringsArray,
  ...values: unknown[]
): MrkdwnString {
  return mrkdwnString(toNode(defaultMarkdown.stripIndents(strings, ...values)));
}

/**
 * The Slack flavored markdown factory. Also available as individual named
 * exports, and as the default export of this entrypoint.
 */
export const slackMrkdwn = {
  h,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  link,
  italics,
  bold,
  strikethrough,
  code,
  codeBlock,
  table,
  blockQuote,
  unorderedList,
  ul,
  orderedList,
  ol,
  lines,
  linkToHeader,
  tableOfContents,
  frontMatter,
  stripIndents,
} as const;

/**
 * The shape of the {@link slackMrkdwn} factory.
 */
export type SlackMrkdwn = typeof slackMrkdwn;

export default slackMrkdwn;

type ListArgs<TOptions extends object> =
  | [MrkdwnStringLike?, ...MrkdwnStringLike[]]
  | [MrkdwnStringLike[]]
  | [TOptions, MrkdwnStringLike[]]
  | [TOptions, ...MrkdwnStringLike[]];

/**
 * Splits the list signatures into the options object and the list items. Unlike
 * the default flavor, {@link MrkdwnString} items have to be excluded from the
 * options check, as they are objects too.
 */
function normalizeListArgs<TOptions extends object>(
  args: ListArgs<TOptions>
): { options: TOptions; items: MrkdwnStringLike[] } {
  const [first, ...rest] = args;
  const isOptions =
    typeof first === 'object' &&
    first !== null &&
    !Array.isArray(first) &&
    !isMrkdwnString(first) &&
    !(first instanceof String);
  const options = (isOptions ? first : {}) as TOptions;
  const items = (isOptions ? rest : [first, ...rest])
    .flat()
    .filter((item): item is MrkdwnStringLike => item !== undefined);
  return { options, items };
}

function listNode(
  node: Omit<ListNode, 'type' | 'children'> & { items: MrkdwnStringLike[] }
): MrkdwnString {
  const { items, ...rest } = node;
  return mrkdwnString({
    ...rest,
    type: 'list',
    children: items.map(toListItem),
  });
}

/**
 * Wraps an item in a `listItem` node. Items built from `lines` are flattened,
 * so that content nested under an item (e.g. a sub-list) is a sibling of the
 * item's text rather than a nested tree.
 */
function toListItem(item: MrkdwnStringLike): ListItemNode {
  const node = toNode(item);
  return {
    type: 'listItem',
    mrkdwn: node.mrkdwn,
    children: node.type === 'root' ? node.children : [node],
  };
}

/**
 * Builds a `tableRow` node from cell values. Values built by this library keep
 * their AST, so that `asBlockkitBlocks` can render a cell containing a link or
 * emphasis as a `rich_text` cell rather than as literal mrkdwn.
 */
function tableRow(cells: MrkdwnStringLike[]): TableRowNode {
  return {
    type: 'tableRow',
    mrkdwn: cells.map(toRaw).join(' | '),
    children: cells.map((cell) => ({
      type: 'tableCell' as const,
      mrkdwn: toRaw(cell),
      children: [toNode(cell)],
    })),
  };
}

/**
 * Mirrors the field normalization done by the default flavor, so that the AST
 * carries the same cell values that were rendered.
 */
function normalizeTableField<T extends Record<string, unknown>>(
  field: TableField<T>
): { label: string; mapFn: (el: T) => MrkdwnStringLike } {
  return {
    label: typeof field === 'object' ? field.label : String(field),
    mapFn:
      typeof field === 'object' && 'mapFn' in field
        ? (el: T) => toCellValue((field as MappedTableField<T>).mapFn(el))
        : (el: T) =>
            toCellValue(el[typeof field === 'object' ? field.field : field]),
  };
}

/**
 * Renders a cell value, keeping values built by this library intact so that
 * their AST survives into the cell.
 */
function toCellValue(value: unknown): MrkdwnStringLike {
  return isMrkdwnString(value)
    ? value
    : (value as { toString(): string }).toString();
}
