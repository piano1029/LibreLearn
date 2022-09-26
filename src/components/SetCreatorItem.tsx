import { Grid, Paper, Select, Text, Group, Avatar, CloseButton, Stack } from "@mantine/core";
import { TablerIcon, IconTestPipe, IconAsteriskSimple, IconLetterCase, IconFunction, IconPhoto } from "@tabler/icons";
import { forwardRef, useState } from "react";
import { ItemType, SetItem } from "../api/sets";
import { RichTextEditor } from '@mantine/rte';
import React from "react";

const data: ItemProps[] & { value: string }[] = [
    {
        icon: IconLetterCase,
        label: 'Text',
        value: 'Text',
        description: 'Text input but it ignores punctuation and capitalization',
    },

    {
        icon: IconAsteriskSimple,
        label: 'Exact Text',
        value: 'ExactText',
        description: 'Strict text input',
    },
    {
        icon: IconFunction,
        label: 'LaTeX',
        value: 'LaTeX',
        description: 'Formulas',
    },
    {
        icon: IconPhoto,
        label: 'Images',
        value: 'Image',
        description: 'Media',
    },
];

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    icon: TablerIcon;
    label: string;
    description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps & { Icon: TablerIcon }>(
    ({ Icon, label, description, ...others }: ItemProps & { Icon: TablerIcon }, ref) => (
        <div ref={ref} {...{ ...others, icon: undefined }}>
            <Grid align={'center'}>
                <Grid.Col span={3} ><Icon size={30} /></Grid.Col>

                <Grid.Col span={9}><div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" color="dimmed">
                        {description}
                    </Text>
                </div>
                </Grid.Col>
            </Grid>
        </div>
    )
);

const TextEditor = React.memo(function TextEditor({ direction, item, setItem }: { direction: 'left' | 'right', item: SetItem, setItem: (item: SetItem | undefined) => void }) {

    //let [temp, setTemp] = useState(item[direction])

    return <RichTextEditor
        value={item[direction]} onChange={(newValue) => { console.log(newValue, item[direction]); if (`<p>` + item[direction] + `</p>` !== newValue) setItem({ ...item, [direction]: newValue }) }}
        //value={temp} onChange={setTemp}
        controls={[
            ['bold', 'italic', 'underline'],
            ['sup', 'sub'],
        ]}
    //onSubmit={() => { update(temp); console.log(`update`) }}
    //onBlur={() => { update(temp); console.log(`update`) }}
    />
})

export default React.memo(function SetCreatorItem({ item, setItem, grip }: { item: SetItem, setItem: (item: SetItem | undefined) => void, grip: any }) {

    return (
        <Paper shadow="sm" p="md" withBorder style={{ width: '100%' }} key={item.uuid} >
            <Grid>
                <Grid.Col span={3}>
                    <Group position="center" noWrap>
                        {grip}
                        <Select
                            itemComponent={SelectItem}
                            //@ts-ignore
                            data={data.map((item) => { return { ...item, Icon: item.icon } })}
                            searchable
                            maxDropdownHeight={400}
                            value={item.type}
                            onChange={(type: ItemType) => {
                                setItem({ ...item, type })
                            }}
                            required
                            filter={(value, item) =>
                                //@ts-ignore
                                item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
                                item.description.toLowerCase().includes(value.toLowerCase().trim())
                            }
                        />
                    </Group>
                </Grid.Col>
                <Grid.Col span={9}>
                    <Stack justify={"center"} style={{ height: '100%' }} >
                        <Group position="right">
                            <CloseButton title="Delete item" size="lg" iconSize={20} onClick={() => { setItem(undefined) }} />
                        </Group>
                    </Stack>
                </Grid.Col>

                <Grid.Col span={6} key={`${item.uuid}TEXTEDITLEFTGRID`} ><TextEditor item={item} setItem={(item: SetItem | undefined) => setItem(item)} key={`${item.uuid}TEXTEDITLEFT`} direction="left" /></Grid.Col>
                <Grid.Col span={6} key={`${item.uuid}TEXTEDITRIGHGRID`} ><TextEditor item={item} setItem={(item: SetItem | undefined) => setItem(item)} key={`${item.uuid}TEXTEDITRIGH`} direction="right" /></Grid.Col>
            </Grid>
        </Paper>
    )
})