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
    /*
    MONGO_CREATE_USER: '/personnalsite/us-central1/mongoCreateUser',
    MONGO_LOGIN_USER: '/personnalsite/us-central1/mongoLogin',
    */

}