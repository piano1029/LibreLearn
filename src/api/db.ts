import { Low } from "lowdb"
import { Store } from 'tauri-plugin-store-api';
const store = new Store('.db.dat');
import { SerializedSet, Set } from './sets'

export type DBData = {
    sets: {
        [key: string]: SerializedSet
    },
    draft: SerializedSet
}

class TauriStorageAdapter {
    async read() {
        return await store.get(`lowdb`) as DBData
    } // should return Promise<data>
    async write(data: DBData) {
        await store.set('lowdb', data)
    } // should return Promise<void>
}

const db = new Low<DBData>(new TauriStorageAdapter)

setInterval(async () => {
    console.log(`Saving database!`, db.data)
    await db.write()
}, 1000)

export default db