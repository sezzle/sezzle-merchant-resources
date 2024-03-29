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

- `merchant_uuid` is your merchant ID which of the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
- `theme` can either be `light` or `dark`.
- `language` can either be `en` or `fr`.

Insert the following code into your HTML file:

```
<div id="how-sezzle-works"></div>
  <script>
      const config = {
          merchant_uuid: "",
          theme: "",
          language: ""
      }
      const node = document.getElementById("how-sezzle-works");
      const iframe = document.createElement('iframe');
      iframe.src = "http://localhost:3000/index.html";
      iframe.height = '2000px';
      iframe.width = '100%';
      iframe.style.border = 'none';
      iframe.onload = function () {
          iframe.contentWindow.postMessage({
              key: "about_sezzle_config",
              ...config
          }, "*")
      };
      node.appendChild(iframe);
  </script>
```
