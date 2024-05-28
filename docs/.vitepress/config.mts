import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  base: "/learning-docs/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'vue3官网', link: 'https://cn.vuejs.org/guide/introduction.html' },
      { text: 'Hello 算法', link: 'https://www.hello-algo.com/chapter_hello_algo/' },
      { text: 'CDN资源', link: 'https://www.bootcdn.cn/' }
    ],
    sidebar: [
      {
        text: '前端',
        items: [
          { text: 'vue3+ts', link: '/vue3/vue3+ts' },
          { text: 'vue3基础', link: '/vue3/vue3-base' },
          { text: '前端面试题', link: '/jobInterview/index'}
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
