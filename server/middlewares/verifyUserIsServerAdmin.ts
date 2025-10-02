import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import HttpCode from "@server/types/HttpCode";

export async function verifyUserIsServerAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = req.user!.userId;

    if (!userId) {
        return next(
            createHttpError(HttpCode.UNAUTHORIZED, "User not authenticated")
        );
    }

    try {
        if (!req.user?.serverAdmin) {
            return next(
                createHttpError(
                    HttpCode.FORBIDDEN,
                    "User is not a server admin"
                )
            );
        }

        return next();
    } catch (e) {
        return next(
            createHttpError(
                HttpCode.INTERNAL_SERVER_ERROR,
                "Error verifying organization access"
            )
        );
    }
}
