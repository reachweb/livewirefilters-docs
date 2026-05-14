---
title: Common Issues
description: Common issues and troubleshooting for Statamic Livewire Filters.
---

# Common Issues

Sometimes things don't work as expected. If you're unsure whether something is a bug, please feel free to [reach out](./support) - I'm more than happy to help.

Below, you'll find some of the most common issues you might encounter while using Livewire Filters.

## Exception: `Blueprint [something] not found.`

This likely means that the collection or blueprint handle was entered incorrectly. Keep in mind that the blueprint handle is usually the singular form of the collection name. For example, the blueprint for the `pages` collection is typically `page`.

## Exception: `Field [handle] not found in blueprint [something].`

Similarly, this error likely indicates a typo in the field handle or an incorrect blueprint selection. Double-check your collections and blueprints to ensure accuracy.

## Exception: `strtolower(): Argument #1 ($string) must be of type string, array given`

This usually occurs when a filter option is selected that isn't compatible with the chosen condition. The most common cause is a field saved as an array being used with an `is` or `contains` filter. To resolve this, refer to the [query scope documentation](./advanced/query-scopes) on using the `multiselect` scope.

## Selecting an option of a taxonomy filter returns no results

Even if you have a taxonomy terms field in your Blueprint, for the taxonomy filtering to work correctly it needs to be selected in your Collection's configuration, in the `Content Model` section.

## Taxonomy filter terms appear as slugs on the filter options or tags.

Clear and warm your Content Stache from Utilities -> Cache. Sometimes the Stache will have old data.

## The add-on doesn't work correctly when using static caching

Static caching needs a small amount of setup to work correctly with Livewire Filters. See the dedicated [Static Caching](./advanced/static-caching) page for the full guide.

## Globals do not persist between Livewire Filters updates

If you are using a [Statamic Global](https://statamic.dev/globals) in your template and you use multi-site, you may have noticed that it gets removed from your Entries template after a Livewire Filters update. This is a limitation of the Statamic Livewire package. There are a couple of ways to fix this:

If your global's value doesn't change between requests, you can add `wire:ignore` to it so that it stays in place:

```antlers
<div wire:ignore>
    {{ your_global:some_variable }}
</div>
```

However if you use the global in some sort of control flow operation, for example you only display it if something else is missing, the above won't work. In that case you can use a [computed value](https://statamic.dev/computed-values):

```php
Collection::computed('collection_handle', 'your_variable', function ($entry, $value) {
    return GlobalSet::findByHandle('your_global')->inCurrentSite()->get('your_variable');
});
```

Obviously you can use the `entry` variable in the above example to get a value from your entry and adjust the return value accordingly. 