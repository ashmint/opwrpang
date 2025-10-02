import OrgUserContext from "@app/contexts/orgUserContext";
import { useContext } from "react";

export function userOrgUserContext() {
    const context = useContext(OrgUserContext);
    if (context === undefined) {
        throw new Error(
            "useOrgUserContext must be used within a OrgUserProvider"
        );
    }
    return context;
}
