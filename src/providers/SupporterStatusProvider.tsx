"use client";

import SupportStatusContext, {
    SupporterStatus
} from "@app/contexts/supporterStatusContext";
import { useState } from "react";

interface ProviderProps {
    children: React.ReactNode;
    supporterStatus: SupporterStatus | null;
}

export function SupporterStatusProvider({
    children,
    supporterStatus
}: ProviderProps) {
    const [supporterStatusState, setSupporterStatusState] =
        useState<SupporterStatus | null>(supporterStatus);

    const updateSupporterStatus = (
        updatedSupporterStatus: Partial<SupporterStatus>
    ) => {
        setSupporterStatusState((prev) => {
            if (!prev) {
                return updatedSupporterStatus as SupporterStatus;
            }
            return {
                ...prev,
                ...updatedSupporterStatus
            };
        });
    };

    return (
        <SupportStatusContext.Provider
            value={{
                supporterStatus: supporterStatusState,
                updateSupporterStatus
            }}
        >
            {children}
        </SupportStatusContext.Provider>
    );
}

export default SupporterStatusProvider;
