import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  Ref,
  watch,
} from 'vue';
import { intersection } from 'lodash';
import { ApolloClients } from '@vue/apollo-composable';
import { ApolloClient, NormalizedCache } from '@apollo/client';
import { useRouter } from 'vue-router';

import {
  useLogin,
  useLogout,
  useSignup,
} from '@/datasources/serverRest/endpoints/auth';
import type { GqlUserRoleType } from '@/__generated__/graphql';
import {
  UseGetUser,
  useGetUser,
  User,
} from '@/datasources/serverApollo/modules/user/useUser';
import { AppRoute } from '@/plugins/vueRouter/router';

export interface UseAuth
  extends Pick<UseGetUser, 'user' | 'userRoles' | 'userError' | 'userLoading'> {
  checkAuthorization: (roles: GqlUserRoleType[]) => boolean;
  authRedirectedFrom: Ref<string | null>;
  login: ReturnType<typeof useLogin>['call'];
  loginError: Ref<string | Error | null>;
  loginLoading: Ref<boolean>;
  signup: ReturnType<typeof useSignup>['call'];
  signupError: Ref<string | Error | null>;
  signupLoading: Ref<boolean>;
  logout: ReturnType<typeof useLogin>['call'];
  logoutError: Ref<string | Error | null>;
  logoutLoading: Ref<boolean>;
}

export const AuthKey = Symbol('auth');

/**
 * Check if user is authorized for any of the given roles
 *
 * Defined separately so it can be used in navigation guard.
 */
export const checkUserAuthorization = ({
  user,
  roles,
}: {
  user: User | null;
  roles: GqlUserRoleType[];
}) => {
  if (!user) return false;
  if (!roles.length) return true;

  // Eg userRoles: [ADMIN] and roles: [ADMIN, SUPERADMIN], then the overlap is [ADMIN]
  // so `length` is truthy.
  return Boolean(intersection(user.userRoles, roles).length);
};

export const useAuth = (): UseAuth => {
  const authRedirectedFrom: Ref<string | null> = ref(null);

  const apolloClients =
    inject<Record<string, ApolloClient<NormalizedCache>>>(ApolloClients);

  const { error: loginError, loading: loginLoading, call: doLogin } = useLogin(); // prettier-ignore
  const { error: signupError, loading: signupLoading, call: doSignup } = useSignup(); // prettier-ignore
  const { error: logoutError, loading: logoutLoading, call: doLogout } = useLogout(); // prettier-ignore

  const { user, userRoles, refetchUser, userError, userLoading } = useGetUser();

  const router = useRouter();

  /** Check if user is authorized for any of the given roles */
  const checkAuthorization = (roles: GqlUserRoleType[]) => {
    return checkUserAuthorization({
      user: user.value,
      roles,
    });
  };

  const isAuthorized = computed((): boolean =>
    checkAuthorization(router.currentRoute.value?.meta.requiredRoles ?? []),
  );

  // Redirect to login page if user loses authorization (eg logs out while on
  // a non-public route)
  watch(
    isAuthorized,
    (newIsAuthorized) => {
      if (!newIsAuthorized) {
        router.push({ name: AppRoute.LOGIN });
      }
    },
    { immediate: true },
  );

  const resetApolloClients = (): Promise<void[]> => {
    return Promise.all(
      Object.values(apolloClients ?? {}).map(async (apolloClient) => {
        await apolloClient.resetStore();
      }),
    );
  };

  const login: typeof doLogin = async (...args) => {
    await resetApolloClients();
    await doLogin(...args);
    await refetchUser();
  };

  const logout: typeof doLogout = async (...args) => {
    const res = await doLogout(...args);
    await resetApolloClients();
    await refetchUser();
    return res;
  };

  const signup: typeof doSignup = async (...args) => {
    await resetApolloClients();
    await doSignup(...args);
    await refetchUser();
  };

  return {
    user,
    userRoles,
    userError,
    userLoading,
    checkAuthorization,
    authRedirectedFrom,
    login,
    loginError,
    loginLoading,
    signup,
    signupError,
    signupLoading,
    logout,
    logoutError,
    logoutLoading,
  };
};

/**
 * Component that wraps provide/inject for auth.
 *
 * We use the component, because useAuth cannot be called in top-level
 * component. It depends on injected apolloClients, and so must be called
 * in a component that's a descendant to the component with apolloClients.
 * So, it cannot be introduced in main.ts.
 */
export const AuthProvider = defineComponent({
  name: 'AuthProvider',
  setup(_, { slots }) {
    const auth = useAuth();
    provide(AuthKey, auth);

    // https://lachlan-miller.me/articles/renderless-components-pattern-in-vue-3
    return () => slots.default?.();
  },
});
