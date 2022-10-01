import { IconPencil, IconStack2, TablerIcon } from "@tabler/icons";
import { SerializedSet, SetItem } from "../api/sets";
import { StudyMethod } from "../api/studyMethods";
import { Carousel } from '@mantine/carousel';
import { Button, Card, Grid, Group, Progress, Stack, Table, createStyles, Text, TextInput, Center, Transition } from "@mantine/core";
import React, { useState } from "react";

type WriterGameData = {
    items: Array<{ timesSuccess: number, timesFailure: number, item: SetItem }>
}

const useStyles = createStyles((theme) => ({
    progressBar: {
        '&:not(:first-of-type)': {
            borderLeft: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
        },
    },

    submitButton: {
        marginLeft: theme.spacing.md
    }
}));

function Writer({ item, setState }: { item: SetItem, setState: (state: boolean) => void }) {

    let [value, setValue] = useState(``)
    let [givingFeedback, setGivingFeedback] = useState(false)
    const { classes, cx, theme } = useStyles();

    function sanitize(input: string) {
        return input
            .replace(/<p>/ig, ``)
            .replace(/<\/p>/ig, ``)
            .replace(/<b>/ig, ``)
            .replace(/<\/b>/ig, ``)
            .replace(/<i>/ig, ``)
            .replace(/<\/i>/ig, ``)
            .replace(/<u>/ig, ``)
            .replace(/<\/u>/ig, ``)
    }

    return <>
        <Stack align="center" justify={'center'} sx={(theme) => ({ height: 'calc(100vh - 70px)', width: 'calc(100vw - 80px)' })}>
            <div dangerouslySetInnerHTML={{ __html: item.left.startsWith(`<p`) ? item.left : `<p>${item.left}</p>` }} />
            <Transition transition="slide-up" mounted={!givingFeedback}>
                {(transitionStyles) => (
                    <Group position="center" style={transitionStyles} >
                        <TextInput placeholder="Answer" value={value} onChange={(event) => {
                            setValue(event.target.value)
                        }} />
                        <Button onClick={() => {

                            console.log(sanitize(item.right), sanitize(value))
                            setValue(``)
                            let gotRight = sanitize(item.right) === sanitize(value)
                            if (gotRight) { setState(gotRight) } else {
                                setGivingFeedback(true)
                            }

                        }} >Submit</Button>
                    </Group>
                )}
            </Transition>
            <Transition transition="slide-up" mounted={givingFeedback}>
                {(transitionStyles) => (
                    <>
                        <div dangerouslySetInnerHTML={{ __html: item.right.startsWith(`<p`) ? item.right : `<p>${item.right}</p>` }} />
                        <TextInput style={transitionStyles} placeholder={'Copy correct answer'} variant="default" value={value} onChange={(event) => {
                            let newValue = event.target.value
                            setValue(newValue)
                            if (sanitize(newValue) === sanitize(item.right)) {
                                setValue(``)
                                setGivingFeedback(false)
                                setState(false)
                            }
                        }} />
                    </>
                )}
            </Transition>
        </Stack>
    </>
}

const WriterMethod: StudyMethod = {
    name: `Writer`,
    icon: IconPencil,
    Render: ({ set }) => {
        const { classes, cx, theme } = useStyles();

        let [counter, setCount] = useState(0)
        let [gameData, setGameData] = useState<WriterGameData>({
            items: set.items.map((item) => {
                return {
                    timesSuccess: 0,
                    timesFailure: 0,
                    item
                }
            })
        })

        let _itemsToLearn = gameData.items.filter((v) => {
            return v.timesSuccess - v.timesFailure < 3
        })

        let [itemsToLearn, setItemsToLearn] = useState(_itemsToLearn)

        if (itemsToLearn[counter] === undefined) {
            if (_itemsToLearn.length > 0) {
                setCount(0)
                setItemsToLearn(_itemsToLearn)
            }
            return <Grid>
                <Grid.Col span={12}><h1 style={{ textAlign: 'center', width: '100%' }} >Results</h1></Grid.Col>
                <Grid.Col span={12}><Table sx={{ minWidth: 700 }}>
                    <thead >
                        <tr>
                            <th>Left</th>
                            <th>Right</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>{gameData.items.map((value) => {
                        return <tr key={value.item.uuid} >
                            <td dangerouslySetInnerHTML={{ __html: value.item.left.startsWith(`<p`) ? value.item.left : `<p>${value.item.left}</p>` }} />
                            <td dangerouslySetInnerHTML={{ __html: value.item.right.startsWith(`<p`) ? value.item.right : `<p>${value.item.right}</p>` }} />
                            <td>
                                <Group position="apart">
                                    <Text size="xs" color="teal" weight={700}>
                                        {((value.timesSuccess / (value.timesFailure + value.timesSuccess)) * 100).toFixed(0)}%
                                    </Text>
                                    <Text size="xs" color="red" weight={700}>
                                        {((value.timesFailure / (value.timesFailure + value.timesSuccess)) * 100).toFixed(0)}%
                                    </Text>
                                </Group>
                                <Progress
                                    classNames={{ bar: classes.progressBar }}
                                    sections={[
                                        {
                                            value: (value.timesSuccess / (value.timesFailure + value.timesSuccess)) * 100,
                                            color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
                                        },
                                        {
                                            value: (value.timesFailure / (value.timesFailure + value.timesSuccess)) * 100,
                                            color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
                                        },
                                    ]}
                                />
                            </td>
                        </tr>
                    })}</tbody>
                </Table></Grid.Col>
            </Grid>
        }

        return <Group onScroll={(e) => { e.preventDefault() }} >
            {gameData.items[counter] !== undefined ? <Writer setState={(state) => {
                let copy = [...gameData.items]
                let field: `timesSuccess` | `timesFailure` = state ? `timesSuccess` : `timesFailure`
                let index = copy.findIndex((v) => {
                    if (v.item.uuid === gameData.items[counter].item.uuid) return true
                })
                copy[index] = {
                    ...copy[index],
                    [field]: copy[index][field] + 1
                }
                setGameData({
                    items: copy
                })
                setCount(counter + 1)
                console.log(`user got answer ${state ? `correct` : `false`}!`)
            }} item={gameData.items[counter].item} /> : null}
        </Group>
    }
}

export default WriterMethod