import { useState } from "react"
import { SetCreatorHeader } from "../components/SetCreatorHeader"
import { SerializedSet, SetItem } from "../api/sets"
import SetCreatorItem from "../components/SetCreatorItem"
import { createStyles, Group, ScrollArea, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IconGripVertical } from '@tabler/icons';
import { SetCreatorAddItem } from "../components/SetCreatorAddItem";
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from "react";
import db from "../api/db";

const useStyles = createStyles((theme) => ({
    item: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: theme.radius.md
    },

    itemMargin: {
        marginBottom: theme.spacing.md,
    },

    itemDragging: {
        boxShadow: theme.shadows.sm,
    },

    dragHandle: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
        //paddingLeft: theme.spacing.md,
        //paddingRight: theme.spacing.md
    },
}));

function array_move(arr: any[], old_index: number, new_index: number) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

export default function SetCreator() {
    const { classes, cx } = useStyles();

    let [setData, setSetData] = useState<SerializedSet>({
        name: "Your new set!",
        times_studied: 0,
        is_2_languages: false,
        items: [{
            left: "Test left",
            right: "Test right",
            type: 'ExactText',
            uuid: '43909daa-eb84-4016-a8de-659baea1d631'
        }, {
            left: "Test left 2",
            right: "Test right 2",
            type: 'ExactText',
            uuid: '43909daa-eb84-4016-a8de-659baea1d632'
        }, {
            left: "Test left 3",
            right: "Test right 3",
            type: 'ExactText',
            uuid: '43909daa-eb84-4016-a8de-659baea1d633'
        }],
        uuid: 'c43692d1-820b-4fcf-b2bc-6dc4f299d4ca'
    })

    useEffect(() => {
        console.log(`loading draft`)
        if (db.data !== null) {
            console.log(`setting setdata to draft`, db.data.draft)
            setSetData(db.data.draft)
        }
    }, [])

    useEffect(() => {
        console.log(`saving`)
        if (db.data !== null) db.data.draft = setData
    })

    /*function setSetData(value: SerializedSet) {
        _setSetData(value)
        if (db.data !== null) db.data.draft = value

    }*/

    return <>
        <SetCreatorHeader key="setcreatorheader" value={setData.name} setValue={(name) => setSetData({
            ...setData,
            name
        })} />

        <div style={{ marginBottom: 80 - 40 }} key="setcreatortopdiv" >
            <ScrollArea style={{ height: `calc(100vh - ${80 + 56 + 10}px)` }} key="setcreatorscrollarea" >
                <div style={{ marginTop: 56, height: '100%' }} key="setcreatordiv2" >
                    <DragDropContext
                        onDragEnd={({ destination, source }) => {
                            let items = [...setData.items]
                            array_move(items, source.index, destination?.index || 0)
                            items = items.filter((v) => v !== undefined)
                            setSetData({ ...setData, items: items as SetItem[] })
                        }
                            //handlers.reorder({ from: source.index, to: destination?.index || 0 })
                        }
                        key="setcreatordeagdropcontext"
                    >
                        <Droppable
                            droppableId="dnd-list" direction="vertical" type="never" key="setcreatordroppable" >
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} key="setcreatordiv3">
                                    {setData.items.map((item, index) => {
                                        return (
                                            <Draggable key={item.uuid + `draggable`} index={index} draggableId={item.uuid} >
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging, [classes.itemMargin]: index !== setData.items.length - 1 })}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        //style={{ marginBottom: 20 }}
                                                        key={item.uuid}
                                                    >

                                                        <SetCreatorItem index={index} key={item.uuid} item={item} setItem={(item) => {
                                                            let items = [...setData.items] as (SetItem | undefined)[]
                                                            if (item !== undefined) {
                                                                if (item.left !== '' || item.right !== '') {
                                                                    item.isEmpty = false
                                                                }
                                                                if (item.left === '' || item.right === '') {
                                                                    item.isEmpty = true
                                                                }
                                                            }

                                                            items[index] = item
                                                            items = items.filter((v) => v !== undefined)
                                                            setSetData({ ...setData, items: items as SetItem[] })
                                                        }} grip={<div {...provided.dragHandleProps} className={classes.dragHandle}>
                                                            <IconGripVertical size={18} stroke={1.5} />
                                                        </div>} />
                                                    </div>
                                                )}


                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </ScrollArea>

            <Group position="center" style={{ marginTop: 18 }} >
                <SetCreatorAddItem addEmpty={(item) => {
                    setSetData({
                        ...setData, items: [...setData.items, {
                            left: '',
                            right: '',
                            type: setData.items[setData.items.length - 1]?.type || 'Text',
                            isEmpty: true,
                            uuid: uuidv4()
                        }]
                    })
                }} />
            </Group>
        </div>


    </>
}