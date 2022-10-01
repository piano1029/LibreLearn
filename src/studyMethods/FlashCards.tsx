import { IconStack2, TablerIcon } from "@tabler/icons";
import { SerializedSet, SetItem } from "../api/sets";
import { StudyMethod } from "../api/studyMethods";
import { Carousel } from '@mantine/carousel';
import { Button, Card, Group, Stack } from "@mantine/core";
import React, { useState } from "react";

type FlashCardsGameData = {
    items: Array<{ timesSuccess: number, timesFailure: number, item: SetItem }>
}

function FlashCard({ item, setState }: { item: SetItem, setState: (state: boolean) => void }) {

    let [flipped, setFlipped] = useState(false)

    return <><Card style={{
        position: 'absolute',
        top: 20,
        bottom: 20,
        left: 50,
        right: 50,

        width: `calc(100% - 100px)`,
        height: `calc(100% - 40px)`,

        transition: `opacity 500ms ease`,

        zIndex: 50,

        opacity: flipped ? 0 : 1,

        pointerEvents: flipped ? `none` : `all`
    }} onClick={() => setFlipped(!flipped)} >
        <div dangerouslySetInnerHTML={{ __html: item.left.startsWith(`<p`) ? item.left : `<p>${item.left}</p>` }} />
    </Card>
        <Card style={{
            position: 'absolute',
            top: 20,
            bottom: 20,
            left: 50,
            right: 50,

            width: `calc(100% - 100px)`,
            height: `calc(100% - 40px)`,

            transition: `opacity 500ms ease`,

            zIndex: 49
        }} onClick={() => setFlipped(!flipped)} >
            <Stack justify="space-between" >
                <div dangerouslySetInnerHTML={{ __html: item.right.startsWith(`<p`) ? item.right : `<p>${item.right}</p>` }} />
                <Group position="center" >
                    <Button onClick={() => { setState(true) }} color="green" >Knew it!</Button>
                    <Button onClick={() => { setState(false) }} color="red" >Repeat</Button>
                </Group>
            </Stack>

        </Card>
    </>
}

const FlashCards: StudyMethod = {
    name: `FlashCards`,
    icon: IconStack2,
    Render: ({ set }) => {
        let [counter, setCount] = useState(0)
        let [gameData, setGameData] = useState<FlashCardsGameData>({
            items: set.items.map((item) => {
                return {
                    timesSuccess: 0,
                    timesFailure: 0,
                    item
                }
            })
        })

        return <Group style={{ width: '200px' }} onScroll={(e) => { e.preventDefault() }} >
            {gameData.items[counter] !== undefined ? <FlashCard setState={(state) => {
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

export default FlashCards