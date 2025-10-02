import { cookies, headers } from "next/headers";
import { pullEnv } from "../pullEnv";

export async function authCookieHeader() {
    const env = pullEnv();

    const allCookies = await cookies();
    const cookieName = env.server.sessionCookieName;
    const sessionId = allCookies.get(cookieName)?.value ?? null;

    // all other headers
    // this is needed to pass through x-forwarded-for, x-forwarded-proto, etc.
    const otherHeaders = await headers();
    const otherHeadersObject = Object.fromEntries(otherHeaders.entries());

    return {
        headers: {
            Cookie: `${cookieName}=${sessionId}`,
            ...otherHeadersObject
        },
    };
}
