const mongoose = require('mongoose');
const { mongooseUris } = require('../.env');

mongoose.connect(mongooseUris, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch(error => console.log('\x1b[41m%s\x1b[37m', error, '\x1b[0m'));
