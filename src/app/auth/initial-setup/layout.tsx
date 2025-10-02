import { internal } from "@app/lib/api";
import { authCookieHeader } from "@app/lib/api/cookies";
import { InitialSetupCompleteResponse } from "@server/routers/auth";
import { AxiosResponse } from "axios";
import { redirect } from "next/navigation";

export default async function Layout(props: { children: React.ReactNode }) {
    const setupRes = await internal.get<
        AxiosResponse<InitialSetupCompleteResponse>
    >(`/auth/initial-setup-complete`, await authCookieHeader());
    const complete = setupRes.data.data.complete;
    if (complete) {
        redirect("/");
    }

    return <div>{props.children}</div>;
}
