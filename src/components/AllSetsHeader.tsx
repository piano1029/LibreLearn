import { createStyles, Header, Menu, Group, Center, Burger, Container, TextInput, Button } from '@mantine/core';
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
        width: 'calc(100vw - 80px)',
        //width: '100vw',
        //paddingLeft: '100px',
        paddingLeft: 10,
        marginLeft: '100px',
        borderBottom: `5px solid #1c7ed6`,
        zIndex: 200000,
        backgroundColor: theme.colorScheme === `dark` ? `rgb(26, 27, 30)` : `#ffffff`
    },
}));


export function AllSetsHeader() {
    const { classes } = useStyles();

    return (
        //{/*<Header height={56} mb={120} style={{ marginLeft: 100 }} >*/ }
        <Container style={{ marginBottom: 56 }} >
            <div className={classes.inner} >
                <span>All your sets</span>
            </div>
        </Container>
        //{/*</Header>*/ }
    );
}