import { GqlUserRoleType } from '@/__generated__/graphql';
import {
  Router,
  createRouter as createVueRouter,
  createWebHistory,
  RouteRecordRaw,
  NavigationGuardWithThis,
} from 'vue-router';
import { authRouteGuard } from './guards/authGuard';
import { mergeRouteGuards } from './utils/mergeRouteGuards';

const LoginPage = () => import('../../modules/auth/pages/LoginPage.vue');
const FoodFeedPage = () => import('../../modules/foodFeed/pages/FoodFeedPage.vue'); // prettier-ignore
const AdminConsolePage = () => import('../../modules/admin/pages/AdminConsolePage.vue'); // prettier-ignore
const AdminReportPage = () => import('../../modules/admin/pages/AdminReportPage.vue'); // prettier-ignore
const UserSettingsPage = () => import('../../modules/user/pages/UserSettingsPage.vue'); // prettier-ignore

export enum AppRoute {
  LOGIN = 'AppRoute__LOGIN',
  FOOD_FEED = 'AppRoute__FOOD_FEED',
  ADMIN_CONSOLE = 'AppRoute__ADMIN_CONSOLE',
  ADMIN_REPORT = 'AppRoute__ADMIN_REPORT',
  USER_SETTINGS = 'AppRoute__USER_SETTINGS',
}

const routes: RouteRecordRaw[] = [
  { name: AppRoute.FOOD_FEED, path: '/', component: FoodFeedPage },
  {
    name: AppRoute.LOGIN,
    path: '/login',
    component: LoginPage,
    meta: {
      hideDrawer: true,
      public: true,
    },
  },
  {
    name: AppRoute.ADMIN_CONSOLE,
    path: '/admin/console',
    component: AdminConsolePage,
    meta: {
      requiredRoles: [GqlUserRoleType.ADMIN],
    },
  },
  {
    name: AppRoute.ADMIN_REPORT,
    path: '/admin/report',
    component: AdminReportPage,
    meta: {
      requiredRoles: [GqlUserRoleType.ADMIN],
    },
  },
  {
    name: AppRoute.USER_SETTINGS,
    path: '/user/settings',
    component: UserSettingsPage,
  },
];

const routeGuards: NavigationGuardWithThis<any>[] = [authRouteGuard];

export const createRouter = (): Router => {
  const router = createVueRouter({
    history: createWebHistory(),
    routes,
  });

  const routeGuard = mergeRouteGuards(routeGuards);
  router.beforeEach(routeGuard);

  return router;
};
