---
title: Select Filter
description: How to use the Select Filter in Statamic Livewire Filters.
---

# Select Filter

## Overview

The **Select Filter** is exactly the same as Radio Filter, it just uses a `select` input instead of a `radio` input group. For more information you can refer to the [Radio Filter](./radio-filter.md) page.

This filter will automatically load the available options of the field you are using.

## Syntax

```antlers
{{ livewire:lf-select-filter
    blueprint="cars.car"
    field="brand"
    condition="is"
}}
``` 

<Image src="/demo/selectfilter.webp" alt="The Select Filter example." />

## Advanced Select Filter

Livewire Filters also includes a more advanced version of the Select Filter that uses `Alpine JS` in order to allow for
consistent styling between platforms and more advanced features like search.

To use it, set the view to the advanced version like so:

```antlers
{{ livewire:lf-select-filter
    blueprint="cars.car"
    field="transmission"
    condition="is"
    view="lf-select-advanced"
    placeholder="Transmission"
}}
``` 

You can also set `searchable="true"` to enabled the search box if needed.

<Image src="/demo/selectfilter-advanced.webp" alt="The Advanced Select Filter." />

<br>

::: warning Be careful
When filtering Statamic fields that are saved like an array like `checkboxes` or a `select` field that allows multiple options you might think that a simple `is` condition will work but it will not. If you are using Statamic **v5.64.0** or later you can use the `overlaps` condition. If not, you can use the [multiselect query scope](../advanced/query-scopes#multiselect-query-scope).
::: 