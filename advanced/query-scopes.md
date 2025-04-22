---
title: Query scopes
description: How to use query scopes with Statamic Livewire Filters.
---

# Query scopes

## Overview

If you don't know what query scopes are, you can check [Statamic's docs](https://statamic.dev/extending/query-scopes-and-filters). This addon supports filtering using query scopes and contains a useful one you can use, called `Multiselect`.

## How to use

Utilizing a query scope is straightforward. Simply set the `condition` property of any filter to `query_scope` and the `modifier` to the name of the scope you wish to use. For example:

```antlers
{{ livewire:lf-checkbox-filter
    blueprint="rooms.rooms"
    field="room_amenities"
    condition="query_scope"
    modifier="you_query_scope_name"
}}
```

## Presetting Multiple Query Scopes

In some cases, you may need to use multiple query scopes and preset values from each within your `LivewireCollection` component.

To do this, use a **pipe-separated list** of query scopes, like so:

```antlers
{{ livewire-collection:cars multiselect:brand="toyota" other_scope="SUV" query_scope="multiselect|other_scope" }}
```

## Multiselect query scope

As emphasized in various sections of these documents, filtering entries using Statamic fields that support multiple values and are stored as arrays (such as `checkboxes` or `select` fields) doesn't work with the stock conditions, like `is`.

In order to help you filter those entries, we ship the `multiselect` query scope with this addon that magically works using `whereJsonContains`. You're welcome.

```antlers
{{ livewire:lf-checkbox-filter
    blueprint="cars.cars"
    field="car_brand"
    condition="query_scope"
    modifier="multiselect"
}}
``` 