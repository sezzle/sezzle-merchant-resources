# Widget Script

## How It Works
When the page loads, the script will reach out to the widget-server to obtain the Javascript and configuration details. If a configuration is not found on the server, it will look for a local configuration. If a configuration is also not found locally, the script may try to guess, which may cause the widget to appear unsightly on some themes, particularly "Debut".

If the script has been added, but there is no config in place, an error will appear in the console: `options.configGroups must have at least one config object`

## The Script

The following is a <strong>template</strong> of the widget script. When using the template to add the widget script to your site, you must replace the 36-character UUID in the template with the Sezzle ID for this site, as found in the Business Settings <a href="https://dashboard.sezzle.com/merchant/settings/business" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/settings/business" target="_blank">(EU)</a> of your Sezzle Merchant Dashboard. **Do not** re-use IDs across multiple URLs.

US Example:
```html
<script src="https://widget.sezzle.com/v1/javascript/price-widget?uuid=12a34bc5-6de7-890f-g123-4hi5678jk901"></script>
```

EU Example:
```html
<script src="https://widget.eu.sezzle.com/v1/javascript/price-widget?uuid=12a34bc5-6de7-890f-g123-4hi5678jk901"></script>
```

## Adding the Script
Widget Script installation is the simplest product to implement, but the process varies slightly depending on the site's platform and extensions:
- <a href="https://vimeo.com/399997792/7884c5984c" target="_blank">Shopify</a>: The Sezzle Shopify App allows the Widget team or Sezzle widget Chrome Extension to inject the script remotely, or to download the theme and add the script manually if there are additional custom product templates. Skip to configuration section below.
    - If opting for `I will install myself`, copy the code snippet from the Merchant Dashboard <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/checklist" target="_blank">(EU)</a> and paste it into the bottom of the `product.liquid` and `cart.liquid` files within the Edit Code page of your Shopify admin.
- Shopify Buy + non-Shopify storefront: The widget script will only work on the Shopify site. Please reference the <a href="./5-Static Widgets.md">Static Widgets</a> document for a recommended alternative.
- WooCommerce (no pagebuilders): Check the "Show Sezzle widget" box in the extension.
- <a href="https://vimeo.com/399937363/4349d4c7e2" target="_blank">WooCommerce + pagebuilder app</a>: Copy the code snippet from the Merchant Dashboard <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/checklist" target="_blank">(EU)</a> and paste it into the bottom of the `footer.php` or `index.php` file within the Theme Editor page or your WooCommerce admin.
- <a href="https://vimeo.com/399935603/1b71ce2a45" target="_blank">BigCommerce</a> - Copy the code snippet from the Merchant Dashboard <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/checklist" target="_blank">(EU)</a> and paste it into the bottom of the `cart.html` and `product.html` files (file names may vary) within Edit Theme Files page of your BigCommerce admin.
- <a href="https://vimeo.com/399929679/aa0791f4d9" target="_blank">3DCart</a> - Copy the code snippet from the Merchant Dashboard <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/checklist" target="_blank">(EU)</a> and paste it into the bottom of the `product_items.html` files (file name may vary) within the Edit Template page of your 3DCart admin.
- Custom/Other Platforms - Copy the code snippet from the <Merchant Dashboard <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/checklist" target="_blank">(EU)</a> and paste it into the bottom of the code files that correspond to the product and cart pages.

## Configuration
Once the widget script has been added, a configuration must also be put in place.
- Option 1: <b style="text-transform: uppercase; color: #ff7f6e;">(Unavailable - release pending)</b> Install the Sezzle Widget Chrome Extension from the <a href="" target="_blank">Chrome App Store</a>, then visit the product page and follow the prompts in the extension window. The extension will create the configuration for the website and save it to Sezzle's widget-server.
    - Advantage: No wait time, can preview changes and update as needed, basic customization.
    - Disadvantages: No advanced troubleshooting, some customizations not supported.
- Option 2: Click "Request Addition of Widgets" in the Merchant Dashboard <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/checklist" target="_blank">(EU)</a>. The Widget team will create the configuration for the website and save it to Sezzle's widget-server.
    - Advantages: Full-service quality assurance, advanced troubleshooting.
    - Disadvantages: Wait time (usually within 1-2 business days).
- Option 3: Create a <a href="./4-Local Config.md" target="_blank">local configuration</a> within the theme files.
    - Advantages: Fully customizable, quick access and full visibility for updates, no wait time.
    - Disadvantages: Tricky implementation. Does not work if a config is saved in widget-server.
