/**
 * @license Apache-2.0
 * @module markdown-factory/slack-mrkdwn
 *
 * @description Rendering of the markdown AST into Slack Block Kit blocks.
 */

import type {
  AstNode,
  ListItemNode,
  ListNode,
  TableCellNode,
  TableNode,
} from './ast.js';
import { toPlainText } from './ast.js';

/**
 * A Slack `plain_text` composition object.
 */
export type PlainTextObject = {
  type: 'plain_text';
  text: string;
  emoji?: boolean;
};

/**
 * A Slack `mrkdwn` composition object.
 */
export type MrkdwnTextObject = {
  type: 'mrkdwn';
  text: string;
  verbatim?: boolean;
};

/**
 * Either flavor of Slack text composition object.
 */
export type TextObject = PlainTextObject | MrkdwnTextObject;

/**
 * A Slack `section` block.
 */
export type SectionBlock = {
  type: 'section';
  text: MrkdwnTextObject;
  block_id?: string;
};

/**
 * A Slack `header` block.
 */
export type HeaderBlock = {
  type: 'header';
  text: PlainTextObject;
  block_id?: string;
};

/**
 * The styles a piece of rich text can carry.
 */
export type RichTextStyle = {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  code?: boolean;
  underline?: boolean;
};

/**
 * A run of text within a rich text element.
 */
export type RichTextText = {
  type: 'text';
  text: string;
  style?: RichTextStyle;
};

/**
 * A link within a rich text element.
 */
export type RichTextLink = {
  type: 'link';
  url: string;
  text?: string;
  style?: RichTextStyle;
};

/**
 * The elements that can appear inside a `rich_text_section`.
 */
export type RichTextElement = RichTextText | RichTextLink;

/**
 * A run of inline content within a `rich_text` block.
 */
export type RichTextSection = {
  type: 'rich_text_section';
  elements: RichTextElement[];
};

/**
 * Preformatted (code block) content within a `rich_text` block.
 */
export type RichTextPreformatted = {
  type: 'rich_text_preformatted';
  elements: RichTextElement[];
  border?: 0 | 1;
};

/**
 * A Slack `rich_text` block.
 */
export type RichTextBlock = {
  type: 'rich_text';
  elements: (RichTextSection | RichTextPreformatted)[];
  block_id?: string;
};

/**
 * A `raw_text` table cell. Slack requires at least one character.
 */
export type RawTextObject = {
  type: 'raw_text';
  text: string;
};

/**
 * A cell within a table row. Cells carrying formatting are `rich_text`,
 * everything else is `raw_text`.
 */
export type TableCell = RawTextObject | RichTextBlock;

/**
 * Per column display settings for a `table` block.
 */
export type TableColumnSettings = {
  align?: 'left' | 'center' | 'right';
  is_wrapped?: boolean;
};

/**
 * A Slack `table` block. The first row is rendered as the header.
 *
 * Only messages support this block - see
 * {@link AsBlockkitBlocksOptions.tableBlocks}.
 */
export type TableBlock = {
  type: 'table';
  rows: TableCell[][];
  column_settings?: TableColumnSettings[];
  block_id?: string;
};

/**
 * The subset of Block Kit blocks that markdown can be rendered into. These are
 * structurally compatible with the `KnownBlock` type from `@slack/types`, so
 * they can be passed directly to `chat.postMessage` and friends.
 */
export type BlockkitBlock =
  | SectionBlock
  | HeaderBlock
  | RichTextBlock
  | TableBlock;

/**
 * Slack rejects a `table` block with more than 100 rows.
 */
const MAX_TABLE_ROWS = 100;

/**
 * Slack rejects a `table` block with more than 20 cells in a row.
 */
const MAX_TABLE_COLUMNS = 20;

/**
 * Slack rejects a `table` block whose cells hold more than 10,000 characters
 * in total, and applies the same budget across every table in a message.
 */
const MAX_TABLE_CHARACTERS = 10000;

/**
 * Options for {@link renderBlockkitBlocks} / `asBlockkitBlocks`.
 */
export type AsBlockkitBlocksOptions = {
  /**
   * The deepest heading level that is rendered as a `header` block. Headings
   * deeper than this are rendered as bold text within a `section` block, since
   * Slack's `header` block has a single visual style.
   *
   * @defaultValue 2
   */
  maxHeaderLevel?: number;
  /**
   * The maximum number of characters placed in a single `section` block. Text
   * longer than this is split across multiple `section` blocks, preferring to
   * split on line boundaries.
   *
   * Slack rejects `section` blocks with more than 3000 characters of text.
   *
   * @defaultValue 3000
   */
  maxSectionLength?: number;
  /**
   * The maximum number of characters allowed in a `header` block. Longer
   * headings are truncated with an ellipsis.
   *
   * Slack rejects `header` blocks with more than 150 characters of text.
   *
   * @defaultValue 150
   */
  maxHeaderLength?: number;
  /**
   * Whether Slack should escape emoji within `header` blocks.
   *
   * @defaultValue true
   */
  emoji?: boolean;
  /**
   * Whether tables are rendered as `table` blocks. Only messages support them,
   * so set this to `false` when the blocks are destined for a modal or an App
   * Home tab, and tables will be rendered as preformatted text instead.
   *
   * A table that Slack would reject - more than 100 rows, more than 20 columns,
   * or more than 10,000 characters of cell content in the message - falls back
   * to preformatted text on its own, whatever this is set to.
   *
   * @defaultValue true
   */
  tableBlocks?: boolean;
};

type ResolvedOptions = Required<AsBlockkitBlocksOptions>;

const DEFAULT_OPTIONS: ResolvedOptions = {
  maxHeaderLevel: 2,
  maxSectionLength: 3000,
  maxHeaderLength: 150,
  emoji: true,
  tableBlocks: true,
};

/**
 * Renders a markdown AST node into an array of Slack Block Kit blocks.
 *
 * @param node The AST node to render. Typically obtained from the `ast`
 * property of a value returned by the slack-mrkdwn flavor.
 * @param options See {@link AsBlockkitBlocksOptions}.
 * @returns The Block Kit blocks representing the node.
 */
export function renderBlockkitBlocks(
  node: AstNode,
  options: AsBlockkitBlocksOptions = {}
): BlockkitBlock[] {
  const opts: ResolvedOptions = { ...DEFAULT_OPTIONS, ...options };
  const blocks: BlockkitBlock[] = [];
  // Inline content is buffered so that adjacent inline nodes (e.g. the
  // paragraphs passed to `lines`) end up within a single section block.
  let buffer: string[] = [];
  // Slack budgets table cell characters across the whole message, not per
  // table, so it is tracked for the duration of the render.
  let tableCharacterBudget = MAX_TABLE_CHARACTERS;

  function flush() {
    if (buffer.length === 0) {
      return;
    }
    const text = buffer.join('\n\n');
    buffer = [];
    pushSection(text);
  }

  function pushSection(text: string) {
    for (const chunk of chunkText(text, opts.maxSectionLength)) {
      blocks.push({ type: 'section', text: { type: 'mrkdwn', text: chunk } });
    }
  }

  function pushPreformatted(contents: string) {
    for (const chunk of chunkText(contents, opts.maxSectionLength)) {
      blocks.push({
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_preformatted',
            elements: [{ type: 'text', text: chunk }],
          },
        ],
      });
    }
  }

  function pushTable(node: TableNode) {
    const rows = node.children;
    const columns = Math.max(0, ...rows.map((row) => row.children.length));
    const characters = tableCharacterCount(node);
    if (
      !opts.tableBlocks ||
      rows.length > MAX_TABLE_ROWS ||
      columns > MAX_TABLE_COLUMNS ||
      characters > tableCharacterBudget
    ) {
      // Falling back keeps the message valid, and the markdown table is
      // already aligned for a monospaced font.
      pushPreformatted(node.mrkdwn);
      return;
    }
    tableCharacterBudget -= characters;
    blocks.push({
      type: 'table',
      rows: rows.map((row) => row.children.map(toTableCell)),
    });
  }

  function visit(node: AstNode) {
    switch (node.type) {
      case 'root':
      case 'listItem':
        node.children.forEach(visit);
        break;
      case 'heading': {
        flush();
        const title = node.children.map(toPlainText).join('').trim();
        if (title) {
          if (node.depth <= opts.maxHeaderLevel) {
            blocks.push({
              type: 'header',
              text: {
                type: 'plain_text',
                text: truncate(title, opts.maxHeaderLength),
                emoji: opts.emoji,
              },
            });
          } else {
            pushSection(`*${title}*`);
          }
        }
        node.section.forEach(visit);
        break;
      }
      case 'code':
        flush();
        pushPreformatted(node.value);
        break;
      case 'table':
        flush();
        pushTable(node);
        break;
      case 'blockquote':
        flush();
        // `node.mrkdwn` is already prefixed with `>`, which Slack renders as a
        // quote.
        pushSection(node.mrkdwn);
        break;
      case 'list':
        flush();
        pushSection(renderList(node));
        break;
      default: {
        const text = node.mrkdwn.trim();
        if (text) {
          buffer.push(text);
        }
        break;
      }
    }
  }

  visit(node);
  flush();
  return blocks;
}

/**
 * Counts the characters Slack bills a table for, which is the content of its
 * cells rather than the rendered markdown.
 */
function tableCharacterCount(node: TableNode): number {
  return node.children.reduce(
    (total, row) =>
      row.children.reduce(
        (rowTotal, cell) => rowTotal + cell.mrkdwn.length,
        0
      ) + total,
    0
  );
}

/**
 * Converts a table cell into its Block Kit representation. Cells that carry
 * formatting become `rich_text` so that links and emphasis render; plain cells
 * become `raw_text`, which Slack shows verbatim.
 */
function toTableCell(cell: TableCellNode): TableCell {
  const [content] = cell.children;
  if (content && content.type !== 'text') {
    return {
      type: 'rich_text',
      elements: [
        { type: 'rich_text_section', elements: toRichTextElements(content) },
      ],
    };
  }
  // Slack rejects a `raw_text` cell with an empty string.
  return { type: 'raw_text', text: cell.mrkdwn || ' ' };
}

/**
 * Converts inline AST content into rich text elements, carrying emphasis down
 * as Slack style flags. Block level content has no rich text equivalent, so it
 * falls back to its rendered mrkdwn as plain text.
 */
function toRichTextElements(
  node: AstNode,
  style: RichTextStyle = {}
): RichTextElement[] {
  const withStyle = (extra: RichTextStyle) => ({ ...style, ...extra });
  const styled = (text: string, applied: RichTextStyle): RichTextElement[] =>
    text ? [{ type: 'text', text, ...maybeStyle(applied) }] : [];

  switch (node.type) {
    case 'text':
      return styled(node.value, style);
    case 'strong':
      return node.children.flatMap((child) =>
        toRichTextElements(child, withStyle({ bold: true }))
      );
    case 'emphasis':
      return node.children.flatMap((child) =>
        toRichTextElements(child, withStyle({ italic: true }))
      );
    case 'delete':
      return node.children.flatMap((child) =>
        toRichTextElements(child, withStyle({ strike: true }))
      );
    case 'inlineCode':
      return styled(node.value, withStyle({ code: true }));
    case 'link':
      return [
        {
          type: 'link',
          url: node.url,
          text: toPlainText(node),
          ...maybeStyle(style),
        },
      ];
    case 'root':
    case 'tableCell':
      return node.children.flatMap((child) => toRichTextElements(child, style));
    default:
      return styled(node.mrkdwn, style);
  }
}

function maybeStyle(style: RichTextStyle): { style?: RichTextStyle } {
  return Object.keys(style).length ? { style } : {};
}

/**
 * Renders a list node as Slack mrkdwn. Slack has no list primitive within
 * `section` blocks, so bullets/numbers are rendered manually.
 */
function renderList(node: ListNode, depth = 0): string {
  // A list may be nested structurally (an item containing another list) or via
  // the `level` option. Whichever is deeper wins, so that passing `level: 2` to
  // a structurally nested list doesn't double indent it.
  const indent = '    '.repeat(Math.max(node.level - 1, depth));
  const lines: string[] = [];
  const start = node.start ?? 1;

  node.children.forEach((item, idx) => {
    const bullet = node.ordered ? `${start + idx}.` : '•';
    const { lead, nested } = splitListItem(item);
    const leadLines = lead.split('\n');
    lines.push(`${indent}${bullet} ${leadLines[0] ?? ''}`.trimEnd());
    // Keep wrapped lines visually attached to their bullet.
    const continuation = `${indent}${' '.repeat(bullet.length + 1)}`;
    for (const line of leadLines.slice(1)) {
      lines.push(`${continuation}${line}`.trimEnd());
    }
    for (const child of nested) {
      lines.push(renderList(child, Math.max(node.level - 1, depth) + 1));
    }
  });

  return lines.join('\n');
}

/**
 * Splits a list item into the text rendered next to its bullet and any lists
 * nested underneath it.
 */
function splitListItem(item: ListItemNode): {
  lead: string;
  nested: ListNode[];
} {
  const lead: string[] = [];
  const nested: ListNode[] = [];
  for (const child of item.children) {
    if (child.type === 'list') {
      nested.push(child);
    } else {
      lead.push(child.mrkdwn);
    }
  }
  return { lead: lead.join('\n').trim(), nested };
}

/**
 * Splits text into chunks no longer than `maxLength`, preferring line
 * boundaries so that formatting isn't broken mid-line.
 */
function chunkText(text: string, maxLength: number): string[] {
  const trimmed = trimBlankLines(text);
  if (!trimmed) {
    return [];
  }
  const limit = Math.max(maxLength, 1);
  if (trimmed.length <= limit) {
    return [trimmed];
  }

  const chunks: string[] = [];
  let current = '';
  const push = (chunk: string) => {
    const trimmedChunk = trimBlankLines(chunk);
    if (trimmedChunk) {
      chunks.push(trimmedChunk);
    }
  };
  for (const line of trimmed.split('\n')) {
    const candidate = current ? `${current}\n${line}` : line;
    if (candidate.length <= limit) {
      current = candidate;
      continue;
    }
    push(current);
    current = '';
    if (line.length <= limit) {
      current = line;
      continue;
    }
    // A single line longer than the limit has to be split mid-line.
    for (let idx = 0; idx < line.length; idx += limit) {
      const slice = line.slice(idx, idx + limit);
      if (slice.length === limit) {
        push(slice);
      } else {
        current = slice;
      }
    }
  }
  push(current);
  return chunks;
}

/**
 * Removes leading and trailing blank lines without touching the indentation of
 * the lines that are kept.
 */
function trimBlankLines(text: string): string {
  const lines = text.split('\n');
  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }
  while (lines.length && !lines[lines.length - 1].trim()) {
    lines.pop();
  }
  return lines.join('\n');
}

function truncate(text: string, maxLength: number): string {
  return text.length <= maxLength
    ? text
    : `${text.slice(0, Math.max(maxLength - 1, 0))}…`;
}
