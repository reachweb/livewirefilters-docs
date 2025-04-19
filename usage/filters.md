---
title: Filters
description: Overview of the available filters in Statamic Livewire Filters.
---

### General

This addon includes several prebuilt but easily modifiable filters. Each filter is a Livewire component that can be placed anywhere on your page. They are minimally styled using TailwindCSS. To avoid conflicts with other Livewire components, all components in this addon are prefixed with `lf-`.

### Properties

To function properly, each filter requires a few properties:

- **blueprint**: Specify the collection and the blueprint containing the field in the format `collection.blueprint`. For instance, if you have a collection with the handle `pages` and a blueprint with the same handle, set the property as `blueprint="pages.pages"`.
- **field**: The handle of the field you wish to filter by. For example, `field="title"`.
- **condition**: The condition for filtering. For instance `condition="contains"`. A comprehensive list of conditions can be found in [Statamic's documentation](https://statamic.dev/conditions). Use `condition="taxonomy"` for filtering by a taxonomy, and `condition="query_scope"` for filtering entries using a query scope.

#### Additional Properties for Specific Filters

- **Taxonomy filters:** These can utilize the `modifier` property to set the relationship as `any`, `all`, or `not`.
- **Query scope filters:** You need to use the `modifier` property to set the query scope to use.
- **Range Filter:** This filter uses the `max` and `min` properties to define the range of available values.
- **Dual Range Filter:** This filter supports the `min` and `max` properties as well as the `step` property that sets the step between values as well as a `minRange` property that sets the minimum range between min and max. The `condition` is not needed here as it's predefined but you can pass it along as a `modifier`.

### Sorting filter values

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

### Available filters

- [TextFilter](./text-filter.md)
- [RadioFilter](./radio-filter.md)
- [SelectFilter](./select-filter.md)
- [CheckboxFilter](./checkbox-filter.md)
- [DateFilter](./date-filter.md)
- [RangeFilter](./range-filter.md)
- [DualRangeFilter](./dual-range-filter.md) 