const cron = require('node-cron');
const { fetchAndProcessLegalNews } = require('./services/articleFetcher');

const initCronJobs = () => {
    // Run every 6 hours (at minute 0 past every 6th hour)
    cron.schedule('0 */6 * * *', async () => {
        console.log('⏰ Running scheduled task: fetchAndProcessLegalNews');
        try {
            await fetchAndProcessLegalNews();
        } catch (err) {
            console.error('Scheduled task failed:', err);
        }
    });

    console.log('✅ Cron jobs initialized. Articles will be synced periodically.');
};

module.exports = initCronJobs;
