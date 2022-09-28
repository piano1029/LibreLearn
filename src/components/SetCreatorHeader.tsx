import { createStyles, Group, Container, TextInput, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import { v4 } from 'uuid';
import { SerializedSet, SetItem } from '../api/sets';

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
        //zIndex: 200000,
        zIndex: 2,
        backgroundColor: theme.colorScheme === `dark` ? `rgb(26, 27, 30)` : `#ffffff`,
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

    saveButton: {
        marginRight: theme.spacing.md
    }
}));


export function SetCreatorHeader({ value, setValue, save, setSet }: { value: string, setValue: (v: string) => any, save: () => void, setSet: (set: SerializedSet) => void }) {
    const { classes } = useStyles();

    const openNewModal = () =>
        //console.log(`opening`)
        openConfirmModal({
            title: 'Create new set',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to create a new set? This will delete any unsaved work
                </Text>
            ),
            labels: { confirm: 'New set', cancel: "No don't create a new set" },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => setSet({
                name: `Your new set!`,
                uuid: v4(),
                times_studied: 0,
                is_2_languages: false,
                items: []
            }),
        });

    return (
        //{/*<Header height={56} mb={120} style={{ marginLeft: 100 }} >*/ }
        <Container >
            <div className={classes.inner} >
                <TextInput
                    placeholder="An epic name for your set"
                    variant="unstyled"
                    value={value}
                    size="md"
                    onChange={(event) => { setValue(event.target.value) }}
                />
                <Group position='right' className={classes.saveButton} ><Button size='xs' onClick={save} >
                    Save
                </Button><Button size='xs' onClick={openNewModal} color="red" >
                        New
                    </Button></Group>
            </div>
        </Container>
        //{/*</Header>*/ }
    );
}