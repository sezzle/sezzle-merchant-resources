# Getting Started


## Why Widgets?

 * What are the benefits of having widgets?

 - Higher AOV and fewer abandoned carts - Customers are not only aware that Sezzle is available at checkout, but they are encouraged by seeing the per-installment price to complete checkout and buy more per order.
 - Co-branding highlights - Widgets are a prerequisite to being promoted in Sezzle's marketing campaigns and merchant highlights.

## Widget Customization and Product Options Overview

* What are my customization options for widgets, and what is the installation process?

 - Widget content and appearance has a wide range of customization options (position, style, content). The only requirement is that the Sezzle logo is present, which is why we offer 6 logo variations.

 - The Widget Script is the simplest to implement, maintain, and track for maintenance purposes.
 - The Static Widget is a bundled JavaScript file that is added to the theme and called into the product and cart pages. Some customizations are supported through a local configuration. This eliminates the need to communicate with Sezzle's widget-server and removes the guess-work used by the widget script to calculate the price and place the widget. It is more tedious to implement, harder to track, and requires either the merchant's development team to maintain or more effort to coordinate maintenance with the Widget team.
 - The Static Widget Lite is a concise HTML snippet with one script to handle the installment price calculations. It was developed particularly for Shopify Buy, which could not retrieve JavaScript from the widget-server or from a separate file within the theme.
 - The React Widget is a script built in ReactJS for use in asynchronous sites.

## Product Disambiguation

The below documentation refers solely to widgets and the static checkout button. To clarify whether this is the correct document for your needs, we have provided a brief overview of Sezzle products that are sometimes mistakenly directed to the Widget team.

 * <a href="https://sezzle.ladesk.com/496485-How-to-Add-the-Sezzle-Price-Element-Widget-to-Your-Product-and-Cart-Pages?r=1" target="_blank">Widgets</a> - the Sezzle promotional asset that appears below the price on a product or cart page, notifying the user that Sezzle is available at checkout.

 * Modal - the Sezzle information window that opens when the widget is clicked.

 * <a href="https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button-html" target="_blank">Static Checkout Button</a> - a Sezzle button that redirects to the Shopify native checkout when the regular checkout button uses a third-party app (Bold, Carthook, Zipify, UpSell).

 * <a href="https://docs.sezzle.com/" target="_blank">Gateway</a> - the Sezzle payment method listed at Checkout.

 * <a href="https://docs.sezzle.com/" target="_blank">App/Extension</a> - direct integration plug-in that handles Sezzle settings on a website.

 * <a href="https://help.sezzle.com/merchant-shopify-settings/creating-an-about-sezzle-page" target="_blank">How It Works</a> - the Sezzle information page that can be added as a menu item to a website.

 * <a href="https://sezzle.com/brand-assets" target="_blank">Brand Assets</a> - Sezzle Banners or other advertisements that can be added to the merchant's website, emails, or social media to promote Sezzle to potential and existing customers.

## Escalation Matrix

During the onboarding process, inquiries can be directed to your Sezzle account manager (Sales or Merchant Success). After the initial setup, please direct inquiries to <a href="https://sezzle.com/contact-us/merchant-support" target="_blank">Merchant Support</a>.

 * Sales - benefits of choosing Sezzle, contract management

 * Merchant Success - application reviews and setup

 * Merchant Support - account and payment management

 * Platform Integration - gateway implementation (direct integration apps and open API)

 * Widget Integration - widget implementation and static checkout button

 * Marketing - promoting Sezzle on websites, emails, and social media