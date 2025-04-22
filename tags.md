---
title: Tags Component
description: How to use Statamic Livewire Filters' LfTags component.
---

# Tags

## Overview

In websites that feature filtering, it is common to have a "tags" or "pills" area displaying all currently active filters along with their values and an option to remove any of them. In keeping with the modular design of Livewire Filters, we include the `LfTags` component, which enables you to display such tags easily. 

## Usage

| Option | Description |
|--------|-------------|
| `blueprint` | The blueprint handle of the collection you're filtering. As usual, format is `collection.blueprint`. |
| `fields` | A pipe-separated list of fields to display. This is required in order to get the field options values from Statamic beforehand and improve performance. |

## Syntax

```antlers
{{ livewire:lf-tags blueprint="cars.car" fields="title|car_brand|transmission" }}
```

## Templating

When you publish your views, you can edit the template of the tags in the `vendor/statamic-livewire-filters/livewire/ui/tags.blade.php` file.

As with all Livewire Filters' components you can also pass a `view` property to the component in order to override the tags filename and use different templates for different parts of your site.