# Minimal Astro + Arborium Blog Template

## Demo

https://cmdcolin.github.io/minimal-astro-arborium-blog-template/

A minimal blog template using [Astro](https://astro.build) with
[arborium](https://crates.io/crates/arborium-cli) for tree-sitter syntax
highlighting.

## Prerequisites

Install the arborium CLI:

```bash
cargo install arborium-cli
```

This has to be installed separately from the npm deps. AFAIK the arborium npm
packages are for dynamic browser usage rather than static server side rendering
(correct me if I'm wrong someone)

## Getting started

```bash
npm install
npm run dev
```

## How it works

- Blog posts go in `src/_posts/` as markdown files with `title` and `date`
  frontmatter
- A custom rehype plugin (`lib/rehype-tree-sitter.js`) calls the `arborium` CLI
  at build time to highlight fenced code blocks
- Arborium outputs custom HTML elements (`<a-k>`, `<a-s>`, `<a-v>`, etc.) that
  are styled via CSS variables in `src/styles/highlight.css`
- Light/dark mode switches automatically via `prefers-color-scheme`

## Adding posts

Create a markdown file in `src/_posts/`:

```markdown
---
title: My Post
date: 2025-01-15
---

Content here with fenced code blocks.
```

## Dependencies

- **astro** — static site generator that processes markdown files and runs
  rehype plugins at build time
- **unist-util-visit** — walks the HTML AST (HAST) to find `<pre><code>` blocks
  that need highlighting
- **hast-util-to-string** — extracts the plain text content from a code element
  so it can be passed to arborium for highlighting

## Deploying to a sub-path

If you're deploying to a sub-path like `username.github.io/my-blog/`, set
`base` in `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://username.github.io',
  base: '/my-blog',
  // ...
})
```

Any links that need to point back to the site root (like a "Home" link in your
layout) should use `import.meta.env.BASE_URL` instead of `/`. Links between
sibling pages (like index to posts) can use relative URLs.

## Supported languages

Arborium supports ~70 languages out of the box. Common ones: javascript,
typescript, python, rust, go, bash, html, css, json, yaml, toml, c, cpp, java,
ruby, and many more.

## Footnote

This was largely vibe coded via claude but is used on my blog
https://cmdcolin.github.io
