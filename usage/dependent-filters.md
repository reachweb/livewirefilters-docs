---
title: Dependent Filters
description: Narrow a filter's options to the values that go with another filter's selection, like car models for the selected brand.
---

# Dependent Filters

## Overview

Since v4.7.0, a filter can depend on another filter, its *parent*, and only offer the options that go with the parent's value. Pick a car brand and the model filter only lists that brand's models. With no brand selected, every model is listed.

Dependent filters work with the [Checkbox](./checkbox-filter), [Radio](./radio-filter) and [Select](./select-filter) filters, including their advanced views. A [range list](./range-filter#range-list) (a filter with `buckets`) can't use `depends_on` and throws an `InvalidDependsOnException`.

## Syntax

Turn on `enable_dependent_filters` in the [config file](../installation#configuration):

```php
'enable_dependent_filters' => true,
```

Then add `depends_on` to the child filter, set to the **field handle** of the parent filter:

```antlers
{{ livewire:lf-checkbox-filter
    blueprint="cars.car"
    field="car_brand"
    condition="taxonomy"
}}

{{ livewire:lf-checkbox-filter
    blueprint="cars.car"
    field="car_model"
    condition="in"
    depends_on="car_brand"
}}
```

The parent can use any condition, such as `is`, `in`, `taxonomy` or a query scope. With several parent values, such as Audi and BMW, the models of both are listed.

::: warning Turn on the config option
Without `enable_dependent_filters`, `depends_on` only works while `enable_filter_values_count` or `enable_dynamic_range_bounds` happens to be on, because the collection doesn't send its filter state to the filters otherwise.
:::

## How it works

- **The options narrow.** While the parent has a value, the filter only shows the options found in the entries that match the active filters. The other filters narrow it too: with *Diesel* selected, only the brand's diesel models are listed. A selected option always stays visible.
- **A parent change can clear the selection.** When the parent's value changes, a selected option is unselected if no entry has it with the new parent value. The other filters don't count here: with *VW* and *Diesel* active, a selected *Polo* that only comes with petrol stays selected, because VW still has a Polo.
- **Nothing else clears it.** A change to another filter keeps the selection, and so does loading a page: a selection from the URL or the tag stays, even when the parent doesn't offer it.
- **Clearing the parent shows every option again** and keeps the selection.

## Chains of filters

A filter can depend on several parents. Separate their field handles with `|`. For a chain such as brand, model and fuel type, list both filters above the last one:

```antlers
{{ livewire:lf-checkbox-filter blueprint="cars.car" field="car_brand" condition="taxonomy" }}

{{ livewire:lf-checkbox-filter blueprint="cars.car" field="car_model" condition="in" depends_on="car_brand" }}

{{ livewire:lf-select-filter
    blueprint="cars.car"
    field="fuel_type"
    condition="is"
    depends_on="car_brand|car_model"
}}
```

The filter narrows while any of its parents has a value. When a new brand clears the model, the fuel type is cleared too, and it then lists the new brand's fuel types. With only `depends_on="car_model"`, a cleared model would leave the fuel type without a parent value, so it would list every fuel type again.

## Tell the visitor what was cleared

When a parent change unselects something, the filter fires a `dependent-selection-cleared` browser event. Its detail has the filter's `field`, and the removed `values` and their `labels`. Listen for it to show a notice:

```antlers
<div
    x-data="{ cleared: [] }"
    x-on:dependent-selection-cleared.window="cleared = $event.detail.labels"
    x-show="cleared.length > 0"
    x-cloak
>
    Removed <span x-text="cleared.join(', ')"></span>: not available for your new selection.
</div>
```

The event doesn't fire when the visitor clears the filter themselves.

## Hide or disable unavailable options

By default, the options that don't go with the parent are hidden. Set `unavailable="disable"` to show them disabled instead. Any other value throws an `InvalidUnavailableModeException`.

```antlers
{{ livewire:lf-select-filter
    blueprint="cars.car"
    field="car_model"
    condition="is"
    depends_on="car_brand"
    unavailable="disable"
}}
```

## Custom views

If you published the checkbox, radio or select views before v4.7.0, re-publish them or update your copies:

- **`lf-checkbox`, `lf-radio`, `lf-select`:** loop over `$this->visible_options` instead of `$this->filter_options`, and disable the options whose key is in `$this->disabled_options`. Both also cover the options that [`zero_count`](./filters#options-without-results) hides or disables.
- **`lf-checkbox-advanced`, `lf-select-advanced`:** start from `@js($availableOptions)` and `@js($unavailable)`, and listen for the `available-options-updated` event. Its first value is the list of available option keys, as strings, or `null` when every option is available.

## Performance

While its parent has a value, a dependent filter runs one query after every filter change. It's the same query the [filter value counts](../installation#configuration) run, so with `enable_filter_values_count` on it adds none.

## Static caching

Dependent filters work with half and full measure [static caching](../advanced/static-caching). On a page opened from a filtered URL, the options narrow right after the page loads.
