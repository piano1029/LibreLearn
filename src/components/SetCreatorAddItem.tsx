import { ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { SetItem } from '../api/sets';

export function SetCreatorAddItem({ addEmpty }: { addEmpty: (item: any) => void }) {
    return (
        <ActionIcon color="blue" size="xl" variant="filled" onClick={addEmpty} >
            <IconPlus size={34} />
        </ActionIcon>
    );
}