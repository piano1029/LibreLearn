import { Grid, Paper, Select, Text, Group, Avatar, CloseButton, Stack } from "@mantine/core";
import { TablerIcon, IconTestPipe, IconAsteriskSimple, IconLetterCase, IconFunction, IconPhoto } from "@tabler/icons";
import { forwardRef } from "react";
import { ItemType, SetItem } from "../api/sets";
import { RichTextEditor } from '@mantine/rte';

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
        <div ref={ref} {...others}>
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

export default function SetCreatorItem({ item, setItem }: { item: SetItem, setItem: (item: SetItem | undefined) => void }) {

    function TextEditor({ direction }: { direction: 'left' | 'right' }) {
        return <RichTextEditor
            value={item[direction]} onChange={(newValue) => { setItem({ ...item, [direction]: newValue }) }}
            controls={[
                ['bold', 'italic', 'underline'],
                ['sup', 'sub'],
            ]}
        />
    }

    return (
        <Paper shadow="sm" p="md" withBorder >
            <Grid>
                <Grid.Col span={3}>
                    <Select
                        itemComponent={SelectItem}
                        data={data.map((item) => { return { ...item, Icon: item.icon } })}
                        searchable
                        maxDropdownHeight={400}
                        value={item.type}
                        onChange={(type: ItemType) => {
                            setItem({ ...item, type })
                        }}
                        required
                        filter={(value, item) =>
                            item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
                            item.description.toLowerCase().includes(value.toLowerCase().trim())
                        }
                    />
                </Grid.Col>
                <Grid.Col span={9}>
                    <Stack justify={"center"} style={{ height: '100%' }} >
                        <Group position="right">
                            <CloseButton title="Delete item" size="lg" iconSize={20} onClick={() => { setItem(undefined) }} />
                        </Group>
                    </Stack>
                </Grid.Col>

                <Grid.Col span={6}><TextEditor direction="left" /></Grid.Col>
                <Grid.Col span={6}><TextEditor direction="right" /></Grid.Col>
            </Grid>
        </Paper>
    )
}