import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Compagnie Jizo",
  base: "/",
  description: "blabla",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Agenda', link: '/agenda' },
      { text: 'Artistes', link: '/artistes' },
      { text: 'Spectacles', link: '/spectacles' },
      
      { text: 'Contact',link: '/contact' }, //allways last
    ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'instagram', link: 'https://www.youtube.com/@CompagnieJizo' },
      { icon: 'youtube', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
