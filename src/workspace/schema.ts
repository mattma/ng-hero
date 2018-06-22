export interface Schema {
    /**
     * The name of the workspace.
     */
    name: string;
    /**
     * The path where new projects will be created.
     */
    newProjectRoot?: string;
}
