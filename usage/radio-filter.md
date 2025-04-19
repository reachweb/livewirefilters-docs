---
title: RadioFilter
description: How to use the RadioFilter in Statamic Livewire Filters.
---

### Overview

The **RadioFilter** utilizes HTML radio inputs to filter the collection based on one of the available options.

This filter will automatically load the available options of the field you are using.

::: info Ideal for
Fields that have options, like a `radio` or `select` field as well as `taxonomy` terms.
:::

### Syntax example

```antlers
{{ livewire:lf-radio-filter
    blueprint="cars.car"
    field="brand"
    condition="is"
}}
```

::: bug Be careful
When filtering Statamic fields that are saved like an array like `checkboxes` or a `select` field that allows multiple options you might think that a simple `is` condition will work. Unfortunately it will not. You can only use it in fields that have a single value. As a workaround use **Taxonomy terms** for fields that you need multiple values or check out our `query_scope` method.
::: 