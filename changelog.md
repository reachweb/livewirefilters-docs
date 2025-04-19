# Changelog

## v2.7.0

- Added support for entries field. You can use an entries relationship field as a filter. The published entries from all associated collections will appear as options.
- When using multi-site and a Statamic entries field to filter your entries, Livewire Filters defaults to using each entry's origin ID. This aligns with Statamic's behavior, where the origin acts as the source of truth unless the field has been localized. This preserves relationships while allowing the associated entry to be translated.
- If you are localizing the entries field itself and want to change this behavior, set the `use_origin_id_for_entries_field` option to `false` in the config file. This will make Livewire Filters use the entry ID from the current site for filtering instead.

## v2.6.0

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
- More information and documentation: https://livewirefilters.com/docs/v1/dual-range-filter
- Fix: The LfRangeFilter was causing double rendering of the LivewireCollection component (#20). This is now fixed and the default property is deprecated. (you can set a default value in the LivewireCollection component itself)

## v2.2.0 (Nov 2, 2024)

- New feature: Custom URL Query String. Statamic Livewire Filters can now generate easy to read, SEO-friendly URLs when the user is using the filtering system.
- Read the docs: https://livewirefilters.com/docs/v1/url-query-string#content-using-livewires-url-query-parameters
- Live demo: https://livewirefilters.com/docs/v1/advanced-example/search/brand/citroen,toyota,vw/categories/crossover-suv/transmission/automaticTransmission

## v2.1.0 (Oct 28, 2024)

- New Feature: Filter options are now sortable. For more information, see the documentation on sorting filter values.
- Documentation: Added a "Common Issues" page to the docs cover common misconfigurations and other issues.

## v2.0.1 (Oct 17, 2024)

- Fixed getting the correct options for array based fields since Statamic changed the way they are saved in statamic/cms#10467

## v2.0.0

- Statamic v5 and Laravel v11 support. 