---
title: SelectFilter
description: How to use the SelectFilter in Statamic Livewire Filters.
---

# SelectFilter

## Overview

The **SelectFilter** is exactly the same as RadioFilter, it just uses a `select` input instead of a `radio` input group. For more information you can refer to the [RadioFilter](./radio-filter.md) page.

This filter will automatically load the available options of the field you are using.

## Syntax example

```antlers
{{ livewire:lf-select-filter
    blueprint="cars.car"
    field="brand"
    condition="is"
}}
``` 

::: warning Be careful
When filtering Statamic fields that are saved like an array like `checkboxes` or a `select` field that allows multiple options you might think that a simple `is` condition will work. Unfortunately it will not. You can only use it in fields that have a single value. As a workaround use **Taxonomy terms** for fields that you need multiple values or check out our `query_scope` method.
::: 