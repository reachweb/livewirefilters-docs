---
title: ToggleFilter
description: How to use the Toggle Filter in Statamic Livewire Filters.
---

# Toggle Filter <Badge type="tip" text="NEW" />


## Overview

The **Toggle Filter** allows you to set a preset value for filter and allow the user to turn it off or on.

::: info Ideal for
This filter is ideal for toggle Statamic fields or other boolean (true/false) values. However, its flexibility allows it to filter by almost any attribute.
:::

## Syntax

This filter requires two properties:

- **preset_value**: The value that the filter will apply when enabled.
- **label**: The text displayed next to the toggle switch.

```antlers
{{ livewire:lf-toggle-filter
    blueprint="cars.car"
    field="date_of_registration"
    condition="gte"
    preset_value="2025-01-01"
    label="Only new vehicles"
}}
```

<Image src="/demo/togglefilter.webp" alt="The Toggle Filter." />

## Additional example

```antlers
{{ livewire:lf-toggle-filter
    blueprint="cars.car"
    field="special_categories"
    condition="overlaps"
    preset_value="4x4|suv"
    label="SUV / Off Road"
}}
```