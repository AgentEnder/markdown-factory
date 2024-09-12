"use strict";(self.webpackChunkdocs_site=self.webpackChunkdocs_site||[]).push([[3361],{7445:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>d,toc:()=>l});var s=t(2540),i=t(3023);const o={id:"index",title:"Home",hide_title:!0,slug:"/",sidebar_position:1},r="Markdown Factory",d={id:"index",title:"Home",description:"Utilities to easily generate valid markdown from within JavaScript",source:"@site/docs/index.md",sourceDirName:".",slug:"/",permalink:"/markdown-factory/",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{id:"index",title:"Home",hide_title:!0,slug:"/",sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Changelog",permalink:"/markdown-factory/changelog"}},a={},l=[{value:"Why?",id:"why",level:2},{value:"Getting Started",id:"getting-started",level:2},{value:"Installation",id:"installation",level:3},{value:"Usage",id:"usage",level:3},{value:"Examples",id:"examples",level:2},{value:"API",id:"api",level:2},{value:"Headers",id:"headers",level:3},{value:"<code>link</code>",id:"link",level:3},{value:"<code>linkToHeader</code>",id:"linktoheader",level:3},{value:"<code>table</code>",id:"table",level:3},{value:"<code>tableOfContents</code>",id:"tableofcontents",level:3},{value:"<code>codeBlock</code>",id:"codeblock",level:3},{value:"<code>stripIndents</code>",id:"stripindents",level:3},{value:"<code>blockQuote</code>",id:"blockquote",level:3},{value:"<code>orderedList</code>",id:"orderedlist",level:3},{value:"<code>unorderedList</code>",id:"unorderedlist",level:3}];function c(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"markdown-factory",children:"Markdown Factory"})}),"\n",(0,s.jsx)(n.p,{children:"Utilities to easily generate valid markdown from within JavaScript"}),"\n",(0,s.jsx)(n.h2,{id:"why",children:"Why?"}),"\n",(0,s.jsxs)(n.p,{children:["For static content, this library is ",(0,s.jsx)(n.strong,{children:"mostly"})," unnecessary. However, when generating a report from a dynamic data source this library can be rather useful."]}),"\n",(0,s.jsxs)(n.p,{children:["An example of using this library for dynamic data, could be the implementation of the ",(0,s.jsx)(n.code,{children:"tableOfContents"})," function. Inside it, we parse the headings and then use the utils to generate an appropriate table of contents. You can read more about it here: ",(0,s.jsx)(n.a,{href:"#tableofcontents",children:(0,s.jsx)(n.code,{children:"tableOfContents"})})]}),"\n",(0,s.jsx)(n.h2,{id:"getting-started",children:"Getting Started"}),"\n",(0,s.jsx)(n.h3,{id:"installation",children:"Installation"}),"\n",(0,s.jsx)(n.p,{children:"npm install markdown-factory"}),"\n",(0,s.jsx)(n.h3,{id:"usage",children:"Usage"}),"\n",(0,s.jsx)(n.p,{children:"Import the functions you need from markdown-factory, they are named based on the markdown they generate. For the most part, they take text content as the first argument, and any additional arguments are treated as sub-elements."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { h1, h2, h3 } from 'markdown-factory';\nh1('Hello World', h2('subheading', h3('sub-subheading', 'foo-bar')));\n"})}),"\n",(0,s.jsx)(n.h2,{id:"examples",children:"Examples"}),"\n",(0,s.jsx)(n.p,{children:"Some advanced usages of the library can be found below:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.a,{href:"https://github.com/agentender/markdown-factory/tree/main/tools/generate-readme.ts",children:(0,s.jsx)(n.code,{children:"generate-readme"})})," script generates this document"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.a,{href:"https://github.com/agentender/markdown-factory/tree/main/packages/markdown-factory/src/lib/markdown.ts",children:"implementation file"})," for this library contains ",(0,s.jsx)(n.code,{children:"tableOfContents"})," which dynamically composes several of these utility functions."]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"api",children:"API"}),"\n",(0,s.jsx)(n.h3,{id:"headers",children:"Headers"}),"\n",(0,s.jsxs)(n.p,{children:["Headers are generated using the ",(0,s.jsx)(n.code,{children:"h1"}),", ",(0,s.jsx)(n.code,{children:"h2"}),", ",(0,s.jsx)(n.code,{children:"h3"}),", ",(0,s.jsx)(n.code,{children:"h4"}),", ",(0,s.jsx)(n.code,{children:"h5"}),", and ",(0,s.jsx)(n.code,{children:"h6"})," functions. For example, a document with a title and 3 subsections could be generated like this:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"h1('Title', h2('Section 1', h3('Subsection 1', 'foo')), h2('Section 2', h3('Subsection 2', 'bar')), h2('Section 3', h3('Subsection 3', 'baz')));\n"})}),"\n",(0,s.jsx)(n.h3,{id:"link",children:(0,s.jsx)(n.code,{children:"link"})}),"\n",(0,s.jsxs)(n.p,{children:["A link can be generated using the ",(0,s.jsx)(n.code,{children:"link"})," function. It takes a url and optionally a label as arguments."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"link('https://google.com', 'Google');\n"})}),"\n",(0,s.jsx)(n.h3,{id:"linktoheader",children:(0,s.jsx)(n.code,{children:"linkToHeader"})}),"\n",(0,s.jsxs)(n.p,{children:["A link to a header can be generated using the ",(0,s.jsx)(n.code,{children:"linkToHeader"})," function. It takes a header and optionally a label as arguments."]}),"\n",(0,s.jsxs)(n.p,{children:["This differs from ",(0,s.jsx)(n.code,{children:"link"})," in that the contents of the ref are sanitized and parsed from header text first. This involves removing all non-alphanumeric characters, and replacing spaces with dashes. If this doesn't suit your use case, you should use ",(0,s.jsx)(n.code,{children:"link"})," directly instead."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"linkToHeader('Resources!', 'More Resources and Information');\n"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-markdown",children:"[More Resources and Information](#resources)\n"})}),"\n",(0,s.jsx)(n.h3,{id:"table",children:(0,s.jsx)(n.code,{children:"table"})}),"\n",(0,s.jsxs)(n.p,{children:["One of the more useful functions in this library is the ",(0,s.jsx)(n.code,{children:"table"})," function. It takes an array of objects, and a list of fields to display. The fields are described in one of 3 forms:"]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"A simple string, which will be used as the label and the field name"}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["An object with a ",(0,s.jsx)(n.code,{children:"label"})," and ",(0,s.jsx)(n.code,{children:"field"})," property, which will be used as the label and the field name, respectively."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["An object with a ",(0,s.jsx)(n.code,{children:"label"})," and ",(0,s.jsx)(n.code,{children:"mapFn"})," property, which will be used as the label and a function to map the item to a string value."]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["These can be mixed and matched within the ",(0,s.jsx)(n.code,{children:"fields"})," array as needed. For example, if you needed to relabel 1 field, and map another, you could do the following:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"table(items, [\n  {\n    label: 'First Name',\n    field: 'name',\n  },\n  'age',\n  {\n    label: 'City',\n    mapFn: (item) => item.address.city,\n  },\n]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"tableofcontents",children:(0,s.jsx)(n.code,{children:"tableOfContents"})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"tableOfContents"})," function takes a depth and the contents that it should cover. It will generate a table of contents for the headers up to the specified depth. For example, if you had a document with the following headers:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-markdown",children:"# Title\n\n## Section 1\n\n### Subsection 1\n\n### Subsection 2\n\n## Section 2\n\n### Subsection 3\n\n#### Subsubsection 1\n\n### Subsection 4\n"})}),"\n",(0,s.jsx)(n.p,{children:"You could generate a table of contents like this:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"tableOfContents(3, mrkdwnContents);\n"})}),"\n",(0,s.jsx)(n.p,{children:"The expected output would be:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-markdown",children:"- [Section 1](#section-1)\n  - [Subsection 1](#subsection-1)\n  - [Subsection 2](#subsection-2)\n- [Section 2](#section-2)\n  - [Subsection 3](#subsection-3)\n  - [Subsection 4](#subsection-4)\n"})}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:['Note: The depth passed into the function is equivalent to the maximum "level" of the headings displayed. e.g., ',(0,s.jsx)(n.code,{children:"depth=3"})," would not show any h4 or h5 headings."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"codeblock",children:(0,s.jsx)(n.code,{children:"codeBlock"})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"codeBlock"})," function takes a string of code and an optional language. It will wrap the code in a code block, and optionally add syntax highlighting for the language. For example:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { codeBlock } from 'markdown-factory';\ncodeBlock('const foo = \"bar\";', 'typescript');\n"})}),"\n",(0,s.jsx)(n.h3,{id:"stripindents",children:(0,s.jsx)(n.code,{children:"stripIndents"})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"stripIndents"})," function is rather unique in terms of this libraries functions. It doesn directly correlate to a markdown element, but is rather a utility function that strips leading whitespace from each line of a string. This doesn't affect the rendered markdown, but can be useful when writing code in a template string. For example, we can write this:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { codeBlock, stripIndents } from 'markdown-factory';\nif (someCondition) {\n  if (someOtherCondition) {\n    codeBlock(\n      stripIndents`\n      const foo = \"bar\";\n      const baz = \"qux\";\n    `,\n      'typescript'\n    );\n  }\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"Instead of this:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { codeBlock } from 'markdown-factory';\nif (someCondition) {\n  if (someOtherCondition) {\n    codeBlock(\n      `const foo = \"bar\";\nconst baz = \"qux\";`,\n      'typescript'\n    );\n  }\n}\n"})}),"\n",(0,s.jsx)(n.h3,{id:"blockquote",children:(0,s.jsx)(n.code,{children:"blockQuote"})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"blockQuote"})," function takes a string of text to render as a quote. For example:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { blockQuote } from 'markdown-factory';\nblockQuote('This is a quote');\n"})}),"\n",(0,s.jsx)(n.h3,{id:"orderedlist",children:(0,s.jsx)(n.code,{children:"orderedList"})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"orderedList"})," function takes a list of strings to render as an ordered list. For example:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { h1, orderedList } from 'markdown-factory';\nh1('Sandwich Recipe', orderedList('Slice bread', 'Spread mayo', 'Add lettuce', 'Add tomato', 'Add cheese', 'Add meat', 'Add condiments', 'Eat'));\n"})}),"\n",(0,s.jsxs)(n.p,{children:["You can also pass an options object as the first argument to the ",(0,s.jsx)(n.code,{children:"orderedList"})," function. The options object can contain the following properties:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"startIdx"})," - The number to start the list at. Defaults to 1."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"level - The level of the list (for nesting lists). Defaults to 1."}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"For example, the following code would produce a nested list that starts at 3:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { h1, orderedList } from 'markdown-factory';\nh1('Sandwich Recipe', orderedList(\n  lines(\n    'Slice bread',\n    orderedList(\n      {startIdx: 3, level: 2},\n      'Grab knife',\n      'Cut bread',\n      'Place on plate'\n    )\n  ),\n  'Spread mayo'\n)\n"})}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["Note - The actual numbers in an ordered list are not used in rendered markdown, but they are visible in the source. This is why the ",(0,s.jsx)(n.code,{children:"startIdx"})," option is useful. For example, the following two lists are identical once rendered:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-markdown",children:"# List 1\n\n1. Item 1\n2. Item 2\n3. Item 3\n\n# List 2\n\n1. Item 1\n1. Item 2\n1. Item 3\n"})}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"unorderedlist",children:(0,s.jsx)(n.code,{children:"unorderedList"})}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"unorderedList"})," function takes a list of strings to render as an unordered list. For example:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { h1, unorderedList } from 'markdown-factory';\nh1('Sandwich Ingredients', unorderedList('Bread', 'Mayo', 'Lettuce', 'Tomato', 'Cheese', 'Meat', 'Condiments'));\n"})}),"\n",(0,s.jsxs)(n.p,{children:["You can also pass an options object as the first argument to the ",(0,s.jsx)(n.code,{children:"unorderedList"})," function. The options object can contain the following properties:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"level - The level of the list (for nesting lists). Defaults to 1."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"For example, the following code would produce a nested list:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { h1, unorderedList } from 'markdown-factory';\nh1('Sandwich Ingredients', unorderedList(\n  'Bread',\n  'Ham',\n  lines(\n    'Condiments',\n    unorderedList(\n      { level: 2 },\n      'Ketchup',\n      'Mayo',\n      'Mustard'\n    )\n  ),\n  'Spread mayo'\n)\n"})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},3023:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>d});var s=t(3696);const i={},o=s.createContext(i);function r(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);