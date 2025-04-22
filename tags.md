---
title: Tags
description: How to use the LfTags component in Statamic Livewire Filters.
---

# Tags

## Overview

In websites that feature filtering, it is common to have a "tags" or "pills" area displaying all currently active filters along with their values and an option to remove any of them. In keeping with the modular design of `Livewire Filters`, we include the LfTags component, which enables you to display such tags easily. You can see it in action at the demo page.

## Usage

The component requires two properties to work correctly:

- **blueprint**: Specify the collection and the blueprint containing the field in the format `collection.blueprint`. For instance, if you have a collection with the handle `pages` and a blueprint with the same handle, set the property as `blueprint="pages.pages"`. This works in exactly the same way as any filter.
- **fields**: Provide a pipe-separated string of the field handles you are using in the page. This is required in order to get the field options values from Statamic beforehand and improve performance.

## Syntax

```antlers
{{ livewire:lf-tags blueprint="cars.car" fields="title|car_brand|transmission" }}
```

## Templating

When you publish your views, you can edit the template of the tags in the `vendor/statamic-livewire-filters/livewire/ui/tags.blade.php` file.

You can also pass a `view` property to the component in order to override the `tags` filename and use different templates for different parts of your site. 