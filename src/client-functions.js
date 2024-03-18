const fetch = require('node-fetch');
const fs = require('fs');
const debug = require('debug')('dataclient');


/**
 * Checks if an access token timestamp is expired
 * @param {number} expiresOn - Expiration data as unix timestamp
 * @returns {boolean} true if expired, false if not
 */
function isAccessTokenExpired(expiresOn){
    const currentTime = Date.now();
    const tokenExpirationTime = expiresOn2date(expiresOn).getTime();
    console.log(tokenExpirationTime)
    return currentTime >= tokenExpirationTime;
}

/**
 * Save an access token to cache file. 
 * Specified at env ACCESS_TOKEN_CACHE_PATH
 * @param {object} accessJsonResponse 
 */
function saveTokenCache(accessJsonResponse){
    try {
        let toSave = {
            "access_token": accessJsonResponse["access_token"],
            "expires_on": accessJsonResponse["expires_on"]
        }
        fs.writeFileSync(ACCESS_TOKEN_CACHE_PATH, JSON.stringify(toSave), 'utf8');
        debug("Saved access token to cache");
    } catch (error) {
        console.error("Error saving access token: " + error)
    } 
}

/**
 * Load an access token from cache file. 
 * Specified at env ACCESS_TOKEN_CACHE_PATH
 */
function loadTokenCache(){
    if(!doesTokenCacheExist()){
        return null;
    }
    let tk = fs.readFileSync(ACCESS_TOKEN_CACHE_PATH, 'utf-8');
    let tkp = JSON.parse(tk)
    debug("Loaded Access token from cache");
    return tkp; 
}

/**
 * Checks if the token cache path exists.
 * Specified at env ACCESS_TOKEN_CACHE_PATH
 * @returns {boolean} true if file is there, false if not
 */
function doesTokenCacheExist(){
    return fs.existsSync(ACCESS_TOKEN_CACHE_PATH);
}

/**
 * Convert a unix timestamp to Date 
 * @param {number} expiresOn - Unix Timestamp 
 * @returns  {Date} from unix timestamp 
 */
function expiresOn2date(expiresOn){
    return new Date(expiresOn * 1000);
}


/**
 * Checks if an access token is available, if yes checks if it is valid.
 * In other cases obtains a new access token and saves it to cache.
 * @returns {object} access token 
 */
const obtainAccessToken = async () => {
    let tk = loadTokenCache();
    if(tk){
        if(isAccessTokenExpired(tk['expires_on'])){
            debug("Access Token from cache is expired, generating a new one ....");
        }else{
            debug("Access Token from cache is still valid until: "+ expiresOn2date(tk['expires_on']));
            return tk["access_token"];
        }
    }else{
        debug("Access Token not cached, generating new one ...");
    }
    json = await requestAccessToken();
    let date = expiresOn2date(json['expires_on']);
    debug("Obtained a new access token, which is valid until: " + date );
    saveTokenCache(json)


    return json["access_token"];
}

/**
 * Request an access token from specified enviroment parameter variables
 * @returns {object} access token 
 */
const requestAccessToken = async () => {
    
        const response = await fetch(OAUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:`grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&resource=${RESOURCE_ID}`     
        })
   
    return await response.json();
}

/**
 * Do a query to fetch info from open data hub api. Use the access token 
 * for authorization.
 * @param {string} query graphql query 
 * @param {object} accessToken  access token 
 * @returns {object} query result 
 */
const doQuery = async(query, accessToken) => {
    var postData = JSON.stringify({
        'query' :  query 
    });

    const response = await fetch(CLIENT_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+ accessToken,
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        },
        body:
            postData
        });
        
    const json = await response.json();
    return json;
};


module.exports = {
    isAccessTokenExpired: isAccessTokenExpired,
    saveTokenCache: saveTokenCache,
    loadTokenCache: loadTokenCache,
    expiresOn2date: expiresOn2date,
    requestAccessToken: requestAccessToken,
    obtainAccessToken: obtainAccessToken,
    doQuery: doQuery
};