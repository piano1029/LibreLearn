import { TablerIcon } from "@tabler/icons";
import { SerializedSet } from "./sets";

import FlashCards from "../studyMethods/FlashCards";
import { AnyARecord } from "dns";

export const StudyMethods: StudyMethod[] = [FlashCards]

export type StudyMethod = {
    Render: (props: { set: SerializedSet }) => any

    icon: TablerIcon
    name: string
}