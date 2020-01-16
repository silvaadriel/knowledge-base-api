module.exports = app => {
    const { existsOrError } = app.api.validation;

    const limit = 10;
    const index = async (request, response) => {
        const page = request.query.page || 1

        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count)

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

    const store = async (request, response) => {
        const article = { ...request.body };

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
        const article = { ...request.body };

        try {
            existsOrError(article.name, 'Name not entered');
            existsOrError(article.description, 'Description not entered');
            existsOrError(article.categoryId, 'Category not entered');
            existsOrError(article.userId, 'Author not entered');
            existsOrError(article.content, 'Content not entered');
        } catch(message) {
            response.status(400).send(message);
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
                .where({ id }).del()
            
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

    return { index, show, store, update, destroy };
};
