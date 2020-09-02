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
        - Repeat these steps up as many parent elements as necessary to get to a unique value, adding each parent identifier before the previous value. This is usually only 1-3 levels.
    - If the element does not have an ID or class, enter the parent element's ID or class as the `targetXPath` and test the results.
        - If this is creating multiple widgets or contains non-price text, place the original price element's tag-name after the previous value and count the number of elements with that same tag-name that exist under the same parent <i>before</i> the desired price element, including children of sibling elements. This number will be the index.

The `targetXPath` value should meet the following criteria:
 * Appears exactly once on the given page.
    - You can check the uniqueness of each identifier by copying+pasting the following snippet into the Console area and enter the #ID or .class name between the quotations: `document.querySelectorAll('').length`
 * Contains only the current price.
    - You can check the text content of the `targetXPath` by inserting the ID or class closest to the current price element between the quotations of the following snippet: `document.querySelectorAll('')[0].innerText`
 * Is always present on the applicable page type.
    - It is advisable to open a regular-priced product and a sale-priced product in separate tabs to check both variations of the page.

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


The `renderToPath` tells the widget to appear after a certain element relative to the `targetXPath`. Its value is interpreted as follows: The path targets the price element with `.` or the parent container with `..`. `..` can be used to travel through multiple parent levels. It can then descend more exactly into child elements using ID, class, or tagName-index as before. It will also accept pseudo-elements such as `::first-child`

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