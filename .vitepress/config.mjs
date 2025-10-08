import { defineConfig } from 'vitepress'
import { createHighlighter } from 'shiki'
import path from 'path'
import {readFileSync} from "fs"

const antlersDef = JSON.parse(readFileSync(path.resolve(__dirname, './languages/antlers.tmLanguage.json'), 'utf8'))


export default defineConfig({
  title: "Statamic Livewire Filters - Supercharge your Statamic Collections",
  cleanUrls: true,
  sitemap: {
    hostname: 'https://livewirefilters.com/'
  },
  description: "Livewire Filters is an add-on for Statamic that enables you to use Livewire to create filters for your Statamic entries.",
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#082F49' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@afonic' }],
    ['meta', { name: 'twitter:creator', content: '@afonic' }],
    ['meta', { name: 'twitter:title', content: 'Livewire Filters - Supercharge your Statamic collections' }],
    ['meta', { name: 'twitter:description', content: 'Livewire Filters is an add-on for Statamic that enables you to use Livewire to create "live" filters for your Statamic collections' }],
    ['meta', { name: 'twitter:image', content: 'https://livewirefilters.com/facebook.png' }],
    ['meta', { property: 'og:title', content: 'Livewire Filters is an add-on for Statamic that enables you to use Livewire to create "live" filters for your Statamic collections' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://livewirefilters.com' }],
    ['meta', { property: 'og:image', content: 'https://livewirefilters.com/twitter.png' }],
    ['meta', { property: 'og:description', content: 'Livewire Filters is an add-on for Statamic that enables you to use Livewire to create "live" filters for your Statamic collections' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/overview' },
      {
        text: '3.0.0',
        items: [
          {
            items: [
              { text: 'Changelog', link: '/changelog' },
              { text: 'Support', link: '/support' }
            ]
          }
        ]
      },
      { text: 'Purchase', link: 'https://statamic.com/addons/reach/statamic-livewire-filters' },
      { text: 'Demo', link: 'https://demo.livewirefilters.com' }      
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/overview' },
          { text: 'Installation', link: '/installation' },
        ]
      },
      {
        text: 'Usage',
        items: [
          { text: 'Usage overview', link: '/usage/overview' },
          { text: 'Livewire Collection tag', link: '/usage/livewire-collection-tag' },
          { text: 'Filters', link: '/usage/filters' },
          { text: 'Text Filter', link: '/usage/text-filter' },
          { text: 'Radio Filter', link: '/usage/radio-filter' },
          { text: 'Select Filter', link: '/usage/select-filter' },
          { text: 'Checkbox Filter', link: '/usage/checkbox-filter' },
          { text: 'Date Filter', link: '/usage/date-filter' },
          { text: 'Range Filter', link: '/usage/range-filter' },
          { text: 'Dual Range Filter', link: '/usage/dual-range-filter' },
          { text: 'Toggle Filter 🆕', link: '/usage/toggle-filter' },
        ]
      },
      {
        text: 'Additional Components',
        items: [
          { text: 'Sorting', link: '/sorting' },
          { text: 'Tags', link: '/tags' },
        ]
      },
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
      {
        text: 'Support',
        items: [
          { text: 'Support & Pricing', link: '/support' },
          { text: 'Common Issues', link: '/common-issues' },
          { text: 'Examples', link: 'https://demo.livewirefilters.com' },
        ]
      },
    ],
    footer: {
      copyright: 'Copyright © 2025 Reach Web Agency'
    },
    siteTitle: false,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/reachweb/statamic-livewire-filters' }
    ],
    logo: { 
      light: '/logo-light.svg', 
      dark: '/logo-dark.svg', 
      alt: 'Statamic Livewire Filters' 
    }, 
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
