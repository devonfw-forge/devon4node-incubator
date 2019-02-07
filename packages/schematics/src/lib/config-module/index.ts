import { join, Path, strings } from '@angular-devkit/core';
import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  Rule,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { ModuleMetadataDeclarator } from '@nestjs/schematics/utils/module-metadata.declarator';
import { DeclarationOptions } from '@nestjs/schematics/utils/module.declarator';
import { ModuleFinder } from '@nestjs/schematics/utils/module.finder';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import { insert } from '../../utils/ast-utils';

export function configModule(_options: any): Rule {
  return chain([
    branchAndMerge(
      mergeWith(
        apply(url('./files'), [
          template({
            ...strings,
            ..._options,
          }),
        ]),
      ),
    ),
    (host: Tree): Tree => {
      host.overwrite('package.json', updatePackageJson(host, _options));
      return host;
    },
    addConfigToSharedModule(),
  ]);
}

function updatePackageJson(host: Tree, _options: any): string {
  const content = JSON.parse(host.read('package.json')!.toString('utf-8'));
  content.dependencies['config'] = '^3.0.1';

  return JSON.stringify(content, null, 2);
}

function addConfigToSharedModule(): Rule {
  return chain([
    (tree: Tree): Tree => {
      const module = new ModuleFinder(tree).find({
        name: 'shared',
        path: join('.' as Path, 'src/shared/') as Path,
      });
      if (!module) {
        return tree;
      }
      const content = tree.read(module)!.toString();
      const declarator: ModuleMetadataDeclarator = new ModuleMetadataDeclarator();
      tree.overwrite(
        module,
        declarator.declare(content, {
          module,
          metadata: 'imports',
          type: 'module',
          name: 'Configuration',
          path: join('.' as Path, '/src/shared/'),
          symbol: 'ConfigurationModule',
        } as DeclarationOptions),
      );
      return tree;
    },
    (tree: Tree): Tree => {
      const modulePath = './src/shared/shared.module.ts';
      const moduleSource = tree.read(modulePath)!.toString('utf-8');
      const sourceFile = ts.createSourceFile(
        modulePath,
        moduleSource,
        ts.ScriptTarget.Latest,
        true,
      );
      insert(tree, 'src/shared/shared.module.ts', [
        insertImport(
          sourceFile,
          modulePath,
          'ConfigurationModule',
          './configuration/configuration.module',
        ),
      ]);
      return tree;
    },
  ]);
}
