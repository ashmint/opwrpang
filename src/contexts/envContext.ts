import { Env } from "@app/lib/types/env";
import { createContext } from "react";

interface EnvContextType {
    env: Env;
}

const EnvContext = createContext<EnvContextType | undefined>(undefined);

export default EnvContext;
