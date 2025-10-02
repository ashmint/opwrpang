import { GetOrgUserResponse } from "@server/routers/user";
import { createContext } from "react";

interface OrgUserContext {
    orgUser: GetOrgUserResponse;
    updateOrgUser: (updateOrgUser: Partial<GetOrgUserResponse>) => void;
}

const OrgUserContext = createContext<OrgUserContext | undefined>(undefined);

export default OrgUserContext;
