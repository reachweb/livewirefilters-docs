---
title: Use in taxonomy term routes
description: How to use Statamic Livewire Filters in taxonomy term routes.
---

# Use in taxonomy term routes

## Overview

Statamic [automatically handles taxonomy routing](https://statamic.dev/taxonomies#routing), allowing for the use of an `{{ entries }}` pair to iterate over and display entries. However, you might prefer to use Livewire Filters to take advantage of additional functionality while maintaining the use of the same view file.

## Enabling Taxonomy Routes Handling

The `livewire-collection` tag is designed to automatically recognize when it's placed on a taxonomy term route, incorporating the necessary parameters for you. By default, this feature is disabled. To enable it, you must adjust the settings in the config file.

```php
'enable_term_routes' => true,
```

Then, in your taxonomy term view, simply replace the `{{ entries }}` pair with `{{ livewire-collection }}`, just as you would under normal circumstances. There's no need to manually preset the taxonomy term - it's automatically handled for you.

## Example

Consider a scenario where you have a `clothes` Collection linked to a `colors` taxonomy, featuring various colors like `red` as terms.

In the default Statamic setup, navigating to the `/clothes/colors/red` route would load the `views/clothes/colors/show.antlers.html` view. Typically, in this view you would employ an `{{ entries }}` pair to showcase your entries.

To incorporate Livewire Filters, simply replace the `{{ entries }}` pair with the tag:

```antlers
{{ livewire-collection:clothes }}
```

There's no need to manually preset the term (e.g., by using `taxonomy:color:any="red"`); this is automatically handled for you.

## Using the tag without a filter

If you prefer not to add a filter for the taxonomy in this view, it's necessary to disable the `only_allow_active_filters` setting. With this setting enabled, the taxonomy filter would not apply.

To disable it, adjust the configuration in the config file as follows:

```php
'only_allow_active_filters' => false,
``` 