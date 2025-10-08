// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Image from '../components/Image.vue'
import ResrvBanner from '../components/ResrvBanner.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(ResrvBanner),
      'home-features-after': () => h(ResrvBanner)
    })
  },
  enhanceApp({ app }) {
    // register your custom global components
    app.component('Image', Image)
  }
}