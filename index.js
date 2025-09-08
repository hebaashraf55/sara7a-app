import express from 'express';
import bootstrap from './src/app.contriller.js';
import chalk from 'chalk';

const app = express()
const port = process.env.PORT ;

await bootstrap(app, express);


app.listen(port, () => console.log(chalk.bgGreen(chalk.black(`Example app listening on port ${port}!`))))