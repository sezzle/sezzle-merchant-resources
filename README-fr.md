# Comment fonctionne Sezzle

How Sezzle Works est une page dédiée que les commerçants peuvent ajouter à leur site Web pour promouvoir davantage Sezzle. Suivez les instructions ci-dessous pour mettre en œuvre.

**_Remarque :_** Chaque fois que les instructions ci-dessous sont mises à jour, assurez-vous de mettre à jour les [documents des marchands](https://merchant-help.sezzle.com/hc/en-us/articles/360041531132-How-do- Je-crée-une-page-à-propos-de-Sezzle-) également

## Intégration des marchands

### Processus Shopify

Pour configurer la page sur Shopify, suivez les étapes ci-dessous.

1. Connectez-vous à votre boutique Shopify
1. Accédez à « Boutique en ligne » « Thèmes »
1. Sur le thème que vous souhaitez modifier, sélectionnez « Actions » puis « Modifier le code »
1. Dans le dossier "Modèles", cliquez sur "Ajouter un nouveau modèle", sélectionnez le modèle pour "Page", tapez le modèle "liquide" et nommez la page "Sezzle", puis cliquez sur Créer un modèle.
1. Sélectionnez le thème qui correspond le mieux à votre boutique dans les onglets répertoriés.
1. Copiez le [code](#code-snippet) et collez-le sous {{page.content}} sur la page Shopify.
1. Enregistrer
1. Accédez à « Pages »
1. Ajoutez une nouvelle page et donnez-lui un titre. Nous vous recommandons quelque chose comme « Comment fonctionne Sezzle » ou « Comment utiliser Sezzle ».
1. Sous « Modèle de thème » (en bas à droite), sélectionnez « sezzle »
1. Enregistrez et affichez la page

Vous pouvez maintenant ajouter la page à votre navigation :

1. Allez dans « Boutique en ligne » « Navigation »
1. Sélectionnez le menu dans lequel vous souhaitez que le lien Sezzle apparaisse (ex : Menu principal)
1. Cliquez sur "Ajouter un élément de menu"
1. Saisissez le texte que vous souhaitez faire apparaître (ex : Comment fonctionne Sezzle)
1. Cliquez sur la deuxième case, sélectionnez "Pages" puis la page que vous venez de créer
1. Cliquez sur Ajouter
1. Cliquez sur le menu Enregistrer

### Autres plateformes

Pour configurer la page sur toute autre plateforme, veuillez travailler avec votre développeur Web et/ou suivre les étapes ci-dessous.

1. Créez une nouvelle page dans votre thème
1. Copiez et collez le [code](#code-snippet) dans la page de votre site Web
1. Cliquez sur Enregistrer et/ou publier !

### Extrait de code
Ajoutez votre « merchant_uuid », ajustez le « thème » et la « langue » selon les exigences de votre site Web.

- `merchant_uuid` (marchand_uuid) est votre identifiant de commerçant au format : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
- `theme` (thème)peut être `clair` ou `sombre`.
- `language` (langue) peut être `en` ou `fr`.

Insérez le code suivant dans votre fichier HTML :

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
