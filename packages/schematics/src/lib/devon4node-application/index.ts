import { join, strings, Path } from '@angular-devkit/core';
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
} from '@angular-devkit/schematics';
import { ModuleFinder } from '@nestjs/schematics/utils/module.finder';
import {
  ModuleDeclarator,
  DeclarationOptions,
} from '@nestjs/schematics/utils/module.declarator';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function devon4nodeApplication(_options: any): Rule {
  return chain([
    externalSchematic('@nestjs/schematics', 'application', _options),
    mergeWith(
      apply(url('./files'), [
        template({
          ...strings,
          ..._options,
        }),
        move(_options.name),
      ]),
    ),
    (host: Tree): Tree => {
      host.overwrite(
        join(_options.name, 'tsconfig.json'),
        updateTsConfig(host, _options),
      );
      return host;
    },
    (host: Tree): Tree => {
      host.overwrite(
        join(_options.name, 'package.json'),
        updatePackageJson(host, _options),
      );
      return host;
    },
    addDeclarationToModule(_options.name),
  ]);
}

function updateTsConfig(host: Tree, _options: any): string {
  const content = JSON.parse(
    host.read(join(_options.name, 'tsconfig.json'))!.toString('utf-8'),
  );
  content.compilerOptions.strict = true;
  content.compilerOptions.skipLibCheck = true;
  content.compilerOptions.skipDefaultLibCheck = true;
  content.compilerOptions.noUnusedLocals = true;
  content.compilerOptions.noUnusedParameters = true;
  content.compilerOptions.noFallthroughCasesInSwitch = true;

  return JSON.stringify(content, null, 2);
}

function updatePackageJson(host: Tree, _options: any): string {
  const content = JSON.parse(
    host.read(join(_options.name, 'package.json'))!.toString('utf-8'),
  );
  content.scripts.preinstall =
    'use-yarn || ( npm install --no-scripts --no-save use-yarn && use-yarn )';

  return JSON.stringify(content, null, 2);
}

function addDeclarationToModule(project: string): Rule {
  return (tree: Tree) => {
    const module = new ModuleFinder(tree).find({
      name: 'app',
      path: (project + '/src/') as Path,
    });
    if (!module) {
      return tree;
    }
    const content = tree.read(module)!.toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();
    tree.overwrite(
      module,
      declarator.declare(content, {
        module,
        metadata: 'imports',
        type: 'module',
        name: 'shared',
        path: join(project as Path, '/src/', 'shared'),
      } as DeclarationOptions),
    );
    return tree;
  };
}
