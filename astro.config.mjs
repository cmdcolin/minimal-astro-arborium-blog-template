import { defineConfig } from 'astro/config'
import rehypeTreeSitter from './lib/rehype-tree-sitter.js'

export default defineConfig({
  site: 'https://cmdcolin.github.io',
  base: '/minimal-astro-arborium-blog-template',
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [rehypeTreeSitter],
  },
})
