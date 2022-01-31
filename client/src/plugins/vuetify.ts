// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify, ThemeDefinition } from 'vuetify';

const mainTheme: ThemeDefinition = {
  colors: {
    primary: '#26D6CF',
    secondary: '#9c9c9c',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',

    background: '#fbfbfb',
    surface: 'white',

    'on-primary': 'white',
    'on-surface': '#191919',
  },
  dark: false,
  variables: {
    // 'border-color': 'red',
    // 'border-opacity': 1,
  },
};

export default createVuetify({
  theme: {
    defaultTheme: 'main',
    themes: {
      main: mainTheme,
    },
  },
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
