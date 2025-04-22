---
title: URL Query String
description: How to use URL query strings with Statamic Livewire Filters.
---

# URL Query String

## Overview

Storing selected filter parameters in the URL is often a good idea, as it allows users to share their search results and retain their selections when navigating away and returning to the page.

In Statamic Livewire Filters, there are two ways to enable this functionality: using Livewire's native URL Query Parameters or a custom made solution that is user- and SEO-friendly.

::: info Preset value precedence
There are two methods to preset filter values on a page:

1. Setting conditions or sort options in the `{{ livewire-collection }}` tag.
2. Using the URL query string (when enabled).

In cases where both methods are used for a filter, the URL query string takes precedence.
:::

## Before you start

In case you haven't already done so during installation, publish the add-on's configuration file:

```shell
php artisan vendor:publish --tag statamic-livewire-filters-config
```

## Using Livewire's URL Query Parameters

[Livewire's URL Query Parameters](https://livewire.laravel.com/docs/url) feature allows you to store your component's parameters (filter conditions and sort options) in the URL. This functionality can be activated through the addon's configuration file.

To enable this feature, simply set `enable_query_string` to `true` in the addon's config file located at `config/statamic-livewire-filters.php`.

```php
'enable_query_string' => false
```

Although this method works well, all parameters are saved inside a `params` array due to the dynamic nature of your filters. As a result, the generated URLs look something like:

```htmlmixed
?params[taxonomy:car_brand:any]=citroen|fiat|vw&params[fuel_type:is]=superUnl&params[sort]=seats:asc
```

Not so pretty, right? Don't worry—we've created a custom URL query string that generates a much more readable URL.

## Using the Custom URL Query String

To enable this feature, configure two additional keys in your config file: `custom_query_string` and `custom_query_string_aliases`. Also make sure `enable_query_string` is set to `false`.

- `custom_query_string` should be set to a string that will act as the prefix for the generated URL, such as `filters`, `search`, or `params`. Ensure this slug is unique across your site to avoid `404` errors.
- `custom_query_string_aliases` is an associative array mapping original filter names to new, readable strings. Original filter names should match the ones used in a Collection tag.

You'll also need to include the `LfUrlHandler` component in your template to handle URL updates. The easiest approach is to add it to the bottom of your layout file:

```antlers
{{ livewire:lf-url-handler }}
```

For our example above this config:

```php
// Enable custom query string
'custom_query_string' => 'search',

// Set the aliases for each custom query string parameter
'custom_query_string_aliases' => [
  'brand' => 'taxonomy:car_brand:any',
  'fuel' => 'fuel_type:is',
],
```

Would generate a URL like so:

```php
/search/brand/citroen,fiat,vw/fuel/superUnl/sort/seats:asc
```

Much cleaner, right? The replacement string for each original parameter key can be anything you like.

## A Couple of Caveats:

- **Query scopes require special handling.** You'll need to include `query_scope:` before the parameter's value. For example: `'categories' => 'query_scope:multiselect:car_categories'`.
- **Unset filter parameters are ignored.** Your filters will still work, but any parameter not defined in the configuration won't be parsed on page load or generated during user interaction.

All the demos on this site use the custom URL query string, so feel free to explore them to get a better understanding of how this feature works. 