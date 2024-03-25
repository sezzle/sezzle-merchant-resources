# How Sezzle Works

How Sezzle Works is a dedicated page that merchants can add to their website to further promote Sezzle. Follow the below instructions to implement.

**_Note:_** Whenever the below instructions are updated, make sure to update the [merchants docs](https://merchant-help.sezzle.com/hc/en-us/articles/360041531132-How-do-I-make-an-About-Sezzle-page-) as well

## Setup

Run the following in Terminal:

```
cd ~/go/src/sezzle
git clone ssh://git@gitlab.sezzle.com:10022/sezzle/how-sezzle-works.git
nvm use
npm install
```

## Running Tests

To test all files, run the following in Terminal:

```
npm test src
```

To test files modified since last commit, run:

```
npm test
```

## Running Locally

Run the following in Terminal:

```
npm start
```

Home page is set to `/how-sezzle-works/v2` since that is where this app is deployed in `media.sezzle.com`

### Test integration in local

Start the app if not already:

```
npm start
```

Open a new terminal and run:

```
npm run start:local
```

`index.html` file inside the `local` directory has the configuration that will be passed to the app. This is to mimic merchant integration and test in local.

## Support

For any questions, issues, or general support related to this project.

- **Slack Channel:** #dev-mint-support

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
