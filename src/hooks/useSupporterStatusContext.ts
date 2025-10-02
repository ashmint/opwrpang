import SupporterStatusContext from "@app/contexts/supporterStatusContext";
import { useContext } from "react";

export function useSupporterStatusContext() {
    const context = useContext(SupporterStatusContext);
    if (context === undefined) {
        throw new Error(
            "useSupporterStatusContext must be used within an SupporterStatusProvider"
        );
    }
    return context;
}
