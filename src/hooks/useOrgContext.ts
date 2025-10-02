import OrgContext from "@app/contexts/orgContext";
import { useContext } from "react";

export function useOrgContext() {
    const context = useContext(OrgContext);
    if (context === undefined) {
        throw new Error("useOrgContext must be used within a OrgProvider");
    }
    return context;
}
