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
import db from "./api/db";

import { Store } from 'tauri-plugin-store-api';
import SetCreator from "./screens/SetCreator";
import AllSets from "./screens/AllSets";
import Set from './screens/Set'
import { ModalsProvider } from "@mantine/modals";
import { v4 } from "uuid";
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
    },
    {
        path: "/all",
        element: <Wrapper><AllSets /></Wrapper>
    },
    {
        path: "/set/:uuid",
        element: <Wrapper><Set /></Wrapper>
    }
]);

function Main({ theme }: { theme: Theme }) {
    const [colorScheme, setColorScheme] = useState<ColorScheme>(theme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        //<React.StrictMode>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                <ModalsProvider>
                    <RouterProvider router={router} />
                </ModalsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
        //</React.StrictMode>
    )
}

appWindow.theme().then((theme) => {
    store.get(`theme`).then((_customTheme) => {
        db.read().then(() => {
            if (db.data === null) {
                // Initialize database!
                db.data = {
                    sets: {},
                    draft: {
                        name: `Demo`,
                        uuid: v4(),
                        times_studied: 0,
                        is_2_languages: false,
                        items: []
                    }
                }
            }
            const customTheme = _customTheme as Theme | null
            if (customTheme !== null) {
                theme = customTheme
            }
            ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
                <Main theme={theme || `dark`} />
            );
        })
    })

})

