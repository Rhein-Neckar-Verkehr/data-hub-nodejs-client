# RNV Open Data Client 

[![NPM](https://nodei.co/npm/rnv-data-client.png?downloads=true)](https://www.npmjs.com/package/rnv-data-client)

A simple client in node.js to access the RNV Open Data API.

This readme file contains information about using the client. For detailed documentation on how to use the GraphQL interface, see the documentation [link from here](https://www.opendata-oepnv.de/ht/de/organisation/verkehrsunternehmen/rnv/openrnv/data-hub-api-dokumentationen)


# Install client from npm 
```bash 
$ npm install rnv-data-client
```

# Usage example 
The usage example contains two ways of using the RNV Open Data Client. 
1. Dynamically obtains an access token, when needed
2. Always obtains an access token 

For obtaining credentials for RNV Open Data API in environment variables,
see the section 'preparation-steps' below.
```js 
const dotenv = require('dotenv');
const client = require('rnv-data-client').client;
const exampleQueries = require('rnv-data-client').examples;

dotenv.config();

// Run prepare_env_file.sh to create an env file 
CLIENT_API_URL = process.env.CLIENT_API_URL;
OAUTH_URL = process.env.OAUTH_URL;
CLIENT_ID = process.env.CLIENT_ID;
CLIENT_SECRET = process.env.CLIENT_SECRET;
RESOURCE_ID = process.env.RESOURCE_ID;
// Modify this path when you copy this solution 
ACCESS_TOKEN_CACHE_PATH = "./at_cache.json";

// Checking that the .env file was loaded
console.log("CLIENT API URL: " + CLIENT_API_URL); 

// Simulate an async context 
(async () => {
    try {
        let DYN = true; 
        if (DYN){
            // Dynamically obtain an access token (only if token not cached and cache not expired)
            const at = await client.obtainAccessToken();
            // Change the key to use other queries here
            query = exampleQueries["stations"]
            console.log("Doing a query: " + query)
            const qres = await client.doQuery(query, at);
            console.log("Response to query: " + JSON.stringify(qres).substring(0, 200))

        }else{
            // Directly obtain access token 
            const at_info = await client.requestAccessToken();
            query = exampleQueries["stations"]
            console.log("Doing a query: " + query)
            const qres = await client.doQuery(query, at_info.access_token);
            console.log("Response to query: " + JSON.stringify(qres).substring(0, 200))
        }
    } catch (error) {
        console.error("Error while running the app: " + error)
    }
})();
``` 

# Debug 
```bash 
$ DEBUG=dataclient node \<your main\>.js 
```
Or set the DEBUG variable in your runtime environment.

# Run Tests 
```bash 
$ npm run test
```


# Preparation steps 
## Obtain Credentials 
To get access to our Open Data Hub API with your solutions, it is necessary to have an oauth2 access token. 
You need to go through several steps to generate such a token 


1. You register with your name and email for "Graphql" access with the reason "Upper Hackathon 24" here. 
[Open RNV Formular](https://www.opendata-oepnv.de/ht/de/organisation/verkehrsunternehmen/rnv/openrnv/api)
2. In around 10 minutes you should receive a mail with your basic credentials, it's recommended to save the mail 
3. From these credentials you can generate an access token for your coded clients, there are several ways to obtain such a token,
some of them are described here. 

## Prepare credentials

1. Download the graphql.http file to this repo and place it in the root path. 
2. Download the preparation script from gist (see below)
3. Run the shell script ./prepare_env_file.sh this will generate a .env file which is read by the node.js application


### On Unix/Mac/Linux 
You can copy the shell-script from node_modules if using npm.

```bash 
$ curl https://gist.githubusercontent.com/rnv-opendata/8365b1317505a80359491c2124a05e94/raw/2fc73bdbb1dd4872feff7aa8182c477d01a379cc/prepare_env_file.sh > prepare_env_file.sh
$ sudo chmod u+rwx prepare_env_file.sh 
$ ./prepare_env_file.sh > .envs
```
### On Windows 
```bash 
$ curl https://gist.githubusercontent.com/rnv-opendata/900d43affca063caed7918f91d9531b5/raw/38060421063bc4766566e5324af489fbce226cac/prepare_env_file.cmd > prepare_env_file.cmd  
$ pwsh prepare_env_file.cmd
```

# Important Links 
1. [RNV Data-Hub-API Main Page and Credentials Request](https://www.opendata-oepnv.de/ht/de/organisation/verkehrsunternehmen/rnv/openrnv/api)
2. [RNV Opendata GitHub Repository](https://github.com/Rhein-Neckar-Verkehr/data-hub-nodejs-client)

# References 
1. [Badges for npm](https://github.com/nodeico/nodeico) 
