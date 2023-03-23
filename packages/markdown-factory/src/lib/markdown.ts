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
  return `*${contents}*;`;
}

export function bold(contents: string) {
  return `**${contents}**;`;
}

export function strikethrough(contents: string) {
  return `~~${contents}~~`;
}

export function code(contents: string) {
  return `\`${contents}\``;
}

export function codeBlock(contents: string, language?: string) {
  return `\`\`\`${language}
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

export function blockQuote(...fragments: string[]) {
  return lines(
    ...fragments.map((fragment) =>
      fragment
        .split('\n')
        .map((line) => '> ' + line)
        .join('\n')
    )
  );
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

// TODO: GET THIS FN WORKING
// export function tableOfContents(maxDepth: number, ...s: string[]) {
//   const allLines = s.flatMap((l) => l.split('\n'));
//   type Section = { label: string; children?: Section[] };

//   // This table of contents doesn't support root header / title.
//   function collectSubsections(
//     depth: number,
//     lines: string[],
//     startIndex: number
//   ): { subsections: Section[]; nextIndex: number } {
//     const subsections: Section[] = [];
//     let i = startIndex;
//     while (i < lines.length) {
//       const line = lines[i];
//       const match = line.match(/^(#+) (.*)$/);
//       if (match) {
//         const [, header, label] = match;
//         const headerLevel = header.length;
//         console.log('Checking line', lines[i], 'at index', i, {
//           headerLevel,
//           depth,
//         });
//         if (headerLevel > depth) {
//           const children = collectSubsections(headerLevel, lines, i + 1);
//           subsections.push({ label, children: children.subsections });
//           i = children.nextIndex;
//           continue;
//         } else if (headerLevel === depth) {
//           subsections.push({ label });
//         } else {
//           break;
//         }
//       }
//       i++;
//     }
//     return { subsections, nextIndex: i };
//   }

//   const sections = collectSubsections(2, allLines, 0).subsections;

//   function buildListsFromSection(section: Section, startIdx = 1, level = 1) {
//     const lists: string[] = [];
//     lists.push(orderedList({ level, startIdx }, section.label));
//     if (section.children) {
//       const newLists = section.children.map((s, idx) =>
//         buildListsFromSection(s, idx + 1, level + 1)
//       );
//       lists.push(...newLists);
//     }
//     return lines(lists);
//   }

//   return lines(
//     sections.map((s, idx) => buildListsFromSection(s, idx + 1)),
//     s
//   );
// }

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
    .map((line) => line.slice(minLeadingWhitespaceLength))
    .join('\n')
    .trim();
}
