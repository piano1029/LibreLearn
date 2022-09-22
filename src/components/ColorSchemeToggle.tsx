import { ActionIcon, UnstyledButton, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';

import { Store } from 'tauri-plugin-store-api';
const store = new Store('.settings.dat');

export function ColorSchemeToggle() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <UnstyledButton
            color={dark ? 'yellow' : 'blue'}
            onClick={() => {
                if (colorScheme === 'dark') {
                    store.set(`theme`, `light`)
                } else {
                    store.set(`theme`, `dark`)
                }
                toggleColorScheme()
            }}
            title="Toggle color scheme"
        >
            {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </UnstyledButton>
    );
}