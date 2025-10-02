import { verifySession } from "@app/lib/auth/verifySession";
import { cache } from "react";
import { redirect } from "next/navigation";

type AdminPageProps = {};

export default async function OrgPage(props: AdminPageProps) {
    redirect(`/admin/users`);

    return <></>;
}
