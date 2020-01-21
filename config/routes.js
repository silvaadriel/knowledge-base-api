const admin = require('./admin');

module.exports = app => {
    app.post('/signup', app.api.user.store);
    app.post('/signin', app.api.auth.signin);
    app.post('/validateToken', app.api.auth.validateToken);

    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.user.index))
        .post(admin(app.api.user.store));

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.user.show))
        .put(admin(app.api.user.update));

    app.route('/categories')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.category.index))
        .post(admin(app.api.category.store));

    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree);

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.category.show)
        .put(admin(app.api.category.update))
        .delete(admin(app.api.category.destroy));

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.article.index))
        .post(admin(app.api.article.store));

    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.article.show)
        .put(admin(app.api.article.update))
        .delete(admin(app.api.article.destroy));

    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.showByCategory);

    app.route('/stats')
        .all(app.config.passport.authenticate())
        .get(app.api.stat.get);
};
