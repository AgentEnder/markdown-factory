import { createProjectGraphAsync, ProjectConfiguration } from '@nrwl/devkit';
import parser from 'yargs-parser';

export type ExtraBuildStepReturnType =
  | { success: true }
  | { success: false; message: string };

export type ExtraBuildStep = (
  projectName: string,
  configuration: ProjectConfiguration,
  buildTarget: string
) => ExtraBuildStepReturnType | Promise<ExtraBuildStepReturnType>;

export async function applyExtraBuildSteps() {
  const args = parser(process.argv.slice(2));
  if (!args.project) {
    console.error('No project specified for extra build steps');
    return;
  }
  const projectGraph = await createProjectGraphAsync();
  const projectConfiguration = projectGraph.nodes[args.project].data;
  const projectBuildSteps: Record<string, ExtraBuildStep> = {
    ...require('./build-steps/global'),
    ...require(`./build-steps/${args.project}`),
  };
  const ora = await importESM<typeof import('ora')>('ora').then(
    (m: typeof import('ora')) => m.default
  );
  for (const fn in projectBuildSteps) {
    const spinner = ora();
    spinner.start(`Running extra build step: ${fn}`);
    await projectBuildSteps[fn](
      args.project,
      projectConfiguration,
      args.targetName
    );
    spinner.succeed();
  }
  process.exit(0);
}

applyExtraBuildSteps();

function importESM<T>(module: string) {
  return new Function('specifier', 'return import(specifier)')(
    module
  ) as Promise<T>;
}
