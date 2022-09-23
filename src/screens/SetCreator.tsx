import { useState } from "react"
import { SetCreatorHeader } from "../components/SetCreatorHeader"
import { SerializedSet, SetItem } from "../api/sets"
import SetCreatorItem from "../components/SetCreatorItem"
import { createStyles, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IconGripVertical } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
    item: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: theme.radius.md,
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
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
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

    return <>
        <SetCreatorHeader value={setData.name} setValue={(name) => setSetData({
            ...setData,
            name
        })} />

        <div style={{ marginTop: 56, marginBottom: 80 }} >
            <DragDropContext
                onDragEnd={({ destination, source }) => {
                    let items = [...setData.items]
                    array_move(items, source.index, destination?.index || 0)
                    items = items.filter((v) => v !== undefined)
                    setSetData({ ...setData, items: items as SetItem[] })
                }
                    //handlers.reorder({ from: source.index, to: destination?.index || 0 })
                }
            >
                <Droppable droppableId="dnd-list" direction="vertical">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {setData.items.map((item, index) => {
                                return (
                                    <Draggable key={item.uuid} index={index} draggableId={item.uuid} >
                                        {(provided, snapshot) => (
                                            <div
                                                className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            //style={{ marginBottom: 20 }}
                                            >

                                                <SetCreatorItem key={item.uuid} item={item} setItem={(item) => {
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
    </>
}