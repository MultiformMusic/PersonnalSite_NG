export const constants = {
    
    URL_CLOUD_MAIL: 'https://us-central1-personnalsite-c7bef.cloudfunctions.net/httpEmail',  
    
    /** pattern de validation email */
    PATTERN_EMAIL: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$',
   
    /** Minimum six characters, at least one letter and one number */
    PATTERN_PASSWORD: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$',

    /** local storage */
    LOCALSTORAGE_TOKEN: 'psng_auth',
    LOCALSTORAGE_META_DATA: 'psng_meta',

    /** Mongo DB */
    
    MONGO_CREATE_USER: 'https://us-central1-personnalsite-c7bef.cloudfunctions.net/mongoCreateUser',
    MONGO_LOGIN_USER: 'https://us-central1-personnalsite-c7bef.cloudfunctions.net/mongoLogin',
    
    //MONGO_CREATE_USER: '/personnalsite/us-central1/mongoCreateUser',
    //MONGO_LOGIN_USER: '/personnalsite/us-central1/mongoLogin',
    

    /** RSS functions */
    FEED_FROM_URL: 'https://us-central1-personnalsite-c7bef.cloudfunctions.net/rssDatasFromUrl',

    //FEED_FROM_URL: '/personnalsite/us-central1/rssDatasFromUrl',
   

    // URL

    //arrayOfRssUrl: ['https://www.futura-sciences.com/rss/actualites.xml', 'https://www.lemonde.fr/rss/une.xml', 'http://feedcleaner.nick.pro/sanitize?url=https%3A%2F%2Ffeeds.feedburner.com%2Ffrandroid%3Fformat%3Dxml&format=rss'],
    arrayOfRssUrl: ['https://www.futura-sciences.com/rss/actualites.xml'],

    /** Filters All */
    CATEGORY_ALL: '-- All categories',
    RSS_NAME_ALL: '-- All RSS',

    /** Liste déroulant rss url search */
    RSS_SEARCH_LIST: '-- Do a search to have list',
    RSS_SELECT_LIST: '-- Please select a rss',

    //URL_FEEDLY: '/personnalsite/us-central1/searchRssUrls',
    URL_FEEDLY: 'https://us-central1-personnalsite-c7bef.cloudfunctions.net/searchRssUrls',
    URL_RSS_PREFIX: 'feed/'

}