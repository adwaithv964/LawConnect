require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { fetchAndProcessLegalNews } = require('./services/articleFetcher');

async function testFetch() {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Running fetch with real images...");
    try {
        const count = await fetchAndProcessLegalNews();
        console.log("Done! Count:", count);
    } catch (err) {
        console.error("Error during fetch:", err);
    }
    process.exit(0);
}

testFetch();
