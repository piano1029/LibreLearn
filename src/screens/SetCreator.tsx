import { useState } from "react"
import { SetCreatorHeader } from "../components/SetCreatorHeader"

export default function SetCreator() {

    let [title, setTitle] = useState('Your new set!')

    return <>
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            left: 120,
            marginLeft: 120
        }} ><SetCreatorHeader value={title} setValue={setTitle} /></div>
    </>
}