---
title: SEO for filtered pages
description: How to control the canonical URL and indexing of filtered and paginated pages in Statamic Livewire Filters.
---

# SEO for filtered pages <Badge type="tip" text="NEW" />

## Overview

When you store filters in the URL using the [URL query string](/advanced/url-query-string) feature, every filter combination gets its own URL that search engines can crawl. Most of these URLs show a part of the same entries as your listing page, so they end up as near-duplicates of it in the search index.

The <code v-pre>{{ livewire-filters:seo }}</code> tag tells search engines which of these URLs to index:

- The listing page and its paginated pages stay indexable.
- Filtered and sorted URLs get `noindex,follow` and a canonical URL that points to the listing page.
- Filters that you choose stay indexable, so you can have a landing page for each brand, for example.

## Adding the tag

Add the tag to the `<head>` of your layout file:

```antlers
<head>
    {{ livewire-filters:seo }}
    ...
</head>
```

The tag is in your layout, so it outputs a canonical URL on **every** page that uses that layout, not only on the pages that have filters.

::: warning Already have a canonical tag?
A page must not have two different canonical URLs. If an SEO addon or your own template already outputs one, read [Using it with another canonical tag](#using-it-with-another-canonical-tag) before adding the tag.
:::

## What the tag outputs

This section covers the Livewire query string mode (`enable_query_string`). The [custom query string](#custom-query-string-mode) mode works differently and has its own section below.

For a `cars` listing page, the tag outputs the following:

| URL | Canonical | Robots |
|---|---|---|
| `/cars` | `/cars` | |
| `/cars?page=2` | `/cars?page=2` | |
| `/cars?params[fuel_type:is]=diesel` | `/cars` | `noindex,follow` |
| `/cars?params[fuel_type:is]=diesel&page=2` | `/cars` | `noindex,follow` |
| `/cars?params[sort]=seats:asc` | `/cars` | `noindex,follow` |
| `/cars?utm_source=newsletter` | `/cars` | |

Canonical URLs are always absolute. A filtered page gets these two tags:

```html
<link rel="canonical" href="https://example.com/cars">
<meta name="robots" content="noindex,follow">
```

Paginated pages keep their own canonical URL and stay indexable. This follows [Google's advice on pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading), which is to give each page its own canonical URL instead of pointing all of them to the first page.

If you don't use the URL query string feature at all, the filters are not part of the URL. The tag then only outputs the canonical URL, with the page number on later pages.

::: info The tags are part of the page load
Filtering in the browser doesn't change the tags in the `<head>`. This is fine for search engines, because they request each URL separately and get the tags for that URL.
:::

### What counts as a filter

A URL is treated as filtered when its `params` contain one of these:

- A `field:condition` style key, such as `fuel_type:is`, `taxonomy:car_brand:any` or a [query scope](/advanced/query-scopes) key.
- `sort`, `order_by` or `taxonomy`.

Everything else is ignored and left out of the canonical URL: parameters in your `blocked_query_params` config, collection settings such as `page_name`, any [data you pass to the Livewire template](/usage/livewire-collection-tag#passing-data-to-the-livewire-template) and unrelated query strings such as `utm_source`.

## Keeping some filters indexable

Some filtered pages are worth indexing. A page that lists all the Audi cars is a good landing page for a "used Audi" search. List these filters in the `seo_indexable_filters` key of the config file:

```php
'seo_indexable_filters' => ['car_brand'],
```

A filtered URL then stays indexable, with a canonical URL that points to itself, when **all** of these are true:

- Every active filter is in the list.
- Every filter has a single value.
- It is the first page.

With the config above you get the following:

| Filters in the URL | Result |
|---|---|
| Brand: `audi` | Indexable, canonical to itself |
| Brand: `audi` and `bmw` | `noindex,follow`, canonical to `/cars` |
| Brand: `audi`, fuel type: `diesel` | `noindex,follow`, canonical to `/cars` |
| Brand: `audi`, page 2 | `noindex,follow`, canonical to `/cars` |
| Brand: `audi`, sorted by seats | `noindex,follow`, canonical to `/cars` |

The canonical URL of an indexable filter is rebuilt from the filters the addon recognizes, in a fixed order. Unrelated query strings and the order of the parameters in the requested URL don't change it, so each filter has exactly one canonical URL.

### How to list a filter

You can list a filter in three ways:

| Entry | Example | What it matches |
|---|---|---|
| Field handle | `car_brand` | Every condition on that field, such as `taxonomy:car_brand:any` or `car_brand:is` |
| Parameter key | `taxonomy:car_brand:any` | Only that exact key |
| Alias | `brand` | The key that the alias points to in `custom_query_string_aliases` |

Use the parameter key when only one condition of a field should be indexable. A field handle never matches a key with a condition that Statamic doesn't know, because such a URL shows the same entries as the listing page.

::: warning Only list filters with a fixed set of values
The addon doesn't check a filter's value against the available options. With `car_brand` in the list, a URL with a brand that doesn't exist is an indexable page without any entries. For the same reason, don't list a text filter: every search term would get its own indexable URL.
:::

### Sorting and preset values

`sort` counts as a filter, so sorted URLs are not indexed. This is usually what you want, because a sorted page shows the same entries in a different order.

Keep in mind that in the Livewire query string mode, Livewire writes all the collection's parameters to the URL after a visitor changes a filter. This includes the conditions and the sort option that you preset in the <code v-pre>{{ livewire-collection }}</code> tag. If your tag has `sort="title:asc"`, the URL of an indexable filter also contains `params[sort]=title:asc`. Add `sort` to `seo_indexable_filters` if these URLs should stay indexable.

## Custom query string mode

In the [custom query string](/advanced/url-query-string#using-the-custom-url-query-string) mode, the addon rewrites a filter URL such as `/cars/search/brand/audi` to the listing page (`/cars`) before Statamic renders it. With [static caching](/advanced/static-caching), all the filter URLs of a page share the cached HTML of the listing page, including its `<head>`. A `noindex` tag in that shared `<head>` would also be served for the listing page itself.

So in this mode the signals are split in two:

- The tag only outputs what is the same for every filter URL: nothing on a first page, and the canonical URL with the page number (`/cars?page=2`) on later pages.
- The signals for the filter URLs are sent as HTTP response headers: `X-Robots-Tag` instead of the robots tag, and `Link` instead of the canonical tag. Google supports both, including the [canonical header](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#rel-canonical-header-method).

The headers are disabled by default. Enable them in the config file:

```php
'seo_filter_headers' => true,
```

::: warning Enable the headers
With `seo_filter_headers` set to `false`, the filter URLs get no `noindex` and no canonical URL in this mode.
:::

With the headers enabled, and the `brand` alias in `seo_indexable_filters`, the responses carry these headers (the canonical URLs are absolute, as in the tag):

| URL | `X-Robots-Tag` header | `Link` canonical header |
|---|---|---|
| `/cars` | | |
| `/cars/search/fuel/diesel` | `noindex, follow` | `/cars` |
| `/cars/search/brand/audi` | | `/cars/search/brand/audi` |
| `/cars/search/brand/audi,bmw` | `noindex, follow` | `/cars` |
| `/cars/search/brand/audi?page=2` | `noindex, follow` | |

A filtered page above 1 gets no `Link` header. Its `<head>` is shared with the unfiltered page 2, so it carries that page's canonical URL (`/cars?page=2`).

The canonical URL of an indexable filter is rebuilt from the aliases in your config, in the order you defined them. Segments that don't match an alias are left out.

You can check the headers of any URL with `curl`:

```shell
curl -sI https://example.com/cars/search/fuel/diesel | grep -iE "x-robots-tag|^link"
```

```http
x-robots-tag: noindex, follow
link: <https://example.com/cars>; rel="canonical"
```

### Static caching

The headers are never stored in the cached page, so they work with both half and full measure static caching. A filter URL has no static file of its own, so even with full measure the request reaches PHP, which serves the cached page and adds the headers.

## Custom page names

The addon needs to know which query string carries the page number. By default this is `page`. If you set a different `page_name` in a collection tag, add it to the `seo_page_names` key of the config file:

```php
'seo_page_names' => ['page', 'p'],
```

## Using it with another canonical tag

If an SEO addon such as SEO Pro, or your own template, already outputs a canonical URL, set `canonical="false"` on the tag. It then only outputs the robots tag:

```antlers
{{ livewire-filters:seo canonical="false" }}
```

A few things change when you do this:

- Filtered URLs still get `noindex,follow`, but where they point to is up to the other canonical tag.
- `seo_indexable_filters` only decides whether a URL gets `noindex`. For a filter URL to be indexed as its own page, the other canonical tag has to point to that filter URL. If it points to the listing page, search engines will most likely treat the filter URL as a copy of the listing page.
- In the custom query string mode the tag has nothing left to output, so you only need the [headers](#custom-query-string-mode). The `Link` header of an indexable filter URL points to the filter URL itself. This conflicts with a canonical tag in the shared `<head>`, so remove that tag from your listing templates if you use `seo_indexable_filters`.

## Configuration reference

All three keys are in `config/statamic-livewire-filters.php`. If you haven't already done so, publish the config file:

```shell
php artisan vendor:publish --tag statamic-livewire-filters-config
```

```php
// Filters whose single-value first pages stay indexable.
// Use a field handle, a parameter key or a custom query string alias.
'seo_indexable_filters' => [
    //
],

// Send the X-Robots-Tag and canonical Link headers for
// the filter URLs of the custom query string mode.
'seo_filter_headers' => false,

// The query strings that carry the page number.
'seo_page_names' => ['page'],
```
