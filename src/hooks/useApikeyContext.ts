import ApiKeyContext from "@app/contexts/apiKeyContext";
import { useContext } from "react";

export function useApiKeyContext() {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error(
            "useApiKeyContext must be used within a ApiKeyProvider"
        );
    }
    return context;
}
