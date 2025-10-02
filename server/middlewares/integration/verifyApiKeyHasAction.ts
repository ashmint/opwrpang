import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import HttpCode from "@server/types/HttpCode";
import logger from "@server/logger";
import { ActionsEnum } from "@server/auth/actions";
import { db } from "@server/db";
import { apiKeyActions } from "@server/db";
import { and, eq } from "drizzle-orm";

export function verifyApiKeyHasAction(action: ActionsEnum) {
    return async function (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            if (!req.apiKey) {
                return next(
                    createHttpError(
                        HttpCode.UNAUTHORIZED,
                        "API Key not authenticated"
                    )
                );
            }

            const [actionRes] = await db
                .select()
                .from(apiKeyActions)
                .where(
                    and(
                        eq(apiKeyActions.apiKeyId, req.apiKey.apiKeyId),
                        eq(apiKeyActions.actionId, action)
                    )
                );

            if (!actionRes) {
                return next(
                    createHttpError(
                        HttpCode.FORBIDDEN,
                        "Key does not have permission perform this action"
                    )
                );
            }

            return next();
        } catch (error) {
            logger.error("Error verifying key action access:", error);
            return next(
                createHttpError(
                    HttpCode.INTERNAL_SERVER_ERROR,
                    "Error verifying key action access"
                )
            );
        }
    };
}
