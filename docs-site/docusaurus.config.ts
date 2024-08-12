import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import RemarkGithubPlugin from 'remark-github';
import { CopyReadmeAndChangelogPlugin } from './src/plugins/copy-readme-changelog';

const config: Config = {
  title: 'Markdown Factory',
  tagline: 'A small utility library for generating markdown files',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://craigory.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: 'markdown-factory',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'agentender', // Usually your GitHub org/user name.
  projectName: 'markdown-factory', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    CopyReadmeAndChangelogPlugin,
    [
      'docusaurus-plugin-typedoc',

      // Options
      {
        entryPoints: [
          '../packages/markdown-factory/src/index.ts',
          '../packages/markdown-factory/src/lib/flavors/slack-mrkdwn.ts',
        ],
        tsconfig: '../packages/markdown-factory/tsconfig.lib.json',
        readme: 'none',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          remarkPlugins: [
            [RemarkGithubPlugin, { repository: 'agentender/markdown-factory' }],
          ],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Nx Github Pages',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/agentender/markdown-factory',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/markdown-factory',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/agentender/markdown-factory',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AgentEnder. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
