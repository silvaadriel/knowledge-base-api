module.exports = middlewere => {
    return (request, response, next) => {
        const { admin } = request.user;
        if(admin) return middlewere(request, response, next);
        response.status(401).send('User isn\'t administrator');
    };
};
