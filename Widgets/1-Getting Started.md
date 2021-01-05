# Getting Started


## Why Widgets?

 * What are the benefits of having widgets?

 - Higher AOV and fewer abandoned carts - Customers are not only aware that Sezzle is available at checkout, but they are encouraged by seeing the per-installment price to complete checkout and buy more per order.
 - Co-branding highlights - Widgets are a prerequisite to being promoted in Sezzle's social media marketing campaigns and being a featured merchant on the Sezzle store directory.

## Widget Customization and Product Options Overview

* What are my customization options for widgets, and what is the installation process?

 - Widget content and appearance has a wide range of customization options (position, style, content). The only requirement is that the Sezzle logo is present, which is why we offer 6 logo variations.

 - The <a href="https://github.com/sezzle/sezzle-js" target="_blank">Widget Script</a> is the simplest to implement, maintain, and track for maintenance purposes.
    - The widget script is accompanied by a configuration, which can be implemented by Sezzle and stored on our server, or can be manually implemented by the merchant directly within the store's theme.
 - The <a href="https://github.com/sezzle/static-widgets" target="_blank">Static Widget</a> is a bundled JavaScript file that is added to the theme and called into the product and cart pages. Some customizations are supported through a local configuration. This eliminates the need to communicate with Sezzle's widget-server and removes the guess-work used by the widget script to calculate the price and place the widget. It is more tedious to implement, harder to track, and requires either the merchant's development team to maintain or more effort to coordinate maintenance with the Widget team.
 - The <a href="https://github.com/sezzle/static-widgets/blob/production/src/sezzle-shopify-buy-static-widget/sezzle-shopify-buy-static-widget.html" target="_blank">Static Widget Lite</a> is a concise HTML snippet with one script to handle the installment price calculations. It was developed particularly for Shopify Buy, which could not retrieve JavaScript from the widget-server or from a separate file within the theme.
 - The React Widget is a script built in ReactJS for use in asynchronous sites.

## Product Disambiguation

The documentation contained in this folder refers solely to widgets and the static checkout button. To clarify whether this is the correct document for your needs, we have provided a brief overview of Sezzle products that are sometimes mistakenly directed to the Widget team.

 * Widgets - the Sezzle promotional asset that appears below the price on a product or cart page, notifying the user that Sezzle is available at checkout.
     * <a href="https://github.com/sezzle/sezzle-js" target="_blank">Dynamic Widgets</a> - the Sezzle script that retrieves the Javascript from Sezzle's widget server and renders the widget according to the configuration either also saved in the widget server or provided locally.
     * <a href="https://github.com/sezzle/static-widgets" target="_blank">Static Widgets</a> - the Sezzle Javascript and accompanying configuration added to the store's theme files.

 * Modal - the Sezzle information window that opens when the widget is clicked. Available in <a href="https://github.com/sezzle/sezzle-js/tree/master/modals/modals-2.0.0" target="_blank">Color</a> or <a href="https://github.com/sezzle/sezzle-js/tree/master/modals/modals-2.0.1" target="_blank">Grayscale</a>.

 * <a href="https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button-html" target="_blank">Static Checkout Button</a> - a Sezzle button that appears below the regular checkout button on the cart page and redirects to the Shopify native checkout when the regular checkout button uses a third-party app (Bold, Carthook, Zipify, UpSell) or when the customer is a Shop Pay user. Available for Shopify merchants only.

 * <a href="https://github.com/sezzle/static-widgets/blob/production/src/sezzle-express-alt-banner/sezzle-express-alt-banner.html" >Express Alternative Banner</a> - a Sezzle banner that appears below the Express checkout buttons on the checkout page and informs the customers that Sezzle is available on the Payments tab. Available for Shopify Plus merchants only.

 * <a href="https://github.com/sezzle/static-widgets/blob/production/src/sezzle-checkout-installment-widget/sezzle-checkout-installment-widget.js" >Checkout Installment Widget</a> - a Sezzle box that appears below the payment method on the checkout page, detailing the customer's payment schedule and installment amounts.

 * <a href="https://docs.sezzle.com/" target="_blank">Gateway</a> - the Sezzle payment method listed at Checkout.

 * <a href="https://docs.sezzle.com/" target="_blank">App/Extension</a> - direct integration plug-in that handles Sezzle settings for the store.

 * <a href="https://help.sezzle.com/merchant-shopify-settings/creating-an-about-sezzle-page" target="_blank">How It Works</a> - the Sezzle information page that can be added as a menu item to a website.

 * <a href="https://sezzle.com/brand-assets" target="_blank">Brand Assets</a> - Sezzle Banners or other advertisements that can be added to the merchant's website, emails, or social media to promote Sezzle to potential and existing customers.

## Escalation Matrix

During the onboarding process, inquiries can be directed to your Sezzle account manager (Sales or Merchant Success). After the initial setup, please direct inquiries to <a href="https://sezzle.com/contact-us/merchant-support" target="_blank">Merchant Support</a>. If another team needs to be consulted, Support will contact the applicable group.

 * Sales - benefits of choosing Sezzle, contract management

 * Merchant Success - application reviews and approved merchant setup

 * Merchant Support - account and payment management

 * Platform Integration - gateway implementation (direct integration apps and open API)

 * Widget Integration - widget implementation and static checkout button

 * Marketing - promoting Sezzle on websites, emails, and social media
