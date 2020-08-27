# Merchant Widget Chrome Extension Troubleshooting Guide

The Sezzle Widget Chrome Extension is designed for simplicity. Some basic issues can be resolved using the Chrome Extension, as outlined below. If you are unable to resolve all widget issues on your site by following these steps, please select `Request Addition of Widgets` in the Merchant Dashboard Setup Checklist, or click the [Contact Us](#request-help) button in the Help Center menu and tell us more about the issue you are experiencing.

Please note: If your site uses cookies, be sure to clear your cache after attempting to fix the widget to ensure you are able to see updates.

## Table of Contents

[Issue 1](#issue-1): My widget is not appearing on the webpage.<br/>
[Issue 2](#issue-2): My widget is appearing twice on the webpage.<br/>
[Issue 3](#issue-3): My widget is not reflecting the correct installment price.<br/>
[Issue 4](#issue-4): I don't like my widget's proximity to other page elements.<br/>
[Issue 5](#issue-5): I don't like my widget's alignment on the page.<br/>
[Issue 6](#issue-6): My widget is broken into multiple lines, but I want it on one line.<br/>
[Issue 7](#issue-7): My widget does not contrast well with the theme of the webpage.<br/>
[Issue 8](#issue-8): My widget is too hard to read.<br/>
[Issue 9](#issue-9): My widget is in a different font from my webpage.<br/>
[Issue 10](#issue-10): My widget translation is not consistent with the webpage.<br/>
[Issue 11](#issue-11): My widget's modal window isn't opening, isn't closing, or has frozen my page from scrolling.<br/>
[Issue 12](#issue-12): The Chrome Extension is stuck on the loading screen.<br/>
[Issue 13](#issue-13): My issue is listed in the Troubleshooting Guide, but the solution did not work.<br/>
[Issue 14](#issue-14): I am getting an error message when trying to log in to the Chrome Extension.<br/>
[Issue 15](#issue-15): I am getting an error message when trying to save my widget settings.<br/>
[Issue 16](#issue-16): I have a special request.<br/>

### <a id="issue-1"></a>Issue 1: My widget is not appearing on the webpage.
 * Reason 1: The targeted price element does not exist on this webpage, or the price value could not be detected. This is commonly due to sale price vs regular price, or multi-currency sites.
    - Try to update the Price Position target.
 * Reason 2: The targeted price element does not exist in this device. This is due to the webpage being set up to handle desktop and mobile views separately.
    - Try to update the Price Position target.
 * Reason 3: The widget position is inside a hidden element. This may be due to sale price vs regular price.
    - Try to update the Widget Position.
 * Reason 4: The widget position is being pushed into a narrow space on the page, which is causing it to seem invisible.
    - Try to update the Widget Position.
    - Try to update the margins, particularly Top and Bottom.
 * Reason 5: The selected URL Word to Match is not present in the URL of this page.
    - Try to update the URL Word to Match. If you are unsure, select (none).
 * Reason 6: The user is viewing the page from an unsupported country.
    - Try to update the Supported Countries to `All Countries`.
 * Reason 7: The widget script is missing or incorrect on this webpage.
    - Add/update the widget script manually to your theme. The code snippet and instructions can be found in the Add Widgets step of your Sezzle Merchant Dashboard Setup Checklist.
 * Reason 8: The widget is disabled for this site.
    - On the Main Menu, click `Enable Widget`.
 * Reason 9: The price is rendered after the widget script has run.
    - Ensure the widget script is at the bottom of the applicable file.
 * Reason 10: You are using Shopify Buy with a non-Shopify storefront.
    - Shopify Buy adds the Shopify product details into the non-Shopify storefront within an iframe, which the Sezzle widget script cannot read. For this reason, we offer a special <a href="https://github.com/sezzle/static-widgets/blob/production/src/sezzle-shopify-buy-static-widget/sezzle-shopify-buy-static-widget.html" target="_blank">static widget lite</a> product specifically for Shopify Buy.

### <a id="issue-2"></a>Issue 2: My widget is appearing twice on the webpage.
 * Reason 1: The targeted price element exists twice on the webpage. This is commonly due to sale price vs regular price, or Recommended/Related Products.
    - Try to update the Price Position target.
 * Reason 2: The targeted price element re-rendered with a new price. This is commonly due to selecting product variants or asynchronous loading.
    - Try to update the Price Position target.
 * Reason 3: There are two configurations applied to this page.
    - There are two scripts with conflicting merchant IDs present. Remove the incorrect script.

### <a id="issue-3"></a>Issue 3: My widget is not reflecting the installment price correctly.
 * Reason 1: The targeted price element is the regular price, but the item is on sale.
    - Try to update the Price Position target.
 * Reason 2: The targeted price element is the sale price, which does not update to the current price when hidden.
    - Try to update the Price Position target.
 * Reason 3: The targeted price element is the current price, but updates on variant selection in a way that the widget does not observe the change.
    - Try to update the Price Position target.
 * Reason 4: The targeted price element contains words or symbols that cannot be parsed as a price.
    - Try to update the Price Position target.
 * Reason 5: The price is given as a range.
    - Reach out to Sezzle for assistance.
 * Reason 6: The price is given with the cents in superscript, so the whole price is not being parsed.
    - Try to update the Price Position target. There is sometimes a hidden element present with the price in the correct format.
 * Reason 7: The price is given as an attribute of the element instead of text content.
    - Create a hidden element inside or after the the price element, then target the hidden element instead. Ex:
    ```html
    <div id="ProductPrice" data-amount={{ product.selected_or_first_available_variant.price }}></div>

    <span class="sezzle-price-element" style="display: none;">{{ product.selected_or_first_available_variant.price }}</span>
    ```

### <a id="issue-4"></a>Issue 4: I don't like my widget's proximity to other page elements.
 * Reason 1: The widget is positioned too close or too far away from the targeted price element.
    - Try to update the Widget Position.
    - Try to update the Top Margin values. Higher margin values move the widget farther from the adjacent element, and negative margin values move the widget closer to the adjacent element in the applicable direction.
 * Reason 2: The widget is in the correct position, but either the parent or adjacent element's settings are placing the widget too close or too far away.
    - Try to update the Widget Position.
    - Try to update the Top and Bottom Margin values. Higher margin values move the widget farther from the adjacent element, and negative margin values move the widget closer to the adjacent element in the applicable direction.
 * Reason 3: The widget is in the correct position, but it is running into the adjacent element.
    - Try to update the Widget Position.
    - Try to update the Maximum Width.
    - Try to update the Left or Right Margin values as applicable. Higher margin values move the widget farther from the adjacent element, and negative margin values move the widget closer to the adjacent element in the applicable direction.
    - Try to update the Font Size.

### <a id="issue-5"></a>Issue 5: I don't like my widget's alignment on the page.
 * Reason 1: The widget's parent element has an alignment that is different from the previous element.
    - Try to update the Widget Position.
    - Try to update the Desktop Alignment.
 * Reason 2: The price element's alignment is different on desktop vs mobile.
    - Try to update the Desktop Alignment, Desktop Minimum Width, and Mobile Alignment. The Desktop Minimum Width can be found as follows:   
        1) Right-click on the webpage, then select Inspect.
        2) In the toolbar, click the Devices icon (looks like a phone and a tablet). 
        3) In the Device dropdown, select Responsive. Click and drag the window width until the layout changes. 
        4) With the window at the width just wider than the change point, note the first number value next to the device type dropdown.
        5) Select the closest value available in the Desktop Minimum Width dropdown of the Sezzle Widget Chrome Extension, then set Desktop and Mobile alignments as applicable.
 * Reason 3: The widget's alignment is correct, but the parent element's settings are shifting the widget laterally.
    - Try to update the Widget Position.
    - Try to update the Left and Right Margin values. Higher margin values move the widget farther from the adjacent element, and negative margin values move the widget closer to the adjacent element in the applicable direction.

### <a id="issue-6"></a>Issue 6: My widget is broken into multiple lines, but I want it on one line.
 * Reason 1: The widget is in a parent element that is narrower than the widget width, breaking the widget contents into multiple lines.
    - Try to update the Widget Position.
    - Try to update the Right and Left Margin values. Higher margin values move the widget farther from the adjacent element, and negative margin values move the widget closer to the adjacent element in the applicable direction.
 * Reason 2: The widget is in the correct position, but the selected Widget Text exceeds the widget's default maximum width.
    - Try to update the Maximum Width values. 

### <a id="issue-7"></a>Issue 7: My widget does not contrast well with the theme of the webpage.
 * Reason 1: The site theme is a dark-mode aesthetic.
    - Try to update the Sezzle Theme to `dark`, `white`, or `white-flat`.
    - Try to update the Font Color to white or a light color present on your theme.
 * Reason 2: The site theme is a colored aesthetic.
    - Try to update the Sezzle Theme to `grayscale`, `black-flat`, `white`, or `white-flat`.
    - Try to update the Font Color to white or black or a high-contrast color present on your theme.
 * Reason 3: The widget's inherited font color is different from the price element's font color.
    - Try to update the Font Color to the same color as  the price text or another high-contrast color present on your theme.
    - Try to update the Widget Position.

### <a id="issue-8"></a>Issue 8: My widget is too hard to read.
 * Reason 1: The widget's parent element's font size is very small.
    - Try to update the Font Size.
 * Reason 2: The widget's parent element's font weight is set too thin.
    - Try to update the Boldness.
    - Try to update the Font Size.
    - Try to update the Widget Position.

### <a id="issue-9"></a>Issue 9: My widget is in a different font from my webpage.
 * Reason 1: The widget's parent element's font family is inconsistent with the rest of the page.
    - Try to update the Font Family to match the rest of the page.
    - Try to update the Widget Position.
 * Reason 2: The widget is inheriting a font override from the site's stylesheet.
    - Try to update the Font Family to match the rest of the page, followed by "!important". Ex: `Comfortaa !important`
 * Reason 3: The widget cannot access the custom font used on the webpage.
    - Try to update the Font Family to a complementary font to the rest of the webpage.

### <a id="issue-10"></a>Issue 10: My widget translation is not consistent with the webpage.
 * Reason 1: User's default browser language is not set to French, but the page is translated to French.
    - Try to update the Language Settings to `Match Page Language`.
 * Reason 2: User's default browser language is not set to French, but the page is only available in French.
    - Try to update the Language Settings to `French`.
 * Reason 3: User's default browser language is set to French, but the page is only available in English.
    - Try to update the Language Settings to `English`.

### <a id="issue-11"></a>Issue 11: My widget's modal window isn't opening, isn't closing, or has frozen my page from scrolling.
 * Reason 1: Your site is linked to an older version of the widget, and the issue has been resolved in later versions.
    - Reach out to Sezzle for assistance.

### <a id="issue-12"></a>Issue 12: The Chrome Extension is stuck on the loading screen.
 * Reason 1: This is possibly due to heavy activity on our end or internet connection strength on your end.
    - Try refreshing the page, clearing your cache, closing the browser and re-opening, restarting your computer, and/or checking your internet connection.
    - Try again later.


## <a id="request-help"></a>Reaching out to Sezzle

If you need standard widget assistance and have not completed the Setup Checklist in your Sezzle Merchant Dashboard, please click `Request Addition of Widgets` within the setup checklist. Otherwise, follow the below guidelines when reaching out to Sezzle.

### <a id="issue-13"></a>Issue 13: My issue is listed in the Troubleshooting Guide, but the solution did not work.
Reach out to Sezzle with the applicable issue description(s) from above, the website URL and a screenshot of the issue or a sample URL of the product page experiencing the issue, and any additional notes regarding the issue. Including the "Reason" description is not necessary, but you may include it if you know which is causing the issue.

### <a id="issue-14"></a>Issue 14: I am getting an error message when trying to log in to the Chrome Extension.
Reach out to Sezzle with the error message, the website URL, and the email address you used to sign in.

### <a id="issue-15"></a>Issue 15: I am getting an error message when trying to save my widget settings.
Reach out to Sezzle with the website URL and a screenshot of the error message.

### <a id="issue-16"></a>Issue 16: I have a special request.
Sezzle offers the following special features by request. Reach out to Sezzle with the applicable request description(s) from below with the desired accompanying value(s). We may reach out to discuss further before fulfilling your request:
 * I want to change the widget's logo size.
    - Logo size must still be legible.
 * I want to show widgets in at least one additional country.
 * I want to change the widget text content.
    - The Sezzle logo image must remain present. The installment price is highly recommended, as it is proven to drive AOV lift.
 * I want to combine the Sezzle widget with a competitor's widget.
    - We currently offer dual install with Afterpay, Quadpay, and Affirm.
 * I am switching to Sezzle from a competitor and need the competitor widget removed.
    - We can hide the competitor widget, but there may be a delay since the Sezzle widget loads last. It is recommended to remove the competitor's code from your theme.
 * I want to add widgets to the quick cart.
 * I want to add widgets to the product preview page.
 * I want to add widgets to the collections page.
    - The more widgets on a page, the more difficult it is to ensure quality performance. 
 * I want to hide widgets for certain products or collections.
    - We can hide the widgets on certain products, but it does not prevent the customer from checking out with Sezzle.
 * I want to hide widgets when a certain variant is selected.
    - If a customer attempts to checkout with Sezzle when purchasing a subscription item, they will be charged for the initial transaction, but Sezzle will not auto-charge the customer for each subsequent issuance.
 * I want to hide widgets below a certain price.
 * I want to hide widgets above a certain price.
    - It is recommended to update the widget text to reflect "on orders over X" instead of hiding the widgets. Not only does this provide transparency to the customer, but it may motivate upsell. 
    - Price thresholds should take into account the price of products and pre-Sezzle AOV.
    - Hiding the widgets outside of the price threshold does not prevent the customer from selecting Sezzle at checkout. Please reach out to Merchant Support to request a <i>gateway</i> minimum.
 * I want to test the widget on an unpublished theme.
    - The Chrome Extension provides a preview of the widget appearance. However, if you wish to test the widget performance across the entire site, the process is as follows:
      1) If widgets are already on the site, the config will need to be added locally to the theme code.
         a. Right-click on the page and select `Inspect`.
         b. On the `Sources` tab, open the folder `widget.sezzle.com`
         c. Find the file with the object `document.sezzleConfig`. Copy this object. Note: If it is <i>inside</i> an if/else conditional statement, copy the entire if/else statement.
         d. In your theme code, create a `<script type="text/javascript"></script>` above the existing widget.sezzle script, then paste the `document.sezzleConfig` between the `><`.
         e. Reach out to Sezzle to delete the config from the widget-server. The server-side config will override the local one, and therefore must be removed to test local configs.
         f. In the unpublished theme, copy+paste the two scripts (`document.sezzleConfig` and `widget.sezzle`) from the live theme into the applicable files, then make updates as needed. Complete documentation can be found <a href="https://docs.sezzle.com/#sezzlejs" target="_blank">here</a>.
 * I am concerned about the loading speed of the widget.
    - The widget is designed to load after all other page content has been rendered and usually takes mere milliseconds. This ensures all the necessary data is present to render the widget correctly and safeguards against the widget causing issues or delays to your site. You can review your site performance using <a href="https://gtmetrix.com/" target="_blank">GTMetrics</a> to confirm the true cause of the delay.
    - We offer an alternative <a href="https://github.com/sezzle/static-widgets" target="_blank">static widget</a> product that lives entirely within the theme code. It removes the need to reach out to Sezzle's widget server and provides a different level of control over the widget's performance. The downside is that Sezzle is unable to monitor performance or make changes, increasing the effort required from the merchant when maintenance is needed.
 * I want to offer Sezzle but I am using a third-party checkout.
    - We offer an additional <a href="https://github.com/sezzle/static-widgets/tree/production/src/sezzle-checkout-button-html" target="_blank">static checkout</a> button product that can be added directly to the theme code and the appearance customized to complement the cart page design. This button directs the user to the native Shopify checkout instead of the third-party checkout.

If you have a special request that is not listed above, please reach out to Sezzle with your request description. We will review and get back to you to determine if your request can be fulfilled.