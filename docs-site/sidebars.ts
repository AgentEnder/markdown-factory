import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'index',
    },
    {
      type: 'doc',
      id: 'changelog',
    },
    {
      type: 'category',
      label: 'Typedoc API',
      link: {
        type: 'doc',
        id: 'api/index',
      },
      items: require('./docs/api/typedoc-sidebar.cjs'),
    },
  ],
  typedocSidebar: [],
};

export default sidebars;
