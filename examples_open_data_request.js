const exampleQueries = require('./src/example-queries');
const client  = require('./src/client-functions');
const dotenv = require('dotenv');

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
        let DYN = false; 
        if (DYN){
            // Dynamically obtain an access token (only if token not cached and cache not expired)
            const at = await client.obtainAccessToken();
            // Change the key to use other queries here
            query = exampleQueries["stations"];
            console.log("Doing a query: " + query)
            const qres = await client.doQuery(query, at);
            console.log("Response to query: " + JSON.stringify(qres).substring(0, 200))

        }else{
            // Directly obtain access token 
            const at_info = await client.requestAccessToken();
            query = exampleQueries["stations"];
            console.log("Doing a query: " + query)
            const qres = await client.doQuery(query, at_info.access_token);
            console.log("Response to query: " + JSON.stringify(qres).substring(0, 200))
        }
    } catch (error) {
        console.error("Error while running the app: " + error)
    }
})();

