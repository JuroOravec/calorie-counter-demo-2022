<template>
  <v-app class="App">
    <AppContext>
      <AppLayout>
        <router-view />
      </AppLayout>
    </AppContext>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppLayout from './modules/core/components/AppLayout.vue';
import AppContext from './modules/core/components/AppContext.vue';

const App = defineComponent({
  name: 'App',
  components: {
    AppContext,
    AppLayout,
  },
})

export default App;
</script>

<style lang="scss">
:root {
  // See https://stackoverflow.com/questions/46522331/scroll-bar-in-the-main-section-of-a-v-app
  overflow-y: auto !important;
}

// Vuetify overrides
.v-overlay-container,
.App {
  // Make primary buttons stronk
  .v-btn.bg-primary {
    font-weight: 900 !important;
  }

  .v-input {
    .v-field__control {
      background: white;
    }
    .v-field__outline {
      color: #646464 !important;
    }

    .v-label {
      color: #646464 !important;
    }
  }
}

</style>
