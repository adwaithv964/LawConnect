require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const doc = await db.collection('lawyers').findOne({});
    console.log(JSON.stringify(doc, null, 2));
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
