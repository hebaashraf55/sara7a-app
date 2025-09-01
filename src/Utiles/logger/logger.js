import morgan from "morgan";
import fs from "fs";
import path from "path";


const __direname = path.resolve();
export function attachRoutingWithLogger(app, routerPath ,router, logesFilename ) {
    const LogStream = fs.createWriteStream(path.join(__direname ,
         './src/logs' ,
         logesFilename), { flags : 'a'}
    );
    app.use(routerPath, morgan('combined', { stream : LogStream }), router)
    app.use(routerPath, morgan('dev'), router)
}