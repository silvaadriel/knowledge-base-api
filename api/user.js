const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    };

    const validateUserFields = user => {
        existsOrError(user.name, 'Name not entered');
        existsOrError(user.email, 'Email not entered');
        existsOrError(user.password, 'Password not entered');
        existsOrError(user.confirmPassword, 'Invalid Password Confirmation');
        equalsOrError(user.password, user.confirmPassword, 'Passwords don\'t match');
    };

    const index = async (_request, response) => {
        try {
            const users = await app.db('users')
                .select('id', 'name', 'email', 'admin');
            response.json(users);
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const show = async (request, response) => {
        const { id } = request.params;

        try {
            const user = await app.db('users')
                .select('id', 'name', 'email', 'admin').where({ id }).first();
            response.json(user);
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const store = async (request, response) => {
        const user = { ...request.body };

        try {
            validateUserFields(user);
            
            const userFromDb = await app.db('users')
                .where({ email: user.email }).first();

            notExistsOrError(userFromDb, 'User already registered');
        } catch(message) {
            return response.status(400).send(message);
        }

        user.password = encryptPassword(user.password);
        delete user.confirmPassword;

        try {
            await app.db('users').insert(user);
            response.status(204).send();
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const update = async (request, response) => {
        const user = { ...request.body };
        user.id = request.params.id;

        try {
            validateUserFields(user);
        } catch(message) {
            return response.status(400).send(message);
        }

        user.password =encryptPassword(user.password);
        delete user.confirmPassword;

        try {
            await app.db('users').update(user).where({ id: user.id });
            response.status(204).send();
        } catch(error) {
            response.status(500).send(error);
        }
    }

    return { index, show, store, update };
};
