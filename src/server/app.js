import express from 'express';
import mongoose from 'mongoose';
import { router } from './routes/router.js';
import { LoggingMiddleware } from './middleware/logging.js';
import { ErrorHandlingMiddleware } from './middleware/errorHandling.js';
import cors from 'cors';
import path from 'path';

const PORT = 3000;
const Server = express();

Server.use(cors());

Server.use(express.json());
Server.use(LoggingMiddleware);
Server.use(express.static(`${import.meta.dirname}/../../dist`));
Server.use("/node_modules", express.static(`${import.meta.dirname}/../../node_modules`));
Server.use(router);

Server.get('*', (req, res, next) => {
    res.sendFile(path.resolve(import.meta.dirname + '/../../dist/index.html'));
});
Server.use(ErrorHandlingMiddleware);


async function startServer() {
    try {
        await mongoose.connect('mongodb://localhost:27017/inft2202');
        console.log('Connected to the database!');

        Server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

startServer();
