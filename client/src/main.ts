import { ApolloClients } from '@vue/apollo-composable';
import { createApp, h, provide } from 'vue';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import { createRouter } from './plugins/vueRouter/router';
import { serverApolloClient } from './datasources/serverApollo/serverApolloClient';

loadFonts();

const app = createApp({
  setup() {
    provide(ApolloClients, {
      default: serverApolloClient,
    });
  },
  render: () => h(App),
})
  .use(vuetify)
  .use(createRouter());

app.config.performance = true;

app.mount('#app');
