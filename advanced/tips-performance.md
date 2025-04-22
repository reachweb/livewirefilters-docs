---
title: Tips & Performance
description: Tips and performance advice for Statamic Livewire Filters.
---

# Tips & Performance

## Overview

On this page, you can find some useful tips for better utilizing Livewire Filters, along with some performance tips.

## Displaying Total Entries / Active Filters

Quite often, you'll need to display the total number of entries after filtering (e.g., X items available) or show how many filters are active. The `LivewireCollection` component fires the `entries-updated` event after filtering is done. This event contains the `count` and `active` variables, which contain the number of entries and active filters, respectively.

Livewire Filters include a helper component called `LfCount` that you can use to display the count of entries:

```antlers
{{ livewire:lf-count }}
```

Alternatively, you can use AlpineJS to listen to that event and update these numbers like so:

```antlers
<div 
     x-data="{ count: 0 }"
     x-on:entries-updated.window="count = $event.detail?.count ?? 0"
 >
  <span x-show="count > 0">
    <span class="font-bold" x-text="count"></span> items found
  </span>
</div>
```

::: info Why not only use {{ entries | count }} ?
You might be wondering why you don't just count the entries variable. You could, however, the entries array only contains the current entries that will be displayed, so if you use pagination, the number will be wrong. Also, you can only use it within LivewireCollection's template, while the solution above works anywhere on your site.
:::

## Clearing All Filters

Sometimes it's helpful to let the user clear all the enabled filters. The [LfTags](../tags.md) component has a "Clear all" button by default that lets the user do just that. If you need to display only the "Clear all" button, you have the following options:

- The `LivewireCollection` component has a `clearAll()` method. So anywhere in your template, you can use `wire:click="clearAll()"` to allow the user to clear all filters.
- Use an `LfTags` component with a custom view that only displays the Clear all button.
- If you want to add the button anywhere else on your page, use a little bit of AlpineJS:

```antlers
<div x-data="{ collectionComponent: Livewire.getByName('livewire-collection')[0] }">
    <button x-show="collectionComponent.$get('activeFilters') > 0" x-on:click="collectionComponent.$call('clearAll')">Clear all filters</button>
</div>
```

## Filtering Entries Field in Multi-Site Setups

When using **multi-site** and a **Statamic entries field** to filter your entries, Livewire Filters defaults to using each entry's **origin ID**. This aligns with Statamic's behavior, where the origin acts as the source of truth unless the field has been localized. We believe this is the most common use case, as it preserves relationships while allowing the associated entry to be translated.

If you are **localizing the entries field itself** and want to change this behavior, set the `use_origin_id_for_entries_field` option to `false` in the config file. This will make Livewire Filters use the **entry ID from the current site** for filtering instead.

## Improving Performance

Livewire Filters use the native Statamic queries as they are used in the native `collection` tag. Usually, the results should load pretty fast; however, if you have hundreds of entries, things might start to slow down.

Some best practices to speed things up are:

- Use pagination: showing fewer entries per page improves performance significantly.
- Set up [Stache indexes](https://statamic.dev/stache#indexes): don't let your users wait for the Stache to rebuild in real-time.
- Optimize your template: more often than not, the real culprit is a slow rendering template for each entry. Make sure you use the Glide cache and try to optimize any slow-loading content by leveraging [computed values](https://statamic.dev/computed-values).

## Presetting Filters Using Statamic Fields

In some cases, you may need to control which filters are preset based on a field in your Statamic entry.

For example, imagine a **Cars** collection with a main landing page displaying all cars and individual landing pages for each brand. While you could use the custom URL query string to build a clean URL, this wouldn't allow for unique content on each landing page—something crucial for SEO.

To solve this, you can use **Antler's** `void` **keyword** to apply a filter only if it exists on the page:

```antlers
{{ livewire-collection:cars taxonomy:car_brand:any="{ current_brand ? current_brand: void }" paginate="8" }}
```

This approach presets the `car_brand` taxonomy filter with the value of `current_brand` if it is set; otherwise, the parameter is removed. 