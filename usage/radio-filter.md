---
title: Radio Filter
description: How to use the Radio Filter in Statamic Livewire Filters.
---

# RadioFilter

## Overview

The **Radio Filter** utilizes HTML radio inputs to filter the collection based on one of the available options.

This filter will automatically load the available options of the field you are using.

::: info Ideal for
Fields that have options, like a `radio` or `select` field as well as `taxonomy` terms.
:::

## Syntax

```antlers
{{ livewire:lf-radio-filter
    blueprint="cars.car"
    field="transmission"
    condition="is"
}}
```

<Image src="/demo/radiofilter.webp" alt="The Radio Filter example." />

<br>

::: warning Be careful
When filtering Statamic fields that are saved like an array like `checkboxes` or a `select` field that allows multiple options you might think that a simple `is` condition will work but it will not. If you are using Statamic **v5.64.0** or later you can use the `overlaps` condition. If not, you can use the [multiselect query scope](../advanced/query-scopes#multiselect-query-scope).
::: 