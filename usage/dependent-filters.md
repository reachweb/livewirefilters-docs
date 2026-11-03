---
title: Dependent Filters
description: Narrow a filter's options to the values that go with another filter's selection, like car models for the selected brand.
---

# Dependent Filters

## Overview

A **dependent filter** only offers the options that go with the value of another filter, its *parent*. Pick a car brand and the model filter only lists that brand's models. With no brand selected, every model is listed.

Dependent filters work with the [Checkbox](./checkbox-filter), [Radio](./radio-filter) and [Select](./select-filter) filters, including their advanced views.

## Syntax

Enable `enable_dependent_filters` in the [config file](../installation#configuration):

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

The parent can use any condition (`is`, `in`, `taxonomy`, a query scope and so on), and several parent values are combined: with Audi and BMW checked, the models of both are listed.

::: warning Turn on the config option
Without `enable_dependent_filters` the collection doesn't send its filter state to the filters, so `depends_on` has no effect and every option stays visible.
:::

## How it works

After every filter change, the collection sends its filter state to the filters. A filter with `depends_on`:

- **Narrows its options.** When the parent has a value, the filter only shows the options that appear in the entries that match the active filters, apart from its own. The option you have selected always stays visible.
- **Clears its selection when the parent changes.** If the new parent value doesn't offer the selected option, that option is unselected: a radio or select filter is cleared, and a checkbox filter keeps only the values that are still available. A change to any other filter never clears the selection, and neither does loading a page: a selection from the URL or the tag is kept, even when its parent doesn't offer it.
- **Shows every option when the parent is cleared.** The selection is kept.

The options are narrowed by the other active filters too, so with *Diesel* selected the model filter only lists the brand's diesel models.

## Hide or disable unavailable options

By default, the options that don't go with the parent are hidden. Set `unavailable="disable"` to show them disabled instead (any other value throws an exception):

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

If you have published the filter views, add the dependent options to your copies:

- **Blade views** (`lf-checkbox`, `lf-radio`, `lf-select`): call `$this->optionIsAvailable($value)` for each option and skip it when it returns `false` and `$unavailable === 'hide'`, or add the `disabled` attribute otherwise.
- **Alpine views** (`lf-checkbox-advanced`, `lf-select-advanced`): start from `@js($this->availableOptions)` and listen for the `available-options-updated` event, whose first value is the list of available option keys as strings, or `null` when every option is available.

## Performance

A dependent filter runs one query after every filter change, collecting its field's values from the matching entries. It is the same query the [filter value counts](../installation#configuration) run, so with `enable_filter_values_count` on it doesn't add a query. Filters that have nothing to update skip their re-render.

## Static caching

Dependent filters work with half and full measure [static caching](../advanced/static-caching) under the same rules as the other filters. On a page loaded from a filtered URL, the options are narrowed right after the page loads, when the collection first sends its filter state.
