<template>
  <v-btn
    :disabled="logoutLoading"
    class="LogoutBtn mb-2"
    @click="logout"
  >
    Logout
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

import { AuthKey, UseAuth } from '@/modules/auth/composables/useAuth';

const LogoutBtn = defineComponent({
  name: 'LogoutBtn',
  setup() {
    const {
      logout,
      logoutLoading,
    } = inject<UseAuth>(AuthKey)!;

    return {
      logout,
      logoutLoading,
    };
  },
});

export default LogoutBtn;
</script>

<style lang="scss">
.LogoutBtn {
}
</style>
