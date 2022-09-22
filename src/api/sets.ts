import { languageID } from "./languages";

type ItemType = "ExactText" | "Text" | "LaTeX" | "Image"

export type SetItem = {
    // the thing that would be shown to the user
    description: string

    // the thing that the user would have to like answer or something
    answer: string

    type: ItemType
}

export type SerializedSet = {
    name: string
    creator?: string
    is_made_by_this_user?: boolean
    has_been_shared?: 'inwards' | 'outwards' | 'inwards_outwards'

    times_studied: number

    is_2_languages: boolean
    language1?: languageID
    language2?: languageID
}

export class Set {
    name: string
    creator?: string
    is_made_by_this_user?: boolean
    has_been_shared?: 'inwards' | 'outwards' | 'inwards_outwards'

    times_studied: number = 0

    is_2_languages: boolean = false
    language1?: languageID
    language2?: languageID

    // Constructor should only be used when creating a new set
    constructor(name: string) {
        this.name = name
    }

    static fromJSON(data: SerializedSet): Set {
        let set = new Set(data.name)

        set.creator = data.creator
        set.is_made_by_this_user = data.is_made_by_this_user
        set.has_been_shared = data.has_been_shared

        set.times_studied = data.times_studied

        set.is_2_languages = data.is_2_languages
        set.language1 = data.language1
        set.language2 = data.language2

        return set
    }
}