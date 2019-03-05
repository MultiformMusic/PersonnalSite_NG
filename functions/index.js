const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const cors = require('cors')({ origin: true });
const sgMail = require('@sendgrid/mail');
const constantes = require('./constantes');
sgMail.setApiKey(constantes.apiKeys.MAIL_API_KEY);

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