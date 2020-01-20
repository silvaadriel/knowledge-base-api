module.exports = app => {
    app.post('/signup', app.api.user.store);
    app.post('/signin', app.api.auth.signin);
    app.post('/validateToken', app.api.auth.validateToken);

    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(app.api.user.index)
        .post(app.api.user.store);

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.user.show)
        .put(app.api.user.update);

    app.route('/categories')
        .all(app.config.passport.authenticate())
        .get(app.api.category.index)
        .post(app.api.category.store);

    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree);

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.category.show)
        .put(app.api.category.update)
        .delete(app.api.category.destroy);

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.index)
        .post(app.api.article.store);

    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.article.show)
        .put(app.api.article.update)
        .delete(app.api.article.destroy);

    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.showByCategory);
};
