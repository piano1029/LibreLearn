import { useState } from "react"
import { SetCreatorHeader } from "../components/SetCreatorHeader"
import { SerializedSet, SetItem } from "../api/sets"
import SetCreatorItem from "../components/SetCreatorItem"

export default function SetCreator() {

    let [setData, setSetData] = useState<SerializedSet>({
        name: "Your new set!",
        times_studied: 0,
        is_2_languages: false,
        items: [{
            left: "Test left",
            right: "Test right",
            type: 'ExactText',
            uuid: '43909daa-eb84-4016-a8de-659baea1d636'
        }],
        uuid: 'c43692d1-820b-4fcf-b2bc-6dc4f299d4ca'
    })

    return <>
        <SetCreatorHeader value={setData.name} setValue={(name) => setSetData({
            ...setData,
            name
        })} />

        <div style={{ marginTop: 56 }} >

            {setData.items.map((item, index) => {
                return (
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
                    }} />
                )
            })}

        </div>
    </>
}