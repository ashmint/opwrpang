import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import HttpCode from "@server/types/HttpCode";
import logger from "@server/logger";
import { checkUserActionPermission } from "@server/auth/actions";
import { ActionsEnum } from "@server/auth/actions";

export function verifyUserHasAction(action: ActionsEnum) {
    return async function (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const hasPermission = await checkUserActionPermission(action, req);
            if (!hasPermission) {
                return next(
                    createHttpError(
                        HttpCode.FORBIDDEN,
                        "User does not have permission perform this action"
                    )
                );
            }

            return next();
        } catch (error) {
            logger.error("Error verifying role access:", error);
            return next(
                createHttpError(
                    HttpCode.INTERNAL_SERVER_ERROR,
                    "Error verifying role access"
                )
            );
        }
    };
}
