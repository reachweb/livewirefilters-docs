# Changelog

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