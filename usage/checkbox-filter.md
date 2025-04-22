---
title: CheckboxFilter
description: How to use the CheckboxFilter in Statamic Livewire Filters.
---

# CheckboxFilter

## Overview

The **Checkbox** filter utilizes HTML checkboxes in order to filter the collection based on the selected options.

This filter will automatically load the available options of the field you are using.

::: info Ideal for
It is particularly well-suited for fields that present multiple selectable options, such as `radio` or `select` fields, as well as `taxonomy` terms. The **Checkbox** filter is the optimal choice in scenarios where users would probably need to select more than one option.
:::

## Syntax example

```antlers
{{ livewire:lf-checkbox-filter
    blueprint="cars.car"
    field="brand"
    condition="taxonomy"
}}
```

::: bug Be careful
When filtering Statamic fields that are saved like an array like `checkboxes` or a `select` field that allows multiple options you might think that a simple `is` condition will work. Unfortunately it will not. You can only use it in fields that have a single value. As a workaround use **Taxonomy terms** for fields that you need multiple values or check out our `query_scope` method.
::: 