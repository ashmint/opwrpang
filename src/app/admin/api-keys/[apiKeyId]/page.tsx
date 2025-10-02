import { redirect } from "next/navigation";

export default async function ApiKeysPage(props: {
    params: Promise<{ apiKeyId: string }>;
}) {
    const params = await props.params;
    redirect(`/admin/api-keys/${params.apiKeyId}/permissions`);
}
