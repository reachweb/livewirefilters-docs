---
title: Dependent Filters
description: Narrow a filter's options to the values that go with another filter's selection, like car models for the selected brand.
---

# Dependent Filters

## Overview

A **dependent filter** only offers the options that go with the value of another filter, its *parent*. Pick a car brand and the model filter only lists that brand's models. With no brand selected, every model is listed.

Dependent filters work with the [Checkbox](./checkbox-filter), [Radio](./radio-filter) and [Select](./select-filter) filters, including their advanced views. A range list (a radio filter with `buckets`) can't use `depends_on` and throws an exception.

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
- **Clears its selection when the parent changes.** If no entry has the selected option together with the new parent value, that option is unselected: a radio or select filter is cleared, and a checkbox filter keeps the values the parent still offers. The other filters don't count here. With *VW* and *Diesel* active, a selected *Polo* that only comes with petrol stays selected, because VW still has a Polo. A change to any other filter never clears the selection, and neither does loading a page: a selection from the URL or the tag is kept, even when its parent doesn't offer it.
- **Shows every option when the parent is cleared.** The selection is kept.

The options are narrowed by the other active filters too, so with *Diesel* selected the model filter only lists the brand's diesel models.

## Chains of filters

A filter can depend on several parents. Separate their field handles with `|`. This is how you build a chain such as brand, model and fuel type, where the last filter lists both filters above it:

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

The filter narrows its options while any of its parents has a value, and a change to any of them unselects what their values together no longer offer. When a new brand clears the model, the fuel type is cleared too, and it then lists the fuel types of the new brand.

If the last filter only named `car_model`, a cleared model would leave it with no parent value, so it would show every fuel type again.

## Tell the visitor what was cleared

When a parent change unselects something, the filter fires a `dependent-selection-cleared` browser event. Its detail has the filter's `field`, the removed option `values` and their `labels`. Listen for it to show a notice:

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

The event is not fired when the visitor clears the filter themselves.

## Hide or disable unavailable options

By default, the options that don't go with the parent are hidden. Set `unavailable="disable"` to show them disabled instead (any other value throws an `InvalidUnavailableModeException`):

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

- **Blade views** (`lf-checkbox`, `lf-radio`, `lf-select`): loop over `$this->visible_options` instead of `$this->filter_options`, and add the `disabled` attribute to the options whose key is in `$this->disabled_options`. Both already include the options that [`zero_count`](./checkbox-filter) hides or disables.
- **Alpine views** (`lf-checkbox-advanced`, `lf-select-advanced`): start from `@js($availableOptions)` and `@js($unavailable)`, and listen for the `available-options-updated` event, whose first value is the list of available option keys as strings, or `null` when every option is available.

## Performance

A dependent filter runs one query after every filter change, collecting its field's values from the matching entries. It is the same query the [filter value counts](../installation#configuration) run, so with `enable_filter_values_count` on it doesn't add a query. When a parent changes while another filter hides a selected option, it runs one more query to see what the parent alone offers. Filters that have nothing to update skip their re-render.

## Static caching

Dependent filters work with half and full measure [static caching](../advanced/static-caching) under the same rules as the other filters. On a page loaded from a filtered URL, the options are narrowed right after the page loads, when the collection first sends its filter state.
