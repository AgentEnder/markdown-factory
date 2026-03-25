# 1.0.0 (2026-03-25)

### 🚀 Features

- **docs-site:** upload algolia config ([b9af794](https://github.com/agentender/markdown-factory/commit/b9af794))
- ⚠️  **markdown-factory:** add dual CJS/ESM build with tsdown ([#9](https://github.com/agentender/markdown-factory/pull/9))
- **markdown-factory:** add attribute support for `codeBlock\' ([13b250f](https://github.com/agentender/markdown-factory/commit/13b250f))

### 🩹 Fixes

- ensure getting env doesn't break web consumers ([9688257](https://github.com/agentender/markdown-factory/commit/9688257))
- **markdown-factory:** add jsdoc / tsdoc comments ([e686124](https://github.com/agentender/markdown-factory/commit/e686124))

### ⚠️  Breaking Changes

- **markdown-factory:** add dual CJS/ESM build with tsdown  ([#9](https://github.com/agentender/markdown-factory/pull/9))
  `frontMatter()` is now async (returns Promise<string>).
  The `require('yaml')` call was replaced with `await import('yaml')` for
  ESM compatibility.

### ❤️ Thank You

- Craigory Coppola @AgentEnder

## 0.2.0 (2024-08-12)


### 🚀 Features

- **repo:** add docs-site ([bedd1cd](https://github.com/agentender/markdown-factory/commit/bedd1cd))

### 🩹 Fixes

- **markdown-factory:** avoid adding extra lines around frontMatter fence ([e6441d5](https://github.com/agentender/markdown-factory/commit/e6441d5))

### ❤️  Thank You

- Craigory Coppola @AgentEnder

## 0.1.0 (2024-08-07)


### 🚀 Features

- **markdown-factory:** add frontmatter function ([3815a57](https://github.com/agentender/markdown-factory/commit/3815a57))
- **repo:** add github actions ([5df4dc4](https://github.com/agentender/markdown-factory/commit/5df4dc4))

### ❤️  Thank You

- Craigory Coppola @AgentEnder