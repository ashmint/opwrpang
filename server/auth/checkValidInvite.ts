import { db } from "@server/db";
import { UserInvite, userInvites } from "@server/db";
import { isWithinExpirationDate } from "oslo";
import { verifyPassword } from "./password";
import { eq } from "drizzle-orm";

export async function checkValidInvite({
    inviteId,
    token
}: {
    inviteId: string;
    token: string;
}): Promise<{ error?: string; existingInvite?: UserInvite }> {
    const existingInvite = await db
        .select()
        .from(userInvites)
        .where(eq(userInvites.inviteId, inviteId))
        .limit(1);

    if (!existingInvite.length) {
        return {
            error: "Invite ID or token is invalid"
        };
    }

    if (!isWithinExpirationDate(new Date(existingInvite[0].expiresAt))) {
        return {
            error: "Invite has expired"
        };
    }

    const validToken = await verifyPassword(token, existingInvite[0].tokenHash);
    if (!validToken) {
        return {
            error: "Invite ID or token is invalid"
        };
    }

    return {
        existingInvite: existingInvite[0]
    };
}
