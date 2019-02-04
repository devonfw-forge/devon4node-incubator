/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT- style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Tree } from '@angular-devkit/schematics';
import {
  Change,
  InsertChange,
  NoopChange,
  RemoveChange,
  ReplaceChange,
} from '@schematics/angular/utility/change';

export function insert(host: Tree, modulePath: string, changes: Change[]) {
  const recorder = host.beginUpdate(modulePath);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    } else if (change instanceof RemoveChange) {
      recorder.remove((<any>change).pos - 1, (<any>change).toRemove.length + 1);
    } else if (change instanceof NoopChange) {
      // do nothing
    } else if (change instanceof ReplaceChange) {
      const action = <any>change;
      recorder.remove(action.pos + 1, action.oldText.length);
      recorder.insertLeft(action.pos + 1, action.newText);
    } else {
      throw new Error(`Unexpected Change '${change}'`);
    }
  }
  host.commitUpdate(recorder);
}
