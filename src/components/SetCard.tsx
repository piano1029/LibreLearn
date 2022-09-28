import { IconEye, IconShare } from '@tabler/icons';
import { Card, Text, Group, Center, createStyles, Stack } from '@mantine/core';
import { SerializedSet } from '../api/sets';

const useStyles = createStyles((theme, _params, getRef) => {
    const image = getRef('image');

    return {
        card: {
            position: 'relative',
            height: 280,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],

            [`&:hover .${image}`]: {
                transform: 'scale(1.03)',
            },
        },

        image: {
            ref: image,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundSize: 'cover',
            transition: 'transform 500ms ease',
            paddingLeft: 15,
            paddingTop: 7
        },

        overlay: {
            position: 'absolute',
            top: '20%',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)',
        },

        content: {
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            zIndex: 1,
        },

        title: {
            color: theme.white,
            marginBottom: 5,
        },

        bodyText: {
            color: theme.colors.dark[2],
            marginLeft: 7,
        },

        author: {
            color: theme.colors.dark[2],
        },

        unsplashLink: {
            color: theme.colors.dark[2],
            textDecoration: 'none'
        }
    };
});

export function SetCard({ set }: { set: SerializedSet }) {
    const { classes, theme } = useStyles();

    return (
        <Card
            p="lg"
            shadow="lg"
            className={classes.card}
            radius="md"
        >

            <div className={classes.image} style={{ backgroundImage: `url("https://images.unsplash.com/photo-1651527567557-769ea053b0ab")` }} />
            <div className={classes.overlay} />

            <div className={classes.content}>
                <a href="https://unsplash.com/@fakurian" className={classes.unsplashLink} target={"_blank"} >Image from fakurian on Unsplash</a>
                <div>
                    <Text size="lg" className={classes.title} weight={500}>
                        {set.name}
                    </Text>

                    <Group position="apart" spacing="xs">
                        <Text size="sm" className={classes.author}>
                            {(set.has_been_shared === "inwards" || set.has_been_shared === "inwards_outwards") ? set.creator : `You`}
                        </Text>

                        <Group spacing="lg">
                            <Center>
                                <IconEye size={16} stroke={1.5} color={theme.colors.dark[2]} />
                                <Text size="sm" className={classes.bodyText}>
                                    {0}
                                </Text>
                            </Center>
                            <Center>
                                <IconShare size={16} stroke={1.5} color={theme.colors.dark[2]} />
                                <Text size="sm" className={classes.bodyText}>
                                    {0}
                                </Text>
                            </Center>
                        </Group>
                    </Group>
                </div>
            </div>
        </Card>
    );
}