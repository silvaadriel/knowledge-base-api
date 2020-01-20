const { authSecret } = require('../.env');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };

    const verifyCallback = async (payload, done) => {
        try {
            const user = await app.db('users').where({ id: payload.id }).first();
            done(null, user ? { ...payload } : false);
        } catch(error) {
            done(error, false);
        }
    };

    const strategy = new Strategy(params, verifyCallback);

    passport.use(strategy);

    return {
        authenticate: () => passport.authenticate('jwt', { session: false }),
    };
};
