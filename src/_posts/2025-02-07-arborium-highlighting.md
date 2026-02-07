---
title: Replacing Shiki with Arborium for syntax highlighting
date: 2025-02-07
---

I recently replaced the default Shiki syntax highlighter in my Astro blog with
[arborium](https://crates.io/crates/arborium-cli), a tree-sitter based
highlighter written in Rust.

## Why switch?

Shiki uses inline styles for coloring, which makes the HTML bulky and harder to
theme. Arborium outputs lightweight custom HTML elements like `<a-k>` (keyword),
`<a-s>` (string), and `<a-v>` (variable) that you style with CSS. This means:

- Smaller HTML output
- Easy light/dark theming via CSS variables and `prefers-color-scheme`
- ~70 languages supported out of the box via tree-sitter grammars

## How it works

A rehype plugin runs `arborium --lang X --html` for each fenced code block at
build time. The CLI reads source code from stdin and outputs HTML with custom
elements. The plugin parses that into HAST nodes that Astro serializes into the
final HTML.

Here's the core of the plugin:

```javascript
function runArborium(lang, code) {
  return new Promise((resolve) => {
    const child = execFile(
      'arborium',
      ['--lang', lang, '--html'],
      (err, stdout) => {
        if (err) {
          resolve(null)
        } else {
          resolve(stdout)
        }
      },
    )
    child.stdin.write(code)
    child.stdin.end()
  })
}
```

## Language showcase

### TypeScript

```typescript
interface User {
  name: string
  email: string
  roles: readonly string[]
}

function greet(user: User): string {
  const { name, roles } = user
  if (roles.includes('admin')) {
    return `Welcome back, ${name}!`
  }
  return `Hello, ${name}.`
}

const users: Map<string, User> = new Map()
```

### Rust

```rust
use std::collections::HashMap;

#[derive(Debug)]
struct Config {
    values: HashMap<String, String>,
}

impl Config {
    fn new() -> Self {
        Config {
            values: HashMap::new(),
        }
    }

    fn get(&self, key: &str) -> Option<&str> {
        self.values.get(key).map(|s| s.as_str())
    }
}

fn main() {
    let mut config = Config::new();
    config.values.insert("theme".into(), "dark".into());

    match config.get("theme") {
        Some(theme) => println!("Using theme: {theme}"),
        None => println!("No theme set"),
    }
}
```

### Python

```python
from dataclasses import dataclass
from typing import Iterator

@dataclass
class Point:
    x: float
    y: float

    def distance_to(self, other: "Point") -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5

def fibonacci() -> Iterator[int]:
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

points = [Point(i, i * 2.5) for i in range(5)]
for p in points:
    print(f"{p} -> distance to origin: {p.distance_to(Point(0, 0)):.2f}")
```

### Go

```go
package main

import (
	"fmt"
	"sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		fmt.Printf("worker %d processing job %d\n", id, j)
		results <- j * 2
	}
}

func main() {
	jobs := make(chan int, 100)
	results := make(chan int, 100)

	var wg sync.WaitGroup
	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= 5; j++ {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	close(results)
}
```

### HTML

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Example</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        color-scheme: light dark;
      }
    </style>
  </head>
  <body>
    <h1>Hello</h1>
    <script>
      document.querySelector('h1').addEventListener('click', () => {
        alert('clicked!')
      })
    </script>
  </body>
</html>
```

### YAML

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - '8080:80'
    volumes:
      - ./html:/usr/share/nginx/html:ro
    environment:
      NGINX_HOST: example.com
      NGINX_PORT: 80
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
```

### Bash

```bash
#!/bin/bash
set -euo pipefail

readonly LOG_DIR="/var/log/myapp"

rotate_logs() {
  local max_size=$((10 * 1024 * 1024))
  for log in "$LOG_DIR"/*.log; do
    if [[ $(stat -f%z "$log" 2>/dev/null || stat -c%s "$log") -gt $max_size ]]; then
      mv "$log" "${log}.$(date +%Y%m%d%H%M%S).bak"
      echo "Rotated: $log"
    fi
  done
}

rotate_logs
echo "Done at $(date)"
```

### CSS

```css
:root {
  --bg: #ffffff;
  --fg: #1a1a1a;
  --accent: #0055ff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0d1117;
    --fg: #e6edf3;
    --accent: #58a6ff;
  }
}

.card {
  background: var(--bg);
  color: var(--fg);
  border: 1px solid color-mix(in srgb, var(--fg) 20%, transparent);
  border-radius: 8px;
  padding: 1.5rem;

  & h2 {
    color: var(--accent);
    margin: 0 0 0.5rem;
  }

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }
}
```

### JSON

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "astro": "^6.0.0",
    "hast-util-to-string": "^3.0.1",
    "unist-util-visit": "^5.1.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  }
}
```

### TOML

```toml
[package]
name = "arborium-cli"
version = "0.1.0"
edition = "2021"

[dependencies]
arborium = { version = "2.12", features = ["cli"] }
clap = { version = "4", features = ["derive"] }

[[bin]]
name = "arborium"
path = "src/main.rs"
```

## Setup

Install the CLI with `cargo install arborium-cli`, disable Shiki in your Astro
config, and register the rehype plugin. The full template is on
[GitHub](https://github.com/cmdcolin/minimal-astro-arborium-blog-template).
