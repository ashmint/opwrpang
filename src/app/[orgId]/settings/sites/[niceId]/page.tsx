import { redirect } from "next/navigation";

export default async function SitePage(props: {
    params: Promise<{ orgId: string; niceId: string }>;
}) {
    const params = await props.params;
    redirect(`/${params.orgId}/settings/sites/${params.niceId}/general`);
}
