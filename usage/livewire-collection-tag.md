---
title: Livewire Collection tag
description: How to use the <code v-pre>{{ livewire-collection }}</code> tag in Statamic Livewire Filters.
---

# Livewire Collection tag

## General

The <code v-pre>{{ livewire-collection }}</code> tag is the cornerstone of this addon. It is responsible for loading the main Livewire component, `LivewireCollection`, and can handle almost all the parameters and syntax of the original <code v-pre>{{ collection }}</code> tag.

For instance, if you have a collection tag like this:

```antlers
{{ collection:cars paginate="10" sort="title:asc" }}
    {{# Your template here #}}
{{ /collection:cars }}
```

You can replace it like so:

```antlers
{{ livewire-collection:cars paginate="10" sort="title:asc" }}
```

::: info Why a tag and not a Livewire component?
Using a Statamic tag to load the Livewire component might seem complex, but it's the most effective way to ensure compatibility with all parameters supported by Statamic's collection tag, both now and in future updates.
:::

## Preset filters

This tag can manage almost all collection parameters, passing them to the Livewire component. When using **conditions**, they are parsed, and the collection is filtered accordingly. If an active filter component for the condition exists, the filter will automatically populate with the correct values. Which means you can do stuff like and expect them to just work:

```antlers
{{ livewire-collection:cars taxonomy:car_brand:any="toyota" max_passengers:gte="4" }}
```

To see preset conditions examples in action, visit the relevant section.

::: warning Take care with the `any` modifier
In Statamic, the `any` modifier is implied when setting taxonomy conditions. Livewire Filters adhere to this convention: if no modifier is set, `any` is used by default. However, if you want to preset taxonomy values using the `any` modifier, ensure that it's added to any preset conditions, like the example above. Otherwise, the filter won't automatically populate the values.
:::

## Other parameters

The <code v-pre>{{ livewire-collection }}</code> also accepts the following parameters:

- **view**: Select a different view (template) for the entries, enabling the use of varied templates for different collections. For example, `view="cars"` will search for the template at `resources/views/vendor/statamic-livewire-filters/livewire/cars.antlers.html`.
- **paginate**: While this is a parameter of the original collection tag, here it replaces the pagination with a pre-built Livewire-compatible one. Use the <code v-pre>{{ links }}</code> variable in your template for pagination (read more below).
- **lazy**: Set this to true to enable lazy loading (also read more below).

## Limiting Allowed Filters

Given that this addon leverages Laravel Livewire, it's important to note that all server requests can *potentially* be modified by a malicious user. This could lead to unintended conditions being applied, such as listing draft entries. While this may not be a significant concern since the data being filtered is public, you might still wish to restrict the filters users can apply for enhanced security.

To specify which filters are permissible, you can set the `allowed_filters` parameter that defines the allowed conditions. This is achieved by passing a pipe-separated list of permissible filters. For example:

```antlers
{{ livewire-collection:cars paginate="6" allowed_filters="taxonomy:car_brand:any|transmission:is" }}
```

When using with `query_scopes` you need to allow both parameters:

```antlers
{{ livewire-collection:cars paginate="8" allowed_filters="taxonomy:car_brand:any|query_scope:multiselect|multiselect:special_categories" }}
```

## Pagination

Pagination is seamlessly managed by the `LivewireCollection` component. Simply include the `paginate` property in the tag to activate it. Within your template, use the <code v-pre>{{ links }}</code> tag to generate a TailwindCSS-styled pagination control.

If you prefer to customize the pagination appearance, you can modify the default pagination template located at `vendor/statamic-livewire-filters/livewire/ui/pagination.blade.php`.

For situations where you need to display the total number of entries (e.g., "Showing 5 of 60 results"), remember that using <code v-pre>{{ entries | count }}</code> will only count the entries on the current page. To display the total number of entries across all pages, use the <code v-pre>{{ pagination_total }}</code> variable anywhere within your template.

### Controlling Pagination Scroll Behavior

By default, pagination scrolls back to the top of the page when changing pages. You can disable this behavior by setting the `scrollTo` property on `LivewireCollection` to `false`.

Alternatively, you can specify a custom scroll target by setting `scrollTo` to a relevant **class** or **ID**. For example `scrollTo="#content"`.

## Lazy loading

You can **lazy load** the `LivewireCollection` component by adding the `lazy="true"` parameter.

By default, the component uses the `resources/views/livewire/ui/lazyload-placeholder.blade.php` file as a skeleton. Feel free to modify this file to suit your needs.

If you need different skeleton templates for different collections, you can set the `lazy-placeholder` parameter in your component to specify a custom template.
