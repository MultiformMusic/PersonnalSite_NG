export const constants = {
    
    URL_CLOUD_MAIL: 'https://us-central1-personnalsite-c7bef.cloudfunctions.net/httpEmail',
    
    
    PATTERN_EMAIL: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$',
   
    /** Minimum six characters, at least one letter and one number */
    PATTERN_PASSWORD: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$',

    /** Mongo DB */
    MONGO_CREATE_USER: '/personnalsite/us-central1/mongoCreateUser',

}