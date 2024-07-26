import { validationResult } from "express-validator";
import { ConflictError } from "../errors/ConflictErrors.js";

function doValidation (request, response, next) {
    const result = validationResult(request);
    if (result.isEmpty()) {
        return next();


    }
    const errObj = {errors: result.array()};
    //response.status(409).json({ errors: result.array()});
    next(new ConflictError('Input Validation Fails', errObj));
}

export function CheckValidation (rules) {
    return [rules, doValidation]
}