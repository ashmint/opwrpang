import { redirect } from "next/navigation";

type OrgPageProps = {
    params: Promise<{ orgId: string }>;
};

export default async function SettingsPage(props: OrgPageProps) {
    const params = await props.params;
    redirect(`/${params.orgId}/settings/sites`);

    return <></>;
}
