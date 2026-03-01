require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

async function checkData() {
    await mongoose.connect(process.env.MONGODB_URI);
    const client = mongoose.connection.getClient();

    const lawconnectDb = client.db('lawconnect');
    const testDb = client.db('test');

    const lawconnectCount = await lawconnectDb.collection('lawyers').countDocuments();
    const testCount = await testDb.collection('lawyers').countDocuments();

    console.log(`Lawconnect DB lawyers: ${lawconnectCount}`);
    console.log(`Test DB lawyers: ${testCount}`);

    if (lawconnectCount > 1000) {
        console.log('Copying documents from lawconnect to test...');
        const docs = await lawconnectDb.collection('lawyers').find({}).toArray();
        await testDb.collection('lawyers').deleteMany({});
        await testDb.collection('lawyers').insertMany(docs);
        console.log('Copied successfully.');
    }

    process.exit(0);
}

checkData().catch(console.error);
