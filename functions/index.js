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
const jwt = require('jsonwebtoken');

const User = require('./models/user');

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

                    console.log("USER : = ", user);

                    if(user.hasSamePassword(password)) {

                        const token = jwt.sign({
                            userId: user.id,
                            username: user.username
                        }, constantes.apiKeys.JWT_SECRET, { expiresIn: '1h' });
            
                        return res.json(token);
                        //res.status(200).send({token});
            
                    } else {
            
                        return res.status(422).send({ errors: [{ title: 'Wrong data', detail: 'Wrong email or password'}]}); 
                    }

                });

                //res.status(200).send({'connexion': req.body.email + ' -- ' + req.body.password});
            
            }).catch(error => {

                res.status(400).send({'resultError': true});
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
                res.status(400).send({'resultError': true});
            });
    });
});

/** 
*   Création d'un user en base mongo
* 
*/
exports.mongoCreatetUser = functions.https.onRequest((req, res) => {

    const { username, email, password, passwordConfirmation } = req.body;

    cors( req, res, () => { 

        mongoose.connect(constantes.apiKeys.MONGO_URL, { useNewUrlParser: true })
            .then(() => {

                // Vérificatio  si email et username présents
                if (!username || !email) {
                    return res.status(422).send({ errors: [{ title: 'Data missing', detail: 'Provide email and pasword'}]});
                }
            
                // vérification si les deux mots de passe sont identiques
                if (password !== passwordConfirmation) {
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
            
                        return res.json({'register': true});
                    });
                });
            
            }).catch(error => {
                res.status(400).send({'resultError': true});
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
                    res.status(200).send({'seek db 2': true})
                ).catch(error => {
                    res.status(400).send({'error': error})
                });
            
            }).catch(error => {
                res.status(400).send({'seek db': false});
            });
    });

});