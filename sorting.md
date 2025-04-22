---
title: Sorting
description: How to use sorting with Statamic Livewire Filters.
---

# Sorting

## Overview

Ever faced the conundrum of meticulously filtering your entries, only to have them whimsically reorganize themselves like a deck of cards shuffled by a magician? Worry no more! Statamic Livewire Filters comes to the rescue, offering support for sorting your entries by any field. With this feature, you can ensure that your entries stay orderly and behave just the way you want them to.

## Usage

To enable sorting you can use the `LfSort` component. The component takes two options:

- **blueprint**: Specify the collection and the blueprint containing the fields you want to sort by in the format `collection.blueprint`. For instance, if you have a collection with the handle `pages` and a blueprint with the handle `page`, set the property as `blueprint="pages.page"`.
- **fields**: Provide a pipe-separated string of the field handles you want to use for sorting.

The `Sort` component employs a `select` HTML field, which displays all the specified fields in both ascending and descending order options.

## Syntax

```antlers
{{ livewire:lf-sort
    blueprint="cars.cars"
    fields="title|max_passengers|price"
}}
``` 