# How Sezzle Works

How Sezzle Works is a dedicated page that merchants can add to their website to further promote Sezzle. Follow the below instructions to implement.

**_Note:_** Whenever the below instructions are updated, make sure to update the [merchants docs](https://merchant-help.sezzle.com/hc/en-us/articles/360041531132-How-do-I-make-an-About-Sezzle-page-) as well

## Merchant Integration

### Shopify Process

To set up the page on Shopify, follow the steps below.

#### Part 1: Create the Page

1. Log in to your Shopify Store
1. Under "Online Store", click "Pages"
1. Click "Add Page", and give it a title - we recommend something like "How Sezzle Works" or "How to use Sezzle"
1. Click "</>" (Show HTML)
1. Copy the [code](#code-snippet) and paste it into the new template
1. In the config, update the merchant_uuid value to your Sezzle merchant ID, then click "Save"
    - See below for additional details
1. Click "Save" then click "Preview" to confirm installation success.
1. Return to the editor, change to "Visible" then click "Save"

#### Part 2: Add to Navigation

1. Go to "Content" > "Menus"
1. Select the menu you wish to edit (ex: Main menu, Footer menu)
1. Click "Add menu item"
1. Enter the label as you want the link to appear
1. Click into the "Link" box, select "Pages", then the new Sezzle page you created
1. Click "Save"

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
- `includeInStore` can be `true` or `false`. Defaults to `false`. Set `true` if shoppers can also pay with Sezzle at your register (via a Sezzle Virtual Card in the Sezzle app). The "How Sezzle Works" section then splits into two labelled groups of steps — "Pay later online" and "Pay later in-store" — instead of showing the online steps alone.

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
          includeInStore: false,
          // Long-term financing (only if approved). isLongTerm is the legacy
          // toggle; prefer LTgroup ("a" or "b") for new integrations.
          // LTgroup: "a",
          isLongTerm: false
      }
      const node = document.getElementById("how-sezzle-works");
      const iframe = document.createElement('iframe');
      iframe.src = 'https://media.sezzle.com/how-sezzle-works/v2/index.html';
      // Accessible name for the frame, localized to match config.language.
      const FRAME_TITLES = {
          en: "How Sezzle Works",
          fr: "Comment fonctionne Sezzle",
          es: "Cómo funciona Sezzle",
      };
      iframe.title = FRAME_TITLES[config.language] || FRAME_TITLES.en;
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
