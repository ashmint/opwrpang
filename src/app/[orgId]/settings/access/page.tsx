import { redirect } from "next/navigation";

type AccessPageProps = {
    params: Promise<{ orgId: string }>;
};

export default async function AccessPage(props: AccessPageProps) {
    const params = await props.params;
    redirect(`/${params.orgId}/settings/access/users`);

    return <></>;
}
