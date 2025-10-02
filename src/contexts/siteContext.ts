import { GetSiteResponse } from "@server/routers/site/getSite";
import { createContext } from "react";

interface SiteContextType {
    site: GetSiteResponse;
    updateSite: (updatedSite: Partial<GetSiteResponse>) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export default SiteContext;
