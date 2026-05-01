const dotenv = require('dotenv');
const express = require('express');


dotenv.config();
const app = express();

const authRoute = require('./routes/auth.route');
const jobRoute = require('./routes/job.route');
const dashboardRoute = require('./routes/dashboard.route');

const { processJobs } = require('./workers/job.worker');
const {processJobsConcurrent} = require('./workers/concurrentJob.worker');
// const { connectRedis } = require('./config/redis');

app.use(express.json());

app.use('/auth', authRoute);
app.use('/jobs', jobRoute);
app.use('/dashboard', dashboardRoute);


const PORT = process.env.PORT ?? 3000;

// processJobs();
processJobsConcurrent();

// await connectRedis();
    
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}...`)
})
