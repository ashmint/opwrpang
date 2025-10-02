import EnvContext from "@app/contexts/envContext";
import { useContext } from "react";

export function useEnvContext() {
    const context = useContext(EnvContext);
    if (context === undefined) {
        throw new Error("useEnvContext must be used within an EnvProvider");
    }
    return context;
}
