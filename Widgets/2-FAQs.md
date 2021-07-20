
# Widget Integration FAQs

## What are the benefits of adding widgets to my site?
The Sezzle widget calculates and displays the bi-weekly installment amount based on the product price or cart total. Displaying the Sezzle widget on product and cart pages has been shown to increase AOV and overall conversion rates. Widget opt-in is also a prerequisite to being featured in Sezzle promotions and the Sezzle store directory.

## What are the prerequisites for adding widgets to my site?
Once your merchant application has been approved, please ensure that the Sezzle gateway is installed properly. If your website is on a platform other than Shopify, please ensure the Sezzle script is added to the product and/or cart page.

## What are my options for installing the widget? How does the process work?
Our standard product is the Sezzle widget script, which can be customized via a configuration either saved in the Sezzle widget-server or added locally to the site's theme. When a page loads, the script reaches out to the Sezzle server for the Javascript and config saved to the applicable merchant ID and renders the widget.

Alternatively, we offer a static widget, which stores all of the configuration and accompanying Javascript entirely in the theme. While both the widget script with local config and the static widget have their advantages, the widget script with server config allows the Sezzle widget team to monitor performance and provide timely support.

## What is the turnaround time for widget implementation or update requests?
The official turnaround time for widget implementation or update requests is within 1 week. However most requests are completed within 1-2 business days.

## Can I test the widget on my staging site before publishing it on my live storefront?
Yes, you can test the widget on your staging site before publishing it on your live storefront using the local config and widget script. If there is a config on the server for your live storefront, it will need to be added locally to the live theme and removed from the server before you begin testing on the unpublished theme. If you need assistance with this process, set up Sezzle as an admin user, or reach out to Sezzle to request <a href="https://help.shopify.com/en/partners/dashboard/managing-stores/request-access" target="_blank">Collaborator access</a> (Shopify only).

## I change my theme frequently - can I have full control of the widget integration to prevent downtime?
When the theme is changed, the Sezzle widget script will need to be re-added to the applicable files in the new theme. The config will also need to be updated to correspond to the new theme. If the config is on the Sezzle widget-server, it can be updated any time upon request or through the Chrome Extension. If the config is local, it will need to be copied to the new theme above the widget script and, at minimum, the `targetXPath` updated. Please note, if there is a config on the server, any local config will be disregarded.

## I am using a <a href="https://www.shopify.com/partners/blog/development-workflow" target="_blank">CI/CD workflow</a> or <a href="https://www.shopify.com/plus/solutions/headless-commerce" target="_blank">headless CMS</a> - can I still use Sezzle?
Yes, in this case, you will simply need to add the widget script manually to the master theme code. The configuration options typically remain unchanged.

However, if multiple sites are managed from the same master code, the static widget is recommended, as the dynamic widget script can only be tied to one merchant ID.

## I am using Shopify Buy with a non-Shopify storefront - can I still use Sezzle?
Yes, in this case, you will need to <a href="https://vimeo.com/399997582/12360671e9" target="_blank">add the gateway to Shopify</a>, and the <a href="https://github.com/sezzle/static-widgets/blob/production/src/sezzle-shopify-buy-static-widget/sezzle-shopify-buy-static-widget.html" target="_blank">static widget lite</a> using the instructions provided.

Product details flow from Shopify into an iframe on the non-Shopify storefront. However, neither the widget script nor the regular static widget can interact with the iframe. The static widget lite is therefore added <i>inside</i> the Shopify product details.

## I am using a third-party checkout such as Bold, Carthook, or Zipify - can I still use Sezzle?
Yes, but you will need to add the Sezzle <a href="https://github.com/sezzle/static-widgets/blob/production/src/sezzle-checkout-button-html/sezzle-checkout-button.html" target="_blank">static checkout button</a>. When the regular checkout button is clicked, the user is taken to the third-party checkout, with which Sezzle does not offer a direct integration. However, when the Sezzle static checkout button is clicked, the user is redirected to the Shopify native checkout.

## My site pages load asynchronously - can I still use Sezzle?
Yes, the widget script is designed to listen for mutations to the price element and update accordingly. However, if it is unable to observe the changes to the price element, the <a href="https://github.com/sezzle/static-widgets" target="_blank">static widget</a> can be used. We also have a React widget version available through <a href="https://www.npmjs.com/package/sezzle-react-widget" target="_blank">NPM</a>, or custom event listeners can be set up within the config for the widget script.

## Is the widget compatible with all browsers?
Yes, the widget is designed on Chrome but should be compatible with all browsers, such as IE11 or Firefox. If you are on a non-Chrome browser and experience an issue, please reach out to Sezzle Support.

## Will the widget affect my site’s load performance?
No, the widget does not affect the rest of your website’s load performance, as it is designed to load last. However, for this reason, there may be a slight delay before the widget appears. If there are any doubts your site's performance, you may view a full report on <a href="https://gtmetrix.com/" target="_blank">GTMetrix.com</a>.

## I am using a page-builder app - can I still use Sezzle?
Yes, you will need to add the Sezzle wiget script manually to at least one file. For Shopify sites where only a few custom templates are created, add the script to each custom template. For non-Shopify or if there are a lot of custom templates, the script can alternatively be added to either the footer file or the primary index/theme file. File names vary by platform and theme, but general instructions for adding the script can be found in the Setup Checklist <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/checklist" target="_blank">(EU)</a>of your Sezzle Merchant Dashboard.

## Can the widgets be displayed on the homepage and any other page besides product and cart pages?
Yes, it is possible to make widgets visible on additional pages. The Sezzle widget script will need to be added to the applicable code file, and a config group created for the additional page type. General instructions for adding the script can be found in the Setup Checklist <a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/checklist" target="_blank">(EU)</a> of your Sezzle Merchant Dashboard. Configuring a page with multiple price targets can be tricky, so adding widgets to the collections page or product previews is not recommended.

## Does the widget support multiple languages?
Yes, the widget and modal have built-in translations in French, German, and Spanish for multilingual websites. By default, translation occurs based on the user's default browser language. Update the Language Settings in the Chrome Extension based on how the translation should occur. If the widget is translating but not the modal, please reach out to Sezzle Support. No other languages are supported at this time.

## Can the color of the Sezzle logo be changed?
Yes, you can update the logo to coordinate and contrast with the background color of your website. The Sezzle logo `theme` options available are `dark`, `light`, `grayscale`, `black-flat`, `white`, `white-flat`, `purple-pill`, `white-pill`, `pride-pill` or `pride-whitepill`. However, it is against our branding guidelines to otherwise customize the logo color.

<div style="background: white; color: #392558; width: fit-content;">
<span>Light: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg' alt=' default color Sezzle logo with dark text'></span>
<span>Grayscale: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_Black.svg' alt='black gradient Sezzle logo'></span>
<span>Black-Flat: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_BlackAlt.svg' alt='black flat Sezzle logo'></span>
<span>Purple-Pill: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_PurplePill.svg' alt='purple pill Sezzle logo'></span>
<span>Pride-Pill: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_Pride_PurplePill.svg' alt='pride pill Sezzle logo'></span>
</div>
<div style="background: black; color: white; padding: 10px; width: fit-content;">
<span>Dark: <img style="height: 18px; padding: 5px;" src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor_WhiteWM.svg' alt='color Sezzle logo with light text for darkmode'></span>
<span>White: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_White.svg' alt='white gradient Sezzle logo'></span>
<span>White-Flat: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_WhiteAlt.svg' alt='white flat Sezzle logo'></span>
<span>White-Pill: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_WhitePill.svg' alt='white pill Sezzle logo'></span>
<span>Pride-WhitePill: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_Pride_WhitePill.svg' alt='pride whitepill Sezzle logo'></span>
</div>

## Can we change the color of the modal?
Yes, there are two modal versions available: `color` or `grayscale`. Alternatively, custom HTML and CSS can be introduced to replace our default modals.

## Can I customize the verbiage in the widget?
Yes, the verbiage in the widget can be customized. Some branding-approved options are available in the Chrome Extension, but we can make a custom template by special request.

## Can the Sezzle widget be combined with another Buy Now Pay Later option?
Yes, there are dual widget options available for merchants with Afterpay, QuadPay, Affirm, or Klarna.

## Can you hide the old BNPL provider's widget?
Yes, in most cases, we can hide the widget of your old BNPL provider. However, due to order of operations, the old BNPL widget may flash briefly on the page. For this reason, it is recommended to remove the competitor's code from the theme.

Klarna widgets are created as an iframe, which the Sezzle widget cannot hide.

## Can the widget be disabled for particular products?
Yes, we can disable the widget for particular products. Commonly requested items include: subscriptions, gift cards, charitable donations, raffle tickets, or a specific collection.

## Can the widgets be shown only for products within a particular price range?
Yes, we can set minimum and maximum thresholds for displaying the widgets. When setting a threshold, please keep in mind your product prices and AOV and Sezzle's credit limits. It is advisable to instead show the widgets on all prices but update the language to state the threshold. A widget minimum or maximum does not prevent a customer from checking out with Sezzle outside of the approved range. Please specify if a gateway minimum is also needed, or if you simply do not wish to advertise Sezzle outside of the threshold.

## Can I hide/show the widgets by country?
Yes, the Chrome Extension has options for US (including territories), CA, or both. Widgets are also visible in India by default, as that is the location of most of Sezzle's widget engineers. We can also add additional countries to your widget white-list upon request.

## Can I hide the widget based on selected currency?
Yes, we can hide the widget based on the selected currency by adding a custom function that listens for changes and updates the widget's display settings accordingly.

## Can the widgets be disabled?
Yes, you can disable the widget at any time, or enable them again as needed through the Chrome Extension or upon request.

## How do I know the correct Sezzle script is installed on my website?
You can easily verify whether the correct Sezzle script is present in the website by going to Inspect Elements and/or View Page Source and search for `widget.sezzle` (North America) or `widget.eu.sezzle` (EU) then verify whether it is reflecting the correct Merchant ID for this website URL, which can be found in the Business Settings <a href="https://dashboard.sezzle.com/merchant/settings/business" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/settings/business" target="_blank">(EU)</a> of your Sezzle Merchant Dashboard. To add or edit the widget script, see the code snippet and instructions in the Setup Checklist<a href="https://dashboard.sezzle.com/merchant/checklist" target="_blank">(US)</a> <a href="https://dashboard.eu.sezzle.com/merchant/checklist" target="_blank">(EU)</a> of your Sezzle Merchant Dashboard.

US Example:
```html
<script src="https://widget.sezzle.com/v1/javascript/price-widget?uuid=12a34bc5-6de7-890f-g123-4hi5678jk901"></script>
```

EU Example:
```html
<script src="https://widget.eu.sezzle.com/v1/javascript/price-widget?uuid=12a34bc5-6de7-890f-g123-4hi5678jk901"></script>
```

## How can I confirm what widget configuration is being applied to my site?
After installing the widget, the extension will show a confirmation message that your configuration has been saved. Alternatively, go to a product page and click Inspect. Under the Sources tab, open the `widget.sezzle` (North America) or `widget.eu.sezzle` (EU) folder. One of these files will reflect the config being applied. Alternatively, type `document.sezzleConfig` into the Console.

## Is there a way to contact the Sezzle support team?
The Contact Us button in the Sezzle Chrome Extension will open a contact form to `merchantsupport@sezzle.com` where the user can draft a description of the issue they are facing. The Contact Us form creates an incident in our centralized ticketing software, which is then routed to Merchant Support. It may then be re-assigned to a more appropriate team if applicable.

## How can I follow up on a widget-related ticket ?
Tickets are often addressed within 1-2 business days. If your ticket has not been addressed within 7 days, you may inquire by calling Sezzle Support at 888-540-1867 or reaching out to your Sezzle account manager.
