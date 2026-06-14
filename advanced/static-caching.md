# Static Caching

Static caching introduces some challenges for Livewire Filters. Each has a different fix, so they are covered separately below.

## What works out of the box

If you **don't** use the [URL query string](/advanced/url-query-string) feature generally everything works for both full and half measure static caching as it should with one small exception:

- Full measure **requires** the <code v-pre>{{ livewire-filters:head }}</code> tag in your layout (before <code v-pre>{{ livewire:scripts }}</code>) to avoid 419 errors on the first interaction. See [Page Expired errors](#page-expired-errors-on-the-first-filter-interaction-or-other-console-errors) below.

## Configuration cheat sheet

Besides the required prerequisite above, to get the addon working correctly when you use the URL query string feature you need to either change some config flags or add <code v-pre>{{ nocache }}</code> tags.

| Setup | <code v-pre>{{ nocache }}</code> required? |
|---|---|
| Full or half measure + `enable_query_string` + `ignore_query_strings: false` (default) | No |
| Full or half measure + `enable_query_string` + `ignore_query_strings: true` (or filter params in `disallowed_query_strings`) | Yes |
| Full or half measure + `custom_query_string` | Yes |

- When half measure is combined with <code v-pre>{{ nocache }}</code> tags, you also **need** `inject_assets: false` in Livewire's config. Read more [here](#detected-multiple-instances-of-livewire-running-error).

## Filter values getting cached in the HTML

When a page is statically cached, the rendered HTML, including filter chrome state and the Livewire collection's results, is stored on disk (or in the application cache) and served to subsequent visitors. The right fix depends on [which filter URL mode](/advanced/url-query-string) you're using. *If you are not using the URL query string feature at all you can ignore this section as you don't need to add the `nocache` tags.*

### Default Livewire query string mode (`enable_query_string`)

Filter URLs look like `/cars?params[taxonomy:car_brand:any]=audi`. You have two valid approaches:

**Option A — Cache each query string variant (Statamic default).**

With `ignore_query_strings: false` (the default), Statamic caches every distinct URL separately — full measure writes a separate static file, half measure stores a separate response in the application cache — so each filter combination serves its own correct state without any extra work. No <code v-pre>{{ nocache }}</code> needed on either measure.

::: warning Watch your disk and cache usage
With `ignore_query_strings: false`, Statamic creates a separate static file (full measure) or cache entry (half measure) for **every** filtered URL a visitor lands on. On a collection with many filters and combinations, that can grow into thousands of files on disk or entries in your application cache. Plan your cache invalidation and storage accordingly, or use Option B below if this is a concern.
:::

**Option B — Share a single cache shell with <code v-pre>{{ nocache }}</code>.**

Wrap the filter components and the `livewire-collection` tag in <code v-pre>{{ nocache }}</code> blocks (same pattern as the custom query string section below). On full measure, the addon's middleware rehydrates the original URL's query string onto the `/!/nocache` request so Livewire's `queryString` trait picks up the params and components mount with the correct state; on half measure, the nocache regions re-render server-side on every request, so the params are picked up from the request directly. This is required when you set `ignore_query_strings: true` or list your filter params under `disallowed_query_strings`, because Statamic would otherwise collapse every filter variant into the same cached HTML.

### Custom query string mode (`custom_query_string`)

Filter URLs look like `/cars/search/brand/audi`. The addon rewrites these to the underlying entry path (`/cars`) so the route resolver can find the page; this rewrite happens before Statamic's static cache decides on a cache key, which means **every filter combination would otherwise overwrite the same cache entry as the unfiltered page**.

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
- The unfiltered URL (`/cars`) and every filter combination share the same cached shell and produce the correct dynamic content because the addon's middleware sets filter params on the `/!/nocache` request from the URL segments.

Trying to use an `exclude.urls` pattern like `*/search/*` to skip caching filter URLs does **not** work in this mode — by the time Statamic evaluates exclusions, the URL has already been rewritten to the canonical path. If you really want to skip caching for a filter page entirely, exclude the canonical path itself (e.g. `'/cars*'`).

### Preset values and presets in `livewire-collection`

The same rule applies. If your `lf-toggle-filter` has a `preset_value`, or your `livewire-collection` tag has preset params like `taxonomy:car_brand:any="toyota|hyundai|vw"`, wrap the filter components and the collection in <code v-pre>{{ nocache }}</code>. Otherwise the cached HTML bakes in whichever preset was active when the cache was warmed.

## Page Expired errors on the first filter interaction or other console errors

When using **full measure** static caching, Statamic serves a cached HTML file in which the CSRF token has been replaced with a placeholder. Statamic replaces the placeholder client-side via an asynchronous `fetch('/!/csrf')` call. Livewire, however, auto-starts on `DOMContentLoaded` and serializes its first commit before that fetch resolves. The first user interaction then sends the placeholder as `_token` and the server responds with 419. You could also see a console log error like `Uncaught TypeError: Cannot set properties of undefined (setting 'csrf')` when using the url handler.

To fix add the <code v-pre>{{ livewire-filters:head }}</code> tag to your layout file.

If you are manually bundling the assets, add it **before** <code v-pre>{{ livewire:scripts }}</code>:

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

The tag loads a small inline script that defers `Livewire.start()` until Statamic's `statamic:csrf.replaced` event fires. The tag outputs nothing when full-measure caching is disabled, so it's safe to leave in the layout permanently.

## Detected multiple instances of Livewire running error

When using **half** measure static caching and using <code v-pre>{{ nocache }}</code> tags you have to publish Livewire's config:

```bash
php artisan vendor:publish --tag=livewire:config
```

and set `'inject_assets' => false`.

Make sure your layout includes both <code v-pre>{{ livewire:styles }}</code> in the head and <code v-pre>{{ livewire:scripts }}</code> at the end of the body like mentioned [here](https://github.com/marcorieser/statamic-livewire#manually-including-livewires-frontend-assets) otherwise Livewire's runtime won't load on cached pages. With `inject_assets` left at the default (`true`), the `nocache` tags needed for the addon to work would cause Livewire assets to load twice on the second load of a cached page, creating an error.

