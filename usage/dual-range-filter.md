---
title: Dual Range Filter
description: How to use the Dual Range Filter in Statamic Livewire Filters.
---

# DualRangeFilter

## Overview

The **Dual Range Filter** allows you to filter the collection by a range of min and max values using a custom [noUiSlider](https://refreshless.com/nouislider/) range slider.

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
- **histogram**: The number of bars to draw behind the slider, showing how many matching entries fall in each part of the range. Needs [dynamic bounds](#dynamic-bounds). See [Histogram](#histogram). *(Default: off)*
- **modifier**: This filter uses by default the `gte` and `lte` [conditions](https://statamic.dev/conditions) for numbers and the `is_after` and `is_before` conditions for date fields. You can pass a pipe separated modifier in order to change that, for example `gt|lt`.

## Syntax

```antlers
{{ livewire:lf-dual-range-filter
    blueprint="cars.car"
    field="date_of_registration"
    min="2019"
    max="2025"
}}
```

<Image src="/demo/dualrangefilter.webp" alt="The Dual Range Filter example." />

## Preset values / Custom URL string

This plugin sets two parameters, one for the minimum value and one for the maximum value. You can preset one or both of those values in the `LivewireCollection` component by using the original conditions:

```antlers
{{ livewire-collection:cars max_passengers:gte="4" max_passengers:lte="7" }}
```

Similarly, you need to set both those conditions in the config file for the [custom URL query string](../advanced/url-query-string#using-the-custom-url-query-string) to work correctly.

## Usage with Date fields

As you can see in the [example page](https://demo.livewirefilters.com/advanced), this slider can also tackle date fields. When the date field is detected, the conditions automatically change to `is_after` and `is_before`. A typical use case is to let the user select a range of years to filter out the entries based on a date field.

Note that the minimum date is set to the start of the year selected and the ending date to the end of the year selected.

## Dynamic bounds

By default the slider always spans the `min` and `max` set on the tag, even when the other filters leave only a few entries. With dynamic bounds turned on, it narrows to the lowest and highest values among the entries that still match the other active filters. If a user picks a brand whose cars have 4 to 7 seats, a seats slider set up from 2 to 9 shrinks to 4–7, so it doesn't offer values that return no results.

Turn it on in the [config file](../installation#configuration):

```php
'enable_dynamic_range_bounds' => true,
```

It's off by default and applies to both the Dual Range Filter and the [Range Filter](./range-filter#dynamic-bounds).

::: warning Published views
The sliders get their new bounds through a `range-bounds-updated` event that the filter views listen for since v4.6.0. If you published `lf-dual-range.blade.php` or `lf-range.blade.php` before that, add the listener (see [Custom views](#custom-views)) or re-publish the views, otherwise the sliders won't change.
:::

### How the bounds are calculated

- **Only the other filters count.** Conditions on the slider's own field are left out, so moving the handles doesn't shrink the slider under them. Parameters set on the <code v-pre>{{ livewire-collection }}</code> tag (such as `status` or a query scope) do count, so the bounds match the entries the tag can show. If the tag uses several collections, matching entries from all of them count.
- **Rounded to the step.** The bounds are rounded outwards to the slider's `step`, counting from `min`, so the handles always land on a valid value. With `min="0"` and `step="5"`, matching values from 12 to 38 give a slider from 10 to 40.
- **One extra step for strict conditions.** With a strict modifier like `gt|lt`, a bound moves one more step out where needed, so that with the handles at the ends every matching entry is still included.
- **Never past `min` and `max`.** The bounds stay within the `min` and `max` set on the tag. If no entries match the other filters, or all their values fall outside `min`–`max`, the slider shows the full `min`–`max` again.
- **Can't be changed from the browser.** The collection sends the filter state for the bounds encrypted and tied to its collections, and the filters ignore anything else. A crafted request can't make the slider reveal values from entries the tag doesn't show, such as drafts.

The first bounds are calculated right after the page loads, so the slider shows the full `min`–`max` for a moment before it narrows.

### Selections

While the filter isn't in use, the handles follow the bounds and sit at the new minimum and maximum. This only moves the handles: it doesn't apply a filter or add a tag.

Once the user moves a handle, changing the other filters never moves the selection. If the matching entries no longer reach the selected values, the bounds widen to include them. For example, with 5 to 10 seats selected and the other filters matching cars with 4 to 6 seats, the slider spans 4 to 10 and the handles stay at 5 and 10.

Moving the handles back to the ends of the narrowed slider clears the filter, just like moving them back to `min` and `max`, as long as the ends don't exclude any matching entries.

### Disabled slider

If the filter isn't in use and the bounds are narrower than `minRange` (with the default `minRange` of 1, that's when every matching entry has the same value), the slider is disabled. It's still drawn `minRange` wide, since noUiSlider can't show a narrower range. It's enabled again as soon as the other filters leave room to move.

A slider with an active selection is never disabled. If the selection and the matching values together leave less than `minRange` or one `step` of room, the slider shows the full `min`–`max` instead.

### Date fields

On a [date field](#usage-with-date-fields) the bounds are whole years: the slider narrows to the years of the earliest and latest matching dates. Since `is_after` and `is_before` are strict conditions, the bounds can reach one year further so those entries stay included.

### Performance

Dynamic bounds run a query for each range filter on the page when it loads and after each filter change, collecting the field's values from the matching entries. Identical queries within the same update are shared, as with the filter value counts. Like `enable_filter_values_count`, use it with care on very large data sets (1000+ entries).

### Custom views

After each bounds update the filter dispatches a `range-bounds-updated` event with this payload:

| Key | Description |
|-----|-------------|
| `min` | The new lower bound. |
| `max` | The new upper bound. |
| `selectedMin`, `selectedMax` | Dual Range Filter only: the handle positions. |
| `selected` | Range Filter only: the value to show on the handle. |
| `disabled` | `true` when the slider should be disabled. |
| `bins` | Dual Range Filter with `histogram` only: the [histogram bars](#histogram), a list of `{from, to, count}`. |

The noUiSlider element is `wire:ignore`d, so `lf-dual-range.blade.php` updates it from the event, next to the existing `dual-range-preset-values` listener:

```js
$wire.on('range-bounds-updated', (bounds) => {
    slider.noUiSlider.updateOptions({
        range: {
            'min': bounds.min,
            'max': bounds.max
        }
    }, false);
    slider.noUiSlider.set([bounds.selectedMin, bounds.selectedMax], false);
    bounds.disabled ? slider.noUiSlider.disable() : slider.noUiSlider.enable();
});
```

Keep the `false` arguments: they update the slider without firing its `set` event, which would send the new positions back to the server as a filter.

For `lf-range.blade.php`, see [Custom views](./range-filter#custom-views) on the Range Filter page.

## Histogram

The Dual Range Filter can draw a histogram behind the slider: a row of bars showing how many of the matching entries fall in each part of the range, so users can see where most of the results are before they move the handles. Set `histogram` to the number of bars you want:

```antlers
{{ livewire:lf-dual-range-filter
    blueprint="cars.car"
    field="price"
    min="8000"
    max="27000"
    step="500"
    minRange="500"
    histogram="20"
}}
```

The histogram needs [dynamic bounds](#dynamic-bounds) turned on, because the bars are counted from the same values: the slider's field across the entries that match the other active filters. They're counted in the same pass as the bounds, so a histogram adds no extra query, only a little work per matching entry. The bars update with the bounds after each filter change, and the bars between the handles are drawn in the slider's connect color (`--noui-connect`).

- **The bars follow the slider.** They span the slider's current bounds, so they narrow and widen along with it.
- **Whole steps.** Each bar covers a whole number of `step`s, starting at the slider's lower bound, so its edges line up with values the handles can stop on. The bar width is rounded up to the next step, so you can get fewer bars than you asked for: with the 20 bars above and other filters narrowing the slider to 14000–17000, each bar covers 500 (one step) and you get 6 bars. The last bar ends at the upper bound and includes it.
- **Dates count by year.** On a [date field](#usage-with-date-fields) each entry counts in the bar of its year.
- **No matches, no bars.** When no entries match the other filters, the histogram is hidden while the slider shows the full `min`–`max`.

::: tip Published views
The bars are part of `lf-dual-range.blade.php` since v4.7.0. If you published the view before that, re-publish it or copy the histogram markup and the `bins` handling from the new view. Without them, `histogram` only adds the `bins` to the event.
:::

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