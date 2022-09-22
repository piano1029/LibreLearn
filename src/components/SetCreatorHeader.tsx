import { createStyles, Header, Menu, Group, Center, Burger, Container, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons';
import { MantineLogo } from '@mantine/ds';

const useStyles = createStyles((theme) => ({
    inner: {
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        right: 0,
        //width: 'calc(100vw - 100px)',
        width: '100vw',
        paddingLeft: '100px',
        borderBottom: `5px solid #1c7ed6`
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkLabel: {
        marginRight: 5,
    },
}));


export function SetCreatorHeader({ value, setValue }: { value: string, setValue: (v: string) => any }) {
    const [opened, { toggle }] = useDisclosure(false);
    const { classes } = useStyles();

    return (
        //{/*<Header height={56} mb={120} style={{ marginLeft: 100 }} >*/ }
        <Container >
            <div className={classes.inner} >
                <TextInput
                    placeholder="An epic name for your set"
                    variant="unstyled"
                    value={value}
                    size="md"
                    onChange={(event) => setValue(event.target.value)}
                />
            </div>
        </Container>
        //{/*</Header>*/ }
    );
}