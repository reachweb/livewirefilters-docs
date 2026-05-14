# Static Caching

Static caching introduces some challenges for Livewire Filters. Each has a different fix, so they are covered separately below.

## Configuration cheat sheet

Generally to get the addon working correctly you need to either change some config flags or add <code v-pre>{{ nocache }}</code> tags.

| Setup | <code v-pre>{{ nocache }}</code> required? |
|---|---|
| Full measure + `enable_query_string` + `ignore_query_strings: false` (default) | No |
| Full measure, any other combination | Yes |
| Half measure (any setup) | Yes |

- Full measure also **requires** the <code v-pre>{{ livewire-filters:head }}</code> tag in your layout (before <code v-pre>{{ livewire:scripts }}</code>) to avoid 419 errors on the first interaction. 

- Half measure also **requires** `inject_assets: false` in Livewire's config **and** using a <code v-pre>{{ nocache }}</code> tag. Instructions for both those issues are included below.

## Filter values getting cached in the HTML

When a page is statically cached, the rendered HTML, including filter chrome state and the Livewire collection's results, is stored on disk (or in the application cache) and served to subsequent visitors. The right fix depends on [which filter URL mode](/advanced/url-query-string) you're using. *If you are not using the URL query string feature at all you can ignore this section and move to the next one.*

### Default Livewire query string mode (`enable_query_string`)

Filter URLs look like `/cars?params[taxonomy:car_brand:any]=audi`. You have two valid approaches:

**Option A — Cache each query string variant (Statamic default).** With `ignore_query_strings: false` (the default), Statamic writes a separate static file for every distinct URL, so each filter combination serves its own correct state without any extra work. No <code v-pre>{{ nocache }}</code> needed.

::: warning Watch your disk usage
With `ignore_query_strings: false`, Statamic writes a separate static file for **every** filtered URL a visitor lands on. On a collection with many filters and combinations, that can grow into thousands of files on disk. Plan your cache invalidation and disk usage accordingly, or use Option B below if this is a concern.
:::

**Option B — Share a single cache shell with <code v-pre>{{ nocache }}</code>.** Wrap the filter components and the `livewire-collection` tag in <code v-pre>{{ nocache }}</code> blocks (same pattern as the custom query string section below). The add-on's middleware rehydrates the original URL's query string onto the `/!/nocache` request so Livewire's `queryString` trait picks up the params and components mount with the correct state. This is required when you set `ignore_query_strings: true` or list your filter params under `disallowed_query_strings`, because Statamic would otherwise collapse every filter variant into the same cached HTML.

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

## Detected multiple instances of Livewire running error

When using **half** measure static caching you have to publish Livewire's config (`php artisan vendor:publish --tag=livewire:config`) and set `'inject_assets' => false`.

Make sure your layout includes both <code v-pre>{{ livewire:styles }}</code> in the head and <code v-pre>{{ livewire:scripts }}</code> at the end of the body — otherwise Livewire's runtime won't load on cached pages. With `inject_assets` left at the default (`true`), the `nocache` tags needed for the addon to work would cause Livewire assets to load twice on the second load of a cached page created an error.

