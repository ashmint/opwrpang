import { redirect } from "next/navigation";

export default async function IdpPage(props: {
    params: Promise<{ idpId: string }>;
}) {
    const params = await props.params;
    redirect(`/admin/idp/${params.idpId}/general`);
}
