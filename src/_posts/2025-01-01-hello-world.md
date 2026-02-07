---
title: Hello World
date: 2025-01-01
---

Welcome to the blog! Here are some code examples.

## JavaScript

```javascript
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.listen(3000)
```

## Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(fibonacci(i))
```

## Rust

```rust
fn main() {
    let numbers: Vec<i32> = (1..=10).collect();
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}
```

## Bash

```bash
#!/bin/bash
for file in *.txt; do
  echo "Processing $file"
  wc -l "$file"
done
```

That's it for now!
