import isNil from 'lodash/isNil';
import { NavigationGuardNext, NavigationGuardWithThis } from 'vue-router';

/**
 * Apply multiple route guards at the same time.
 *
 * Route guards are executed based on the order in the array.
 */
export const mergeRouteGuards =
  (routeGuards: NavigationGuardWithThis<any>[]): NavigationGuardWithThis<any> =>
  async (routeTo, routeFrom, next) => {
    for (const routeGuard of routeGuards) {
      const nextValue = await new Promise<any>((res, rej) => {
        try {
          routeGuard(routeTo, routeFrom, res as NavigationGuardNext);
        } catch (err) {
          res(err);
        }
      });

      // If there is nextValue, it's either a redirect, or "false" to deny a redirect,
      // or an error, etc. Any of these mean we will stop here and let VueRouter handle it.
      if (!isNil(nextValue)) {
        next(nextValue);
        return;
      }
    }

    // If we got out of the loop, no guard raised an error or redirect, so
    // we can proceed to the new route.
    next();
  };
