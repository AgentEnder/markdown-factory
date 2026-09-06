/**
 * @license Apache-2.0
 * @module markdown-factory/slack-mrkdwn
 *
 * @description Rendering of the markdown AST into Slack Block Kit blocks.
 */

import type { AstNode, ListItemNode, ListNode } from './ast.js';
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
 * The subset of Block Kit blocks that markdown can be rendered into. These are
 * structurally compatible with the `KnownBlock` type from `@slack/types`, so
 * they can be passed directly to `chat.postMessage` and friends.
 */
export type BlockkitBlock = SectionBlock | HeaderBlock;

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
};

type ResolvedOptions = Required<AsBlockkitBlocksOptions>;

const DEFAULT_OPTIONS: ResolvedOptions = {
  maxHeaderLevel: 2,
  maxSectionLength: 3000,
  maxHeaderLength: 150,
  emoji: true,
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

  function pushCodeSection(contents: string) {
    // The fences count against the section limit, so leave room for them.
    for (const chunk of chunkText(contents, opts.maxSectionLength - 8)) {
      pushSection('```\n' + chunk + '\n```');
    }
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
        pushCodeSection(node.value);
        break;
      case 'table':
        flush();
        // Block Kit has no table primitive, so the markdown table is rendered
        // as preformatted text to keep the columns aligned.
        pushCodeSection(node.mrkdwn);
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
