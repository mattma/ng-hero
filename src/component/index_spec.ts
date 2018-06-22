import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ComponentOptions } from './schema';
import { Schema as ApplicationOptions } from '../application/schema';
import { Schema as WorkspaceOptions } from '../workspace/schema';


fdescribe('Enum Schematic', () => {
  const projectName = 'bar';
  const projectPrefix = 'hero';
  const componentName = 'foo';
  const pageName = 'my-page';
  const fullPath = `/projects/${projectName}/src/app/${pageName}/${componentName}`;

  const schematicRunner = new SchematicTestRunner(
    'smart',
    path.join(__dirname, '../collection.json'),
  );
  const defaultOptions: ComponentOptions = {
    name: componentName,
    page: pageName,
    project: projectName,
    prefix: projectPrefix,
    inlineTemplate: false,
  };
  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
  };
  const appOptions: ApplicationOptions = {
    name: projectName,
    prefix: projectPrefix,
  };

  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = schematicRunner.runSchematic('workspace', workspaceOptions);
    appTree = schematicRunner.runSchematic('application', appOptions, appTree);
  });

  it('should generate component folder and ts,html,scss files', () => {
    const options = { ...defaultOptions };
    const tree = schematicRunner.runSchematic('smart', options, appTree);
    const files = tree.files;

    expect(files.indexOf(`${fullPath}/${componentName}.component.ts`)).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${fullPath}/${componentName}.component.html`)).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${fullPath}/${componentName}.component.scss`)).toBeGreaterThanOrEqual(0);
  });

  it('should generate component folder and ts,scss files without html file', () => {
    const options = { ...defaultOptions, inlineTemplate: true };
    const tree = schematicRunner.runSchematic('smart', options, appTree);
    const files = tree.files;

    expect(files.indexOf(`${fullPath}/${componentName}.component.ts`)).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${fullPath}/${componentName}.component.scss`)).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${fullPath}/${componentName}.component.html`)).toEqual(-1);
  });
});
