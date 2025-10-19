---
title: Usage overview
description: Step-by-step guide to using Statamic Livewire Filters.
---

# Usage overview

Utilizing Statamic Livewire Filters is straightforward. Here's a simple step-by-step guide:

1. **Replace Collection Tags:** Substitute your <code v-pre>{{ collection }}</code> tag pairs with the <code v-pre>{{ livewire-collection }}</code> tag.
2. **Move Your Entry Template:** Transfer your entry template (the content between the collection tags) to `resources/views/vendor/statamic-livewire-filters/livewire/livewire-collection.antlers.html`.
3. **Add Required Filters:** Incorporate all the necessary filters at any desired location on your website.
4. **Ready to Go:** Your setup is now complete and ready for use!
5. **Add more features:** If you wish you can add [sorting](../sorting), [filter tags](../tags) or [custom URL query string](../advanced/url-query-string#using-the-custom-url-query-string).

For practical examples and a more comprehensive understanding, you can check out the **Examples** website or read the complete documentation, starting with the [livewire-collection tag](../usage/livewire-collection-tag). 