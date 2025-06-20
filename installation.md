---
title: Installation
description: How to install Statamic Livewire Filters and configure it for your project.
---

# Installation

## Installing the addon

You can install Statamic Livewire Filters using Composer:

```shell
composer require reachweb/statamic-livewire-filters
```

## Configuration

There are a few configuration options. If you wish to change them, publish the config file using:

```shell
php artisan vendor:publish --tag statamic-livewire-filters-config
```

The available config options at the time are:


| Option | Description | Default |
|--------|-------------|---------|
| `enable_query_string` | Enables Livewire's [query string feature](./advanced/url-query-string). | `false` |
| `validate_filter_values` | When using fields that have predefined options, the addon will validate that the value the user wants to filter by actually exists in the options array. | `true` |
| `enable_term_routes` | When enabled, the addon will preset the value of any Taxonomy filters when in [term routes](./advanced/taxonomy-term-routes). | `false` |
| `use_origin_id_for_entries_field` | Set to false to use the IDs of the localized entries when using multi-site. Read more [here](./advanced/tips-performance#filtering-entries-field-in-multi-site-setups). | `true` |
| `enable_filter_values_count` | When enabled, Livewire Filters calculates and displays counts for each option in checkboxes, radio, and select fields next to their labels. This feature is resource-intensive, as it performs a query for each filter option on the page and repeats these queries after each user action to update the counts. Therefore, it should be used cautiously, especially with very large data sets. | `false` |
| `custom_query_string` & `custom_query_string_aliases` | These are used to control the [custom URL query string feature](./advanced/url-query-string#using-the-custom-url-query-string). | - |


## Publish the views

To publish the views use the `vendor:publish` command:

```shell
php artisan vendor:publish --tag statamic-livewire-filters-views
```

## Publish the language file

Livewire Filters includes a few translation strings for the UI. You can publish the language file using the `vendor:publish` command:

```shell
php artisan vendor:publish --tag=statamic-livewire-filters-translations
```

The remaining strings are located within the views, which you will likely edit as needed.

## Livewire assets

We are using the `marcorieser/statamic-livewire` package under the hood, which injects Livewire styles and scripts automatically into the page. If you are using static caching, please check the [common issues page](/common-issues) in order to configure everything correctly.

## Assets handling with TailwindCSS

If you're using TailwindCSS, publish the views and you should be all set: your build tool should pick up the classes from the views and include them in your CSS bundle.

If you plan on building on the default filter templates, it's a good idea to add the `@tailwindcss/forms` plugin as well and add it in your plugins array.

```shell
npm install @tailwindcss/forms
```

Plugins array in your `tailwind.config.js`:

```js
plugins: [
  require('@tailwindcss/typography'),
  require("@tailwindcss/forms")({
    strategy: 'class'
  }),
],
```

## Javascript

Right now, Statamic Livewire Filters does not *need* Javascript unless you are using either the **DateFilter** or the **DualRangeFilter** components. If you are, you need to import **Flatpickr and / or noUiSlider** in your project. We provide a prebuilt bundle that you can use :

```antlers{11,17}
<!-- resources/views/layout.antlers.html -->
<!doctype html>
<html lang="{{ site:short_locale }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ title ?? site:name }}</title>
        {{ vite src="resources/js/site.js|resources/css/site.css" }}        
        {{ livewire:styles }}
        <link rel="stylesheet" href="/vendor/statamic-livewire-filters/frontend/css/livewire-filters.css">
    </head>
    <body class="bg-gray-100 font-sans leading-normal text-gray-800">
        <div class="mx-auto px-2 lg:min-h-screen flex flex-col items-center justify-center">
            {{ template_content }}
        </div>
        <script src="/vendor/statamic-livewire-filters/frontend/js/livewire-filters.js"></script>
        {{ livewire:scripts }}    
    </body>
</html>
```

Or you can manually add them, by installing what you need and adding them to your build process.

## Add the assets at your project (if not using TailwindCSS)

Post-installation, all assets will be available at `vendor/reachweb/statamic-livewire-filters/resources/frontend`. It's not recommended but if **not** using TailwindCSS, you could also add the styles in your layout file:

```antlers
<link rel="stylesheet" href="/vendor/statamic-livewire-filters/frontend/css/livewire-filters-tailwind.css">
```

::: warning This might mess up your site
As you might know, TailwindCSS ships with some global CSS resets and styling. Adding our CSS file in your project might cause other things to break. This is provided mainly as a means to test things before you commit to using Statamic Livewire Filters, you should publish the views and add your own styling for production.
:::