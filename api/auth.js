const { authSecret } = require('../.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    const { existsOrError } = app.api.validation;

    const signin = async (request, response) => {
        const { email, password } = request.body;

        try {
            existsOrError(email, 'Email not entered');
            existsOrError(password, 'Password not entered');
        } catch(message) {
            return response.status(400).send(message);
        }

        
        try {
            const user = await app.db('users')
                .where({ email })
                .first();

            if (!user) return response.status(400).send('User not found');

            const isMatch = bcrypt.compareSync(password, user.password);
            existsOrError(isMatch, 'Invalid Email/Password');

            const now = Math.floor(Date.now() / 1000);

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                admin: user.admin,
                iat: now,
                exp: now + (60 * 60 * 24 * 3),
            };

            response.json({
                ...payload,
                token: jwt.encode(payload, authSecret),
            });
        } catch(message) {
            response.status(401).send(message);
        }
    }

    const validateToken = async (request, response) => {
        const userData = request.body || null;
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret);
                if(new Date(token.exp * 1000) > new Date()) {
                    return response.send(true);
                }
            }
        } catch(e) {}

        response.send(false);
    }

    return { signin, validateToken };
};
