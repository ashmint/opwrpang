import { ActionsEnum } from "@server/auth/actions";
import { db } from "@server/db";
import { actions, roles, roleActions } from "@server/db";
import { eq, inArray } from "drizzle-orm";
import logger from "@server/logger";

export async function ensureActions() {
    const actionIds = Object.values(ActionsEnum);
    const existingActions = await db.select().from(actions).execute();
    const existingActionIds = existingActions.map((action) => action.actionId);

    const actionsToAdd = actionIds.filter(
        (id) => !existingActionIds.includes(id)
    );
    const actionsToRemove = existingActionIds.filter(
        (id) => !actionIds.includes(id as ActionsEnum)
    );

    const defaultRoles = await db
        .select()
        .from(roles)
        .where(eq(roles.isAdmin, true))
        .execute();

    await db.transaction(async (trx) => {
        // Add new actions
        for (const actionId of actionsToAdd) {
            logger.debug(`Adding action: ${actionId}`);
            await trx.insert(actions).values({ actionId }).execute();
            // Add new actions to the Default role
            if (defaultRoles.length != 0) {
                await trx
                    .insert(roleActions)
                    .values(
                        defaultRoles.map((role) => ({
                            roleId: role.roleId!,
                            actionId,
                            orgId: role.orgId!
                        }))
                    )
                    .execute();
            }
        }

        // Remove deprecated actions
        if (actionsToRemove.length > 0) {
            logger.debug(`Removing actions: ${actionsToRemove.join(", ")}`);
            await trx
                .delete(actions)
                .where(inArray(actions.actionId, actionsToRemove))
                .execute();
            await trx
                .delete(roleActions)
                .where(inArray(roleActions.actionId, actionsToRemove))
                .execute();
        }
    });
}
