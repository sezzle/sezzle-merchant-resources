# Static Widgets

For Shopify and custom platforms, the <a href="https://github.com/sezzle/static-widgets" target="_blank">static widget</a> was created as an alternative to the standard widget script with the following benefits:

* Fully self-contained - no communication with the Sezzle server.
* Loads with the page - not after.
* Targeted price is give as a variable - not detected from page text.
* Widget location is determined by placeholder element - not relative to price.
* Merchant has full control.

However, there are also disadvantages:

* Sezzle cannot track widget performance.
* Sezzle cannot provide instant updates.
* More effort required by the merchant for implementation and maintenance. <i>Some development experience required.</i>
* If Sezzle support is needed, access credentials or a video call will be required.

For Shopify Buy + non-Shopify storefront, neither the widget script nor the static widget work. Instead, add the <a href="https://github.com/sezzle/static-widgets/blob/production/src/sezzle-shopify-buy-static-widget/sezzle-shopify-buy-static-widget.html" target="_blank">static widget lite</a> with the instructions provided in the file.