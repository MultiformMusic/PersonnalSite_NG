const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const cors = require('cors')({ origin: true });
const sgMail = require('@sendgrid/mail');
const constantes = require('./constantes');
sgMail.setApiKey(constantes.apiKeys.MAIL_API_KEY);

const mongoose = require('mongoose');
const FakeDb = require('./fake-db');
const { normalizeErrors } = require('./helpers/mongoose');

const User = require('./models/user');
const { getToken } = require('./helpers/tokenHelper');

const request = require('request');
const RssParser = require('rss-parser');
let rssParser = new RssParser();


/**
 * 
 * Envoi mail via Sendgrid
 * 
 */
exports.httpEmail = functions.https.onRequest((req, res) => {

    cors( req, res, () => { 

        const htmtMsg = 
        `<p>mail : ${req.body.email}</p>
        <p>name : ${req.body.name}</p>
        <p>message : ${req.body.message}</p>
        ` 
        
        const msg = {
          to: 'michel.dio33@gmail.com',
          from: 'mdio@free.fr',
          subject: 'Message contact site perso 1',
          text: 'text',
          html: '<p>Message reçu : </p>' + htmtMsg
        };

        sgMail.send(msg)
            .then(response => {
                res.status(200).send(response);
            })
            .catch(error => {
                res.status(400).send(error);
        });
    });

});

/** 
*   Login utilisateur : email - password 
* 
*/
exports.mongoLogin = functions.https.onRequest((req, res) => {

    const { email, password } = req.body;

    cors( req, res, () => { 

        mongoose.connect(constantes.apiKeys.MONGO_URL, { useNewUrlParser: true })
            .then(() => {

                User.findOne({email}, function(err, user) {

                    // si erreur mongo lors exécution requête
                    if (err) {
                        return res.status(422).send({errors: normalizeErrors(err.errors)});
                    }

                    // utilisateur avec cet email n'existe pas
                    if (!user) {
                        return res.status(422).send({ errors: [{ title: 'Invalid user', detail: 'User does not exist'}]}); 
                    }

                    if(user.hasSamePassword(password)) {

                        const token = getToken(user);

                        return res.json(token);
            
                    } else {
            
                        return res.status(422).send({ errors: [{ title: 'Wrong data', detail: 'User does not exist'}]}); 
                    }

                });
            
            }).catch(error => {

                res.status(400).send(error);
            });
    });

});

/** 
*   Test existence utilisateur avec même email
* 
*/
exports.mongoExistUser = functions.https.onRequest((req, res) => {

    const email = req.body.email;

    cors( req, res, () => { 

        mongoose.connect(constantes.apiKeys.MONGO_URL, { useNewUrlParser: true })
            .then(() => {

                User.findOne({email}, function(err, user) {

                    // si erreur mongo lors exécution requête
                    if (err) {
                        return res.status(422).send({errors: normalizeErrors(err.errors)});
                    }

                    if (!user) {
                        return res.status(200).send({"exist": false});
                    } else {
                        return res.status(200).send({"exist": true});
                    }
                    
                });
            
            }).catch(error => {
                res.status(400).send(error);
            });
    });
});

/** 
*   Création d'un user en base mongo
* 
*/
exports.mongoCreateUser = functions.https.onRequest((req, res) => {

    const { username, email, password, confirmpassword } = req.body;

    cors( req, res, () => { 

        mongoose.connect(constantes.apiKeys.MONGO_URL, { useNewUrlParser: true })
            .then(() => {

                // Vérification  si email et username présents
                if (!username || !email) {
                    return res.status(422).send({ errors: [{ title: 'Data missing', detail: 'Provide email and pasword'}]});
                }
            
                // vérification si les deux mots de passe sont identiques
                if (password !== confirmpassword) {
                    return res.status(422).send({ errors: [{ title: 'Invalid password', detail: 'Password is not equal to confirmation'}]});
                }

                // vérification si email existe déjà en base
                User.findOne({email}, function(err, existingUser) {

                    if (err) {
                        return res.status(422).send({errors: normalizeErrors(err.errors)});
                    }
            
                    if (existingUser) {
                        return res.status(422).send({ errors: [{ title: 'Invalid email', detail: 'Email already exists'}]});
                    }
            
                    // construction nouvel User
                    const user = new User({
                        username,
                        email,
                        password
                    });
            
                    // sauvegarde User en base
                    user.save(function(err) {

                        if (err) {
                            return res.status(422).send({errors: normalizeErrors(err.errors)});
                        }
                        const token = getToken(user);
                        return res.json(token);

                    });
                });
            
            }).catch(error => {
                res.status(400).send(error);
            });
    });
});

/**
*   Initialisation de la base avec un utilisateur 
* 
*/
exports.mongoUpdateUser = functions.https.onRequest((req, res) => {

    const { id, username, email } = req.body;

    // le user sera positionné dans locals de la réponse pour avoir l'id
    //const user = res.locals.user;

    cors( req, res, () => { 

        mongoose.connect(constantes.apiKeys.MONGO_URL, { useNewUrlParser: true })
            .then(() => {

                // recher si utilisateur avec email existe déjà
                User.findOne({email}, function(err, existingUser) {

                    if (err) {
                        return res.status(422).send({errors: normalizeErrors(err.errors)});
                    }

                    // Vérification  si email et username présents
                    if (!username || !email) {
                        return res.status(422).send({ errors: [{ title: 'Data missing', detail: 'Provide email and pasword'}]});
                    }

                    if (existingUser) {
                        return res.status(422).send({ errors: [{ title: 'Invalid email', detail: 'Email already exists'}]});
                    }

                    User.update(
                        {_id: id},
                        {
                            $set: {
                                "email": email,
                                "username": username
                            }
                        }
                        ,
                        function(err, userUpdate) {

                            if (err) {
                                return res.status(422).send({errors: normalizeErrors(err.errors)});
                            }
                            return res.json({'user update': userUpdate});
                        }
                    );
                });
                    
            
            }).catch(error => {
                res.status(400).send({'seek db': false});
            });
    });

});

/**
*   Initialisation de la base avec un utilisateur 
* 
*/
exports.mongoInitDb = functions.https.onRequest((req, res) => {

    cors( req, res, () => { 

        mongoose.connect(constantes.apiKeys.MONGO_URL, { useNewUrlParser: true })
            .then(() => {

                const fakeDb = new FakeDb();
                fakeDb.pushDatasToDb().then(
                    res.status(200).send({'seek db': true})
                ).catch(error => {
                    res.status(400).send({'error': error})
                });
            
            }).catch(error => {
                res.status(400).send({'seek db': false});
            });
    });

});

/**
 * 
 * Récupére les feeds d'une url rss passé en requête
 * 
 */
exports.rssDatasFromUrl = functions.https.onRequest((req, res) => {

    const { rssUrls } = req.body;
    const arrayRssUrls = rssUrls.split('|');

    cors( req, res, async () => { 

        /*request(rssUrl, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            return res.send(body);
        });*/

        /*rssParser.parseURL(rssUrl).then(

            feed => {
                return res.json(feed);
            }
        );*/

        const feed = await rssParser.parseURL(arrayRssUrls[0]);
        return res.json(feed);
        

    });

});