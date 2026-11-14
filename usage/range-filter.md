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

The [Select Filter](./select-filter) takes `buckets` too and shows the same ranges as options, in both the `lf-select` and `lf-select-advanced` views. Its placeholder option, **All** or your `placeholder` text, clears the range. Everything below applies to both filters.

```antlers
{{ livewire:lf-select-filter
    blueprint="cars.car"
    field="price"
    buckets="0-12000|12000-16000|16000-20000|20000-"
    placeholder="Any price"
}}
```

Separate buckets with `|`. Each bucket is `min-max`; leave a side empty for an open-ended range (`20000-` or `-12000`). Labels are generated from the bounds: `0-100` and `-100` read "Under 100", `100-200` reads "100 to 200" and `200-` reads "Over 200". You can change the wording with the `range_under`, `range_between` and `range_over` keys of the [language file](../installation#publish-the-language-file).

To set a label yourself, for example to add a currency, pass `options` keyed by bucket. A bucket you leave out keeps its generated label:

```antlers
{{ price_labels = [
    '0-12000' => 'Up to €12,000',
    '12000-16000' => '€12,000 to €16,000',
    '16000-20000' => '€16,000 to €20,000',
    '20000-' => '€20,000 and up'
] }}

{{ livewire:lf-radio-filter
    blueprint="cars.car"
    field="price"
    buckets="0-12000|12000-16000|16000-20000|20000-"
    :options="price_labels"
}}
```

Selecting a bucket filters the field the same way as the [Dual Range Filter](./dual-range-filter): with `gte` and `lte` by default, so the URL and the [tags](../tags) show `price:gte` and `price:lte`. An open side sets only one of them. Because both ends are inclusive, an entry on a shared edge (a price of exactly `12000` above) matches both neighbouring buckets. To make the upper end exclusive, set `modifier="gte|lt"`; the counts follow the same comparisons. The modifier takes `gt` or `gte` for the lower end, then `lt` or `lte` for the upper end.

A bucket that isn't `min-max`, `min-` or `-max`, a bucket whose min is above its max, and any other modifier throw an exception, so a typo is caught on the first render.

A bucket is selected when the bounds in the URL, or in a preset on the [`livewire-collection` tag](./livewire-collection-tag), match its bounds exactly. Bounds that match no bucket still filter the collection, for example an old link from before you changed `buckets`, a link made with the Dual Range Filter or a hand-edited URL. The radio list then checks no option, and choosing **All** clears the bounds. The select shows "Custom range" as its value without offering it in the list, and choosing its placeholder option, or the clear icon in `lf-select-advanced`, clears the bounds. Choosing a bucket replaces them in either filter. You can change the label with the `range_custom` key of the [language file](../installation#publish-the-language-file).

With `enable_filter_values_count` turned on, the counts come from a single query of the field's values, bucketed in PHP, and ignore the filter's own selection like the other filters' counts. The [`zero_count`](./filters#options-without-results) property works on buckets as on any other option: `zero_count="hide"` removes the buckets without matching entries and `zero_count="disable"` disables them. The selected bucket and the **All** or placeholder option always stay.

::: info Ideal for
Numeric fields, such as an `integer` price. A range list allows one bucket at a time; date fields aren't supported, use the Dual Range Filter for those.
:::

The Radio Filter's view is `lf-range-list.blade.php`, and the Select Filter keeps `lf-select` or `lf-select-advanced`. Pass `view` to use your own. While the bounds match no bucket, `$selected` holds `LfRadioFilter::UNMATCHED_RANGE` (`'custom'`), a value no bucket has. A range list view should check its **All** option only when `$selected` is empty, as the bundled view does: the browser sends no change for a radio that is already checked, so a checked **All** couldn't clear the bounds.

The select views take the "Custom range" label from `$this->unmatched_range_option`, which maps `UNMATCHED_RANGE` to the label and is empty without buckets. `lf-select` renders it as a hidden, disabled option, so choosing the empty option is still a change. A published copy of `lf-select` or `lf-select-advanced` needs this new markup: without it, the plain select shows its empty option for such bounds and can't clear them.

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
