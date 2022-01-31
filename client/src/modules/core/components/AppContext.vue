<template>
  <AuthProvider>
      <slot name="default" />
  </AuthProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { AuthProvider } from '../../auth/composables/useAuth';

/** Configure provide / inject, and other things available to the whole app. */
const AppContext = defineComponent({
  name: 'AppContext',
  components: {
    AuthProvider,
  },
})

export default AppContext;
</script>
