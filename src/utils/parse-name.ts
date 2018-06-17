import { Path, basename, dirname, normalize } from '@angular-devkit/core';

export interface Location {
  name: string;
  page: Path;
}

export function parseName(root: string, pageName: string, name: string): Location {
  const nameWithoutPath = basename(name as Path);
  const namePath = dirname((`${root}src/app/${pageName}/${name}/`) as Path);

  return {
    name: nameWithoutPath,
    page: normalize('/' + namePath),
  };
}
