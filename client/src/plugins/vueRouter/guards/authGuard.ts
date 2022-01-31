import { NavigationGuardWithThis } from 'vue-router';

import { transformGetMeUserQuery } from '@/datasources/serverApollo/modules/user/useUser';
import { serverApolloClient } from '@/datasources/serverApollo/serverApolloClient';
import { checkUserAuthorization } from '@/modules/auth/composables/useAuth';
import {
  getMeUserDocument,
  GqlgetMeUserQuery,
  GqlgetMeUserQueryVariables,
} from '@/__generated__/graphql';
import { AppRoute } from '../router';

export const authRouteGuard: NavigationGuardWithThis<void> = async (
  routeTo,
  routeFrom,
  next,
) => {
  const user = await serverApolloClient
    .query<GqlgetMeUserQuery, GqlgetMeUserQueryVariables>({
      query: getMeUserDocument,
      fetchPolicy: 'cache-first',
    })
    .then((result) => transformGetMeUserQuery(result.data));

  const userIsAuthorized = checkUserAuthorization({
    user,
    roles: routeTo.meta.requiredRoles ?? [],
  });

  const userCanAccessNewRoute =
    // Allow route if its public
    routeTo.meta.public ||
    // Or user is authenticated and authorized
    userIsAuthorized;

  // Redirect user to login page and remember where they wanted to go
  if (!userCanAccessNewRoute) {
    localStorage.setItem('authRedirectedFrom', routeTo.fullPath ?? '/');
    next({ name: AppRoute.LOGIN });
    return;
  }

  // User is not authorized, BUT they can access the page (eg it's public)
  // So we allow them to.
  if (!userIsAuthorized) {
    return next();
  }

  // At this point we have auth'd user and we want to send them back

  const redirectedFrom = localStorage.getItem('authRedirectedFrom');

  if (
    // Prevent user accessing LOGIN route when they are already logged in
    // Or send them back they were redirected
    routeTo.name === AppRoute.LOGIN ||
    redirectedFrom
  ) {
    next({ path: redirectedFrom ?? '/' });
    localStorage.removeItem('authRedirectedFrom');
    return;
  }

  // Otherwise, we let the route proceed
  next();
};
