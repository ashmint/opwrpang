import UserContext from "@app/contexts/userContext";
import { useContext } from "react";

export function useUserContext() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}
