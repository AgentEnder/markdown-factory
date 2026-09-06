/**
 * @license Apache-2.0
 * @module markdown-factory/slack-mrkdwn
 *
 * @description The AST produced by nested invocations of the slack-mrkdwn
 * flavor, and the string-like value used to carry it.
 *
 * Node types and fields follow the
 * {@link https://github.com/syntax-tree/mdast | mdast} vocabulary (`heading`
 * with a `depth`, `strong` / `emphasis` / `delete`, `inlineCode`, `code` with a
 * `lang`, `list` of `listItem`s, `table` of `tableRow`s of `tableCell`s, ...) so
 * that the tree is familiar, and so that it can be handed to the unified /
 * remark ecosystem via {@link MrkdwnString.asMdast | asMdast}. This library
 * itself stays dependency free - none of the mdast packages are used.
 */

import type { AsBlockkitBlocksOptions, BlockkitBlock } from './blockkit.js';
import { renderBlockkitBlocks } from './blockkit.js';
import type { MdastRoot } from './mdast.js';
import { toMdast } from './mdast.js';

/**
 * Properties shared by every AST node.
 */
export type AstNodeBase = {
  /**
   * The Slack mrkdwn this node renders to. This is exactly the string that the
   * flavor returned, so `String(value) === value.ast.mrkdwn`.
   *
   * This field is an addition to the mdast vocabulary - it is what lets a node
   * be used as a string and as a tree at the same time.
   */
  mrkdwn: string;
};

/**
 * A sequence of sibling nodes. Produced by `lines`, and by any function which
 * joins several fragments together.
 *
 * Mirrors mdast's `root`.
 */
export type RootNode = AstNodeBase & {
  type: 'root';
  children: AstNode[];
};

/**
 * Content that wasn't produced by this library, e.g. a plain string argument.
 *
 * The value is treated as pre-rendered markdown rather than as literal text,
 * since composing already-rendered fragments is how this library is used.
 *
 * Mirrors mdast's `text`.
 */
export type TextNode = AstNodeBase & {
  type: 'text';
  value: string;
};

/**
 * Bold text. Produced by `bold`.
 *
 * Mirrors mdast's `strong`.
 */
export type StrongNode = AstNodeBase & {
  type: 'strong';
  children: AstNode[];
};

/**
 * Italicized text. Produced by `italics`.
 *
 * Mirrors mdast's `emphasis`.
 */
export type EmphasisNode = AstNodeBase & {
  type: 'emphasis';
  children: AstNode[];
};

/**
 * Struck through text. Produced by `strikethrough`.
 *
 * Mirrors mdast's (GFM) `delete`.
 */
export type DeleteNode = AstNodeBase & {
  type: 'delete';
  children: AstNode[];
};

/**
 * Inline code. Produced by `code`.
 *
 * Mirrors mdast's `inlineCode`.
 */
export type InlineCodeNode = AstNodeBase & {
  type: 'inlineCode';
  value: string;
};

/**
 * A link. Produced by `link` and `linkToHeader`. The label of the link is its
 * `children`, matching mdast - note that mdast's `title` is the link's tooltip,
 * which this library has no concept of.
 *
 * Mirrors mdast's `link`.
 */
export type LinkNode = AstNodeBase & {
  type: 'link';
  url: string;
  children: AstNode[];
};

/**
 * A heading. Produced by `h` and `h1` - `h6`.
 *
 * Mirrors mdast's `heading`, where `children` is the content of the heading
 * itself. The contents nested underneath the heading are kept in `section`,
 * which is an addition to the mdast vocabulary - mdast keeps them as siblings,
 * and {@link MrkdwnString.asMdast | asMdast} flattens them back out.
 */
export type HeadingNode = AstNodeBase & {
  type: 'heading';
  depth: number;
  children: AstNode[];
  section: AstNode[];
};

/**
 * A fenced code block. Produced by `codeBlock`.
 *
 * Mirrors mdast's `code`, with the code fence attributes kept in `attributes`.
 */
export type CodeNode = AstNodeBase & {
  type: 'code';
  value: string;
  lang?: string;
  attributes?: Record<string, string>;
};

/**
 * An ordered or unordered list. Produced by `orderedList` / `ol` and
 * `unorderedList` / `ul`.
 *
 * Mirrors mdast's `list`, with the nesting level kept in `level`, which is an
 * addition to the mdast vocabulary.
 */
export type ListNode = AstNodeBase & {
  type: 'list';
  ordered: boolean;
  start?: number;
  level: number;
  children: ListItemNode[];
};

/**
 * An item within a list.
 *
 * Mirrors mdast's `listItem`.
 */
export type ListItemNode = AstNodeBase & {
  type: 'listItem';
  children: AstNode[];
};

/**
 * A table. The first row holds the headers, as in mdast.
 *
 * Mirrors mdast's (GFM) `table`.
 */
export type TableNode = AstNodeBase & {
  type: 'table';
  children: TableRowNode[];
};

/**
 * A row within a table.
 *
 * Mirrors mdast's (GFM) `tableRow`.
 */
export type TableRowNode = AstNodeBase & {
  type: 'tableRow';
  children: TableCellNode[];
};

/**
 * A cell within a table row.
 *
 * Mirrors mdast's (GFM) `tableCell`.
 */
export type TableCellNode = AstNodeBase & {
  type: 'tableCell';
  children: AstNode[];
};

/**
 * A block quote. Produced by `blockQuote`.
 *
 * Mirrors mdast's `blockquote`.
 */
export type BlockquoteNode = AstNodeBase & {
  type: 'blockquote';
  children: AstNode[];
};

/**
 * Any node within the markdown AST.
 */
export type AstNode =
  | RootNode
  | TextNode
  | StrongNode
  | EmphasisNode
  | DeleteNode
  | InlineCodeNode
  | LinkNode
  | HeadingNode
  | CodeNode
  | ListNode
  | ListItemNode
  | TableNode
  | TableRowNode
  | TableCellNode
  | BlockquoteNode;

/**
 * The node types that are rendered inline, i.e. mdast's phrasing content.
 */
export type InlineAstNode =
  | TextNode
  | StrongNode
  | EmphasisNode
  | DeleteNode
  | InlineCodeNode
  | LinkNode;

const INLINE_TYPES: ReadonlySet<AstNode['type']> = new Set([
  'text',
  'strong',
  'emphasis',
  'delete',
  'inlineCode',
  'link',
]);

/**
 * Whether a node is rendered inline, i.e. is mdast phrasing content.
 *
 * @param node The node to check.
 * @returns Whether the node is inline.
 */
export function isInlineNode(node: AstNode): node is InlineAstNode {
  return INLINE_TYPES.has(node.type);
}

/**
 * A string of Slack mrkdwn which also carries the AST that produced it.
 *
 * Instances behave like strings: they can be interpolated into template
 * literals, concatenated, compared with `==`, and every `String` method is
 * available. Use {@link MrkdwnString.asBlockkitBlocks} to render the same
 * content as Block Kit blocks instead of mrkdwn.
 *
 * @example
 * ```typescript
 * import { h1, ul } from 'markdown-factory/slack-mrkdwn';
 *
 * const message = h1('Deploy finished', ul('api', 'web'));
 *
 * message.toString();           // the raw mrkdwn
 * message.asBlockkitBlocks();   // [{ type: 'header', ... }, { type: 'section', ... }]
 * message.asMdast();            // an mdast tree, for unified / remark
 * ```
 */
export class MrkdwnString extends String {
  /**
   * The AST that produced this string.
   */
  readonly ast: AstNode;

  constructor(ast: AstNode) {
    super(ast.mrkdwn);
    this.ast = ast;
  }

  /**
   * Renders this value as an array of Slack Block Kit blocks.
   *
   * @param options See {@link AsBlockkitBlocksOptions}.
   * @returns The Block Kit blocks representing this value.
   */
  asBlockkitBlocks(options?: AsBlockkitBlocksOptions): BlockkitBlock[] {
    return renderBlockkitBlocks(this.ast, options);
  }

  /**
   * Converts this value into an mdast tree, for use with the unified / remark
   * ecosystem. See {@link toMdast} for the details of the conversion.
   *
   * @returns The mdast root node.
   */
  asMdast(): MdastRoot {
    return toMdast(this.ast);
  }
}

/**
 * A value which can be passed to the slack-mrkdwn flavor as content. Either a
 * plain string, or the {@link MrkdwnString} returned by another call.
 */
export type MrkdwnStringLike = string | MrkdwnString;

/**
 * Type guard for {@link MrkdwnString}.
 *
 * @param value The value to check.
 * @returns Whether the value is a {@link MrkdwnString}.
 */
export function isMrkdwnString(value: unknown): value is MrkdwnString {
  return (
    value instanceof MrkdwnString ||
    // Duck typed so that values crossing module instances (e.g. an ESM and a
    // CJS copy of this package) are still recognized.
    (typeof value === 'object' &&
      value !== null &&
      'ast' in value &&
      typeof (value as { asBlockkitBlocks?: unknown }).asBlockkitBlocks ===
        'function')
  );
}

/**
 * Creates a {@link MrkdwnString} from an AST node.
 *
 * @param node The node to wrap.
 * @returns The string-like value carrying the node.
 */
export function mrkdwnString(node: AstNode): MrkdwnString {
  return new MrkdwnString(node);
}

/**
 * Converts a value into an AST node. Values produced by this library keep the
 * AST they were built with, anything else becomes a {@link TextNode}.
 *
 * @param value The value to convert.
 * @returns The corresponding AST node.
 */
export function toNode(value: MrkdwnStringLike): AstNode {
  if (isMrkdwnString(value)) {
    return value.ast;
  }
  const text = String(value);
  return { type: 'text', mrkdwn: text, value: text };
}

/**
 * Converts a value into a primitive string.
 *
 * @param value The value to convert.
 * @returns The primitive string.
 */
export function toRaw(value: MrkdwnStringLike): string {
  return typeof value === 'string' ? value : String(value);
}

/**
 * Strips inline formatting from a node, e.g. for use in Slack's `plain_text`
 * composition objects, which don't support mrkdwn.
 *
 * @param node The node to convert.
 * @returns The unformatted text of the node.
 */
export function toPlainText(node: AstNode): string {
  switch (node.type) {
    case 'inlineCode':
      return node.value;
    case 'link':
      return node.children.length
        ? node.children.map(toPlainText).join('')
        : node.url;
    case 'strong':
    case 'emphasis':
    case 'delete':
    case 'tableCell':
      return node.children.map(toPlainText).join('');
    case 'heading':
      return node.children.map(toPlainText).join('');
    case 'root':
      return node.children.map(toPlainText).join('\n\n');
    default:
      return node.mrkdwn;
  }
}
