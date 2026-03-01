const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const seedArticles = require('./seeds/seedArticles');
const seedAdminUser = require('./seeds/seedAdminUser');
const { seedLawyers } = require('./routes/lawyerRoutes');

const initCronJobs = require('./cron');

// Load env vars
dotenv.config({ path: '../.env' }); // Looking for .env in root

connectDB().then(() => {
    seedArticles();
    seedAdminUser();
    // seedLawyers(); // Removed to preserve 17k records
    initCronJobs();
});
const app = express();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/evidence', require('./routes/evidenceRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/lawyers', require('./routes/lawyerRoutes').router);
app.use('/api/case-tracker', require('./routes/caseTrackerRoutes'));
app.use('/api/admin/auth', require('./routes/adminAuthRoutes').router);
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Another process is occupying this port.`);
        console.error('   Run: netstat -ano | findstr :5000  — then: taskkill /F /PID <pid>');
    } else {
        throw err;
    }
});
