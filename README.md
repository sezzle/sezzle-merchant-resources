# How Sezzle Works

How Sezzle Works is a dedicated page that merchants can add to their website to further promote Sezzle. Follow the below instructions to implement.

## Shopify Process

To set up the page on Shopify, follow the steps below.

1. Log in to your Shopify Store
1. Navigate to "Online Store" "Themes"
1. On the theme you want to edit, select "Actions" and then "Edit Code"
1. Under the "Templates" folder, click "Add New Template," select 1. template for "Page," template type "liquid", and name the page "Sezzle", then click Create Template
1. Select the theme that best fits your store from the tabs listed.
1. Copy the appropriate code and paste it under {{page.content}} on the Shopify page.
   - [Light Theme (English)](<#light-theme-(english)>)
   - [Light Theme (French)](<#light-theme-(french)>)
   - [Dark Theme (English)](<#dark-theme-(english)>)
   - [Dark Theme (French)](<#dark-theme-(french)>)
1. Save
1. Navigate to "Pages"
1. Add a new page, and give it a title - we recommend something like "How Sezzle Works" or "How to use Sezzle"
1. Under "Theme Template" (in the bottom-right), select "sezzle"
1. Save and view the page

## Other Platforms

To set up the page on any other platform, please work with your web developer and/or follow the steps below.

1. Create a new page in your theme
1. Copy and paste the appropriate code into your website's page
   - [Light Theme (English)](<#light-theme-(english)>)
   - [Light Theme (French)](<#light-theme-(french)>)
   - [Dark Theme (English)](<#dark-theme-(english)>)
   - [Dark Theme (French)](<#dark-theme-(french)>)
1. Click save and/or publish!

### Code Snippets

- #### Light Theme (English)
  ```
  <div id="how-sezzle-works-container"></div>
  <script>
  document.addEventListener('DOMContentLoaded', function() {
      try {
      fetch('https://media.sezzle.com/how-sezzle-works/light-theme.html')
          .then(response => {
          if (!response.ok) {
              throw new Error('failed to fetch `how sezzle works`: ' + response.status);
          }
          return response.text();
          })
          .then(html => {
          const container = document.getElementById('how-sezzle-works-container');
          container.innerHTML = html;
      })
      }catch(e){
      console.error('Error rendering `how sezzle works`: ', e);
      }
  });
  </script>
  ```
- #### Light Theme (French)
  ```
  <div id="how-sezzle-works-container"></div>
  <script>
  document.addEventListener('DOMContentLoaded', function() {
      try {
      fetch('https://media.sezzle.com/how-sezzle-works/light-theme-french.html')
          .then(response => {
          if (!response.ok) {
              throw new Error('failed to fetch `how sezzle works`: ' + response.status);
          }
          return response.text();
          })
          .then(html => {
          const container = document.getElementById('how-sezzle-works-container');
          container.innerHTML = html;
      })
      }catch(e){
      console.error('Error rendering `how sezzle works`: ', e);
      }
  });
  </script>
  ```
- #### Dark Theme (English)

  ```
  <div id="how-sezzle-works-container"></div>
  <script>
  document.addEventListener('DOMContentLoaded', function() {
      try {
      fetch('https://media.sezzle.com/how-sezzle-works/dark-theme.html')
          .then(response => {
          if (!response.ok) {
              throw new Error('failed to fetch `how sezzle works`: ' + response.status);
          }
          return response.text();
          })
          .then(html => {
          const container = document.getElementById('how-sezzle-works-container');
          container.innerHTML = html;
      })
      }catch(e){
      console.error('Error rendering `how sezzle works`: ', e);
      }
  });
  </script>
  ```

- #### Dark Theme (French)

  ```
  <div id="how-sezzle-works-container"></div>
  <script>
  document.addEventListener('DOMContentLoaded', function() {
      try {
      fetch('https://media.sezzle.com/how-sezzle-works/dark-theme.html')
          .then(response => {
          if (!response.ok) {
              throw new Error('failed to fetch `how sezzle works`: ' + response.status);
          }
          return response.text();
          })
          .then(html => {
          const container = document.getElementById('how-sezzle-works-container');
          container.innerHTML = html;
      })
      }catch(e){
      console.error('Error rendering `how sezzle works`: ', e);
      }
  });
  </script>
  ```
