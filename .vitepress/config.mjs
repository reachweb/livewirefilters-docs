import { defineConfig } from 'vitepress'
import { createHighlighter } from 'shiki'
import path from 'path'
import {readFileSync} from "fs"

const antlersDef = JSON.parse(readFileSync(path.resolve(__dirname, './languages/antlers.tmLanguage.json'), 'utf8'))


export default defineConfig({
  title: "Statamic Livewire Filters",
  cleanUrls: true,
  sitemap: {
    hostname: 'https://livewirefilters.com/'
  },
  description: "Supercharge your Statamic Collections using Livewire.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/overview' },
      {
        text: 'v2.8.0',
        items: [
          {
            items: [
              { text: 'Changelog', link: '/changelog' },
              { text: 'Support', link: '/support' }
            ]
          }
        ]
      },
      { text: 'Purchase', link: 'https://statamic.com/addons/reach/statamic-livewire-filters' }
    ],

    sidebar: [
      { text: 'Overview', link: '/overview' },
      { text: 'Installation', link: '/installation' },
      {
        text: 'Usage',
        items: [
          { text: 'Usage overview', link: '/usage/overview' },
          { text: 'Livewire Collection tag', link: '/usage/livewire-collection-tag' },
          { text: 'Filters', link: '/usage/filters' },
          { text: 'TextFilter', link: '/usage/text-filter' },
          { text: 'RadioFilter', link: '/usage/radio-filter' },
          { text: 'SelectFilter', link: '/usage/select-filter' },
          { text: 'CheckboxFilter', link: '/usage/checkbox-filter' },
          { text: 'DateFilter', link: '/usage/date-filter' },
          { text: 'RangeFilter', link: '/usage/range-filter' },
          { text: 'DualRangeFilter', link: '/usage/dual-range-filter' },
        ]
      },
      { text: 'Sorting', link: '/sorting' },
      { text: 'Tags', link: '/tags' },
      {
        text: 'Advanced',
        items: [
          { text: 'Query scopes', link: '/advanced/query-scopes' },
          { text: 'URL Query String', link: '/advanced/url-query-string' },
          { text: 'Transitions & animations', link: '/advanced/transitions-animations' },
          { text: 'Use in taxonomy term routes', link: '/advanced/taxonomy-term-routes' },
          { text: 'Hooks', link: '/advanced/hooks' },
          { text: 'Tips & Performance', link: '/advanced/tips-performance' },
        ]
      },
      { text: 'Support & Pricing', link: '/support' },
      { text: 'Common Issues', link: '/common-issues' },
      { text: 'Examples', link: '/examples' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/reachweb/statamic-livewire-filters' }
    ],    
  },
  markdown: {
    shikiSetup: async (highlighter) => {
      // Ensure 'html' is loaded before loading 'antlers'
      await highlighter.loadLanguage('html');
      await highlighter.loadLanguage({        
        scopeName: 'text.html.statamic',
        embeddedLangs: ['html'],
        ...antlersDef,
        name: 'antlers',
      })
    },
  },
})
