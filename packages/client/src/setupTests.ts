/** ===========================================================================
 * Any global test setup for Jest
 * ============================================================================
 */

import "babel-polyfill";
import "jest-localstorage-mock";

// Mock Segment Analytics module
// @ts-ignore
// tslint:disable-next-line
global.analytics = {
  load: (args: any) => null,
  page: (args: any) => null,
  track: (args: any) => null,
  args: (args: any) => null,
};
