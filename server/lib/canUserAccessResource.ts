import { db } from "@server/db";
import { and, eq } from "drizzle-orm";
import { roleResources, userResources } from "@server/db";

export async function canUserAccessResource({
    userId,
    resourceId,
    roleId
}: {
    userId: string;
    resourceId: number;
    roleId: number;
}): Promise<boolean> {
    const roleResourceAccess = await db
        .select()
        .from(roleResources)
        .where(
            and(
                eq(roleResources.resourceId, resourceId),
                eq(roleResources.roleId, roleId)
            )
        )
        .limit(1);

    if (roleResourceAccess.length > 0) {
        return true;
    }

    const userResourceAccess = await db
        .select()
        .from(userResources)
        .where(
            and(
                eq(userResources.userId, userId),
                eq(userResources.resourceId, resourceId)
            )
        )
        .limit(1);

    if (userResourceAccess.length > 0) {
        return true;
    }

    return false;
}
