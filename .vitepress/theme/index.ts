// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Agenda from '../../components/Agenda.vue'
import Spectacles from '../../components/Spectacles.vue'
import Artistes from '../../components/Artistes.vue'
import './style.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Agenda', Agenda);
    app.component('Spectacles', Spectacles);
    app.component('Artistes', Artistes);
    // ...
  }
} satisfies Theme
