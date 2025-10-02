import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { db } from "@server/db";
import { apiKeyOrg, apiKeys } from "@server/db";
import { and, eq } from "drizzle-orm";
import response from "@server/lib/response";
import HttpCode from "@server/types/HttpCode";
import createHttpError from "http-errors";
import logger from "@server/logger";
import { fromError } from "zod-validation-error";

const paramsSchema = z.object({
    apiKeyId: z.string().nonempty(),
    orgId: z.string().nonempty()
});

export async function deleteOrgApiKey(
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

        const { apiKeyId, orgId } = parsedParams.data;

        const [apiKey] = await db
            .select()
            .from(apiKeys)
            .where(eq(apiKeys.apiKeyId, apiKeyId))
            .innerJoin(
                apiKeyOrg,
                and(
                    eq(apiKeys.apiKeyId, apiKeyOrg.apiKeyId),
                    eq(apiKeyOrg.orgId, orgId)
                )
            )
            .limit(1);

        if (!apiKey) {
            return next(
                createHttpError(
                    HttpCode.NOT_FOUND,
                    `API Key with ID ${apiKeyId} not found`
                )
            );
        }

        if (apiKey.apiKeys.isRoot) {
            return next(
                createHttpError(
                    HttpCode.FORBIDDEN,
                    "Cannot delete root API key"
                )
            );
        }

        await db.transaction(async (trx) => {
            await trx
                .delete(apiKeyOrg)
                .where(
                    and(
                        eq(apiKeyOrg.apiKeyId, apiKeyId),
                        eq(apiKeyOrg.orgId, orgId)
                    )
                );

            const apiKeyOrgs = await db
                .select()
                .from(apiKeyOrg)
                .where(eq(apiKeyOrg.apiKeyId, apiKeyId));

            if (apiKeyOrgs.length === 0) {
                await trx.delete(apiKeys).where(eq(apiKeys.apiKeyId, apiKeyId));
            }
        });

        return response(res, {
            data: null,
            success: true,
            error: false,
            message: "API removed from organization",
            status: HttpCode.OK
        });
    } catch (error) {
        logger.error(error);
        return next(
            createHttpError(HttpCode.INTERNAL_SERVER_ERROR, "An error occurred")
        );
    }
}
