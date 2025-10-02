import ResourceContext from "@app/contexts/resourceContext";
import { useContext } from "react";

export function useResourceContext() {
    const context = useContext(ResourceContext);
    if (context === undefined) {
        throw new Error(
            "useResourceContext must be used within a ResourceProvider"
        );
    }
    return context;
}
