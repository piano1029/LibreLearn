import { createStyles, Anchor, Group, ActionIcon } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconBrandGithub } from '@tabler/icons';
import { MantineLogo } from '@mantine/ds';

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: -70,
        marginLeft: 80,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
        },
    },
}));

export function Footer() {
    const { classes } = useStyles();

    return (
        <div className={classes.footer}>
            <div className={classes.inner}>
                <span style={{ fontWeight: '600' }} >LibreLearn</span>

                <Group spacing="xs" position="right" noWrap>
                    <a style={{ color: 'inherit', textDecoration: 'none', margin: 0, padding: 0 }} href="https://github.com" target="_blank"  >
                        <ActionIcon size="lg" variant="default" radius="xl">
                            <IconBrandGithub size={18} stroke={1.5} />
                        </ActionIcon>
                    </a>
                </Group>
            </div>
        </div>
    );
}