# Widget Script

## How It Works
When the page loads, the script will reach out to the widget-server to obtain the Javascript and configuration details. If a configuration is not found on the server, it will look for a local configuration. If a configuration is also not found locally, the script may try to guess, which may cause the widget to appear unsightly on some themes, particularly "Debut".

If the script has been added, but there is no config in place, an error will appear in the console: `options.configGroups must have at least one config object`

## Adding the Script
Widget Script installation is the simplest product to implement, but the process varies slightly depending on the site's platform and extensions:
- <a href="https://vimeo.com/399997792/7884c5984c" target="_blank">Shopify</a>: The Sezzle Shopify App allows the Widget team or Sezzle widget Chrome Extension to inject the script remotely, or to download the theme and add the script manually if there are additional custom product templates. Skip to configuration section below.
    - If opting for local configuration, copy the code snippet from the <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">Merchant Dashboard</a> and paste it into the bottom of the product.liquid and cart.liquid files within Edit Code.
- Shopify Buy + non-Shopify storefront: The widget script will only work on the Shopify site. Please reference the <a href="./Static Widgets.md">Static Widgets</a> document.
- WooCommerce (no pagebuilders): Check the "Show Sezzle widget" box in the extension.
- <a href="https://vimeo.com/399937363/4349d4c7e2" target="_blank">WooCommerce + pagebuilder app</a>: Copy the code snippet from the <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">Merchant Dashboard</a> and paste it into the bottom of the Theme Footer file within Theme Editor.
- <a href="https://vimeo.com/399935603/1b71ce2a45" target="_blank">BigCommerce</a> - Copy the code snippet from the <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">Merchant Dashboard</a> and paste it into the bottom of the cart.html and product.html files within Edit Theme Files (file names may vary).
- <a href="https://vimeo.com/399929679/aa0791f4d9" target="_blank">3DCart</a> - Copy the code snippet from the <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">Merchant Dashboard</a> and paste it into the bottom of the product_items.html files within Edit Template (file name may vary).
- Custom/Other Platforms - Copy the code snippet from the <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">Merchant Dashboard</a> and paste it into the bottom of the code files for the product and cart pages.
    - Example: 
```html 
<script src="https://widget.sezzle.com/v1/javascript/price-widget?uuid=12a34bc5-6de7-890f-g123-4hi5678jk901"></script>
```

## Configuration
Once the widget script has been added, a configuration must also be put in place.
- Option 1: <b style="text-transform: uppercase; color: #ff7f6e;">(Unavailable - release pending)</b> Install the Sezzle Widget Chrome Extension from the <a href="" target="_blank">Chrome App Store</a>, then visit the product page and follow the prompts in the extension window. The extension will create the configuration for the website and save it to Sezzle's widget-server.
    - Advantage: No wait time, can preview changes and update as needed, basic customization.
    - Disadvantages: No advanced troubleshooting, some customizations not supported.
- Option 2: Click "Request Addition of Widgets" in the <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">Merchant Dashboard</a>. The Widget team will create the configuration for the website and save it to Sezzle's widget-server. 
    - Advantages: Full-service quality assurance, advanced troubleshooting.
    - Disadvantages: Wait time (usually within 1-2 business days).
- Option 3: Create a <a href="https://docs.sezzle.com/#sezzlejs" target="_blank">local configuration</a> within the theme files.
    - Advantages: Fully customizable, quick access and full visibility for updates, no wait time.
    - Disadvantages: Tricky implementation. Does not work if a config is saved in widget-server.