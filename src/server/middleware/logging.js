import { logger } from "../utils/logger.js";

export const LoggingMiddleware = (request, response, next) => {
    logRequest(request, response);
    response.once('finish', () => { logRequest(request, response); 
    });

    next();
}

const logRequest = async (request, response) => {
    const {method, originalUrl, body, params, query, headers} = request;
    const {statusCode} = response;
    const time = new Date().toISOString();

    const og = response.json;
    response.json = async (value) => {
        const data = await Promise.resolve(value);
        response.locals.data = data
        return og.call(response, data);
    }


    const context = { 
        time,
        request: { body, params, query, headers},
        response: {
            statusCode,
            body: response.locals.data,
            headers: response.headers
        },


        
    }
    
    if (response.headersSent) {
        logger.info(`[${time}] RESPONSE: ${method} ${originalUrl}`, context);
        
    }else{
        logger.info(`[${time}] REQUEST: ${method} ${originalUrl}`, context);

    }

}