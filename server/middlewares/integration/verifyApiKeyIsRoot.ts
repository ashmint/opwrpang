import logger from "@server/logger";
import HttpCode from "@server/types/HttpCode";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export async function verifyApiKeyIsRoot(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { apiKey } = req;

        if (!apiKey) {
            return next(
                createHttpError(HttpCode.UNAUTHORIZED, "Key not authenticated")
            );
        }

        if (!apiKey.isRoot) {
            return next(
                createHttpError(
                    HttpCode.FORBIDDEN,
                    "Key does not have root access"
                )
            );
        }

        return next();
    } catch (error) {
        logger.error(error);
        return next(
            createHttpError(
                HttpCode.INTERNAL_SERVER_ERROR,
                "An error occurred checking API key"
            )
        );
    }
}
