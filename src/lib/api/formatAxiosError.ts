export function formatAxiosError(error: any, defaultMessage?: string): string {
    return (
        error.response?.data?.message ||
        error?.message ||
        defaultMessage ||
        "An error occurred"
    );
}
