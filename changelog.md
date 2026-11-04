# Changelog

## v4.6.3 (Nov 4th, 2026)

**Changed**

- Filters and `lf-sort` read the URL's filter parameters when they mount, so on a filtered URL the page shows ticked checkboxes, selected options and filled inputs straight away, in both [URL query string](./advanced/url-query-string) modes. Before, controls rendered empty and filled in after a second Livewire request, and <code v-pre>{{ nocache }}</code> regions returned empty controls. Filters set from presets on the <code v-pre>{{ livewire-collection }}</code> tag still arrive through `preset-params`, which now only carries filter parameters and `sort`.

**Fixed**

- With full-measure static caching, <code v-pre>{{ livewire-filters:head }}</code> waits for `DOMContentLoaded` before starting Livewire, so `alpine:init` listeners placed after <code v-pre>{{ livewire:scripts }}</code>, such as ones that register `Alpine.store`, run in time. See [Static Caching](./advanced/static-caching).
- With `custom_query_string` and full-measure static caching, filter changes no longer sometimes leave the browser URL unchanged.
- With `custom_query_string` and <code v-pre>{{ nocache }}</code> regions on full measure, a paginated URL such as `/cars/search/brand/audi?page=2` now opens on that page instead of page 1.

**Upgrading**

Sites that use the bundled views need no changes. Check these if they apply:

- **Custom filter components** that relied on `preset-params` for a URL parameter no longer receive it. Read `CustomQueryString::urlParams()` at mount; filters that use the `IsLivewireFilter` trait and define `setPresetValues()` get this automatically.
- **Published filter views** keep working but only show the selection once Livewire starts. Copy the new `@checked`, `@selected` and `value` attributes from the bundled views to show it in the server HTML.
- **Published `livewire/utility/url-handler.blade.php`:** re-publish it or merge in the new script to get the URL fix.

## v4.6.2 (Nov 4th, 2026)

**Performance**

A performance release: faster counts, range bounds and filter options, smaller Livewire responses and fewer Livewire requests. Results, counts and bounds are the same as before.

**Requirements**

- Statamic 5 sites need **5.29 or later**. On an older 5.x, `composer update` keeps you on 4.6.1, so nothing breaks. Statamic 6 is unchanged. See [Requirements](./installation#requirements).

**Changed**

- Faceted counts and dynamic range bounds find the matching entries once per filter state per request and read each field straight from the Stache index, instead of running one sorted query per filter. On a 5,000-entry collection with 8 filters, the counts request after page load drops from about 1 s to 300 ms. The Eloquent driver is unchanged.
- Term and entry option labels are read from the Stache indexes instead of loading every term and entry, so filters over a large taxonomy or collection mount several times faster. Option lists are no longer written to the cache store on every page view, so `lw_computed` cache files stop piling up.
- Filters no longer send HTML the browser throws away, and with `enable_filter_values_count` off their snapshots no longer carry an empty counts array.
- Fewer Livewire requests: the bundled checkbox view sends its update to the collection from the browser, the bundled `lf-count` view updates from the `entries-updated` event, the collection skips the tags update on page load when there's nothing to show, and "Clear all" only asks a filter to send a change back when it needs to. On the demo site a filtering session makes 8–26% fewer requests and receives up to 27% less data.
- `entries-updated` also carries `entriesLabel`, the translated count text. `clear-all-filters` from the collection carries two arguments: the condition keys it kept and the parameters it removed. See [Clearing All Filters](./advanced/tips-performance#clearing-all-filters).
- `validate_filter_values` still shows an error for an invalid checkbox value, but no longer stops the bundled checkbox view from applying it. Use `allowed_filters` and `blocked_query_params` to control which parameters the collection accepts. See [Configuration](./installation#configuration).

**Fixed**

- With full-measure static caching, <code v-pre>{{ livewire-filters:head }}</code> now starts Livewire even when its script runs after Statamic has replaced the CSRF token. Before, filters could stay unresponsive on slow networks. Place the tag before your stylesheets. See [Static Caching](./advanced/static-caching#page-expired-errors-on-the-first-filter-interaction-or-other-console-errors).
- A selection made while "Clear all" was on its way no longer stays applied after the filter resets.

**Upgrading**

Sites that use the bundled views, or published copies of them, need no changes. Check these if they apply:

- **Custom views that read `$statamic_field['counts']`:** with counts off the key is no longer set. Use `$this->counts[$value]`, which works with counts on or off.
- **Subclasses of `LfCheckboxFilter`** that define `payload()`, `updatedSelected()` or `dispatchFilterUpdated()` keep updating through the server and work as before.
- **Published `lf-checkbox.blade.php` or `ui/count.blade.php`:** both keep working through the server. Re-publish `lf-checkbox.blade.php`, or delete a published `count.blade.php`, to get the saved requests. See [Publish the views](./installation#publish-the-views).
- **Custom `clear-all-filters` listeners** that declare parameters now receive the kept keys and the removed parameters, in that order.

## v4.6.1 (Nov 2nd, 2026)

**Security**

- Faceted counts now only use the encrypted filter state that the collection sends, the same one dynamic range bounds use. A crafted `params-updated` event could previously put query controls into the count query and reveal whether matching draft, future or other-site entries exist.
- The `view` property of every filter component is now `#[Locked]`, so a tampered request can't switch a filter to another view. Setting `view` on the tag still works.

**Changed**

- `params-updated` always carries its second argument, the encrypted query, when `enable_filter_values_count` or `enable_dynamic_range_bounds` is on. Custom code that dispatches `params-updated` to refresh counts must pass it.
- The bundled filters now extend a new abstract `LivewireFilter` class. Subclasses of a bundled filter that define `payload()`, `emptyValue()`, `applyPreset()` or `dispatchFilterUpdated()` must match the new signatures.

**Fixed**

- A dual-range filter on a date field no longer crashes after a URL or tag preset, and removing a dual-range tag resets only the bound it names.
- With dynamic range bounds on, "Clear all" keeps range sliders within the full-collection bounds.
- Pretty URLs with several `query_scope` aliases now apply every scope.
- `condition="taxonomy"` on a field whose handle isn't the taxonomy handle now throws a clear exception at mount.
- Faceted counts no longer crash on fields holding nested arrays or objects, and multi-collection and multi-taxonomy counts now match the entries.
- Localized term routes now filter by the default-locale term slug.

**Upgrading**

- If you published `tags.blade.php`, pass `$tag['condition']` as the third argument of `removeOption`.

## v4.6.0 (Oct 21st, 2026)

**Security: query parameter hardening**

Livewire keeps the active filter state in a public property, so a crafted request can inject any key into it, including Statamic query controls like `from`, `status`, `limit` and `site` that change which entries are returned rather than filtering them. This release blocks that by default, with no configuration needed.

**New**

- **`blocked_query_params` config option:** a blocklist of query control keys (`status`, `from`, `site`, `limit`, `paginate`, `since`/`until`, `filter`, and more) stripped from filter state sent by the client before the entries query runs. It ships populated, so there is nothing to set up. Parameters set directly on the <code v-pre>{{ livewire-collection }}</code> tag are always kept, and `allowed_filters` can let a specific key back through (a value sent by the client then overrides the one set on the tag). See [Securing parameters](./usage/livewire-collection-tag#securing-parameters).
- **Dynamic range bounds:** set the new `enable_dynamic_range_bounds` config option to `true` and the Range and Dual Range filters narrow their slider to the values that still match the other active filters. A selection the user has made is never moved, and an unused slider is disabled when there's nothing left to choose between. It's off by default, since it runs a query for each range filter after every change. See [Dynamic bounds](./usage/dual-range-filter#dynamic-bounds).

**Changed**

- Removing a filter from the tags, or clicking "Clear all", now updates the collection in a single Livewire round trip instead of waiting for each filter to relay the change back. The `clear-option` and `clear-all-filters` events still reach filter components with the same payloads, so custom filters keep working. On "Clear all", parameters set on the tag or by an `init` hook are still only cleared by their own filter component, and Resrv's availability filter keeps its dates.
- A `filter-updated`, `clear-filter` or `clear-option` event that changes nothing (on page 1) no longer re-renders the collection. If you dispatched `filter-updated` to force a refresh, call Livewire's `$refresh` on the collection component instead.
- Filter identity properties (`field`, `condition`, `modifier`, `collection`, `blueprint`, `statamic_field`), and the `collection`, `blueprint` and `fields` properties of the sort component, are now `#[Locked]`, so a tampered request can no longer change what a filter points at.
- `setParameters()` on the `LivewireCollection` component is now `protected`. Livewire exposes every public method as an action the client can call, and this one writes trusted state such as the collection and `allowed_filters`. If you were calling it from custom code, pass the parameters through the tag instead.
- Filter state keys starting with `:` are rejected. Statamic evaluates a `:key` parameter as an Antlers expression, so a crafted request could have one evaluated inside the entries or count query.
- Filter state arriving through the URL (`params[...]`, in both query string modes) is sanitized before it reaches the component: blocked keys are stripped, and parameters that configure the tag itself (`from`, `view`, `paginate`, `allowed_filters` and the other collection aliases) are never read from the URL, since they can only be set on the tag. If you relied on a URL `limit` with legacy `paginate="true"` pagination, allow it back with `allowed_filters` (for example `allowed_filters="transmission:is|limit"`).
- Query control parameters written by a server `init` hook keep working: anything the hook adds, changes or removes during mount is treated as trusted, the same as parameters set on the tag, since hooks are registered in your own application code.
- Counts are calculated from the same hardened parameters as the entries query, so the blocklist and `allowed_filters` apply to them too, and the first counts on page load include parameters added by `init` hooks.
- The `params-updated` event carries the hardened parameters instead of the raw filter state, gains a second argument (the encrypted bounds query) and also fires when only dynamic bounds are on. Listeners that take one argument keep working.
- The count listener now exits early when `enable_filter_values_count` is off, so no queries run when the feature is disabled, and it always counts within the filter's own collection.

**Fixed**

- Moving a range slider back to its default value now clears the filter instead of leaving it in the URL and the tags.
- Toggle filters with a numeric or boolean `preset_value` now show as on when restored from the URL or a preset.
- Removing a tag for a condition, taxonomy or query scope parameter that has no filter component on the page now removes it. Previously the click did nothing.
- With `allowed_filters`, an active query scope is now allowed when its own `query_scope:<scope>` entry is listed. Previously the whole scope list had to match one entry, so two active scope filters dropped both scopes.

**Upgrading**

- **Config cache:** If you cache your config, run `php artisan config:clear` or rebuild it with `php artisan config:cache` after updating, otherwise the blocklist stays unset. See [Upgrading and the config file](./installation#upgrading-and-the-config-file).
- **Published range views:** If you published `lf-range.blade.php` or `lf-dual-range.blade.php`, merge in the new `range-bounds-updated` listener (the range view also reads `$dynamicMin`, `$dynamicMax` and `$boundsDisabled`) or re-publish them, otherwise the sliders won't update when dynamic bounds are on. See the [Range](./usage/range-filter#custom-views) and [Dual Range](./usage/dual-range-filter#custom-views) filter pages.
- **Static caching:** clear the static cache after updating (`php please static:clear`). Pages cached under 4.5.1 hold the old component state, so on the first filter change control parameters set on the tag (such as `limit` or `site`) would be stripped as if a visitor had sent them. See [Static caching](./advanced/static-caching).
- **Fields named like a control key:** a filter on a field whose handle is a blocked key (such as `status`, `site` or `from`) is now stripped. See [Fields named like a control key](./usage/livewire-collection-tag#the-blocklist-blocked-query-params).
- **Sensitive query scopes:** `query_scope` isn't blocked, since the addon builds it for scope filters. Lock scopes down with `query_scope:<scope>` entries in `allowed_filters`. See [Which should I use?](./usage/livewire-collection-tag#which-should-i-use).
- **Custom filter components:** "Clear all" now removes every filter parameter except those set on the tag or by an `init` hook, including those from custom components that don't listen for `clear-all-filters`. If such a component should reset its own controls too, listen for that event.
- **Overridden methods:** `filterUpdated()` and `clearFilter()` on the `LivewireCollection` component, and `clearFilters()` on the filter components, have a new optional `$boundsSelection` parameter. If you extend one of these components and override any of these methods, add `$boundsSelection = null` to its signature, otherwise PHP throws a fatal "must be compatible" error.

📖 Full guide: [https://livewirefilters.com/usage/livewire-collection-tag#securing-parameters](https://livewirefilters.com/usage/livewire-collection-tag#securing-parameters)

## v4.5.1 (Jun 29th, 2026)

**Fixed**

-Fix browser-history behavior when using the addon's custom query string mode

## v4.5.0 (Jun 19th, 2026)

**New**

- **Infinite scroll / "Load more" pagination** — add `infinite_scroll="true"` to the <code v-pre>{{ livewire-collection }}</code> tag to enable incremental loading, then render the trigger with the new <code v-pre>{{ livewire-filters:load_more }}</code> tag. Use `auto="true"` for true infinite scroll or omit it for a manual "Load more" button; either way it degrades to a real button without JavaScript. Each load grows the page by the initial `paginate` value and resets on filter/sort change. The trigger is a publishable partial with translatable labels.

**Fixed**

- Duplicate browser history entries when paginating in custom query string mode, plus more reliable browser **Back** button behaviour.
- Static caching on multisite installs: correct site resolution and subdirectory handling.

📖 Full guide: [https://livewirefilters.com/usage/livewire-collection-tag#infinite-scroll-load-more](https://livewirefilters.com/usage/livewire-collection-tag#infinite-scroll-load-more)

## v4.4.0 (Jun 14th, 2026)

**Static Caching Support**

Improves Livewire Filters' support for statically cached pages (full and half measure).

**New**

- <code v-pre>{{ livewire-filters:head }}</code> tag — add it to your layout before <code v-pre>{{ livewire:scripts }}</code> to prevent 419 "Page Expired" errors on the first filter interaction under full-measure caching. Outputs nothing when caching is off, so it's safe to leave in permanently.
- Better <code v-pre>{{ nocache }}</code> handling across all URL modes — filter state is rehydrated on Statamic's `/!/nocache` requests, so filters resolve correctly on a shared cache shell in both the Livewire and custom query string modes (no more stale or "poisoned" filtered pages).

**Changed**

- Query string modes are now mutually exclusive — when `enable_query_string` (Livewire) is on, `custom_query_string` is ignored.

**Fixed**

- Taxonomy terms with numeric slugs are no longer dropped from filter options and counts.

📖 Full guide: [https://livewirefilters.com/advanced/static-caching](https://livewirefilters.com/advanced/static-caching)

## v4.3.2 (Mar 25th, 2026)

- Fix counts for custom options array.

## v4.3.1 (Mar 24th, 2026)

- Preserve existing (non-filter) query parameters when rewriting custom filter URLs
- Avoid pushing browser history when the computed URL is unchanged.

## v4.3.0 (Mar 20th, 2026)

- Laravel 13 support

## v4.2.0 (Mar 20th, 2026)

**Performance**
- **Shared count queries** — filters with the same base parameters share a single query instead of each running their own.
- **Eloquent optimization** — on sites using the Eloquent driver, counts pull only the needed field values directly from the database instead of hydrating full entry objects.
- **Request-level caching** — taxonomy terms, collection entries, dictionary options, and blueprint lookups are cached within the request so duplicate lookups are avoided.

**Bug Fixes**

- **Custom query string URL matching** — /myfilters/ no longer incorrectly matches a filters prefix. Matching is now segment-exact.
- **Query scope count parameters** — fixed incorrect count results when using scoped filters.
- **Livewire request detection** — now uses the X-Livewire header instead of checking for the livewire/update path, fixing issues with custom Livewire endpoints.
- **Multisite path handling** — correctly resolves the current page path from the Referer header during Livewire requests.

**View Template Changes**

Only relevant if you've published views with `php artisan vendor:publish`

There are two changes in `lf-checkbox-advanced.blade.php` & `lf-select-advanced.blade.php` :

The Alpine counts property is now initialized with PHP rendered data (keys with null values) instead of an empty object, so Alpine knows which filter options exist from the start:

Change: `counts: {},`

To: `counts: @js($this->counts),`

The visibility check has been simplified since the keys are now always present:

You can change: `x-show="counts && counts[value] !== undefined"`

To: `x-show="counts[value] != null"`

## v4.1.1 (Mar 9th, 2026)

- Fix: Using sort on a taxonomy filter in a multisite setup displayed terms in mixed/incorrect languages instead of the current site's locale.

## v4.1.0 (Feb 21st, 2026)

- Added Laravel Boost guidelines

## v4.0.0 (Dec 15th, 2025)

- Statamic 6 support
- Livewire 4 support
- Fix pagination ?page query string when using custom query sting.

## v3.1.4 (Dec 15th, 2025)

- Fixed: Correctly decode URL encoded values

## v3.1.3 (Dec 1st, 2025)

- Fixed: Lazyload placeholder view was always the default (the parameter didn't get through).

## v3.1.2 (Nov 8th, 2025)

- Fixed: Pagination was not reset when the user was using the "Clear filter" button or when removing an option using LfTags.

## v3.1.1 (Nov 5th, 2025)

- Significantly improve the performance of filter option counts.

## v3.1.0 (Oct 22nd, 2025)

- Added support for the dictionary field. You can now use the built-in or any custom Dictionaries in any filter.
- Fixed ordering for the entries fieldtype so that you can order the field options by title.

## v3.0.1 (Oct 20th, 2025)

- Fixed: Display the key of a select field when the label is not set.

## v3.0.0 (Oct 8th, 2025)

We're excited to announce a new major release for Livewire Filters! This update is accompanied by a brand new documentation website (you're on it!) and a new live [demo page](https://demo.livewirefilters.com) where you can see all the features in action.

### ✨ What's New

* **Upgraded to Tailwind v4**
    This makes customizing the theme—especially for minor color changes—much easier. If you're updating from a `v2.x` version, please check the [installation guide](./installation) for the required changes.

* **New Advanced Filters with Alpine.js**
    We've added new "advanced" **select** and **checkbox** filters! They are ideal for horizontal layouts, offer consistent styling across different platforms, and can be made searchable. See them in action on the [horizontal demo page](https://demo.livewirefilters.com/horizontal).

* **New Toggle Filter**
    The new **[Toggle Filter](./usage/toggle-filter)** allows you to create filters with preset values that your users can simply turn on or off.

### 🚀 Improvements & Fixes

* Added a `placeholder` property to all applicable filters.
* Upgraded the core dependency to `marcorieser/statamic-livewire` v5.0.0.
* Made several accessibility improvements.
* Fixed various minor bugs.

## v2.7.0 (Mar 29th, 2025)

- Added support for entries field. You can use an entries relationship field as a filter. The published entries from all associated collections will appear as options.
- When using multi-site and a Statamic entries field to filter your entries, Livewire Filters defaults to using each entry's origin ID. This aligns with Statamic's behavior, where the origin acts as the source of truth unless the field has been localized. This preserves relationships while allowing the associated entry to be translated.
- If you are localizing the entries field itself and want to change this behavior, set the `use_origin_id_for_entries_field` option to `false` in the config file. This will make Livewire Filters use the entry ID from the current site for filtering instead.

## v2.6.0 (Mar 28th, 2025)

- Added a `scrollTo` property to LivewireCollection to disable or control the target of the scroll after using the paginator. (#41)
- Added a `placeholder` property to LfTextFilter that allows you to set a placeholder for the input element. (#42)
- Fixed an issue where the taxonomy terms would appear in the wrong language when using multi site.

**Upgrade Notes:**
- The templates for the pagination (`ui/pagination.blade.php`) and the LfTextFilter (`filters/lf-text-filter.blade.php`) need to be upgraded to support the above features. If you have published them, check the original files to copy over the changes.

## v2.5.0 (Feb 26, 2024)

- Laravel 12 support

## v2.4.0 (Feb 10, 2024)

**New features**
- Lazy Loading: The LivewireCollection component now supports lazy loading.
- LfCount component and `count` and `active` variables in the `entries-updates` event.
- Added a method to allow clearing all filters at once and added a "Clear all" button in LfTags.

**Fixes**
- Fixed multi-site queries by using the RestoreCurrentSite trait from the statamic-livewire package.
- Fixed an issue with LfTags when multiple query scopes were used.
- Fixed an error that caused LivewireCollection to render twice when values were preset.
- Added a command to publish the language file.

**Other**
- New Tips and Performance page in the docs that will contain some tips and best practices.
- Changed the statamic-livewire package installed to marcorieser/statamic-livewire as @marcorieser is the new maintainer.

## v2.3.2 (Nov 10, 2024)

- Fixed a few issues regarding query scopes:
  - You can now apply more than one query scope at a time (before the key would have been overridden).
  - You can preset a query scope in the LivewireCollection tag and another one in the URL and they will both be correctly preset.
  - The Multiselect can now apply for more than one field (previously it only applied randomly for the first).
  - The Resrv query scope is now recognized so that it doesn't try to implode the search array.
- If you are not using query scopes or Resrv you can safely skip this release.

## v2.3.1 (Nov 7, 2024)

- Fixed an issue that was caused by the LivewireCollection component responding too slowly when adding filter params.
- Removed the command property from the filters-updated event and cleaned up the code.
- Fixed removing a filter from the LfTags component when the selected value was an array.

## v2.3.0 (Nov 6, 2024)

- New filter: Dual Range Filter. A brand new custom build Livewire component that uses a slider to let the user filter entries that fall into the specified values range.
- More information and documentation: https://livewirefilters.com/usage/dual-range-filter
- Fix: The LfRangeFilter was causing double rendering of the LivewireCollection component (#20). This is now fixed and the default property is deprecated. (you can set a default value in the LivewireCollection component itself)

## v2.2.0 (Nov 2, 2024)

- New feature: Custom URL Query String. Statamic Livewire Filters can now generate easy to read, SEO-friendly URLs when the user is using the filtering system.
- Read the docs: https://livewirefilters.com/advanced/url-query-string#using-the-custom-url-query-string
- Live demo: https://demo.livewirefilters.com/advanced/search/brand/citroen,toyota,vw/categories/crossover-suv/transmission/automaticTransmission

## v2.1.0 (Oct 28, 2024)

- New Feature: Filter options are now sortable. For more information, see the documentation on sorting filter values.
- Documentation: Added a "Common Issues" page to the docs cover common misconfigurations and other issues.

## v2.0.1 (Oct 17, 2024)

- Fixed getting the correct options for array based fields since Statamic changed the way they are saved in statamic/cms#10467

## v2.0.0

- Statamic v5 and Laravel v11 support. 