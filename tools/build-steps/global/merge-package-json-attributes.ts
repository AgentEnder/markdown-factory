import { writeFileSync } from 'fs';
import { workspaceRoot } from '@nrwl/devkit';
import { join } from 'path';
import { ExtraBuildStep } from '../../extra-build-step';

export const mergePackageJsonAttributes: ExtraBuildStep = (
  projectName,
  config,
  buildTarget
) => {
  const outputPath = config.targets?.[buildTarget].options.outputPath;
  if (!outputPath) {
    return {
      success: false,
      message: `No output path specified for ${buildTarget} in ${projectName}`,
    } as const;
  }
  const builtPackageJson = require(join(workspaceRoot, outputPath, 'package.json'));
  const { license, author, bugs, homepage, repository } = require(join(
    __dirname,
    '../../../package.json'
  )) as typeof import('../../../package.json');
  const mergedPackageJson = {
    license,
    author,
    bugs,
    homepage,
    repository,
    ...builtPackageJson,
  };
  writeFileSync(
    join(outputPath, 'package.json'),
    JSON.stringify(mergedPackageJson, null, 2)
  );
  return { success: true };
};
