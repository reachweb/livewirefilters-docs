---
title: Checkbox Filter
description: How to use the Checkbox Filter in Statamic Livewire Filters.
---

# CheckboxFilter

## Overview

The **Checkbox Filter** utilizes HTML checkboxes in order to filter the collection based on the selected options.

This filter will automatically load the available options of the field you are using.

::: info Ideal for
It is particularly well-suited for fields that present multiple selectable options, such as `radio` or `select` fields, as well as `taxonomy` terms. The **Checkbox** filter is the optimal choice in scenarios where users would probably need to select more than one option.
:::

## Syntax

```antlers
{{ livewire:lf-checkbox-filter
    blueprint="cars.car"
    field="brand"
    condition="taxonomy"
}}
```

<Image src="/demo/checkboxfilter.webp" alt="The Checkbox Filter example." />

## Advanced Select Filter

Livewire Filters also includes a more advanced version of the Checkbox Filter that uses `Alpine JS` in order to better suit horizontal place of the filters and allow for consistent styling between platforms and more advanced features like search.

To use it, set the view to the advanced version like so:

```antlers
{{ livewire:lf-checkbox-filter
    blueprint="cars.car"
    field="car_brand"
    condition="taxonomy"
    view="lf-checkbox-advanced"
    searchable="true"
    placeholder="Car brand"
}}
``` 

You can also set `searchable="true"` to enabled the search box if needed.

<Image src="/demo/checkboxfilter-advanced.webp" alt="The Advanced Select Filter." />

<br>

::: warning Be careful
When filtering Statamic fields that are saved like an array like `checkboxes` or a `select` field that allows multiple options you might think that a simple `is` condition will work but it will not. If you are using Statamic **v5.64.0** or later you can use the `overlaps` condition. If not, you can use the [multiselect query scope](../advanced/query-scopes#multiselect-query-scope).
::: 