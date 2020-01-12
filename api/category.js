module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId);
            return parent.length ? parent[0] : null;
        };

        const categoriesWithPath = categories.map(category => {
            let path = category.name;
            let parent = getParent(categories, category.parentId);

            while(parent) {
                path = `${parent.name} > ${path}`;
                parent = getParent(categories, parent.parentId);
            }

            return { ...category, path };
        });

        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1;
            if(a.path > b.path) return 1;
            return 0;
        });

        return categoriesWithPath;
    };

    const index = async (_request, response) => {
        try {
            const categories = await app.db('categories');
            response.json(withPath(categories));
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const show = async (request, response) => {
        const { id } = request.params;

        try {
            const category = await app.db('categories').where({ id }).first();
            response.json(category);
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const store = async (request, response) => {
        const category = { ...request.body };

        try {
            existsOrError(category.name, 'Name not entered');
        } catch(message) {
            return response.status(400).send(message);
        }

        try {
            await app.db('categories').insert(category);
            response.status(204).send();
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const update = async (request, response) => {
        const category = { ...request.body };
        category.id = request.params.id;

        try {
            existsOrError(category.name, 'Name not entered');
        } catch(message) {
            return response.status(400).send(message);
        }

        try {
            await app.db('categories').update(category).where({ id: category.id });
            response.status(204).send();
        } catch(error) {
            response.status(500).send(error);
        }
    };

    const destroy = async (request, response) => {
        try {
            existsOrError(request.params.id, 'Category id not informed');

            const subcategory = await app.db('categories')
                .where({ parentId: request.params.id });
            notExistsOrError(subcategory, 'Category has subcategories');

            const articles = await app.db('articles')
                .where({ categoryId: request.params.id });
            notExistsOrError(articles, 'Category has articles');

            const rowsDeleted = await app.db('categories')
                .where({ id: request.params.id }).del();
            existsOrError(rowsDeleted, 'Category was not found');

            response.status(204).send();
        } catch(message) {
            response.status(400).send(message);
        }
    };

    return { index, show, store, update, destroy };
};
