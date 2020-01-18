module.exports = app => {
    app.route('/users')
        .get(app.api.user.index)
        .post(app.api.user.store);

    app.route('/users/:id')
        .get(app.api.user.show)
        .put(app.api.user.update);

    app.route('/categories')
        .get(app.api.category.index)
        .post(app.api.category.store);

    app.route('/categories/tree')
        .get(app.api.category.getTree);

    app.route('/categories/:id')
        .get(app.api.category.show)
        .put(app.api.category.update)
        .delete(app.api.category.destroy);

    app.route('/articles')
        .get(app.api.article.index)
        .post(app.api.article.store);

    app.route('/articles/:id')
        .get(app.api.article.show)
        .put(app.api.article.update)
        .delete(app.api.article.destroy);

    app.route('/categories/:id/articles')
        .get(app.api.article.showByCategory);
};
