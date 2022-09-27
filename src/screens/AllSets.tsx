import { AllSetsHeader } from "../components/AllSetsHeader";
import { SetCard } from "../components/SetCard";
import db from "../api/db";
import { SerializedSet } from "../api/sets";
import { createStyles, Grid, ScrollArea } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    grid: {
        width: '100%'
    },

    container: {
        marginBottom: 67
    },

    scrollContainer: { //        grid               header  footer
        height: `calc(100vh - ${theme.spacing.md}px - 56px - 67px - 16px)`
    }
}));

export default function AllSets() {
    const { classes, cx } = useStyles()

    return <div className={classes.container} >
        <AllSetsHeader />
        <ScrollArea className={classes.scrollContainer} >
            <Grid grow className={classes.grid} >
                {Object.keys((db.data === null ? { sets: {} } : db.data).sets).map((uuid) => {
                    return <Grid.Col span={4}><SetCard set={db.data?.sets[uuid] as SerializedSet} /></Grid.Col>
                })}
            </Grid>
        </ScrollArea>
    </div>
}