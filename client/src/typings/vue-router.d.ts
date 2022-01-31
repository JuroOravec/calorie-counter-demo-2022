import 'vue-router';

import type { GqlUserRoleType } from '@/__generated__/graphql';

declare module 'vue-router' {
  interface RouteMeta {
    /** Public path does not require auth. Default false (not public) */
    public?: boolean;
    /** Whether the layout drawer should be hidden */
    hideDrawer?: boolean;
    /**
     * List of roles that have access to the route. Empty list means any role can access it.
     */
    requiredRoles?: GqlUserRoleType[];
  }
}
