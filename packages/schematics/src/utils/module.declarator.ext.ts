import { capitalize, classify } from '@angular-devkit/core/src/utils/strings';
import { ModuleImportDeclarator } from '@nestjs/schematics/utils/module-import.declarator';
import { ModuleMetadataDeclarator } from '@nestjs/schematics/utils/module-metadata.declarator';
import { DeclarationOptions } from '@nestjs/schematics/utils/module.declarator';
export class ModuleDeclaratorExt {
  constructor(
    private imports: ModuleImportDeclarator = new ModuleImportDeclarator(),
    private metadata: ModuleMetadataDeclarator = new ModuleMetadataDeclarator(),
  ) {}

  public declare(content: string, options: DeclarationOptions): string {
    const prevSymb = options.symbol;
    options = this.computeSymbol(options);
    content = this.imports.declare(content, options);
    options.symbol = prevSymb || options.symbol;
    content = this.metadata.declare(content, options);
    return content;
  }

  private computeSymbol(options: DeclarationOptions): DeclarationOptions {
    const target = Object.assign({}, options);
    if (options.type !== undefined) {
      target.symbol = classify(options.name).concat(capitalize(options.type));
    } else {
      target.symbol = classify(options.name);
    }
    return target;
  }
}
