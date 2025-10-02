"use client";

import EnvContext from "@app/contexts/envContext";
import { Env } from "@app/lib/types/env";

interface ApiProviderProps {
    children: React.ReactNode;
    env: Env;
}

export function EnvProvider({ children, env }: ApiProviderProps) {
    return (
        <EnvContext.Provider value={{ env }}>{children}</EnvContext.Provider>
    );
}

export default EnvProvider;
