import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { UserProvider } from "./contexts/userContext.tsx";

import App from "./App.tsx";
import "./i18n.ts";



const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <UserProvider>
                    <App />
                </UserProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
);
