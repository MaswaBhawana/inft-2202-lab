import { ConflictError } from "../errors/ConflictErrors.js";
import { logger } from "../utils/logger.js";

export const ErrorHandlingMiddleware = (error, request, response, next) => {
    const {message, stack, statusCode = 500} = error;

    console.log(error.details);

    const {method, originalUrl, body, params, query, headers} = request;
    const time = new Date().toISOString();
    const context = {
        time,
        stack,
        req: {method, path: originalUrl, headers,query, body, params},
        res: {body: response.locals.data, statusCode}
    }

    const responseObject = {message}
    if (error instanceof ConflictError) {
        responseObject.errors = error.details.errors;
    }

    logger.error(`${statusCode}: ${message}`, context);
    response.status (statusCode).send(responseObject);
}