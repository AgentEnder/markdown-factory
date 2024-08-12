import * as defaultMarkdown from '../markdown';

export const slackMrkdwn: typeof import('../markdown') = {
  ...defaultMarkdown,
  link: (ref: string, title?: string) =>
    title ? `<${ref}|${title}>` : `<${ref}/>`,
  bold: (contents) => `*${contents}*`,
  italics: (contents) => `_${contents}_`,
  strikethrough: (contents) => `~${contents}~`,
} as const;

export default slackMrkdwn;
