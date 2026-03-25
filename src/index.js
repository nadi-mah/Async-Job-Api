const dotenv = require('dotenv');
const express = require('express');


dotenv.config();
const app = express();

const authRoute = require('./routes/auth.route');

app.use(express.json());

app.use('/auth', authRoute);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}...`)
})