import { GetApiKeyResponse } from "@server/routers/apiKeys";
import { createContext } from "react";

interface ApiKeyContextType {
    apiKey: GetApiKeyResponse;
    updateApiKey: (updatedApiKey: Partial<GetApiKeyResponse>) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export default ApiKeyContext;
