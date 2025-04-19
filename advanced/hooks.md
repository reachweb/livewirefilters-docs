---
title: Hooks
description: How to use hooks with Statamic Livewire Filters.
---

### Overview

Since v4.50.0 Statamic supports [hooks](https://statamic.dev/extending/hooks), allowing you to "hook" into the `Collection` tag to perform an action into the `Entries` data.

Statamic Livewire Filters adds a hook called `livewire-fetched-entries` in order to allow you to modify `Entries` data before they are served to the frontend.

### How to use

You can register hooks in the `boot` method of your `AppServiceProvider` file (or any other Provider):

```php
public function boot()
{
    // Other code here
    \Reach\StatamicLivewireFilters\Http\Livewire\LivewireCollection::hook('livewire-fetched-entries',
        function ($entries, $next) {
            // The parameters of the component if you need them
            $params = $this->params;

            $entries->each(function ($entry) {
                // Do something with the data here
            });

            return $next($entries);
        }
    );
}
```

### When is this useful

The concept of hooks can be hard to grasp at first, but the general idea is that you can use them to modify each Entry's data. A simple example can be seen in one of our other add-ons, [Statamic Resrv](https://resrv.dev/availability-search-multiple#accessing-availability-data).

The hook is being used here to load the availability information, like days, price, discounts and more into each `Entry` for display in the list of the items. 