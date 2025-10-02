import { redirect } from "next/navigation";

export default async function UserPage(props: {
    params: Promise<{ orgId: string; userId: string }>;
}) {
    const { orgId, userId } = await props.params;
    redirect(`/${orgId}/settings/access/users/${userId}/access-controls`);
}
