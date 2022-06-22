# Local Config
The most important config options are `targetXPath` and `renderToPath`.
- `targetXPath` tells the widget where to find and extract the product price to calculate the installment price correctly. If the `targetXPath` is incorrect, it may cause one or more of the following issues:
    - No widgets
    - Duplicate widgets
    - Incorrect installment price
- `renderToPath` tells the widget where to appear in relation to the price element. If the `renderToPath` is incorrect, the widget may be hidden or will not render at all.

These two options are also the most difficult to identify correctly. For both, the following conditions apply:

 * ID names need to be preceded by a `#` character. If used in `targetXPath`, an ID can only be in the first position of the string.
 * Class names need to be preceded by a `.` character.
 * Tag names need to be followed by the applicable index. The format of a tagname is as follows: tagName-Index (e.g. `SPAN-2`). The indexes are zero-based, such that the first element of the specified type within the parent element is at index 0.
 * The path may contain multiple subpaths. All subpaths need to be separated by the ’/’ character.

## targetXPath

The `targetXPath` tells the widget where to find the current price. Its value is interpreted as follows: The first ID or all occurrences of the first class are found on the page, then that element(s) is checked for all occurrences of the next given subpath. Every element found on the page where all levels of the ID, classes, and tag+index can be applied in order will be given a `data-sezzleindex` attribute. If the `renderToPath` is found relative to that element, a widget will be created on the page.

To identify the `targetXPath`, complete the following steps:
 * Right-click on the current price element and select Inspect.
    - If the element has an ID or class, enter this as your `targetXPath` and test the results.
        - If this is creating widgets in multiple locations on the page, find the ID or class of this element's parent and place it in front of the current `targetXPath`. Example: `targetXPath: '.parent-class/.price-element-class'`
        - Repeat these steps up as many parent elements as necessary to get to a unique value, adding each parent identifier before the previous value, separated by a `/`. This is usually only 1-3 levels.
    - If the element does not have an ID or class, enter the parent element's ID or class as the `targetXPath` and test the results.
        - If this is creating multiple widgets or contains non-price text, place the original price element's tag-name after the previous value and count the number of elements with that same tag-name that exist under the same parent <i>before</i> the desired price element, including children of sibling elements. This number will be the index.

The `targetXPath` value should meet the following criteria:
 * Appears exactly once on the given page.
    - You can check the uniqueness of each identifier by copying+pasting the following snippet into the Console area and enter the #ID or .class name between the quotations: `document.querySelectorAll('').length`
 * Contains only the current price.
    - You can check the text content of the `targetXPath` by inserting the ID or class closest to the current price element between the quotations of the following snippet: `document.querySelectorAll('')[0].textContent`
 * Is always present on the applicable page type.
    - It is advisable to open a regular-priced product and a sale-priced product in separate tabs to check both variations of the page.
    - If a `targetXPath` cannot be identified that is always on the page and indicating the <i>current</i> price, it is also permissible to create two configurations for the same page type if the two `targetXPath`s do not appear on the page at the same time.

To illustrate `targetXPath`, below is the product price area from the Shopify theme Prestige:

```html
<div class="ProductMeta__PriceList">
    <span class="ProductMeta__Price Price--highlight">$20</span>
    <span class="ProductMeta__Price Price--compareAt">$15</span>
</div>
```

WRONG: If `targetXPath: '.ProductMeta__Price'` is applied, two widgets will be created, since that class appears twice.

WRONG: If `targetXPath: 'Price--highlight'` is applied, one widget will be created on sale items, but no widget will appear on regular-priced items, since that class only exists if the item is on sale.

WRONG: If `targetXPath: 'ProductMeta__PriceList'` is applied, one widget will be created, but the widget text will reflect both the regular and sale prices in the installment price.

RIGHT: If `targetXPath: 'ProductMeta__PriceList/SPAN-0'` is applied, the widget will render correctly on both regular and sale items, since the current price is always the first child of the parent container in this theme.

RIGHT: Alternatively, `targetXPath: 'ProductMeta__PriceList'` can be used with `ignoredPriceElements: ['.Price--compareAt']` to accomplish the same result.


Let's look at another, more complicated, example. Below is the product price area from the Shopify theme Supply:

```html
<ul class="inline-list product-meta">
    <li>
        <span id="productPrice-product-template" class="h1">
            <span>$15<sup>00</sup></span>
            <span><small><s>$20<sup>00</sup></s></small></span>
            <span class="visually-hidden">
                <span class="visually-hidden">Regular price</span>$26.00
            </span>
            <span class="visually-hidden">
                <span class="visually-hidden">Sale price</span>$20.00
            </span>
        </span>
        <div class="product-price-unit">
            <span class="visually-hidden">Unit price</span>
            <span></span>
            <span>/</span>
            <span class="visually-hidden">&nbsp;per&nbsp;</span>
            <span>
                <span></span>
            </span>
        </div>
    </li>
    <li>
        <span id="comparePrice-product-template" class="sale-tag large">Save $6</span>
    </li>
</ul>
```

WRONG: If `targetXPath: '.product-meta/#productPrice-product-template'` is applied, an error will show in the console `element.getElementById is not a function`. If an ID is used, it must start the targetXPath, since IDs should inherently appear only once per page.

WRONG: If `targetXPath: '#productPrice-product-template'` is applied, one widget is created, but the widget text will reflect all the inner text content in the installment price.

WRONG: If `targetXPath: '#productPrice-product-template/SPAN-0'` is applied, the installment price will be incorrect since the price text does not have a period separating dollars from cents.
    Note: This <i>can</i> work if the theme is modified to add the period delimiter.

WRONG: If `targetXPath: '#productPrice-product-template/.visually-hidden'` is applied, two widgets will be created, since that class appears twice within the parent container specified by the ID. Also the widget text will reflect the non-price text in the installment price.

WRONG: If `targetXPath: '#productPrice-product-template/SPAN-4'` is applied, one widget will be created on sale items, but no widget will appear on regular-priced items, since there is only one child span within the parent container specified by the ID for non-sale items.

RIGHT: If `targetXPath: document.querySelector('#productPrice-product-template').getElementsByTagName('span').length > 2 ? '#productPrice-product-template/SPAN-4' : '#productPrice-product-template/.visually-hidden'` is applied with `ignoredFormattedPriceText: ['Sale price', 'Regular price']`, the widget will render correctly on both regular and sale items, as the function checks whether the item is on sale and applies the targetXPath accordingly AND the non-price text is extracted from the inner text before rendering the installment price.


## renderToPath

The `renderToPath` tells the widget to appear after a certain element relative to the `targetXPath`. Its value is interpreted as follows: The path targets the price element with `.` or the parent container with `..`. `..` can be used to travel through multiple parent levels. It can then descend more exactly into child elements using ID, class, or tagName-index as before. Unlike `targetXPath`, it will also accept pseudo-elements such as `::first-child`.

To illustrate `renderToPath`, below is the product price area from the Shopify theme Lorenza:

```html
<div class="product-item-caption-white product-item-caption- sidebar-product-template equal-columns-product-template" id="sidebar">
    <div class="mobile-hidden-sm">
        <header class="product-item-caption-header desktop_caption_header">
            <ul class="product-item-caption-price">
                <li id="ProductPrice-product-template" class="product-item-caption-price-current">
                    <span class="money">$429.00</span> <!-- End .money -->
                </li> <!-- End #ProductPrice-product-template -->
            </ul> <!-- End .product-item-caption-price -->
        </header> <!-- End .product-item-caption-header -->
    </div> <!-- End .mobile-hidden-sm -->
    <form id="product_form_1540309581868"class="shopify-product-form">
        <div class="row">
            <div class="col-xs-4 col-md-3  centered_on_mobile_btns">
                <div class="product-form__item product-form__item--quantity product-item-caption-qty">
                    <button class="btn-number btn-number-product-template">-</button>
                    <input id="Quantity-product-template" class="form-control input-number input-number-product-template product-form__input">
                    <button class="btn-number btn-number-product-template">+</button>
                </div>
            </div>
            <div class="product-form__item product-form__item--submit product_payments_btns">
              <button id="AddToCart-product-template" class="btn featured_product_submit product-form__cart-submit btn-primary btn-block btn-lg btn-shop">
                <span id="AddToCartText-product-template">Add to cart</span>
              </button>
            </div>
        </div> <!-- End .row -->
    </form> <!-- End .shopify-product-form -->
</div> <!-- End .product-item-caption-white -->
```

The `targetXPath` value in this example is `#ProductPrice-product-template/.money`.

If `renderToPath: '.'` is applied, the widget will be inserted after `.money`.
If `renderToPath: '..'` is applied, the widget will be inserted after the end of the `#ProductPrice-product-template` container.
If `renderToPath: '../..'` is applied, the widget will be inserted after the end of the `.product-item-caption-price` container.
If `renderToPath: '../../..'` is applied, the widget will be inserted after the end of the `.product-item-caption-header` container.
If `renderToPath: '../../../..'` is applied, the widget will be inserted after the end of the `.mobile-hidden-sm` container.
    Note: Avoid using classes or IDs that specify a device type, as the widget may act unexpectedly on different devices. In this case, the widget appears above the product details when viewed on a desktop device. For the previous 4 examples, the widget does not display at all on certain devices.

If `renderToPath: '../../../../..'` is applied, the widget will be inserted after the end of the `.product-item-caption-white` container, appearing below the product details.

If `renderToPath: '../../../../../FORM-0'` is applied, the widget will be inserted after the end of the `.shopify-product-form` container, appearing below the Add to Cart buttons.
    Note: `renderToPath: '../../../../../.shopify-product-form'` works the same in this scenario, but if the class names  differ, tagName-index may be better. Conversely, if the desired element is not always in the same position, the class name may be better.

If `renderToPath: '../../../../../FORM-0/::last-child'` is applied, the widget will be inserted as the last child of the `.shopify-product-form` container.
    Note: `renderToPath: '../../../../../.shopify-product-form/.row'` works the same in this scenario, but technically the widget is inserted after the end of the `.row` container. This distinction is important if there is innerText not contained inside an element.

If `renderToPath: '../../../../../FORM-0/::first-child'`is applied, the widget will be inserted as the first child of the `.shopify-product-form` container, appearing between the price container and the variant options (not shown).


## Content

`theme` controls the Sezzle logo version that appears inside the widget.
* `'light'` renders a color logo with purple text for light-colored backgrounds.
* `'dark'` renders a color logo with white text for dark-colored backgrounds.
* `'black-flat'` renders a black monochrome logo with black text for medium- or light-colored backgrounds.
* `'white-flat'` renders a white monochrome logo with white text for medium- or dark-colored backgrounds.

<div style="background: white; color: #392558; width: fit-content;">
<span>Light: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg' alt=' default color Sezzle logo with dark text'></span>
<span>Black-Flat: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_BlackAlt.svg' alt='black flat Sezzle logo'></span>
</div>
<div style="background: black; color: white; padding: 10px; width: fit-content;">
<span>Dark: <img style="height: 18px; padding: 5px;" src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor_WhiteWM.svg' alt='color Sezzle logo with light text for darkmode'></span>
<span>White-Flat: <img style="height: 18px; padding: 5px; " src='https://media.sezzle.com/branding/2.0/Sezzle_Logo_WhiteAlt.svg' alt='white flat Sezzle logo'></span>
</div>
<br/>

`ignoredPriceElements` disregards the provided child elements of the `targetXPath` when rendering the price in the widget. It will accept ID, class, tag, or an array. If a tag is provided without an index, it will be assumed at index 0. If an array is provided, note that the function may fail to apply to multiple identifier types on the same page. Ex: `ignoredPriceElements:['.visually-hidden', 'SPAN-1']` or `ignoredPriceElements: ['.from','DEL', '.base-price']`

`ignoredFormattedPriceText` can be used for non-price text that cannot be targeted by `ignoredPriceElements` due to being 1) not contained in a child element, 2) is not a direct child of the `targetXPath` element, or 3) is otherwise failing to be hidden by `ignoredPriceElements`. It will accept text such as `'Regular price'` or an array of text strings such as `['Regular price', 'Sale price']`.
* Note: The given value must match the text content substring exactly, including capitalization, spacing, and punctuation.

`language` determines the language or translation parameters of the widget and modal text. By default the widget and modal will translate automatically to match the page language based on the value of `document.querySelector('html).lang`. It can accept `'en'`, `'fr'`, or `'es'` for one-language sites, or a function or query to identify the in-page translation if the lang attribute does not work properly.

`apDualInstall` adds `or Afterpay` to the end of the widget text, featuring the Afterpay black on mint pill logo and an info icon to open the Afterpay modal.

`minPrice` adds `for orders over ${amount in local currency}` to the end of the widget text. Give the value as the price in cents, for example: `"minPrice": 3500` will result in the widget reflecting `for orders over $35.00`


## Style

`containerStyle` overrides the overall dimensions of the widget, particularly margins.

`textStyle` overrides the text area of the widget, such as font-size, font-family, and color.

`logoStyle` overrides the inherited style of the logo image to accompany changes to `logoSize` or to override local style being applied in error. This is intended solely for positioning purposes - per <a href="https://media.sezzle.com/branding/2.0/merchant/sezzle-co-branding-guidelines.pdf" target="_blank">Sezzle's Brand Guidelines</a>, please do not alter or distort the logo image in any way.


## Position

`alignment` overrides the inherited alignment applied to the widget. It accepts `'left'`, `'center'`, and `'right'`.

`alignmentSwitchMinWidth` determines the smallest screen width (assuming px) at which to apply `alignment` instead of `alignmentSwitchType`. For example, if `alignment: 'left', alignmentSwitchMinWidth: 768, alignmentSwitchType: 'center'` is applied, the widget will align left for screen widths >= 768 or more, and will align center for screen widths < 768.

`alignmentSwitchType` sets the widget alignment for smaller devices, if different from larger devices. It accepts `'left'`, `'center'`, and `'right'`.

`logoStyle` overrides the inherited style of the logo image to accompany changes to `logoSize` or to override local style being applied in error. This is intended solely for positioning purposes - per <a href="https://media.sezzle.com/branding/2.0/merchant/sezzle-co-branding-guidelines.pdf" target="_blank">Sezzle's Brand Guidelines</a>, please do not alter or distort the logo image in any way.


## Other Conditions

`urlMatch` restricts the application of a config group to pages where the URL contains the provided text string. For example: `urlMatch: 'cart'` will only apply that config group to the cart page, or `urlMatch: 'shirt'` will only apply that config group to products where the word 'shirt' is present in the URL.

`hideClasses` allows the Sezzle widget script to hide other elements on the same page, such as an old custom Sezzle widget or an old BNPL provider's widget. Values should be given as a class or array of classes.

`relatedElementActions` runs a custom function for each `targetXPath`. The value is an array of objects, each object accepting `relatedElement` and `initialAction`<!-- or `action` -->.
* `relatedPath` accepts a value like `renderToPath` to target an element relative to the `targetXPath` element.
* `initialAction` accepts a function with two parameters. The first parameter indicates the `relatedPath` element, and the second parameter indicates the corresponding widget. Beyond this, the content of the function is fully customizable.
<!-- * `action` accepts a function with two parameters. The first parameter indicates the mutation type for which to watch on the `relatedPath` element. The second parameter indicates the corresponding widget. When the event occurs, the widget price will update automatically. -->

`maxPrice` will prevent the widget from rendering above a certain price. Give the value in cents, for example `"maxPrice": 100000` will not display a widget for products exceeding $1000.

`observeElements` can be used to apply an event listener to an element on the page to trigger the re-initialization of the widget. Give the value as an array of objects with keys `eventType` and `element` - the element can be specified by class or ID. For example: `"observeElements": [{"element": ".language-selector","eventType": "click"}]`


## Writing the Configuration

The `targetXPath` is the only required widget configuration option, since the value varies by theme. All other options have a default value. So let's look at a "best case scenario" configuration:

```html
<!-- The below example is based on the Shopify theme Simple -->
<script type="text/javascript">
document.sezzleConfig = {
    "configGroups": [
        {
            "targetXPath": "#ProductPrice"
        },
        {
            "targetXPath": ".cart__subtotal"
        }
    ]
}
</script>
```

This configuration is written so the same code can be placed anywhere a widget is needed. However, if the code is being placed in the product and cart page files specifically instead of the theme/index or footer file, only the applicable config group object would be necessary. `urlMatch` is not required on this theme, because the `targetXPath` for the cart total does not appear on the product page, and vice versa.

Now let's look at a "worst case scenario" configuration:

```html
<!-- The below example is loosely based on WooCommerce -->
<script type="text/javascript">
document.sezzleConfig = {
    "configGroups": [
        {
            "targetXPath": ".summary/.price",
            "renderToPath": ".",
            "ignoredPriceElements": ["DEL"],
            "ignoredFormattedPriceText": ["From: "],
            "theme": "dark",
            "alignment": "left",
            "alignmentSwitchMinWidth": 768,
            "alignmentSwitchType": "center",
			"containerStyle": {
				"marginTop": "-15px",
				"marginBottom": "5px",
				"marginRight": "5px",
				"marginLeft": "5px"
			},
			"textStyle": {
				"fontWeight": 100,
				"maxWidth": "280px",
				"lineHeight": "20px",
				"fontSize": "16px",
				"fontFamily": "Helvetica Neue, sans-serif",
				"color": "white"
			},
            "logoStyle": {
				"transform": "scale(1.2)",
				"transformOrigin": "center top",
				"margin": "3px 5px 0px 7px"
			},
            "hideClasses": ["#processors"],
            "relatedElementActions": [
                "relatedPath": ".",
                "initialAction": function(r,w){
                    if(r.classList.contains("product-form__options__recurring")){
                        w.style.display = "none"
                    } else {
                        w.style.display = "block"
                    }
                }
            ]
        },
        {
            "targetXPath": ".order-total/TD-0/STRONG-0/.woocommerce-Price-amount",
            "renderToPath": "../../../../..",
            "urlMatch": "cart",
            "theme": "dark",
            "alignment": "right",
            "alignmentSwitchMinWidth": 576,
            "alignmentSwitchType": "center",
			"textStyle": {
				"color": "white",
				"fontSize": "16px",
				"fontWeight": 100,
				"fontFamily": "Helvetica Neue, sans-serif",
				"maxWidth": "320px",
			},
            "logoStyle": {
				"margin": "3px 5px 0px 7px",
				"transformOrigin": "center top"
			},
            "relatedElementActions": [
                "relatedPath": "../../../../../../../../../FORM-0/TABLE-0",
                "initialAction": function(r,w){
                    if(r.innerText.indexOf("subscription") > -1){
                        w.style.display = "none"
                    } else {
                        w.style.display = "block"
                    }
                }
            ]
        }
    ],
    "language": document.querySelector("html").lang === "fc" ? "fr" : "en"
}
</script>
```

In reality, WooCommerce typically only needs `targetXPath`, `renderToPath`, and `ignoredPriceElements`, but this configuration has been dramatized for illustrative purposes. Note the `language` setting is outside of the config groups since it applies site-wide, but all position, content, and style options are provided per config group so they are applied per page type.

Finally, let's see what the configuration defaults looks like. These are the values that are applied if none are given in the config group:

```js
document.sezzleConfig = {
    configGroups: [
        {
            "targetXPath": "", // required
            "renderToPath": "..",
			"urlMatch": "",
            "theme": "auto",
            "ignoredPriceElements": [],
            "ignoredFormattedPriceText": ["Subtotal", "Total:", "Sold Out"],
            "alignment": "inherit",
            "alignmentSwitchMinWidth": 0,
            "alignmentSwitchType": "inherit",
			"containerStyle": {
				"marginTop": "0px",
				"marginBottom": "0px",
				"marginRight": "0px",
				"marginLeft": "0px"
			},
			"textStyle": {
				"color": "inherit"
				"fontFamily": "inherit",
				"fontSize": "14px",
				"fontWeight": 500,
				"lineHeight": "13px",
				"maxWidth": "480px"
			},
            "logoStyle": {
				"transform": "scale(1)",
				"transformOrigin": "center",
				"margin": "0px"
			},
            "hideClasses": [],
            "relatedElementActions": []
        }
    ],
    "language": document.querySelector("html").lang || "en",
    "apDualInstall": false,
    "minPrice": 0,
    "maxPrice": 250000,
    "observeElements": [
        {
            "eventType": "",
            "element": ""
        }
    ]
}
```

## Troubleshooting

* options.configGroups must have at least one config object
    - Widget script is added, but no configuration was found for the applicable merchant ID. Confirm the widget script is reflecting the correct 36-character merchant ID for the store URL, then complete the configuration or request widget help from Sezzle.

* Unexpected end of input
    - Configuration does not have the correct number of opening and closing brackets. Review all bracket sets, updating brackets where needed.

* element.getElementById is not a function
    - ID is in `targetXPath` but does not begin the string. Remove all parent levels before the ID, or replace the ID with the class or tagName-index of that element.

* Uncaught SyntaxError: Unexpected string
    - One or more options is missing a comma separator. Review each config option to ensure it is followed by a comma. Commas are not required for the last option in each object.

* Uncaught SyntaxError: Unexpected token
    - Configuration contains at least one invalid or duplicate punctuation mark. Find the specified symbol and remove or replace it as applicable.

* Uncaught SyntaxError: Invalid or unexpected token
    - One or more quotation sets is missing or mismatched. Review all quotation sets to ensure opening closing marks are present and matching (`'`single or `"` double quotes), updating quotations where needed.

* Uncaught DOMException: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
    - The `ignoredPriceElement` is not a direct child of the `targetXPath`. Either update the `targetXPath` or the `ignoredPriceElement`, or use `ignoredFormattedPriceText`.

* Cannot read property 'parentNode' of undefined
    - The `renderToPath` is attempting to target a child element that doesn't exist within the applicable parent container. Try adding another `../` to the `renderToPath`, or change the child element target identifier.

* renderToPath must be of type string
	- TBD
