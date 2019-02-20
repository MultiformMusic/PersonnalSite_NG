const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const cors = require('cors')({ origin: true });
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

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
          subject: 'Hello world',
          text: 'text',
          html: '<p>Message reçu 1 : </p>' + htmtMsg
        };

        sgMail.send(msg)
            .then(response => {
                res.status(200).send(response);
            })
            .catch(error => {

                //Log friendly error
                console.error(error.toString());

                res.status(400).send(error);
        });
    });

});