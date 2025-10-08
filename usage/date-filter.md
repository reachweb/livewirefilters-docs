---
title: Date Filter
description: How to use the Date Filter in Statamic Livewire Filters.
---

# DateFilter

## Overview

The **Date Filter** allows you to filter the collection by date.

::: info Ideal for
Entries that contain a `date` field. You can use it on collections with publish dates or at any other `date` field.
:::

## Javascript

This field uses the `Flatpickr` datepicker. Visit the [installation page](../installation.md) to learn more.

## Options

If `earliest_date` and `latest_date` are defined in your field's blueprint, these settings are automatically applied as `minDate` and `maxDate` within Flatpickr's options in order to limit the dates the user can select.

## Syntax

```antlers
{{ livewire:lf-date-filter
    blueprint="cars.car"
    field="registration_date"
    condition="is_after"
}}
```

<Image src="/demo/datefilter.webp" alt="The Date Filter." />
