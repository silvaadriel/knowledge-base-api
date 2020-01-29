const queries = require('./queries');

module.exports = app => {
    const { existsOrError } = app.api.validation;

    const index = async (request, response) => {
        const page = request.query.page || 1;
        const limit = request.query.limit || 10;

        const result = await app.db('articles').count('id').first();
        const count = parseInt(result.count);

        try {
            const articles = await app.db('articles')
                .select('id', 'name', 'description')
                .limit(limit).offset(page * limit - limit);
            response.json({ data: articles, count, limit });
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const show = async (request, response) => {
        const { id } = request.params;

        try {
            const article = await app.db('articles').where({ id }).first();
            article.content = article.content.toString();
            response.json(article);
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const showByCategory = async (request, response) => {
        const categoryId = request.params.id;
        const page = request.query.page || 1;
        const limit = request.query.limit || 10;
        const categories = await app.db
            .raw(queries.categoryWithChildren, categoryId);
        const ids = categories.rows.map(c => c.id);

        try {
            const articles = await app.db({a: 'articles', u: 'users'})
                .select(
                    'a.id',
                    'a.name',
                    'a.description',
                    'a.imageUrl',
                    { author: 'u.name' },
                )
                .limit(limit).offset(page * limit - limit)
                .whereRaw('?? = ??', ['u.id', 'a.userId'])
                .whereIn('categoryId', ids)
                .orderBy('a.id', 'desc');

            response.json(articles);
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const store = async (request, response) => {
        const article = {
            id : request.body.id,
            name : request.body.name,
            description : request.body.description,
            imageUrl : request.body.imageUrl,
            content : request.body.content,
            userId : request.body.userId,
            categoryId : request.body.categoryId,
        };

        try {
            existsOrError(article.name, 'Name not entered');
            existsOrError(article.description, 'Description not entered');
            existsOrError(article.categoryId, 'Category not entered');
            existsOrError(article.userId, 'Author not entered');
            existsOrError(article.content, 'Content not entered');
        } catch(message) {
            return response.status(400).send(message);
        }

        try {
            await app.db('articles').insert(article);
            response.status(204).send();
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const update = async (request, response) => {
        const { id } = request.params;
        const article = {
            id : request.body.id,
            name : request.body.name,
            description : request.body.description,
            imageUrl : request.body.imageUrl,
            content : request.body.content,
            userId : request.body.userId,
            categoryId : request.body.categoryId,
        };

        try {
            existsOrError(article.name, 'Name not entered');
            existsOrError(article.description, 'Description not entered');
            existsOrError(article.categoryId, 'Category not entered');
            existsOrError(article.userId, 'Author not entered');
            existsOrError(article.content, 'Content not entered');
        } catch(message) {
            return response.status(400).send(message);
        }

        try {
            await app.db('articles').update(article).where({ id });
            response.status(204).send();
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const destroy = async (request, response) => {
        const { id } = request.params;

        try {
            const rowsDeleted = await app.db('articles')
                .where({ id }).del();
            
            try {
                existsOrError(rowsDeleted, 'Article not entered');
            } catch(message) {
                return res.status(400).send(message); 
            }

            response.status(204).send();
        } catch(error) {
            response.status(500).send(error);
        }
    };

    return { index, show, showByCategory, store, update, destroy };
};
