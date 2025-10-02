import config from "@server/lib/config";

export function generateOidcRedirectUrl(idpId: number) {
    const dashboardUrl = config.getRawConfig().app.dashboard_url;
    const redirectPath = `/auth/idp/${idpId}/oidc/callback`;
    const redirectUrl = new URL(redirectPath, dashboardUrl).toString();
    return redirectUrl;
}
