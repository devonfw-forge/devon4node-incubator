import { join, strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  externalSchematic,
  mergeWith,
  move,
  Rule,
  template,
  Tree,
  url,
  branchAndMerge,
} from '@angular-devkit/schematics';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function devon4nodeApplication(_options: any): Rule {
  return chain([
    externalSchematic('@nestjs/schematics', 'application', _options),
    branchAndMerge(
      mergeWith(
        apply(url('./files'), [
          template({
            ...strings,
            ..._options,
          }),
          move(_options.name),
        ]),
      ),
    ),
    (host: Tree): Tree => {
      host.overwrite(
        join(_options.name, 'tsconfig.json'),
        updateTsConfig(host, _options),
      );
      return host;
    },
  ]);
}

function updateTsConfig(host: Tree, _options: any): string {
  const content = JSON.parse(
    host.read(join(_options.name, 'tsconfig.json'))!.toString('utf-8'),
  );
  content.compilerOptions.strict = true;

  return JSON.stringify(content, null, 2);
}
