import { useNavigate, useParams } from "react-router-dom";
import db from "../api/db";

import { createStyles, Card, Overlay, CardProps, Button, Text, Grid, Stack, Group, Divider, Affix, Transition } from '@mantine/core';
import { SerializedSet } from "../api/sets";
import { IconDownload, IconUpload, IconX } from "@tabler/icons";
import { v4 } from "uuid";
import { openConfirmModal } from "@mantine/modals";
import { StudyMethods } from "../api/studyMethods";
import { useState } from "react";
import FlashCards from "../studyMethods/FlashCards";

const useStyles = createStyles((theme) => ({
    card: {
        height: 240,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    content: {
        position: 'absolute',
        padding: theme.spacing.xl,
        zIndex: 1,
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },

    title: {
        color: theme.white,
        marginBottom: theme.spacing.xs / 2,
    },

    description: {
        color: theme.white,
        maxWidth: 220,
    },

    actionButton: {
        marginLeft: theme.spacing.xs
    },

    setTrainerBox: {
        position: `absolute`,
        left: 80,
        right: 10,
        top: 0,
        bottom: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 5
    },

    setTrainer: {
        transition: `transform 500ms ease`,
        transform: `scale(0)`,
        backgroundColor: theme.colorScheme === `dark` ? theme.colors.dark[7] : `#ffffff`,
        width: '100%',
        height: '100%',
        zIndex: 6,
        pointerEvents: `all`
    },

    setTrainerOpened: {
        transform: `scale(1)`
    }
}));

interface BannerProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    image: string;
}

export function Banner({
    title,
    description,
    image,
    style,
    className,
    ...others
}: BannerProps & Omit<CardProps, keyof BannerProps | 'children'>) {
    const { classes, cx, theme } = useStyles();

    return (
        <Card
            radius="md"
            style={{ backgroundImage: `url(${image})`, ...style }}
            className={cx(classes.card, className)}
            {...others}
        >
            <Overlay
                gradient={`linear-gradient(105deg, ${theme.black} 20%, #312f2f 50%, ${theme.colors.gray[4]} 100%)`}
                opacity={0.55}
                zIndex={0}
            />

            <div className={classes.content}>
                <Text size="lg" weight={700} className={classes.title}>
                    {title}
                </Text>

                {description !== undefined ? <Text size="sm" className={classes.description}>
                    {description}
                </Text> : null}
            </div>
        </Card>
    );
}

function InfoAndActions({ set }: { set: SerializedSet }) {
    const { classes, cx, theme } = useStyles();
    const navigate = useNavigate()

    const openNewModal = () =>
        //console.log(`opening`)
        openConfirmModal({
            title: `Delete ${set.name}`,
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete "${set.name}"?
                </Text>
            ),
            labels: { confirm: 'Yes, delete it', cancel: "No I don't want to delete it" },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                if (db.data !== null) delete db.data.sets[set.uuid]
                navigate(`/all`)
            },
        });

    return <Stack>
        <Group position="apart" >Shared: {set.has_been_shared == `inwards_outwards` ? <><IconUpload /><IconDownload /></> : set.has_been_shared == 'inwards' ? <IconDownload /> : set.has_been_shared == 'outwards' ? <IconUpload /> : <IconX />}</Group><Divider />
        <Group position="apart" ><span>Times studied:</span><span>{set.times_studied.toString()}</span></Group><Divider />
        <Group position="apart" ><span>Actions</span><span>
            <Button size="xs" className={classes.actionButton} onClick={() => {
                if (db.data === null) {
                    return
                }
                let newSet: SerializedSet = { ...set, name: `Copy of ${set.name}`, uuid: v4() }
                db.data.sets[newSet.uuid] = newSet
                navigate(`/all`)
            }} >Duplicate</Button>
            <Button size="xs" className={classes.actionButton} color="red" onClick={openNewModal} >Delete</Button>
        </span></Group><Divider />


    </Stack>
}

export default function Set() {
    let { uuid } = useParams()
    const { classes, cx, theme } = useStyles();

    let [trainerBoxOpen, setTrainerBoxOpen] = useState(false)
    let [TrainerProvider, setTrainerProvider] = useState<typeof FlashCards | null>(null)

    if (uuid == undefined || db.data == null || db.data.sets[uuid] == undefined) {
        return <h1>An error occurred</h1>
    }

    const set = db.data.sets[uuid]

    return <Grid>
        <Grid.Col span={8}><Banner title={set.name} description={set.description} image="https://images.unsplash.com/photo-1651527567557-769ea053b0ab" /></Grid.Col>
        <Grid.Col span={4}><InfoAndActions set={set} /></Grid.Col>
        <Grid.Col span={12}><Group >{StudyMethods.map((studyMethod) => {
            const Icon = studyMethod.icon
            return <Button key={studyMethod.name} leftIcon={<Icon />} onClick={() => {
                setTrainerBoxOpen(false)
                setTrainerProvider(studyMethod)
                setTrainerBoxOpen(true)
            }} >{studyMethod.name}</Button>
        })}</Group></Grid.Col>
        {uuid}
        <Button onClick={() => { setTrainerBoxOpen(!trainerBoxOpen) }} >test</Button>

        <div className={classes.setTrainerBox} >
            <div className={cx(classes.setTrainer, { [classes.setTrainerOpened]: trainerBoxOpen })} >
                {(TrainerProvider === null) ? <h1>No trainer</h1> : <TrainerProvider.Render set={set} />}

                <Affix position={{ bottom: 20 + 70, right: 20 }}>
                    <Transition transition="slide-up" mounted={TrainerProvider !== null && trainerBoxOpen}>
                        {(transitionStyles) => (
                            <Button style={transitionStyles} variant="default" onClick={() => {
                                setTrainerBoxOpen(false)
                            }} >Close trainer</Button>
                        )}
                    </Transition>
                </Affix>

            </div>
        </div>
    </Grid>
}