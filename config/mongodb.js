const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/knowledge_stats', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch(error => console.log('\x1b[41m%s\x1b[37m', error, '\x1b[0m'));
