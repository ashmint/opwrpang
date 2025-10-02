import { verify } from "@node-rs/argon2";
import { db } from "@server/db";
import { twoFactorBackupCodes } from "@server/db";
import { eq } from "drizzle-orm";
import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";
import { verifyPassword } from "./password";

export async function verifyTotpCode(
    code: string,
    secret: string,
    userId: string
): Promise<boolean> {
    // if code is digits only, it's totp
    const isTotp = /^\d+$/.test(code);
    if (!isTotp) {
        const validBackupCode = await verifyBackUpCode(code, userId);
        return validBackupCode;
    } else {
        const validOTP = await new TOTPController().verify(
            code,
            decodeHex(secret)
        );

        return validOTP;
    }
}

export async function verifyBackUpCode(
    code: string,
    userId: string
): Promise<boolean> {
    const allHashed = await db
        .select()
        .from(twoFactorBackupCodes)
        .where(eq(twoFactorBackupCodes.userId, userId));

    if (!allHashed || !allHashed.length) {
        return false;
    }

    let validId;
    for (const hashedCode of allHashed) {
        const validCode = await verifyPassword(code, hashedCode.codeHash);
        if (validCode) {
            validId = hashedCode.codeId;
        }
    }

    if (validId) {
        await db
            .delete(twoFactorBackupCodes)
            .where(eq(twoFactorBackupCodes.codeId, validId));
    }

    return validId ? true : false;
}
