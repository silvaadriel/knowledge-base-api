module.exports = app => {
    app.route('/users')
        .get(app.api.user.index)
        .post(app.api.user.store);

    app.route('/users/:id')
        .get(app.api.user.show)
        .put(app.api.user.update);
};
