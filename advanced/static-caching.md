# Static Caching

Static caching introduces two distinct problems for Livewire Filters. Each has a different fix, so they are covered separately below.

If you're unsure which problem you're seeing, the symptoms are:

- **"Page Expired" (419) on the first filter interaction after every page load.** Subsequent interactions work. → See *Page Expired errors* below.
- **Filtered results are wrong or stale, or filter chrome shows the wrong checked state.** A visitor sees the previous visitor's filters. → See *Filter values getting cached in the HTML* below.
- **Console errors mentioning that multiple instances of Livewire (or Alpine) are running.** On the second load of a page when using **half measure** static caching. → See *Detected multiple instances of Livewire running error* below.

## Page Expired errors on the first filter interaction

When using **full measure** static caching, Statamic serves a cached HTML file in which the CSRF token has been replaced with a placeholder. Statamic replaces the placeholder client-side via an asynchronous `fetch('/!/csrf')` call. Livewire, however, auto-starts on `DOMContentLoaded` and serializes its first commit before that fetch resolves. The first user interaction then sends the placeholder as `_token` and the server responds with 419.

Add the <code v-pre>{{ livewire-filters:head }}</code> tag to your layout file, **before** <code v-pre>{{ livewire:scripts }}</code>:

```antlers
<head>
    ...
    {{ livewire:styles }}
    {{ livewire-filters:head }}
</head>

<body>
    ...
    {{ livewire:scripts }}
</body>
```

The tag emits a small inline script that defers `Livewire.start()` until Statamic's `statamic:csrf.replaced` event fires. The tag outputs nothing when full-measure caching is disabled, so it's safe to leave in the layout permanently.

## Filter values getting cached in the HTML

When a page is statically cached, the rendered HTML — including filter chrome state and the Livewire collection's results — is stored on disk (or in the application cache) and served to subsequent visitors. The right fix depends on **which filter URL mode** you're using.

### Default Livewire query string mode (`enable_query_string`)

Filter URLs look like `/cars?params[taxonomy:car_brand:any]=audi`. Statamic's default static-caching configuration caches each unique query string as a separate file, so each URL serves its own correct state without any extra work. **Do not wrap these pages in <code v-pre>{{ nocache }}</code>** — the dynamic content inside <code v-pre>{{ nocache }}</code> is rendered via Statamic's `/!/nocache` endpoint, which doesn't carry the original URL's query string through to Livewire's `queryString` trait. Direct visits to a filtered URL would then come back unfiltered.

::: warning Watch your disk usage
With the default `ignore_query_strings: false`, Statamic writes a separate static file for **every** filtered URL a visitor lands on. On a collection with many filters and combinations, that can grow into thousands of files on disk. Plan your cache invalidation and disk usage accordingly, or switch to the <code v-pre>{{ nocache }}</code> approach below if this is a concern.
:::

This assumes you haven't set `ignore_query_strings: true` or disallowed your filter parameters via `disallowed_query_strings` in `config/statamic/static_caching.php`. If you have, Statamic collapses every query-string variant into a single cache file and you need the next section's <code v-pre>{{ nocache }}</code> approach instead.

### Custom query string mode (`custom_query_string`)

Filter URLs look like `/cars/search/brand/audi`. The add-on rewrites these to the underlying entry path (`/cars`) so the route resolver can find the page; this rewrite happens before Statamic's static cache decides on a cache key, which means **every filter combination would otherwise overwrite the same cache entry as the unfiltered page**.

Wrap **both** the `livewire-collection` tag and the filter components in <code v-pre>{{ nocache }}</code> tags:

```antlers
{{ nocache }}
    {{ livewire:lf-text-filter blueprint="cars.car" field="title" condition="contains" }}
    {{ livewire:lf-checkbox-filter blueprint="cars.car" field="car_brand" condition="taxonomy" }}
    {{ livewire:lf-radio-filter blueprint="cars.car" field="transmission" condition="is" }}
{{ /nocache }}

{{ nocache }}
    {{ livewire:lf-tags blueprint="cars.car" fields="title|car_brand|transmission" }}
    {{ livewire-collection:cars paginate="9" }}
{{ /nocache }}
```

A single <code v-pre>{{ nocache }}</code> block can wrap multiple tags, so two blocks are usually enough no matter how many filters you have. With this in place:

- The cached HTML is just a shell with placeholders.
- Filter chrome state and entries are rendered fresh per request via Statamic's `/!/nocache` endpoint.
- The unfiltered URL (`/cars`) and every filter combination share the same cached shell and produce the correct dynamic content because the add-on's middleware sets filter params on the `/!/nocache` request from the URL segments.

Trying to use an `exclude.urls` pattern like `*/search/*` to skip caching filter URLs does **not** work in this mode — by the time Statamic evaluates exclusions, the URL has already been rewritten to the canonical path. If you really want to skip caching for a filter page entirely, exclude the canonical path itself (e.g. `'/cars*'`).

### Preset values and presets in `livewire-collection`

The same rule applies. If your `lf-toggle-filter` has a `preset_value`, or your `livewire-collection` tag has preset params like `taxonomy:car_brand:any="toyota|hyundai|vw"`, wrap the filter components and the collection in <code v-pre>{{ nocache }}</code>. Otherwise the cached HTML bakes in whichever preset was active when the cache was warmed.

## Detected multiple instances of Livewire running error

When using **half** measure static caching you have to publish Livewire's config (`php artisan vendor:publish --tag=livewire:config`) and set `'inject_assets' => false`.

Make sure your layout includes both <code v-pre>{{ livewire:styles }}</code> in the head and <code v-pre>{{ livewire:scripts }}</code> at the end of the body — otherwise Livewire's runtime won't load on cached pages. With `inject_assets` left at the default (`true`), the `nocache` tags needed for the addon to work would cause Livewire assets to load twice on the second load of a cached page created an error.
