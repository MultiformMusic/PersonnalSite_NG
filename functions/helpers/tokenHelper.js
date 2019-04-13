const jwt = require('jsonwebtoken');
const constantes = require('../constantes');

module.exports = {

    getToken: function(user) {

        const token = jwt.sign({
            userId: user.id,
            username: user.username,
            email: user.email
        }, constantes.apiKeys.JWT_SECRET, { expiresIn: '4h' });

        return token;
    }

}