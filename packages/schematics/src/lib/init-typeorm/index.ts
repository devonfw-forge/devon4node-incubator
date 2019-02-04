import { join, Path } from '@angular-devkit/core';
import {
  apply,
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
import {
  dbpackages,
  ITypeormInitializer,
  nesttypeorm,
  typeorm,
} from './defaults';

export function initTypeorm(_options: ITypeormInitializer): Rule {
  return chain([
    mergeWith(
      apply(url('./files'), [
        template({
          ..._options,
        }),
      ]),
    ),
    (host: Tree): Tree => {
      host.overwrite('package.json', updatePackageJson(host, _options));
      return host;
    },
    addTypeormToAppModule(),
  ]);
}

function updatePackageJson(host: Tree, _options: ITypeormInitializer): string {
  const content = JSON.parse(host.read('package.json')!.toString('utf-8'));
  content.dependencies['@nestjs/typeorm'] = nesttypeorm;
  content.dependencies.typeorm = typeorm;
  content.dependencies[dbpackages[_options.db][0]] = dbpackages[_options.db][1];

  return JSON.stringify(content, null, 2);
}

function addTypeormToAppModule(): Rule {
  return chain([
    (tree: Tree): Tree => {
      const module = new ModuleFinder(tree).find({
        name: 'app',
        path: join('.' as Path, 'src/') as Path,
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
          name: 'typeOrm',
          path: join('.' as Path, '/src/'),
          symbol: 'TypeOrmModule.forRoot()',
        } as DeclarationOptions),
      );
      return tree;
    },
    (tree: Tree): Tree => {
      const modulePath = './src/app.module.ts';
      const moduleSource = tree.read(modulePath)!.toString('utf-8');
      const sourceFile = ts.createSourceFile(
        modulePath,
        moduleSource,
        ts.ScriptTarget.Latest,
        true,
      );
      insert(tree, 'src/app.module.ts', [
        insertImport(
          sourceFile,
          modulePath,
          'TypeOrmModule',
          '@nestjs/typeorm',
        ),
      ]);
      return tree;
    },
  ]);
}
