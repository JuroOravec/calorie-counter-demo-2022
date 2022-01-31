<template>
  <v-layout class="AppLayout" @click="onLayoutClick">
    <v-app-bar
      absolute
      color="deep-purple"
      class="elevation-0"
    >
      <v-app-bar-nav-icon
        v-if="!hideDrawer"
        ref="drawerToggleRef"
        @click="showDrawer = !showDrawer"
      />

      <!-- TODO: Should be v-toolbar-title, but that's not available in Vuetify 3 -->
      <v-app-bar-title class="text-white">Calorie Counter Demo App</v-app-bar-title>

      <v-spacer />
      <LogoutBtn v-if="user" class="mx-4 my-2" />
    </v-app-bar>

    <v-navigation-drawer
      v-if="!hideDrawer"
      ref="drawerRef"
      v-model="showDrawer"
      absolute
      :temporary="false"
    >
      <v-list nav dense>
        <v-list-item
          v-for="item in availableMenuItems"
          :key="item.text"
          :prepend-icon="item.icon"
          :title="item.text"
          :to="{ name: item.to }"
          @click="showDrawer = false"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="px-16">
          <slot name="default" />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { ComponentPublicInstance, computed, defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import max from 'lodash/max';

import { AppRoute } from '@/plugins/vueRouter/router';
import { GqlUserRoleType } from '@/__generated__/graphql';
import LogoutBtn from '@/modules/auth/components/LogoutBtn.vue';
import { AuthKey, UseAuth } from '@/modules/auth/composables/useAuth';
import { elementCollidesWithMouseEvent } from '../utils/collide';

interface MenuItem {
  text: string;
  to: AppRoute;
  icon: string;
  requiredRoles: GqlUserRoleType[];
}

const menuItems: MenuItem[] = [{
  text: 'Home',
  to: AppRoute.FOOD_FEED,
  icon: 'mdi-home',
  requiredRoles: [],
}, {
  text: 'Admin Console',
  to: AppRoute.ADMIN_CONSOLE,
  icon: 'mdi-console',
  requiredRoles: [GqlUserRoleType.ADMIN],
}, {
  text: 'Admin Report',
  to: AppRoute.ADMIN_REPORT,
  icon: 'mdi-chart-timeline-variant',
  requiredRoles: [GqlUserRoleType.ADMIN],
}, {
  text: 'Settings',
  to: AppRoute.USER_SETTINGS,
  icon: 'mdi-cog',
  requiredRoles: [],
}];

const AppLayout = defineComponent({
  name: 'AppLayout',
  components: {
    LogoutBtn,
  },
  setup() {
    const showDrawer = ref(false);
    const drawerRef = ref<ComponentPublicInstance | null>(null);
    const drawerToggleRef = ref<ComponentPublicInstance | null>(null);

    const router = useRouter();
    const { checkAuthorization, user } = inject<UseAuth>(AuthKey)!;

    const hideDrawer = computed(() => router.currentRoute.value?.meta.hideDrawer);

    // Keep only those menu items that current user has priviledge for
    const availableMenuItems = computed((): MenuItem[] =>
      menuItems.filter(({requiredRoles}) => checkAuthorization(requiredRoles))
    );

    const currentMenuItem = computed(() => {
      const menuIndex = menuItems.findIndex((item) => item.to === router.currentRoute.value?.name);
      return max([0, menuIndex]);
    });

    // Close drawer on clicking outside it
    const onLayoutClick = (event: MouseEvent): void => {
      const drawerEls = [drawerToggleRef.value, drawerRef.value].map((component) => component?.$el as HTMLElement).filter(Boolean);
      if (!showDrawer.value || !drawerEls.length) return;

      // Ignore if we click on drawer element or toggle, etc
      const clickedDrawerEl = drawerEls.find((el) => elementCollidesWithMouseEvent(el, event));
      if (clickedDrawerEl) return;

      // At this point, drawer is open and we clicked outside, so we should close the drawer
      showDrawer.value = false;
    };

    return {
      drawerRef,
      drawerToggleRef,
      showDrawer,
      currentMenuItem,
      availableMenuItems,
      hideDrawer,
      onLayoutClick,
      user,
    };
  },
});

export default AppLayout;
</script>

<style lang="scss">
.AppLayout {
  overflow: hidden;

  .v-app-bar {
    background: linear-gradient(135deg, #DD2476, #FF512F);
    border-radius: 0% 0% 23% 77% / 0% 100% 50% 34%;
    height: 75px !important;
  }

  .v-main {
    padding-top: 92px !important;
  }

  .v-navigation-drawer .v-avatar {
    --v-avatar-height: 30px !important;
  }
}
</style>
