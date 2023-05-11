import { ProjectConfiguration } from '@nrwl/devkit';
import { readFileSync } from 'fs';
import { copyFile } from 'fs/promises';
import { join } from 'path';
import type { ExtraBuildStep } from '../../extra-build-step';

const README_PATH = join(__dirname, '../../../README.md');

export const copyReadme: ExtraBuildStep = (
  projectName: string,
  config: ProjectConfiguration,
  targetName: string
) => {
  const outputPath = config.targets?.[targetName].options.outputPath;
  if (!outputPath) {
    return {
      success: false,
      message: `No output path specified for  ${targetName} in ${projectName}`,
    } as const;
  }

  try {
    assertReadmeUnchanged();
  } catch (e: unknown) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error.',
    } as const;
  }

  const destination = join(outputPath, 'README.md');
  console.log('Copying readme from', README_PATH, 'to', destination);
  return copyFile(README_PATH, destination)
    .then((s) => ({ success: true } as const))
    .catch(
      (s) => ({ success: false, message: 'Failed to copy file.' } as const)
    );
};

function assertReadmeUnchanged() {
  const currentReadmeContents = readFileSync('README.md', 'utf-8');
  const nextReadmeContents = require('../../generate-readme').contents;
  if (!currentReadmeContents === nextReadmeContents) {
    throw new Error(
      'README.md has changed. Please run `yarn generate-readme`.'
    );
  }
}
