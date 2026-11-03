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

## Range list

To let visitors pick from predefined numeric ranges ("Under 100", "100 to 200", "Over 200") instead of dragging a slider, use the Radio Filter with a `buckets` parameter. Each bucket becomes a radio option with its own entry count, and an **All** option clears the selection.

```antlers
{{ livewire:lf-radio-filter
    blueprint="cars.car"
    field="price"
    buckets="0-12000|12000-16000|16000-20000|20000-"
}}
```

Separate buckets with `|`. Each bucket is `min-max`; leave a side empty for an open-ended range (`20000-` or `-12000`). Labels are generated from the bounds: `0-100` and `-100` read "Under 100", `100-200` reads "100 to 200" and `200-` reads "Over 200". You can change the wording with the `range_under`, `range_between` and `range_over` keys of the [language file](../installation#publish-the-language-file).

Selecting a bucket filters the field the same way as the [Dual Range Filter](./dual-range-filter): with `gte` and `lte` by default, so the URL and the [tags](../tags) show `price:gte` and `price:lte`. An open side sets only one of them. Because both ends are inclusive, an entry on a shared edge (a price of exactly `12000` above) matches both neighbouring buckets. To make the upper end exclusive, set `modifier="gte|lt"`; the counts follow the same comparisons.

With `enable_filter_values_count` turned on, the counts come from a single query of the field's values, bucketed in PHP, and ignore the filter's own selection like the other filters' counts.

::: info Ideal for
Numeric fields, such as an `integer` price. A range list allows one bucket at a time; date fields aren't supported, use the Dual Range Filter for those.
:::

The view is `lf-range-list.blade.php`. Pass `view` to use your own.

## Dynamic bounds

With `enable_dynamic_range_bounds` turned on in the [config file](../installation#configuration), the slider narrows to the lowest and highest values among the entries that still match the other active filters, instead of always spanning `min` to `max`. It's off by default.

```php
'enable_dynamic_range_bounds' => true,
```

The bounds are calculated the same way as for the Dual Range Filter, including the rounding to `step`, the extra step for `gt` and `lt`, and the fallback to `min` and `max`. See [How the bounds are calculated](./dual-range-filter#how-the-bounds-are-calculated), and [Performance](./dual-range-filter#performance) for the cost of the extra queries.

On the Range Filter:

- **Before the filter is used**, the handle follows the bounds: it moves to the `default` value (or `min`), kept within the new range. This doesn't apply a filter.
- **Once the user moves the handle**, changing the other filters never moves it. If the matching entries no longer reach the selected value, the bounds widen to include it.
- **Moving the handle back** to the default, or to where the default sits within the narrowed range, clears the filter, as long as that position doesn't exclude any matching entries.
- **When every matching entry has the same value**, the bounds collapse to that value and the slider is disabled until the other filters leave room again. A slider with an active selection is never disabled: if it has no room to move, it shows the full `min`–`max` instead.

### Custom views

The `lf-range.blade.php` view changed in v4.6.0. If you published it before that, re-publish it or merge in the changes below, otherwise the slider won't follow the bounds. The input takes its `min` and `max` from `$dynamicMin` and `$dynamicMax` (falling back to `$min` and `$max`), `$boundsDisabled` disables it, and a listener for the `range-bounds-updated` event keeps the displayed value in sync. This is the full default view:

```blade
<div>
    <div
        class="grid grid-cols-1 gap-y-4"
        x-data="{
            init() {
                // Only the display syncs; the true selection is preserved server-side.
                // Bounds go first so the value isn't clamped to the old range.
                $wire.on('range-bounds-updated', (bounds) => {
                    $refs.range.min = bounds.min;
                    $refs.range.max = bounds.max;
                    $refs.range.value = bounds.selected;
                    $refs.selectedValue.textContent = bounds.selected;
                });
            }
        }"
    >
        <div class="relative mb-3">
            <input
                id="{{ $field }}"
                type="range"
                x-ref="range"
                min="{{ $dynamicMin ?? $min }}"
                max="{{ $dynamicMax ?? $max }}"
                step="{{ $step }}"
                class="w-full h-1 mb-6 bg-gray-200 rounded-lf appearance-none cursor-pointer"
                wire:model.live="selected"
                @disabled($boundsDisabled)
            >
            <span class="text-sm text-lf-text absolute start-0 -bottom-1">{{ $dynamicMin ?? $min }}</span>
            <span class="text-sm text-lf-text absolute left-1/2 -translate-x-1/2 -bottom-1">{{ __('statamic-livewire-filters::ui.value') }}: <span x-ref="selectedValue">{{ $selected }}</span></span>
            <span class="text-sm text-lf-text absolute end-0 -bottom-1">{{ $dynamicMax ?? $max }}</span>
        </div>
    </div>
</div>
```

The event's payload has `min`, `max`, `selected` and `disabled`. See [Custom views](./dual-range-filter#custom-views) on the Dual Range Filter page for details.
