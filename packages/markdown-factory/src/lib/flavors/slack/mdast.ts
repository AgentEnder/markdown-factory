/**
 * @license Apache-2.0
 * @module markdown-factory/slack-mrkdwn
 *
 * @description Conversion of the markdown AST into an
 * {@link https://github.com/syntax-tree/mdast | mdast} tree.
 *
 * The node types below mirror the mdast spec (including the GFM `delete` and
 * table nodes) closely enough to be structurally assignable to the interfaces
 * in `@types/mdast`, so the result can be handed straight to unified / remark:
 *
 * ```typescript
 * import { unified } from 'unified';
 * import remarkStringify from 'remark-stringify';
 * import remarkGfm from 'remark-gfm';
 * import type { Root } from 'mdast';
 *
 * const tree: Root = h1('Title', ul('a', 'b')).asMdast();
 * const gfm = unified().use(remarkGfm).use(remarkStringify).stringify(tree);
 * ```
 *
 * They are declared here rather than imported so that this library keeps its
 * dependency free (and bundler friendly) install - consumers only need
 * `@types/mdast` if they want to name the types themselves.
 */

import type { AstNode, ListItemNode, TableRowNode } from './ast.js';
import { isInlineNode } from './ast.js';

/** Mirrors mdast's `text`. */
export type MdastText = { type: 'text'; value: string };
/** Mirrors mdast's `html`, which is passed through verbatim when serialized. */
export type MdastHtml = { type: 'html'; value: string };
/** Mirrors mdast's `inlineCode`. */
export type MdastInlineCode = { type: 'inlineCode'; value: string };
/** Mirrors mdast's `strong`. */
export type MdastStrong = { type: 'strong'; children: MdastPhrasingContent[] };
/** Mirrors mdast's `emphasis`. */
export type MdastEmphasis = {
  type: 'emphasis';
  children: MdastPhrasingContent[];
};
/** Mirrors mdast's (GFM) `delete`. */
export type MdastDelete = { type: 'delete'; children: MdastPhrasingContent[] };
/** Mirrors mdast's `link`. */
export type MdastLink = {
  type: 'link';
  url: string;
  title?: string | null;
  children: MdastPhrasingContent[];
};

/** The mdast phrasing content this library produces. */
export type MdastPhrasingContent =
  | MdastText
  | MdastHtml
  | MdastInlineCode
  | MdastStrong
  | MdastEmphasis
  | MdastDelete
  | MdastLink;

/** Mirrors mdast's `paragraph`. */
export type MdastParagraph = {
  type: 'paragraph';
  children: MdastPhrasingContent[];
};
/** Mirrors mdast's `heading`. */
export type MdastHeading = {
  type: 'heading';
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: MdastPhrasingContent[];
};
/** Mirrors mdast's `code`. */
export type MdastCode = {
  type: 'code';
  lang?: string | null;
  meta?: string | null;
  value: string;
};
/** Mirrors mdast's `blockquote`. */
export type MdastBlockquote = {
  type: 'blockquote';
  children: MdastBlockContent[];
};
/** Mirrors mdast's `listItem`. */
export type MdastListItem = {
  type: 'listItem';
  spread?: boolean | null;
  checked?: boolean | null;
  children: MdastBlockContent[];
};
/** Mirrors mdast's `list`. */
export type MdastList = {
  type: 'list';
  ordered?: boolean | null;
  start?: number | null;
  spread?: boolean | null;
  children: MdastListItem[];
};
/** Mirrors mdast's (GFM) `tableCell`. */
export type MdastTableCell = {
  type: 'tableCell';
  children: MdastPhrasingContent[];
};
/** Mirrors mdast's (GFM) `tableRow`. */
export type MdastTableRow = {
  type: 'tableRow';
  children: MdastTableCell[];
};
/** Mirrors mdast's (GFM) `table`. */
export type MdastTable = {
  type: 'table';
  children: MdastTableRow[];
};

/** The mdast block content this library produces. */
export type MdastBlockContent =
  | MdastParagraph
  | MdastHeading
  | MdastCode
  | MdastBlockquote
  | MdastList
  | MdastTable
  | MdastHtml;

/** Mirrors mdast's `root`. */
export type MdastRoot = {
  type: 'root';
  children: MdastBlockContent[];
};

/**
 * Converts a markdown AST node into an mdast tree.
 *
 * Two things are worth knowing about the conversion:
 *
 * - Content that this library didn't produce (plain string arguments) becomes
 *   an mdast `html` node rather than a `text` node, since it is already
 *   rendered markdown. `text` nodes are escaped when serialized, which would
 *   mangle fragments that were composed by hand.
 * - The contents nested underneath a heading become siblings of that heading,
 *   as mdast has no concept of a section.
 *
 * @param node The node to convert.
 * @returns The mdast root node.
 */
export function toMdast(node: AstNode): MdastRoot {
  return { type: 'root', children: toBlockContent(node) };
}

/**
 * Converts a node into mdast block content, wrapping inline content in a
 * paragraph.
 */
function toBlockContent(node: AstNode): MdastBlockContent[] {
  if (isInlineNode(node)) {
    const children = toPhrasingContent(node);
    return children.length ? [{ type: 'paragraph', children }] : [];
  }

  switch (node.type) {
    case 'root':
      return node.children.flatMap(toBlockContent);
    case 'heading':
      return [
        {
          type: 'heading',
          depth: clampDepth(node.depth),
          children: node.children.flatMap(toPhrasingContent),
        },
        ...node.section.flatMap(toBlockContent),
      ];
    case 'code':
      return [
        {
          type: 'code',
          lang: node.lang ?? null,
          meta: toCodeMeta(node.attributes),
          value: node.value,
        },
      ];
    case 'blockquote':
      return [
        { type: 'blockquote', children: node.children.flatMap(toBlockContent) },
      ];
    case 'list':
      return [
        {
          type: 'list',
          ordered: node.ordered,
          start: node.ordered ? node.start ?? 1 : null,
          children: node.children.map(toListItem),
        },
      ];
    case 'listItem':
      return toListItem(node).children;
    case 'table':
      return [{ type: 'table', children: node.children.map(toTableRow) }];
    case 'tableRow':
      return [{ type: 'table', children: [toTableRow(node)] }];
    case 'tableCell':
      return [{ type: 'paragraph', children: toPhrasingContent(node) }];
    default:
      // Every node type is handled above, so this is unreachable today. It
      // keeps the conversion total should a node type be added later.
      return [{ type: 'html', value: rawMrkdwn(node) }];
  }
}

/**
 * Converts a node into mdast phrasing content. Block level nodes have no
 * phrasing representation, so they are passed through as raw markdown.
 */
function toPhrasingContent(node: AstNode): MdastPhrasingContent[] {
  switch (node.type) {
    case 'text':
      // Already rendered markdown, so it is passed through rather than escaped.
      return node.value ? [{ type: 'html', value: node.value }] : [];
    case 'inlineCode':
      return [{ type: 'inlineCode', value: node.value }];
    case 'strong':
      return [{ type: 'strong', children: childPhrasing(node.children) }];
    case 'emphasis':
      return [{ type: 'emphasis', children: childPhrasing(node.children) }];
    case 'delete':
      return [{ type: 'delete', children: childPhrasing(node.children) }];
    case 'link':
      return [
        {
          type: 'link',
          url: node.url,
          children: node.children.length
            ? childPhrasing(node.children)
            : [{ type: 'text', value: node.url }],
        },
      ];
    case 'root':
    case 'heading':
    case 'tableCell':
      return childPhrasing(node.children);
    default:
      return node.mrkdwn ? [{ type: 'html', value: node.mrkdwn }] : [];
  }
}

function childPhrasing(children: AstNode[]): MdastPhrasingContent[] {
  return children.flatMap(toPhrasingContent);
}

function toListItem(node: ListItemNode): MdastListItem {
  return { type: 'listItem', children: node.children.flatMap(toBlockContent) };
}

function toTableRow(node: TableRowNode): MdastTableRow {
  return {
    type: 'tableRow',
    children: node.children.map((cell) => ({
      type: 'tableCell' as const,
      children: toPhrasingContent(cell),
    })),
  };
}

function toCodeMeta(attributes?: Record<string, string>): string | null {
  const entries = Object.entries(attributes ?? {});
  return entries.length
    ? entries.map(([key, value]) => `${key}="${value}"`).join(' ')
    : null;
}

/**
 * Reads the rendered mrkdwn off a node. Typed against {@link AstNode} so that
 * the exhaustive switches above can fall back to it.
 */
function rawMrkdwn(node: AstNode): string {
  return node.mrkdwn;
}

function clampDepth(depth: number): MdastHeading['depth'] {
  return Math.min(Math.max(Math.round(depth), 1), 6) as MdastHeading['depth'];
}
