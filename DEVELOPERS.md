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

Goto `localhost:8080` or whichever port the http-server is running on, to see the changes. 

`index.html` file inside the `local` directory has the configuration that will be passed to the app. This is to mimic merchant integration and test in local.


## Working with translations and Lokalise

Now we are using Localise tool here where we keep translations for how-sezzle-works.

### If you want to add a new key of translation and upload it to Localise

1. Add a new message to the component's `en.json` file with default message. For example:

```json
  "myNewMessage" :  "Default message"
```

1. Run command `API_KEY=<localise-api-key> npm run translate:extract` where is `<localise-api-key>` your API key which you need for authentication. You can find Localise API key using following instructions given in the link (https://docs.lokalise.com/en/articles/1929556-api-tokens).
1. Run command `API_KEY=<localise-api-key> npm run translate:push`
1. Send translations keys to #translation-request Slack channel
1. Then translator or developer can go to the Lokalise project and add translations for the needed languages.

### If you want to download translations from Lokalise

1. Run command `API_KEY=<localise-api-key> npm run translate:pull` where is `<localise-api-key>` is your api key which you need for authentication.
1. Then updated files with translations should appear in the src/translations directory

Commit and push the change and merge your MR.

For futher information,please follow the link https://sezzle.atlassian.net/wiki/spaces/ME/pages/2887909400/Translation+-+everything+you+need+to+know

## Support

For any questions, issues, or general support related to this project.

- **Slack Channel:** #dev-mint-support
