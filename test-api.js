const api = require('./server/routes/aiRoutes'); // Wait, better to just make an HTTP request to the running server.
const http = require('http');

const data = JSON.stringify({
    problemDescription: "I was hired by a software company 6 months ago. They haven't paid my salary for the last 2 months and when I ask, they ignore my emails. Now they have locked me out of my official email id without any termination letter.",
    category: "employment"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/ai/generate-action-plan',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
