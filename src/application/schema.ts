/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export interface Schema {
    /**
     * The root directory of the new application.
     */
    projectRoot?: string;
    /**
     * The name of the application.
     */
    name: string;
    /**
     * The prefix to apply to generated selectors.
     */
    prefix?: string;
}
