---
title: Tags Component
description: How to use Statamic Livewire Filters' LfTags component.
---

# Tags Component

## Overview

The `LfTags` component is a handy way to display all active filters and provides users with a quick way to remove them.

Here's an example of how to use the component:

```antlers
<div v-pre>
{{ livewire:lf-tags blueprint="cars.car" fields="title|car_brand|transmission" }}
</div>
```

## Options

| Option | Description |
|--------|-------------|
| `blueprint` | The blueprint handle of the collection you're filtering. Format is `collection.blueprint`. |
| `fields` | A pipe-separated list of fields to display. The component will only show tags for these fields when they are active. |
| `wrapper_class` | Additional classes for the wrapper div. |

## Customization

To personalize the look of the `LfTags` component, publish the vendor views:

```bash
php artisan vendor:publish --tag=statamic-livewire-filters-views
```

Then modify the view located at `resources/views/vendor/statamic-livewire-filters/components/lf-tags.blade.php`.

## Default Behavior

By default, the component:

1. Displays all active filters as tags
2. Shows a clear text for each tag (e.g., "Brand: Toyota")
3. Provides a "✕" button to remove individual filters
4. Includes a "Clear all" button when multiple filters are active 