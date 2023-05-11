import { ProjectConfiguration } from '@nrwl/devkit';
import { copyFile } from 'fs/promises';
import { join } from 'path';
import type { ExtraBuildStep } from '../../extra-build-step';

export const copyLicense: ExtraBuildStep = (
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
  const [from, to] = [
    join(__dirname, '../../../LICENSE'),
    join(outputPath, 'LICENSE'),
  ];
  console.log('Copying license from', from, 'to', to);
  return copyFile(from, to)
    .then((s) => ({ success: true } as const))
    .catch(
      (s) => ({ success: false, message: 'Failed to copy file.' } as const)
    );
};
