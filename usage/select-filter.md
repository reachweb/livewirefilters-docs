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