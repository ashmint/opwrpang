import { createContext } from "react";

export type SupporterStatus = {
    visible: boolean;
    tier?: string;
};

type SupporterStatusContextType = {
    supporterStatus: SupporterStatus | null;
    updateSupporterStatus: (updatedSite: Partial<SupporterStatus>) => void;
};

const SupporterStatusContext = createContext<
    SupporterStatusContextType | undefined
>(undefined);

export default SupporterStatusContext;
