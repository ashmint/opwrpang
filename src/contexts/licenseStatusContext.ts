import { LicenseStatus } from "@server/license/license";
import { createContext } from "react";

type LicenseStatusContextType = {
    licenseStatus: LicenseStatus | null;
    updateLicenseStatus: (updatedSite: LicenseStatus) => void;
    isLicenseViolation: () => boolean;
    isUnlocked: () => boolean;
};

const LicenseStatusContext = createContext<
    LicenseStatusContextType | undefined
>(undefined);

export default LicenseStatusContext;
