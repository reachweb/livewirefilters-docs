---
title: Transitions & animations
description: How to add transitions and animations to Statamic Livewire Filters.
---

# Transitions & animations

## Overview

When users interact with filters, especially in large collections where updating entries may take more than just a few microseconds, it's usually a good idea to show some indication of activity. This becomes even more important in design-focused websites, where animating entries as they enter the viewport can enhance the user experience. Let's explore some examples.

## Using wire:loading

A straightforward method to signal that an update is in progress is by using Livewire's `wire:loading` feature. This feature can add or remove a class to show activity. For instance, this is a simple yet effective approach:

```antlers
<div class="transition-opacity duration-700" wire:loading.class="opacity-40">
  {{ entries }}
    {{# Your entries' template #}}
  {{ /entries }}
</div>
```

This will create a very subtle effect, lowering the opacity of the current entries while fetching the new ones.

## Loading indicators

Also using the `wire:loading` feature, you can easily display a loading indicator. Something like this should work if put into a `relative` div that displays your entries:

```antlers
<div class="absolute z-10 top-0 left-0 w-full h-full flex flex-col items-center bg-white bg-opacity-90 rounded p-8 xl:p-12" wire:loading.flex>
    <div class="animate-spin text-black dark:text-gray-700 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    </div>
    <div class="text-2xl text-black dark:text-gray-700 font-bold mb-4">Loading...</div>
    <div class="text-gray-500">Please wait.</div>
</div>
```

## Animations

To create more advanced animations, like an entry animation for your entries, you should probably use Alpine.js. There are a few events you can hook up to in order to do it:

- `filter-updated` and `sort-updated` events: These are triggered when the LivewireCollection component receives new conditions for filtering or sorting.
- `entries-updated` event: This event is fired once the entries have been retrieved and are prepared for display.

You can see an implementation of the above at [the animations demo page](https://demo.livewirefilters.com/animations). 