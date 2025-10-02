import { NextFunction, Response } from "express";
import ErrorResponse from "@server/types/ErrorResponse";
import { db } from "@server/db";
import { users } from "@server/db";
import { eq } from "drizzle-orm";
import createHttpError from "http-errors";
import HttpCode from "@server/types/HttpCode";
import { verifySession } from "@server/auth/sessions/verifySession";
import { unauthorized } from "@server/auth/unauthorizedResponse";

export const verifySessionMiddleware = async (
    req: any,
    res: Response<ErrorResponse>,
    next: NextFunction
) => {
    const { session, user } = await verifySession(req);
    if (!session || !user) {
        return next(unauthorized());
    }

    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.userId, user.userId));

    if (!existingUser || !existingUser[0]) {
        return next(
            createHttpError(HttpCode.BAD_REQUEST, "User does not exist")
        );
    }

    req.user = existingUser[0];
    req.session = session;

    next();
};
