---
title: SEO for filtered pages
description: How to control the canonical URL and indexing of filtered and paginated pages in Statamic Livewire Filters.
---

# SEO for filtered pages <Badge type="tip" text="NEW" />

## Overview

When you keep filters in the URL with the [URL query string](/advanced/url-query-string) feature, every filter combination gets its own URL that search engines can crawl. Most of these URLs show part of the same entries as your listing page, so they end up as near-copies of it.

Since v4.7.0, the <code v-pre>{{ livewire-filters:seo }}</code> tag tells search engines which of these URLs to index:

- The listing page and its later pages stay indexable.
- Filtered and sorted URLs get `noindex,follow` and a canonical URL that points to the listing page.
- Filters you choose can stay indexable, for example to have a landing page for each brand.

## Adding the tag

Add the tag to the `<head>` of your layout:

```antlers
<head>
    {{ livewire-filters:seo }}
    ...
</head>
```

It outputs a canonical URL on **every** page that uses the layout, not only on pages with filters.

::: warning Already have a canonical tag?
A page must not have two different canonical URLs. If an SEO addon or your template already outputs one, see [Using it with another canonical tag](#using-it-with-another-canonical-tag).
:::

## What the tag outputs

This section is about the Livewire query string mode (`enable_query_string`). The [custom query string mode](#custom-query-string-mode) works differently.

For a `cars` listing page, the tag outputs:

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

Later pages keep their own canonical URL and stay indexable, as [Google recommends for pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading).

Without the URL query string feature, the filters aren't in the URL, so the tag only outputs the canonical URL, with the page number on later pages.

Filtering in the browser doesn't change these tags. That's fine, because search engines load each URL on its own.

### What counts as a filter

A URL counts as filtered when its `params` hold a `field:condition` style key (such as `fuel_type:is`, `taxonomy:car_brand:any` or a [query scope](/advanced/query-scopes) key), or `sort`, `order_by` or `taxonomy`.

Everything else is ignored and left out of the canonical URL, such as `page_name`, keys in `blocked_query_params`, [data you pass to the template](/usage/livewire-collection-tag#passing-data-to-the-livewire-template) and query strings like `utm_source`.

## Keeping some filters indexable

Some filtered pages are worth indexing. A page with all the Audi cars is a good landing page for a "used Audi" search. List these filters in the `seo_indexable_filters` config key:

```php
'seo_indexable_filters' => ['car_brand'],
```

A filtered URL then stays indexable, with a canonical URL to itself, when every active filter is in the list, each filter has one value, and it's the first page:

| Filters in the URL | Result |
|---|---|
| Brand: `audi` | Indexable, canonical to itself |
| Brand: `audi` and `bmw` | `noindex,follow`, canonical to `/cars` |
| Brand: `audi`, fuel type: `diesel` | `noindex,follow`, canonical to `/cars` |
| Brand: `audi`, page 2 | `noindex,follow`, canonical to `/cars` |
| Brand: `audi`, sorted by seats | `noindex,follow`, canonical to `/cars` |

You can list a filter in three ways:

- **Field handle**, such as `car_brand`: matches any condition on that field.
- **Parameter key**, such as `taxonomy:car_brand:any`: matches only that key.
- **Alias**, such as `brand`: matches the key the alias points to in `custom_query_string_aliases`.

::: warning Only list filters with a fixed set of values
The tag doesn't check the value. With `car_brand` in the list, a URL with a brand that doesn't exist is an indexable page without entries. For the same reason, don't list a text filter: every search term would get its own indexable URL.
:::

`sort` counts as a filter, so sorted URLs aren't indexed. Keep in mind that in the Livewire query string mode, once a visitor changes a filter, the URL also carries the conditions and the `sort` you preset on the <code v-pre>{{ livewire-collection }}</code> tag. If your tag has `sort="title:asc"`, add `sort` to `seo_indexable_filters` so those URLs stay indexable.

## Custom query string mode

In the [custom query string](/advanced/url-query-string#using-the-custom-url-query-string) mode, a filter URL such as `/cars/search/brand/audi` shares the listing page's static cache entry, `<head>` included. A `noindex` there would also be served for the listing page. So in this mode:

- The tag outputs nothing on a first page, and the canonical URL with the page number (`/cars?page=2`) on later pages.
- Filter URLs get their signals as HTTP headers: `X-Robots-Tag` instead of the robots tag, and a `Link` header instead of the canonical tag. Google supports both, including the [canonical header](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#rel-canonical-header-method).

The headers are off by default. Turn them on in the config file:

```php
'seo_filter_headers' => true,
```

::: warning Turn on the headers
With `seo_filter_headers` off, filter URLs get no `noindex` and no canonical URL in this mode.
:::

With the headers on, and the `brand` alias in `seo_indexable_filters`, the responses carry these headers:

| URL | `X-Robots-Tag` | `Link` canonical |
|---|---|---|
| `/cars` | | |
| `/cars/search/fuel/diesel` | `noindex, follow` | `/cars` |
| `/cars/search/brand/audi` | | `/cars/search/brand/audi` |
| `/cars/search/brand/audi,bmw` | `noindex, follow` | `/cars` |
| `/cars/search/brand/audi?page=2` | `noindex, follow` | |

A filtered page above 1 gets no `Link` header, because its `<head>` already carries the canonical of the unfiltered page (`/cars?page=2`).

The headers are never stored in the static cache, so they work with both half and full measure. To check a URL, use `curl`:

```shell
curl -sI https://example.com/cars/search/fuel/diesel | grep -iE "x-robots-tag|^link"
```

## Custom page names

The tag reads the page number from the `page` query string. If a collection tag sets another `page_name`, add it to the `seo_page_names` config key:

```php
'seo_page_names' => ['page', 'p'],
```

## Using it with another canonical tag

If an SEO addon such as SEO Pro, or your template, already outputs a canonical URL, set `canonical="false"`. The tag then only outputs the robots tag:

```antlers
{{ livewire-filters:seo canonical="false" }}
```

When you do this:

- Filtered URLs still get `noindex,follow`, but the other tag decides their canonical URL.
- For a filter URL in `seo_indexable_filters` to be indexed as its own page, the other canonical has to point to that URL, not to the listing page.
- In the custom query string mode, the tag has nothing left to output, so you only need the [headers](#custom-query-string-mode). If you use `seo_indexable_filters`, remove the other canonical tag from your listing templates, because it would conflict with the `Link` header of an indexable filter URL.

All three config keys are listed on the [Installation](/installation#configuration) page.
