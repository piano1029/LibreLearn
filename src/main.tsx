import { ColorScheme, ColorSchemeProvider, MantineProvider, AppShell } from "@mantine/core";
import { Theme, appWindow } from "@tauri-apps/api/window";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
import App from "./App";
import { Sidebar } from "./components/Sidebar";
import "./style.css";
import { ErrorScreen } from "./components/ErrorScreen";
import { Footer } from "./components/Footer";

import { Store } from 'tauri-plugin-store-api';
import SetCreator from "./screens/SetCreator";
const store = new Store('.settings.dat');

function Wrapper({ children }: { children: any }) {
    return (
        <AppShell
            padding="md"
            navbar={<Sidebar />}
            footer={<Footer />}
        >
            {children}
        </AppShell>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Wrapper><App /></Wrapper>,
        errorElement: <ErrorScreen />
    },
    {
        path: "/creator",
        element: <Wrapper><SetCreator /></Wrapper>
    }
]);

function Main({ theme }: { theme: Theme }) {
    const [colorScheme, setColorScheme] = useState<ColorScheme>(theme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <React.StrictMode>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                    <RouterProvider router={router} />
                </MantineProvider>
            </ColorSchemeProvider>
        </React.StrictMode>
    )
}

appWindow.theme().then((theme) => {
    store.get(`theme`).then((_customTheme) => {
        const customTheme = _customTheme as Theme | null
        if (customTheme !== null) {
            theme = customTheme
        }
        ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
            <Main theme={theme || `dark`} />
        );
    })

})

