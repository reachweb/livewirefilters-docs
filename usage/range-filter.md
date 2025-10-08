---
title: Range Filter
description: How to use the Range Filter in Statamic Livewire Filters.
---

# Range Filter

## Overview

The **Range Filter** allows you to filter the collection by using an HTML range field.

::: info Ideal for
This filter is especially useful for entries that contain numeric values, such as those in an `integer` field.
:::

## Options

You can set the `min`, `max` and `step` values as well as a `default` value that sets the default value of the range slider.

::: warning Default value caveat
If there is a preset condition specified in the `livewire-collection` tag, it will override the default value set using the filter's `default` property.
:::

## Syntax

```antlers
{{ livewire:lf-range-filter
    blueprint="cars.car"
    field="seats"
    condition="gte"
    min="2"
    max="9"
    default="2"
}}
``` 

<Image src="/demo/rangefilter.webp" alt="The Range Filter example." />