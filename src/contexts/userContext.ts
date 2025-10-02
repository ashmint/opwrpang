import { GetUserResponse } from "@server/routers/user";
import { createContext } from "react";

interface UserContextType {
    user: GetUserResponse;
    updateUser: (updatedUser: Partial<GetUserResponse>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;
