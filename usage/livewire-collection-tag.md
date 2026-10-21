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
- **infinite_scroll**: Enable incremental "load more" pagination instead of numbered links, rendered with the <code v-pre>{{ livewire-filters:load_more }}</code> tag (read more below). Requires `paginate` to be set.

## Securing parameters

Livewire keeps the active filter state in a public property, so like any Livewire request it can be tampered with. The risk isn't the filter *values* (the data is public), but Statamic query control keys. Statamic's collection query reads keys like `from`, `status`, `limit`, `site` and `since`/`until` as instructions that change which entries are returned, not as filters. Left open, a crafted request could inject them to surface draft entries or query a different collection.

The addon guards against this in two layers: a blocklist that is always on, and an optional allowlist for stricter control.

### The blocklist (`blocked_query_params`)

This is the default protection and needs no configuration. The `blocked_query_params` config option lists the query control keys that are stripped from filter state sent by the client before the entries query runs:

- **Safe by default.** The list ships populated with the known Statamic control keys (`status`, `published`, `show_future`, `show_past`, `since`, `until`, `redirect`, `redirects`, `links`, `from`, `in`, `folder`, `use`, `collection`, their `not_*` variants, `site`, `locale`, `limit`, `offset`, `paginate`, `chunk`, `filter`). Publish the config only if you want to add or remove keys.
- **Matches the key, not the condition.** A blocked key is matched against the segment before the first colon, so `status` blocks both `status` and `status:is`, while ordinary filter params like `transmission:is` pass through.
- **Covers URL state too.** Filter state provided through the URL (`params[...]` in either query string mode) passes through the same blocklist when the page loads. Parameters that configure the tag itself (`from`, `view`, `paginate`, `allowed_filters` and the other collection aliases) are never read from the URL at all, since they can only be set on the tag.
- **Counts follow the same state.** Filter value counts are calculated from the same filtered state as the entries query. The count listener doesn't apply the blocklist again to events sent to it directly, so a forged request can at most change the count numbers it gets back. It can't return entries or count another collection.
- **Trusts your tag.** Parameters set directly on the <code v-pre>{{ livewire-collection }}</code> tag are always kept, even if blocked. So this preset still works, and only a copy injected by the client is dropped:

```antlers
{{ livewire-collection:events from="events" status="draft" paginate="12" }}
```

::: info Fields named like a control key
Because matching is on the part before the colon, a real filter on a field named `status`, `from`, `site`, etc. (param key `status:is`) is stripped too. This is uncommon, but if you have one, allow it back through with `allowed_filters` (below).
:::

### The allowlist (`allowed_filters`)

The `allowed_filters` tag parameter does the opposite of the blocklist: when set, only the keys you name are allowed and everything else is dropped. It is optional, stricter, and scoped to a single tag. Pass the keys separated by `|`:

```antlers
{{ livewire-collection:cars paginate="6" allowed_filters="taxonomy:car_brand:any|transmission:is" }}
```

When using [query scopes](/advanced/query-scopes) you need to allow both parameters:

```antlers
{{ livewire-collection:cars paginate="8" allowed_filters="taxonomy:car_brand:any|query_scope:multiselect|multiselect:special_categories" }}
```

Any key you list is also exempt from the blocklist, which is how you allow a control key you legitimately need, such as letting visitors change the page size:

```antlers
{{ livewire-collection:cars paginate="6" allowed_filters="transmission:is|limit" }}
```

### Which should I use?

For most sites the blocklist already covers you and you need nothing else. Add `allowed_filters` when you want to:

- Restrict a tag to an exact allowlist instead of trusting the blocklist to name every risky key.
- Secure query scopes. The addon builds the `query_scope` key itself, so it can't be added to the blocklist without breaking scoped filters. If your app registers scopes that are sensitive or expensive, list them explicitly with `query_scope:<scope>` entries, the only option that fully resists tampering.
- Allow a specific blocked key on a single tag, such as a `limit` visitors can change or a filter on a field named like a control key.

## Pagination

Pagination is seamlessly managed by the `LivewireCollection` component. Simply include the `paginate` property in the tag to activate it. Within your template, use the <code v-pre>{{ links }}</code> tag to generate a TailwindCSS-styled pagination control.

If you prefer to customize the pagination appearance, you can modify the default pagination template located at `vendor/statamic-livewire-filters/livewire/ui/pagination.blade.php`.

For situations where you need to display the total number of entries (e.g., "Showing 5 of 60 results"), remember that using <code v-pre>{{ entries | count }}</code> will only count the entries on the current page. To display the total number of entries across all pages, use the <code v-pre>{{ pagination_total }}</code> variable anywhere within your template.

### Controlling Pagination Scroll Behavior

By default, pagination scrolls back to the top of the page when changing pages. You can disable this behavior by setting the `scrollTo` property on `LivewireCollection` to `false`.

Alternatively, you can specify a custom scroll target by setting `scrollTo` to a relevant **class** or **ID**. For example `scrollTo="#content"`.

## Infinite scroll (load more)

Instead of numbered page links, a paginated collection can pull more entries into the same page, either when the visitor clicks a button, or automatically as they scroll (true infinite scroll).

Enable it with `infinite_scroll="true"`:

```antlers
{{ livewire-collection:cars paginate="12" infinite_scroll="true" }}
```

Then render the trigger in your view with the <code v-pre>{{ livewire-filters:load_more }}</code> tag — think of it as the "load more" counterpart to <code v-pre>{{ links }}</code>:

```antlers
{{ livewire-filters:load_more }}              {{# manual "Load more" button #}}
{{ livewire-filters:load_more auto="true" }}  {{# auto-loads on scroll #}}
```

- Without `auto`, it renders a **"Load more"** button the visitor clicks.
- With `auto="true"`, it additionally wires up Alpine's `x-intersect` so the next page loads automatically as the trigger scrolls into view.

Each load grows the page size by the initial `paginate` value (so the example above loads 12 more entries at a time), and the size resets automatically whenever a filter or sort changes. The tag **hides itself** once there are no more pages, so you don't need to wrap it in a condition.

::: info Requires `paginate`
Infinite scroll builds on pagination, so `paginate` must be set. If it's missing (or `0`), `infinite_scroll` is ignored and the collection renders normally.
:::

The default view already includes the tag, so the basic setup works out of the box. You only have to add it yourself when using a **custom view**.

### Customizing the trigger

The <code v-pre>{{ livewire-filters:load_more }}</code> tag accepts:

| Parameter | Description |
|-----------|-------------|
| `auto` | Set to `true` to auto-load on scroll. Defaults to a click-to-load button. |
| `text` | Override the button label. Defaults to the translatable `statamic-livewire-filters::ui.load_more` string. |
| `class` | CSS classes for the `<button>` element. |

`text` and `class` are output as-is, like any Antlers variable. If you bind either to untrusted input (e.g. a request value), sanitize it at the call site — <code v-pre>text="{{ value | sanitize }}"</code>.

For full control over the markup, publish and edit the template at `vendor/statamic-livewire-filters/livewire/ui/load-more.antlers.html`.

::: warning State lives in the component, not the URL
The "loaded more" state is kept in the Livewire component rather than the URL. A full page reload therefore resets the list back to the first page — so infinite scroll is best suited to discovery-style listings rather than deep-linkable, shareable result sets.
:::

## Lazy loading

You can **lazy load** the `LivewireCollection` component by adding the `lazy="true"` parameter.

By default, the component uses the `resources/views/livewire/ui/lazyload-placeholder.blade.php` file as a skeleton. Feel free to modify this file to suit your needs.

If you need different skeleton templates for different collections, you can set the `lazy-placeholder` parameter in your component to specify a custom template.

## Passing data to the Livewire template

Since we're using a tag and not a partial your page variables will not be available in the Livewire template. There are times when you might want to pass some one-off parameter to the Livewire view. To do that just pass it using the tag:

```antlers
{{ livewire-collection:cars view="cars" image_size="large" }}
``

Then in your `cars.antlers.html` file in the Livewire Filters vendor folder you can access the `image_size` variable inside the `params` array:

```antlers
{{ params:image_size }}
``

