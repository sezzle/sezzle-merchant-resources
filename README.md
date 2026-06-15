# How Sezzle Works

How Sezzle Works is a dedicated page that merchants can add to their website to further promote Sezzle. Follow the below instructions to implement.

**_Note:_** Whenever the below instructions are updated, make sure to update the [merchants docs](https://merchant-help.sezzle.com/hc/en-us/articles/360041531132-How-do-I-make-an-About-Sezzle-page-) as well

## Merchant Integration

### Shopify Process

To set up the page on Shopify, follow the steps below.

1. Log in to your Shopify Store
1. Navigate to "Online Store" "Themes"
1. On the theme you want to edit, select "Actions" and then "Edit Code"
1. Under the "Templates" folder, click "Add New Template", select template for "Page", template type "liquid", and name the page "Sezzle", then click Create Template
1. Select the theme that best fits your store from the tabs listed.
1. Copy the [code](#code-snippet) and paste it under {{page.content}} on the Shopify page.
1. Save
1. Navigate to "Pages"
1. Add a new page, and give it a title - we recommend something like "How Sezzle Works" or "How to use Sezzle"
1. Under "Theme Template" (in the bottom-right), select "sezzle"
1. Save and view the page

You can now add the page to your navigation:

1. Go to "Online Store" "Navigation"
1. Select the menu where you would like the Sezzle link to appear (ex: Main menu)
1. Click "Add menu item"
1. Enter the text you wish to appear (ex: How Sezzle Works)
1. Click the second box, select "Pages" then the page you just created
1. Click Add
1. Click Save Menu

### Other Platforms

To set up the page on any other platform, please work with your web developer and/or follow the steps below.

1. Create a new page in your theme
1. Copy and paste the [code](#code-snippet) into your website's page
1. Click save and/or publish!

### Code Snippet
Add your `merchant_uuid`, adjust `theme` and `language` as per your website's requirements.

- `merchant_uuid` is your merchant ID which is of the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
- `theme` can either be `light` or `dark`.
- `language` can either be `en` , `fr` or `es`.
- `countryCode` is the viewer's two-letter country (e.g. `US`, `CA`). Defaults to `US`. In Canada (`CA`), Pay-in-5 and all long-term financing are hidden automatically.
- `numberOfPayments` can be `4` or `5`. Defaults to `5` (the Pay-in-5 bi-weekly card shows above $50). Set `4` to never show the Pay-in-5 card. Forced to `4` in Canada.

##### Long-term financing (only for merchants approved for Sezzle Long-term)

- `LTgroup` enables long-term and applies your lending package's defaults. Confirm the value for your enrollment with your account manager. Options: `"a"` or `"b"`. This is the crucial option for enabling long-term.
- `isLongTerm` (legacy) can be `true` or `false`. For backwards compatibility, `isLongTerm: true` behaves like `LTgroup: "a"`.
- `minPriceLT` / `maxPriceLT` — the price range (in whole dollars) eligible for long-term monthly installments. Default to the `LTgroup` preset (e.g. `150` / `15000` for group `a`).
- `minAPR` / `medianAPR` / `maxAPR` — APR range and the representative APR used to calculate monthly amounts. Default to the `LTgroup` preset.
- `termsToShow` — object mapping price thresholds (in dollars) to term-length arrays (in months), plus a `default` key, e.g. `{ default: [3, 6, 9], 500: [12, 18, 24] }`. Defaults to the `LTgroup` preset.

The input field on the page defaults to `minPriceLT` (or `$150` when long-term is disabled).

Insert the following code into your HTML file:

```
<div id="how-sezzle-works"></div>
  <script>
      const config = {
          merchant_uuid: "",
          theme: "",
          language: "",
          countryCode: "US",
          numberOfPayments: 5,
          // Long-term financing (only if approved). isLongTerm is the legacy
          // toggle; prefer LTgroup ("a" or "b") for new integrations.
          // LTgroup: "a",
          isLongTerm: false
      }
      const node = document.getElementById("how-sezzle-works");
      const iframe = document.createElement('iframe');
      iframe.src = 'https://media.sezzle.com/how-sezzle-works/v2/index.html';
      iframe.height = '2000px';
      iframe.width = '100%';
      iframe.style.border = 'none';

      // Function to send config to iframe
      const sendConfig = function() {
          iframe.contentWindow.postMessage({
              key: "about_sezzle_config",
              ...config
          }, "*");
      };

      // Listen for ready signal from iframe (handles browsers where onload fires before React mounts)
      window.addEventListener("message", function(event) {
          if (event.data.key === "signal_about_sezzle_ready") {
              sendConfig();
          }
      });

      // Also send on load as fallback
      iframe.onload = sendConfig;

      node.appendChild(iframe);
  </script>
```
