import { strings } from '@angular-devkit/core';
import {
  Rule,
  apply,
  mergeWith,
  template,
  url,
} from '@angular-devkit/schematics';
import { Schema as WorkspaceOptions } from './schema';

export default function (options: WorkspaceOptions): Rule {
  return mergeWith(apply(url('./files'), [
    template({
      utils: strings,
      ...options,
    }),
  ]));
}
