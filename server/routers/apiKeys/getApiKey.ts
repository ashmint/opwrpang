import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { db } from "@server/db";
import { apiKeys } from "@server/db";
import { eq } from "drizzle-orm";
import response from "@server/lib/response";
import HttpCode from "@server/types/HttpCode";
import createHttpError from "http-errors";
import logger from "@server/logger";
import { fromError } from "zod-validation-error";

const paramsSchema = z.object({
    apiKeyId: z.string().nonempty()
});

async function query(apiKeyId: string) {
    return await db
        .select({
            apiKeyId: apiKeys.apiKeyId,
            lastChars: apiKeys.lastChars,
            createdAt: apiKeys.createdAt,
            isRoot: apiKeys.isRoot,
            name: apiKeys.name
        })
        .from(apiKeys)
        .where(eq(apiKeys.apiKeyId, apiKeyId))
        .limit(1);
}

export type GetApiKeyResponse = NonNullable<
    Awaited<ReturnType<typeof query>>[0]
>;

export async function getApiKey(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    try {
        const parsedParams = paramsSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return next(
                createHttpError(
                    HttpCode.BAD_REQUEST,
                    fromError(parsedParams.error).toString()
                )
            );
        }

        const { apiKeyId } = parsedParams.data;

        const [apiKey] = await query(apiKeyId);

        if (!apiKey) {
            return next(
                createHttpError(
                    HttpCode.NOT_FOUND,
                    `API Key with ID ${apiKeyId} not found`
                )
            );
        }

        return response<GetApiKeyResponse>(res, {
            data: apiKey,
            success: true,
            error: false,
            message: "API key deleted successfully",
            status: HttpCode.OK
        });
    } catch (error) {
        logger.error(error);
        return next(
            createHttpError(HttpCode.INTERNAL_SERVER_ERROR, "An error occurred")
        );
    }
}
