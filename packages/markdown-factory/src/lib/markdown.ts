export function h1(title: string, ...contents: string[]) {
  return lines(`# ${title}`, contents);
}

export function h2(title: string, ...contents: string[]) {
  return lines(`## ${title}`, contents);
}

export function h3(title: string, ...contents: string[]) {
  return lines(`### ${title}`, contents);
}

export function h4(title: string, ...contents: string[]) {
  return lines(`#### ${title}`, contents);
}

export function h5(title: string, ...contents: string[]) {
  return lines(`##### ${title}`, contents);
}

export function h6(title: string, ...contents: string[]) {
  return lines(`###### ${title}`, contents);
}

export function link(ref: string, title?: string) {
  return `[${title ?? ref}](${ref})`;
}

export function italics(contents: string) {
  return `*${contents}*`;
}

export function bold(contents: string) {
  return `**${contents}**`;
}

export function strikethrough(contents: string) {
  return `~~${contents}~~`;
}

export function code(contents: string) {
  return `\`${contents}\``;
}

export function codeBlock(contents: string, language?: string) {
  return `\`\`\`${language ? language : ''}
${contents}
\`\`\``;
}

type SimpleTableField<T> = keyof T;
type MappedTableField<T> = {
  label: string;
  mapFn: (el: T) => string;
};
type RenamedTableField<T> = {
  label: string;
  field: keyof T;
};

export type TableField<T extends Record<string, unknown>> =
  | SimpleTableField<T>
  | MappedTableField<T>
  | RenamedTableField<T>;

function normalizeTableField<T extends Record<string, unknown>>(
  f: TableField<T>
): MappedTableField<T> {
  return {
    label: typeof f === 'object' ? f.label : f.toString(),
    mapFn:
      typeof f === 'object' && 'mapFn' in f
        ? f.mapFn
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e) => (e[typeof f === 'object' ? f.field : f] as any).toString(),
  };
}

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

export function blockQuote(...fragments: string[]): string {
  const mappedFragments = fragments.map((f) =>
    f
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n')
  );
  return mappedFragments.join('\n>\n').trim();
}

export type OrderedListOptions = { level?: number; startIdx?: number };
export type UnorderedListOptions = { level?: number };

export function unorderedList(item: string, ...items: string[]): string;
export function unorderedList(
  options: UnorderedListOptions,
  ...items: string[]
): string;
export function unorderedList(
  itemOrOptions: string | UnorderedListOptions,
  ...items: string[]
): string {
  const level =
    typeof itemOrOptions === 'string' ? 0 : (itemOrOptions?.level ?? 1) - 1;
  if (typeof itemOrOptions === 'string') {
    items.unshift(itemOrOptions);
  }
  return lines(items.map((i) => `${'\t'.repeat(level)}- ${i}`));
}

export function orderedList(item: string, ...items: string[]): string;
export function orderedList(
  options: OrderedListOptions,
  ...items: string[]
): string;
export function orderedList(
  itemOrOptions: string | OrderedListOptions,
  ...items: string[]
): string {
  const level =
    typeof itemOrOptions === 'string' ? 0 : (itemOrOptions?.level ?? 1) - 1;
  const startIdx =
    typeof itemOrOptions === 'string' ? 1 : itemOrOptions?.startIdx ?? 1;
  if (typeof itemOrOptions === 'string') {
    items.unshift(itemOrOptions);
  }
  return lines(
    items.map((i, idx) => `${'\t'.repeat(level)}${startIdx + idx}. ${i}`)
  );
}

export function lines(...ls: (string[] | string)[]) {
  return ls.flat().join('\n\n');
}

export function linkToHeader(header: string, linkText?: string): string {
  const sanitized = header
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/[\s+]/g, '-');
  return link(`#${sanitized}`, linkText ?? header);
}

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
