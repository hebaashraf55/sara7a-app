import express from 'express';
import dontenv from 'dotenv';
import bootstrap from './app.contriller.js';
import chalk from 'chalk';

const app = express()
dontenv.config({path : './src/config/.env'});
const port = process.env.PORT ;

await bootstrap(app, express);


app.listen(port, () => console.log(chalk.bgGreen(chalk.black(`Example app listening on port ${port}!`))))