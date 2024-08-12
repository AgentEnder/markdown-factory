import { LoadContext } from '@docusaurus/types';
import { workspaceRoot } from '@nx/devkit';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { stringify } from 'yaml';

export async function CopyReadmeAndChangelogPlugin(context: LoadContext) {
  const readme = removeTocFromReadme(
    readFileSync(join(workspaceRoot, './README.md'), 'utf-8')
  );
  const changelog = readFileSync(
    join(workspaceRoot, './CHANGELOG.md'),
    'utf-8'
  );

  writeFileSync(
    join(__dirname, '../../docs/index.md'),
    addFrontMatter(readme, {
      id: 'index',
      title: 'Home',
      hide_title: true,
      slug: '/',
      sidebar_position: 1,
    })
  );
  writeFileSync(
    join(__dirname, '../../docs/changelog.md'),
    addFrontMatter(changelog, {
      id: 'changelog',
      title: 'Changelog',
      hide_title: true,
      sidebar_position: 2,
      slug: '/changelog',
    })
  );

  return {
    // a unique name for this plugin
    name: 'copy-readme-and-changelog-plugin',
  };
}

function removeTocFromReadme(contents: string) {
  const lines = contents.split('\n');
  let line = lines.shift();
  while (line !== null && !line.startsWith('# ')) {
    line = lines.shift();
  }
  return [line, ...lines].join('\n');
}

function addFrontMatter(
  contents: string,
  frontMatter: Record<string, string | boolean | number>
) {
  return `---
${stringify(frontMatter).trim()}
---
${contents}`;
}
