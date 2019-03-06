const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const cors = require('cors')({ origin: true });
const sgMail = require('@sendgrid/mail');
const constantes = require('./constantes');
sgMail.setApiKey(constantes.apiKeys.MAIL_API_KEY);

const mongoose = require('mongoose');
const FakeDb = require('./fake-db');

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
 * Login utilisateur : email - password 
 * 
*/
exports.mongoLogin = functions.https.onRequest((req, res) => {

    const login = req.body.email;
    const password = req.body.password

    cors( req, res, () => { 

        mongoose.connect(constantes.apiKeys.MONGO_URL, { useNewUrlParser: true })
            .then(() => {
                res.status(200).send({'connexion': req.body.email + ' -- ' + req.body.password});
            }).catch(error => {
                res.status(400).send({'connexion': false});
            });
    });

});

/**
 *  Initialisation de la base avec un utilisateur 
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