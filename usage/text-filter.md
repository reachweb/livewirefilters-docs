---
title: Text Filter
description: How to use the TextFilter in Statamic Livewire Filters.
---

# TextFilter

## Overview

**Text Filter** is a simple text input that you can use in order to "live search" your collection.

::: info Ideal for
This filter is perfect for any field where you need to perform a text search, typically using conditions like `contains`. It allows for quick and efficient searching through text-based data.
:::

## Syntax

```antlers
{{ livewire:lf-text-filter
    blueprint="cars.car"
    field="title"
    condition="contains"
    placeholder="Search cars"
}}
```

<Image src="/demo/textfilter.webp" alt="The Text Filter example." />

