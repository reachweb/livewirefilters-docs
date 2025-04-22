---
title: DualRangeFilter
description: How to use the DualRangeFilter in Statamic Livewire Filters.
---

# DualRangeFilter

## Overview

The **DualRangeFilter** allows you to filter the collection by a range of min and max values using a custom [noUiSlider](https://refreshless.com/nouislider/) range slider.

::: info Ideal for
Any situation that you want to let the user select a range of values, for example an integer field, pricing fields or even dates.
:::

## Javascript

This field uses the `noUiSlider` Javascript range slider so you need to include it in order for this field to work. Visit the [installation page](../installation) to learn more.

## Options

You can set the following options:

- **min**: The minimum allowed value
- **max**: The maximum allowed value
- **step**: The steps that the value of each handle will change between when moved. *(Default: 1)*
- **minRange**: The minimum allowed distance between the handles *(Default: 1)*
- **format**: By default the range slider uses integer values. You can set this to **float** to enable more accuracy if needed.
- **modifier**: This filter uses by default the `gte` and `lte` [conditions](https://statamic.dev/conditions) for numbers and the `is_after` and `is_before` conditions for date fields. You can pass a pipe separated modifier in order to change that, for example `gt|lt`.

## Syntax example

```antlers
{{ livewire:lf-dual-range 
    blueprint="cars.car" 
    field="price" 
    min="0" 
    max="60000" 
    step="1000" 
}}
```

## Preset values / Custom URL string

This plugin sets two parameters, one for the minimum value and one for the maximum value. You can preset one or both of those values in the `LivewireCollection` component by using the original conditions:

```antlers
{{ livewire-collection:cars max_passengers:gte="4" max_passengers:lte="7" }}
```

Similarly, you need to set both those conditions in the config file for the [custom URL query string](../advanced/url-query-string#using-the-custom-url-query-string) to work correctly.

## Usage with Date fields

As you can see in the [example page](../examples), this slider can also tackle date fields. When the date field is detected, the conditions automatically change to `is_after` and `is_before`. A typical use case is to let the user select a range of years to filter out the entries based on a date field.

Note that the minimum date is set to the start of the year selected and the ending date to the end of the year selected.


## Styling

We have modified the original CSS file of noUiSlider to better fit with the rest of the filters. If you are using our Javascript bundle as mentioned in the [installation page](../installation), you can use CSS variables to modify the appearance of the slider. The following variables can be overridden in your CSS file (use !important):

```css
:root {
    --noui-width: 16px;
    --noui-height: 12px;
    --noui-handle-width: 28px;
    --noui-handle-height: 28px;
    --noui-handle-radius: 100%;
    --noui-border-radius: 0;
    --noui-bg: #FAFAFA;
    --noui-bg-dark: #e4e4e4;
    --noui-border: #D3D3D3;
    --noui-shadow-light: #F0F0F0;
    --noui-shadow-dark: #BBB;
    --noui-connect: #2563eb;
    --noui-shadow-active: #DDD;
}
``` 