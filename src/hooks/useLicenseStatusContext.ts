import LicenseStatusContext from "@app/contexts/licenseStatusContext";
import { useContext } from "react";

export function useLicenseStatusContext() {
    const context = useContext(LicenseStatusContext);
    if (context === undefined) {
        throw new Error(
            "useLicenseStatusContext must be used within an LicenseStatusProvider"
        );
    }
    return context;
}
