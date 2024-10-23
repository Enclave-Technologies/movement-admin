// app/(protected)/client/layout.js

import { UserProvider } from "@/context/ClientContext";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    return <UserProvider>{children}</UserProvider>;
};

export default ClientLayout;
