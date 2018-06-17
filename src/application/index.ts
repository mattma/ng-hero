/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { JsonObject, join, normalize, relative, strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  chain,
  mergeWith,
  move,
  template,
  url,
} from '@angular-devkit/schematics';
import {
  WorkspaceProject,
  WorkspaceSchema,
  addProjectToWorkspace,
  getWorkspace,
} from '../utils/config';
import { Schema as ApplicationOptions } from './schema';

function addAppToWorkspaceFile(options: ApplicationOptions, workspace: WorkspaceSchema): Rule {
  let projectRoot = options.projectRoot !== undefined
    ? options.projectRoot
    : `${workspace.newProjectRoot}/${options.name}`;
  if (projectRoot !== '' && !projectRoot.endsWith('/')) {
    projectRoot += '/';
  }
  const rootFilesRoot = options.projectRoot === undefined
    ? projectRoot
    : projectRoot + 'src/';

  const schematics: JsonObject = {};


  const project: WorkspaceProject = {
    root: projectRoot,
    sourceRoot: join(normalize(projectRoot), 'src'),
    projectType: 'application',
    prefix: options.prefix || 'app',
    schematics,
    architect: {
      build: {
        builder: '@angular-devkit/build-angular:browser',
        options: {
          outputPath: `dist/${options.name}`,
          index: `${projectRoot}src/index.html`,
          main: `${projectRoot}src/main.ts`,
          polyfills: `${projectRoot}src/polyfills.ts`,
          tsConfig: `${rootFilesRoot}tsconfig.app.json`,
          assets: [
            join(normalize(projectRoot), 'src', 'favicon.ico'),
            join(normalize(projectRoot), 'src', 'assets'),
          ],
          scripts: [],
        },
        configurations: {
          production: {
            fileReplacements: [{
              replace: `${projectRoot}src/environments/environment.ts`,
              with: `${projectRoot}src/environments/environment.prod.ts`,
            }],
            optimization: true,
            outputHashing: 'all',
            sourceMap: false,
            extractCss: true,
            namedChunks: false,
            aot: true,
            extractLicenses: true,
            vendorChunk: false,
            buildOptimizer: true,
          },
        },
      },
    },
  };

  return addProjectToWorkspace(workspace, options.name, project);
}

export default function (options: ApplicationOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.name) {
      throw new SchematicsException(`Invalid options, "name" is required.`);
    }

    const workspace = getWorkspace(host);
    let newProjectRoot = workspace.newProjectRoot;
    let appDir = `${newProjectRoot}/${options.name}`;
    let sourceRoot = `${appDir}/src`;
    let relativePathToWorkspaceRoot = appDir.split('/').map(x => '..').join('/');

    if (options.projectRoot !== undefined) {
      newProjectRoot = options.projectRoot;
      appDir = `${newProjectRoot}/src`;
      sourceRoot = appDir;
      relativePathToWorkspaceRoot = relative(normalize('/' + sourceRoot), normalize('/'));
      if (relativePathToWorkspaceRoot === '') {
        relativePathToWorkspaceRoot = '.';
      }
    }

    return chain([
      addAppToWorkspaceFile(options, workspace),
      mergeWith(
        apply(url('./files/src'), [
          template({
            utils: strings,
            ...options,
            relativePathToWorkspaceRoot,
          }),
          move(sourceRoot),
        ])),
    ]);
  };
}
