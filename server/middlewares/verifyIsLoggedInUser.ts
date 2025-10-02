import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import HttpCode from "@server/types/HttpCode";

export async function verifyIsLoggedInUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.user!.userId;
        const reqUserId =
            req.params.userId || req.body.userId || req.query.userId;

        if (!userId) {
            return next(
                createHttpError(HttpCode.UNAUTHORIZED, "User not authenticated")
            );
        }

        // allow server admins to access any user
        if (req.user?.serverAdmin) {
            return next();
        }

        if (reqUserId !== userId) {
            return next(
                createHttpError(
                    HttpCode.FORBIDDEN,
                    "User only has access to their own account"
                )
            );
        }

        return next();
    } catch (error) {
        return next(
            createHttpError(
                HttpCode.INTERNAL_SERVER_ERROR,
                "Error checking if user has access to this user"
            )
        );
    }
}
