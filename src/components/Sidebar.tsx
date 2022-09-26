import { Navbar, Center, Tooltip, UnstyledButton, createStyles, Stack, useMantineColorScheme, ScrollArea } from '@mantine/core';
import {
    TablerIcon,
    IconHome2,
    IconSquarePlus,
    IconMoonStars,
    IconSun,
    IconList
} from '@tabler/icons';
import Icon from '../assets/icon.svg'
import { Store } from 'tauri-plugin-store-api';
import { useLocation, useNavigate } from 'react-router-dom';
const store = new Store('.settings.dat');

const useStyles = createStyles((theme) => ({
    link: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    active: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        }
    },
}));

interface NavbarLinkProps {
    icon: TablerIcon;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    const { classes, cx } = useStyles();
    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
                <Icon stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const sidebarElements = [
    { icon: IconHome2, label: 'Home', url: `/` },
    { icon: IconList, label: 'All', url: `/all` },
    { icon: IconSquarePlus, label: 'Create', url: '/creator' }
];

export function Sidebar() {
    const { classes, cx } = useStyles()
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const dark = colorScheme === 'dark';
    const location = useLocation()
    const navigate = useNavigate()

    const links = sidebarElements.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={link.url === location.pathname}
            onClick={() => navigate(link.url)}
        />
    ));

    return (

        <Navbar width={{ base: 80 }} p="md">
            <Center>
                <img src={Icon} style={{ width: 60, height: 60 }} />
            </Center>
            <Navbar.Section grow mt={50}>
                <Stack justify="center" spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    <Tooltip label={"Change color scheme"} position="right" transitionDuration={0}>
                        <UnstyledButton onClick={() => {
                            if (colorScheme === 'dark') {
                                store.set(`theme`, `light`)
                            } else {
                                store.set(`theme`, `dark`)
                            }
                            toggleColorScheme()
                        }} className={cx(classes.link)} color={dark ? 'yellow' : 'blue'} >
                            {dark ? <IconSun stroke={1.5} /> : <IconMoonStars stroke={1.5} />}
                        </UnstyledButton>
                    </Tooltip>
                </Stack>
            </Navbar.Section>
        </Navbar>

    );
}