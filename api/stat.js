module.exports = app => {
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date,
    });

    const get = async (_request, response) => {
        const stat = await Stat.findOne({}, {}, { sort: { 'createdAt' : -1 } })
        const defaultStat = {
            users: 0,
            categories: 0,
            articles: 0,
        };
        response.json(stat || defaultStat);
    };

    return { Stat, get };
};
