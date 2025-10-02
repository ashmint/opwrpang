import { verifyPassword } from "@server/auth/password";
import { db } from "@server/db";
import { apiKeys } from "@server/db";
import logger from "@server/logger";
import HttpCode from "@server/types/HttpCode";
import { eq } from "drizzle-orm";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export async function verifyApiKey(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(
                createHttpError(HttpCode.UNAUTHORIZED, "API key required")
            );
        }

        const key = authHeader.split(" ")[1]; // Get the token part after "Bearer"
        const [apiKeyId, apiKeySecret] = key.split(".");

        const [apiKey] = await db
            .select()
            .from(apiKeys)
            .where(eq(apiKeys.apiKeyId, apiKeyId))
            .limit(1);

        if (!apiKey) {
            return next(
                createHttpError(HttpCode.UNAUTHORIZED, "Invalid API key")
            );
        }

        const secretHash = apiKey.apiKeyHash;
        const valid = await verifyPassword(apiKeySecret, secretHash);

        if (!valid) {
            return next(
                createHttpError(HttpCode.UNAUTHORIZED, "Invalid API key")
            );
        }

        req.apiKey = apiKey;

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
