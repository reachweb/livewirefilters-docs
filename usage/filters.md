---
title: Filters
description: Overview of the available filters in Statamic Livewire Filters.
---

# Filters

## General

This addon includes several prebuilt but easily modifiable filters. Each filter is a Livewire component that can be placed anywhere on your page. They are minimally styled using TailwindCSS. To avoid conflicts with other Livewire components, all components in this addon are prefixed with `lf-`.

## Properties

To function properly, each filter requires a few properties:

- **blueprint**: Specify the collection and the blueprint containing the field in the format `collection.blueprint`. For instance, if you have a collection with the handle `pages` and a blueprint with the handle `page`, set the property as `blueprint="pages.page"`.
- **field**: The handle of the field you wish to filter by. For example, `field="title"`.
- **condition**: The condition for filtering. For instance `condition="contains"`. A comprehensive list of conditions can be found in [Statamic's documentation](https://statamic.dev/conditions). Use `condition="taxonomy"` for filtering by a taxonomy, and `condition="query_scope"` for filtering entries using a query scope.

::: warning Double check your conditions!
If your conditions are not applicable, it may result in unexpected behavior. While the addon is designed to alert you to obvious errors, such as incorrect field handles, it's crucial to be aware that using unsuitable conditions for a field or making typographical errors can lead to misleading outcomes. In such cases, the addon might appear to function correctly, but the results and filters could be incorrect or inconsistent.
:::

#### Additional Properties for Specific Filters

- **Taxonomy filters:** These can utilize the `modifier` property to set the relationship as `any`, `all`, or `not`.
- **Query scope filters:** You need to use the `modifier` property to set the query scope to use.
- **Range Filter:** This filter uses the `max` and `min` properties to define the range of available values.
- **Dual Range Filter:** This filter supports the `min` and `max` properties as well as the `step` property that sets the step between values as well as a `minRange` property that sets the minimum range between min and max. The `condition` is not needed here as it's predefined but you can pass it along as a `modifier`.
- **Toggle Filter:** This filter needs a `preset_value` variable that sets the value to apply and a `label` filter that is the text for the toggle field label.

## Sorting filter values

You can sort the values of `taxonomy`, `select`, `radio`, and `checkbox` filters. This is especially useful for taxonomy terms, as Statamic doesn't offer a way to order them, while the options for the other filters can be ordered in the Blueprint editor.

To sort the values, use the `sort` property as you would in a collection tag, separating the attribute to sort by and the direction with a colon (`:`). For example:

```antlers
{{ livewire:lf-radio-filter
  blueprint="rooms.room"
  field="rooms_amenities"
  condition="taxonomy"
  sort="slug:desc"
}}
```

The available options for sorting are as follows:

- `key` or `slug` will sort by the array key or the term slug, respectively.
- `label` or `title` will sort by the array label or the term title field, respectively.
- For taxonomies, you can use any field from its blueprint to sort. For example, `sort="order:asc"` will sort the options by an `order` field. This allows you to create a custom order for your taxonomy terms or sort them by any additional value.

## Options without results

When [`enable_filter_values_count`](../installation.md#configuration) is on, each option of the `checkbox`, `radio` and `select` filters shows how many entries match it together with the other active filters. Use the `zero_count` property to choose what happens to options whose count drops to zero:

- `show` (default): keep the option, with its `(0)` count.
- `hide`: remove the option until other filter changes give it matching entries again.
- `disable`: keep the option but disable it, so it can't be selected.

```antlers
{{ livewire:lf-checkbox-filter
  blueprint="cars.car"
  field="car_brand"
  condition="taxonomy"
  zero_count="hide"
}}
```

It works the same with the advanced views (`lf-checkbox-advanced` and `lf-select-advanced`), which apply it in the browser whenever the counts update.

A few things to keep in mind:

- **Selected options always stay.** An option that is already selected is never hidden or disabled, even when the other filters bring its count to zero, so visitors can still see and clear it.
- **Counts must be enabled.** Without `enable_filter_values_count`, there are no counts to go by and `zero_count` has no effect.
- **Nothing changes until the counts load.** Counts are calculated after the page loads, so every option is shown on the first render and the rule applies as soon as the counts arrive.

Any value other than `show`, `hide` or `disable` throws an exception, so a typo is caught on the first render.

## Available filters

- [TextFilter](./text-filter.md)
- [RadioFilter](./radio-filter.md)
- [SelectFilter](./select-filter.md)
- [CheckboxFilter](./checkbox-filter.md)
- [DateFilter](./date-filter.md)
- [RangeFilter](./range-filter.md)
- [DualRangeFilter](./dual-range-filter.md) 
- [ToggleFilter](./toggle-filter.md) 