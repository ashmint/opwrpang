import { Request, Response, NextFunction } from "express";
import { db } from "@server/db";
import { siteResources, apiKeyOrg } from "@server/db";
import { and, eq } from "drizzle-orm";
import createHttpError from "http-errors";
import HttpCode from "@server/types/HttpCode";

export async function verifyApiKeySiteResourceAccess(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const apiKey = req.apiKey;
        const siteResourceId = parseInt(req.params.siteResourceId);
        const siteId = parseInt(req.params.siteId);
        const orgId = req.params.orgId;

        if (!apiKey) {
            return next(
                createHttpError(HttpCode.UNAUTHORIZED, "Key not authenticated")
            );
        }

        if (!siteResourceId || !siteId || !orgId) {
            return next(
                createHttpError(
                    HttpCode.BAD_REQUEST,
                    "Missing required parameters"
                )
            );
        }

        if (apiKey.isRoot) {
            // Root keys can access any resource in any org
            return next();
        }

        // Check if the site resource exists and belongs to the specified site and org
        const [siteResource] = await db
            .select()
            .from(siteResources)
            .where(and(
                eq(siteResources.siteResourceId, siteResourceId),
                eq(siteResources.siteId, siteId),
                eq(siteResources.orgId, orgId)
            ))
            .limit(1);

        if (!siteResource) {
            return next(
                createHttpError(
                    HttpCode.NOT_FOUND,
                    "Site resource not found"
                )
            );
        }

        // Verify that the API key has access to the organization
        if (!req.apiKeyOrg) {
            const apiKeyOrgRes = await db
                .select()
                .from(apiKeyOrg)
                .where(
                    and(
                        eq(apiKeyOrg.apiKeyId, apiKey.apiKeyId),
                        eq(apiKeyOrg.orgId, orgId)
                    )
                )
                .limit(1);
            
            if (apiKeyOrgRes.length === 0) {
                return next(
                    createHttpError(
                        HttpCode.FORBIDDEN,
                        "Key does not have access to this organization"
                    )
                );
            }
            
            req.apiKeyOrg = apiKeyOrgRes[0];
        }

        // Attach the siteResource to the request for use in the next middleware/route
        // @ts-ignore - Extending Request type
        req.siteResource = siteResource;

        return next();
    } catch (error) {
        return next(
            createHttpError(
                HttpCode.INTERNAL_SERVER_ERROR,
                "Error verifying site resource access"
            )
        );
    }
}
