import {
  apply,
  chain,
  mergeWith,
  Rule,
  template,
  url,
  Tree,
} from '@angular-devkit/schematics';
import {
  ITypeormInitializer,
  nesttypeorm,
  typeorm,
  dbpackages,
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
  ]);
}

function updatePackageJson(host: Tree, _options: ITypeormInitializer): string {
  const content = JSON.parse(host.read('package.json')!.toString('utf-8'));
  content.dependencies['@nestjs/typeorm'] = nesttypeorm;
  content.dependencies.typeorm = typeorm;
  content.dependencies[dbpackages[_options.db][0]] = dbpackages[_options.db][1];

  return JSON.stringify(content, null, 2);
}
