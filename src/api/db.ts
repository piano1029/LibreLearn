import { Low } from "lowdb"
import { Store } from 'tauri-plugin-store-api';
const store = new Store('.db.dat');
import { Set } from './sets'

export type DBData = {
    sets: Set[]
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

export default db