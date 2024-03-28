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

## Support

For any questions, issues, or general support related to this project.

- **Slack Channel:** #dev-mint-support